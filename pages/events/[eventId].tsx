import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';
import { Spin, Row, Col, Tabs, Tooltip, message, Modal, Button } from 'antd';
import { isAndroid, isIOS, isDesktop } from 'react-device-detect';
import type { TabsProps } from 'antd';
import {
  LoadingOutlined,
  QuestionCircleOutlined,
  RightOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import Image from 'next/image';
import { NextSeo } from 'next-seo';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { useCollapse } from 'react-collapsed';

import {
  formatTimeStrByTimeString,
  openApp,
  formatLocation,
} from '../../utils/func';
import {
  FormatTimeKeys,
  PriceUnit,
  PrimaryMarket,
  PurchaseFromFan,
  AppLandingPage,
  FirebaseEventEnv,
  AppDomain,
  DefaultEventListBannerPageSize,
  SetRefundKey,
} from '../../constants/General';
import { Images } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  getEventTicketTypeAction,
  selectEventTicketTypeData,
  selectEventDetailLoading,
  selectEventDetailData,
  getEventDetailAction,
  selectEventDetailError,
  resetError,
  EventTicketTypeResponseType,
  getEventMarketAction,
  selectEventMarket,
  resetEventDatail,
} from '../../slice/event.slice';
import { TicketDetailResponseType } from '../../slice/tickets.slice';
import {
  EventDetailContainer,
  TicketTypeItem,
  SecondaryMarketItem,
} from '../../styles/eventDetail.style';
import Messages from '../../constants/Messages';
import PageHearderComponent from '../../components/pageHearder';
import PageHearderResponsive from '../../components/pageHearderResponsive';
import PageBottomComponent from '../../components/pageBottomComponent';
import firebaseApp from '../../firebase';
import EventService from '../../services/API/Event/Event.service';
import { RouterKeys } from '../../constants/Keys';
import PageNotFound from '../404';
import ImageSizeLayoutComponent from '@/components/imageSizeLayoutComponent';
import { EventDetailCard } from '@/styles/myTicketsEventDetail.style';

const libraries: ('places' | 'drawing' | 'geometry' | 'visualization')[] = [
  'places',
];

const EventDetail = ({
  openGraphDetail,
}: {
  openGraphDetail: TicketDetailResponseType;
}) => {
  const openAppInIos = useRef<any>(null);
  const detailContentRef: any = useRef(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOLE_MAP_API_KEY as string,
    libraries,
  });

  const error = useAppSelector(selectEventDetailError);
  const loading = useAppSelector(selectEventDetailLoading);
  const eventTicketTypeData = useAppSelector(selectEventTicketTypeData);
  const eventDetailData = useAppSelector(selectEventDetailData);
  const eventMarket = useAppSelector(selectEventMarket);

  const [id, setEventId] = useState<string>('');
  const [clickEventMarketModalOpen, setClickEventMarketModalOpen] =
    useState(false);
  const [menuState, setMenuState] = useState<boolean>(false);
  const [tabActiveKey, setTabActiveKey] = useState<string>(PrimaryMarket);
  const [eventCorrect, setEventCorrect] = useState<boolean>(true);
  const [eventTicketTypeFilter, setEventTicketTypeFilter] = useState<
    EventTicketTypeResponseType[]
  >([]);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [isExpanded, setExpanded] = useState<boolean>(false);
  const [needShowMore, setNeedShowMore] = useState<boolean>(false);

  const { getCollapseProps, getToggleProps } = useCollapse({
    isExpanded,
    collapsedHeight: 75,
  });

  const tabsItem: TabsProps['items'] = [
    {
      key: PrimaryMarket,
      label: (
        <div>
          <span>{PrimaryMarket}</span>
          <Tooltip title="Official Issued Tickets">
            <QuestionCircleOutlined />
          </Tooltip>
        </div>
      ),
      children: '',
    },
    {
      key: PurchaseFromFan,
      label: (
        <div>
          <span>{PurchaseFromFan}</span>
          <Tooltip title="Authenticity Guaranteed">
            <QuestionCircleOutlined />
          </Tooltip>
        </div>
      ),
      children: '',
    },
  ];

  const onMapLoad = useCallback((map: any) => {
    if (map) {
      const { center } = map;
      const bounds = new window.google.maps.LatLngBounds({
        lat: center.lat(),
        lng: center.lng(),
      });
      map.fitBounds(bounds);
    }
  }, []);

  const getData = async (payload: string) => {
    const response = await dispatch(getEventDetailAction(payload));
    if (response.type === getEventDetailAction.fulfilled.toString()) {
      dispatch(getEventTicketTypeAction(id));
      dispatch(
        getEventMarketAction({
          event: id,
          size: DefaultEventListBannerPageSize,
        })
      );
    }
  };

  const handleOpenApp = () => {
    if (isDesktop) {
      router.push(RouterKeys.landingPage);
    } else {
      if (isIOS) {
        openAppInIos.current.click();
      } else if (isAndroid) {
        openApp();
      }
    }
  };

  const toShopify = (data: EventTicketTypeResponseType) => {
    if (data.stock === 0 || !data.externalLink) {
      return;
    }
    if (!data.onSale) {
      return;
    }
    window.open(data.externalLink, '_blank');
  };

  useEffect(() => {
    const { eventId } = router.query;
    if (eventId) {
      const parameterArr = (eventId as string).split('-');
      if (_.last(parameterArr)) {
        setEventId(_.last(parameterArr) || '');
      } else {
        setEventCorrect(false);
      }
    }
  }, [router.isReady]);

  useEffect(() => {
    const { source, ticket, eventId } = router.query;
    if (eventDetailData.slug) {
      if (eventDetailData.slug !== eventId) {
        router.push(
          RouterKeys.eventDetail.replace(':slug', eventDetailData.slug)
        );
      } else {
        if (eventDetailData.name && source === 'sharing' && ticket) {
          const analytics = getAnalytics(firebaseApp);
          logEvent(analytics, `web_event_page_view${FirebaseEventEnv}`, {
            ticketMark: `<${ticket}>: ${eventDetailData.name}`,
          });
        }
      }
    }
  }, [eventDetailData]);

  useEffect(() => {
    if (!loading) {
      if (detailContentRef.current.clientHeight > 57) {
        setNeedShowMore(true);
      } else {
        setNeedShowMore(false);
      }
    }
  }, [loading]);

  useEffect(() => {
    if (error) {
      if (
        error.code === Messages.notFound.code ||
        error.code === Messages.invalidUnlawful.code ||
        error.code === Messages.eventMismatch.code
      ) {
        setEventCorrect(false);
      }
      message.open({
        content: error.message,
        className: 'error-message-event',
      });
    }
  }, [error]);

  useEffect(() => {
    let data: EventTicketTypeResponseType[] = [];
    if (eventTicketTypeData.length) {
      data = eventTicketTypeData.filter((item) => item.externalLink);
    }
    setEventTicketTypeFilter(data);
  }, [eventTicketTypeData]);

  useEffect(() => {
    if (id) {
      getData(id);
    }
  }, [id]);

  // eslint-disable-next-line
  useEffect(() => {
    return () => {
      dispatch(resetEventDatail());
      dispatch(resetError());
    };
  }, []);

  return (
    <>
      {(!eventCorrect && <PageNotFound />) || (
        <>
          <NextSeo
            openGraph={{
              type: 'website',
              title: (openGraphDetail && openGraphDetail.name) || '',
              url: `${AppDomain}${
                (openGraphDetail && openGraphDetail.shareUrl) || ''
              }`,
              description:
                (openGraphDetail &&
                  openGraphDetail.description.slice(0, 300)) ||
                '',
              images: [
                {
                  url: (openGraphDetail && openGraphDetail.image) || '',
                  alt: '',
                },
              ],
            }}
            twitter={{
              cardType: 'summary_large_image',
              site: '@CrowdServe',
              handle: '@CrowdServe',
            }}
          />
          {(!loading && (
            <EventDetailContainer>
              <div className="container-wrap">
                <Col md={24} xs={0}>
                  <PageHearderResponsive />
                </Col>
                <Col md={0} xs={24}>
                  <PageHearderComponent setMenuState={setMenuState} />
                </Col>
                <div className="page-main">
                  <Row>
                    <Col span={24} className="detail-background">
                      <Image
                        src={eventDetailData.image}
                        alt=""
                        layout="fill"
                        onError={(e: any) => {
                          e.target.onerror = null;
                          e.target.src = Images.BackgroundLogo.src;
                          e.target.className = 'error-full-image';
                        }}
                      />
                    </Col>
                  </Row>
                  <div className="event-detail-container">
                    <div className="item-info">
                      <Row className="item-info-row">
                        <Col span={24} className="info-title">
                          {eventDetailData.name}
                        </Col>
                        <Col span={24} className="info-description-short">
                          {eventDetailData.descriptionShort}
                        </Col>
                        <Col span={24} className="info-item">
                          <Image
                            className="info-item-icon"
                            src={Images.ClockIcon}
                            alt=""
                          />
                          <div className="info-description">
                            {(eventDetailData.startTime &&
                              eventDetailData.endTime &&
                              `${formatTimeStrByTimeString(
                                eventDetailData.startTime,
                                FormatTimeKeys.norm
                              )} - ${formatTimeStrByTimeString(
                                eventDetailData.endTime,
                                FormatTimeKeys.norm
                              )}`) ||
                              '-'}
                          </div>
                        </Col>
                        <Col span={24} className="info-item">
                          <Image
                            src={Images.OrganiserIcon}
                            alt=""
                            className="info-item-icon"
                          />
                          <span className="info-description">
                            {eventDetailData.organizerName || '-'}
                          </span>
                        </Col>
                        <Col span={24} className="info-item">
                          <Image
                            src={Images.LocationIcon}
                            alt=""
                            className="info-item-icon"
                          />
                          <div className="info-description">
                            <span>
                              {formatLocation(
                                eventDetailData.location,
                                eventDetailData.address
                              )}
                            </span>
                            {eventDetailData.locationCoord && (
                              <span
                                className="show-map-action"
                                onClick={() => setShowMap(!showMap)}
                              >
                                {(!showMap && (
                                  <>
                                    SHOW MAP
                                    <DownOutlined />
                                  </>
                                )) || (
                                  <>
                                    HIDE MAP
                                    <UpOutlined />
                                  </>
                                )}
                              </span>
                            )}
                          </div>
                        </Col>
                        {showMap && isLoaded && (
                          <Col span={24}>
                            <div className="google-map-content">
                              <GoogleMap
                                mapContainerStyle={{
                                  width: '100%',
                                  height: '220px',
                                  marginTop: '10px',
                                }}
                                options={{
                                  disableDefaultUI: true,
                                }}
                                center={{
                                  lat: Number(
                                    eventDetailData.locationCoord.split(',')[0]
                                  ),
                                  lng: Number(
                                    eventDetailData.locationCoord.split(',')[1]
                                  ),
                                }}
                                zoom={10}
                                onLoad={onMapLoad}
                              />
                            </div>
                          </Col>
                        )}
                        {eventDetailData.crowdfundLink && (
                          <Col span={24} className="crowd-fund-link">
                            <a
                              href={eventDetailData.crowdfundLink}
                              target="_blank"
                            >
                              View CrowdFund Progress <RightOutlined />
                            </a>
                          </Col>
                        )}
                        <EventDetailCard
                          span={24}
                          className="event-detail-content"
                        >
                          <Col
                            span={24}
                            className="detail-title"
                            style={{
                              marginBottom:
                                (!eventDetailData.description && 24) || 0,
                            }}
                          >
                            Event Details
                          </Col>
                          <Col span={24} className="detail-show-more-box">
                            {needShowMore && (
                              <div
                                className={
                                  (!isExpanded && 'show-more-box-action') ||
                                  'show-more-box-action no-background'
                                }
                              >
                                <div
                                  {...getToggleProps({
                                    onClick: () =>
                                      setExpanded(
                                        (prevExpanded) => !prevExpanded
                                      ),
                                  })}
                                >
                                  <div className="action-button">
                                    <span>
                                      {(!isExpanded && 'Show More') ||
                                        'Show Less'}
                                    </span>
                                    <span>
                                      {(!isExpanded && <DownOutlined />) || (
                                        <UpOutlined />
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                            <Col
                              span={24}
                              className={
                                (!needShowMore && 'show-box no-show-more') ||
                                'show-box event-detail'
                              }
                              {...getCollapseProps()}
                            >
                              <div ref={detailContentRef}>
                                {eventDetailData.description && (
                                  <p className="detail-description">
                                    {eventDetailData.description}
                                  </p>
                                )}
                                <ImageSizeLayoutComponent
                                  images={eventDetailData.descriptionImages}
                                />
                                <p
                                  className="refund-info"
                                  style={{
                                    marginTop:
                                      (eventDetailData.descriptionImages &&
                                        eventDetailData.descriptionImages
                                          .length &&
                                        24) ||
                                      0,
                                  }}
                                >
                                  {(eventDetailData.refundPolicy ===
                                    SetRefundKey.nonRefundable &&
                                    '* Tickets are non-refundable. Please ensure your availability before making a purchase.') ||
                                    '*  To request a refund, please contact the event organizer.'}
                                </p>
                              </div>
                            </Col>
                          </Col>
                        </EventDetailCard>
                      </Row>
                    </div>
                    <div className="item-tabs">
                      <Tabs
                        defaultActiveKey={PrimaryMarket}
                        items={tabsItem}
                        onChange={(activeKey) => setTabActiveKey(activeKey)}
                      />
                      <Row>
                        <Col span={24} className="dividing-line" />
                      </Row>
                      {(tabActiveKey === PrimaryMarket && (
                        <Row gutter={[16, 16]}>
                          {(eventTicketTypeFilter.length && (
                            <>
                              {eventTicketTypeFilter.map((item) => (
                                <TicketTypeItem
                                  xs={24}
                                  sm={12}
                                  md={12}
                                  xl={12}
                                  lg={12}
                                  key={item.id}
                                  onClick={() => toShopify(item)}
                                >
                                  <Row>
                                    <Col className="type-img" xl={8} span={10}>
                                      <img
                                        src={item.thumbnailUrl}
                                        alt=""
                                        onError={(e: any) => {
                                          e.target.onerror = null;
                                          e.target.src =
                                            Images.BackgroundLogo.src;
                                        }}
                                      />
                                      {!item.onSale && (
                                        <div className="not-sale">
                                          NOT ON SALE YET
                                        </div>
                                      )}
                                      {item.stock === 0 && (
                                        <div className="out-stock-mask">
                                          OUT OF STOCK
                                        </div>
                                      )}
                                    </Col>
                                    <Col
                                      xl={16}
                                      span={14}
                                      className="type-info"
                                    >
                                      <div className="line">
                                        <img
                                          src={Images.VerticalLineIcon.src}
                                          alt=""
                                        />
                                      </div>
                                      <div className="type-info-content">
                                        <div>
                                          <Col
                                            span={24}
                                            title={item.name}
                                            className="title"
                                          >
                                            {item.name}
                                          </Col>
                                          <Col
                                            span={24}
                                            className="description"
                                          >
                                            {item.description}
                                          </Col>
                                          <Col span={24} className="price">
                                            {`${item.price.toFixed(
                                              2
                                            )} ${PriceUnit}`}
                                          </Col>
                                        </div>
                                      </div>
                                    </Col>
                                  </Row>
                                </TicketTypeItem>
                              ))}
                            </>
                          )) || (
                            <Col span={24} className="all-ticket-sold">
                              <div
                                style={{ textAlign: 'center', marginTop: 20 }}
                              >
                                <Image src={Images.AllTicketSold} alt="" />
                                <p>All tickets are sold.</p>
                              </div>
                            </Col>
                          )}
                        </Row>
                      )) || (
                        <>
                          {(eventMarket.length && (
                            <Row gutter={[20, 20]}>
                              {eventMarket.map((item) => (
                                <Col
                                  key={item.id}
                                  xl={4}
                                  md={6}
                                  sm={6}
                                  span={12}
                                >
                                  <SecondaryMarketItem
                                    onClick={() =>
                                      setClickEventMarketModalOpen(true)
                                    }
                                  >
                                    <div className="item-background">
                                      <Image
                                        src={
                                          item.thumbnailUrl ||
                                          Images.BackgroundLogo.src
                                        }
                                        layout="fill"
                                        alt=""
                                        onError={(e: any) => {
                                          e.target.onerror = null;
                                          e.target.src =
                                            Images.BackgroundLogo.src;
                                        }}
                                      />
                                    </div>
                                    <div className="item-price">
                                      <span>
                                        {item.sellPrice.toFixed(2)}{' '}
                                        {item.currency}
                                      </span>
                                    </div>
                                    <div className="item-type">{item.type}</div>
                                  </SecondaryMarketItem>
                                </Col>
                              ))}
                            </Row>
                          )) || (
                            <Col span={24} className="all-ticket-sold">
                              <div
                                style={{ textAlign: 'center', marginTop: 20 }}
                              >
                                <Image src={Images.AllTicketSold} alt="" />
                                <p>All tickets are sold.</p>
                              </div>
                            </Col>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {!menuState && <PageBottomComponent />}
                <Modal
                  title=""
                  centered
                  closable={false}
                  footer={null}
                  open={clickEventMarketModalOpen}
                  className="eventMarketModal"
                  onCancel={() => setClickEventMarketModalOpen(false)}
                >
                  <div className="container">
                    <div className="market-modal-main">
                      <Image src={Images.MyWalletIcon} alt="" />
                      <p className="title">
                        Open the app to access the full functionality.
                      </p>
                      <p className="info">
                        With our app, you can view your account balance, track
                        your transaction history.
                      </p>
                      <div className="market-modal-bottom">
                        <Button onClick={handleOpenApp}>OPEN NOW</Button>
                      </div>
                    </div>
                  </div>
                  <div className="close-modal">
                    <Image
                      src={Images.CloseIcon}
                      alt=""
                      onClick={() => setClickEventMarketModalOpen(false)}
                    />
                  </div>
                  <a
                    ref={openAppInIos}
                    href={AppLandingPage}
                    style={{ display: 'none' }}
                  />
                </Modal>
              </div>
            </EventDetailContainer>
          )) || (
            <Spin spinning indicator={<LoadingOutlined spin />} size="large">
              <div />
            </Spin>
          )}
        </>
      )}
    </>
  );
};

EventDetail.getInitialProps = async (ctx: any) => {
  const { query, req } = ctx;
  const { ticket, source, eventId } = query;
  if (eventId) {
    const parameterArr = eventId.split('-');
    if (ticket && source === 'sharing') {
      try {
        const response = await EventService.getEventDetail(
          _.last(parameterArr) as string
        );
        if (response.code === 200) {
          return { openGraphDetail: { ...response.data, shareUrl: req.url } };
        }
      } catch (error) {
        return {
          props: {},
        };
      }
    }
  }
  return {
    props: {},
  };
};

export default EventDetail;
