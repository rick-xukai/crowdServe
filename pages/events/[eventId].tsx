import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { last } from 'lodash';
import {
  Spin,
  Row,
  Col,
  Tabs,
  Tooltip,
  message,
  Modal,
  Button,
  Avatar,
  Checkbox,
} from 'antd';
import { isAndroid, isIOS, isDesktop, browserName } from 'react-device-detect';
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
  formatDescription,
  checkOperatingSys,
  generateRandomString,
  generateRandomLetters,
} from '../../utils/func';
import {
  FormatTimeKeys,
  PriceUnit,
  PrimaryMarket,
  PurchaseFromFan,
  Rave,
  AppLandingPage,
  FirebaseEventEnv,
  AppDomain,
  DefaultEventListBannerPageSize,
  SetRefundKey,
  EventStatus,
  DefaultPageType,
  DefaultPlatform,
} from '../../constants/General';
import { CookieKeys, LocalStorageKeys } from '../../constants/Keys';
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
  resetEventDetailLoading,
  eventDetailGetJoinRaveAction,
  selectGetJoinRaveData,
  setTabActiveKey,
  selectTabActiveKey,
} from '../../slice/event.slice';
import { TicketDetailResponseType } from '../../slice/tickets.slice';
import {
  EventDetailContainer,
  TicketTypeItem,
  SecondaryMarketItem,
  JoinRaveModalContent,
  JoinRaveModalBannerItem,
  HaveJoinedRaveModalContent,
} from '../../styles/eventDetail.style';
import Messages from '../../constants/Messages';
import PageHearderComponent from '../../components/pageHearder';
import PageHearderResponsive from '../../components/pageHearderResponsive';
import PageBottomComponent from '../../components/pageBottomComponent';
import firebaseApp from '../../firebase';
import EventService from '../../services/API/Event/Event.service';
import { RouterKeys } from '../../constants/Keys';
import PageNotFound from '../404';
import { useCookie } from '@/hooks';
import ImageSizeLayoutComponent from '@/components/imageSizeLayoutComponent';
import { EventDetailCard } from '@/styles/myTicketsEventDetail.style';
import { StatusContainer } from '@/styles/myTicketsEventDetail.style';
import { logPageViewAction } from '@/slice/pageTrack.slice';
import Raves from '@/components/raves';
import RavesPopUp from '@/components/ravesPopup';

interface CloseRavesPopUpProps {
  event: string;
  time: number;
  joined: boolean;
}

const libraries: ('places' | 'drawing' | 'geometry' | 'visualization')[] = [
  'places',
];

const EventDetail = ({
  openGraphDetail,
}: {
  openGraphDetail: TicketDetailResponseType;
}) => {
  const openAppInIos = useRef<any>(null);
  const itemTabs = useRef<any>(null);
  const detailContentRef = useRef<any>(null);
  const eventDetailContainer = useRef<any>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOLE_MAP_API_KEY as string,
    libraries,
  });
  const cookies = useCookie([
    CookieKeys.userLoginId,
    CookieKeys.userLoginToken,
  ]);

  const error = useAppSelector(selectEventDetailError);
  const loading = useAppSelector(selectEventDetailLoading);
  const eventTicketTypeData = useAppSelector(selectEventTicketTypeData);
  const eventDetailData = useAppSelector(selectEventDetailData);
  const eventMarket = useAppSelector(selectEventMarket);
  const joinRaveData = useAppSelector(selectGetJoinRaveData);

  const [id, setEventId] = useState<string>('');
  const [clickEventMarketModalOpen, setClickEventMarketModalOpen] =
    useState(false);
  const [menuState, setMenuState] = useState<boolean>(false);
  const [eventCorrect, setEventCorrect] = useState<boolean>(true);
  const [eventTicketTypeFilter, setEventTicketTypeFilter] = useState<
    EventTicketTypeResponseType[]
  >([]);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [isExpanded, setExpanded] = useState<boolean>(false);
  const [needShowMore, setNeedShowMore] = useState<boolean>(false);
  const tabActiveKey = useAppSelector(selectTabActiveKey);
  const [previousPage, setPreviousPage] = useState<string>('');
  const [showJoinRaveModal, setShowJoinRaveModal] = useState<boolean>(false);
  const [clickNotShowAnymore, setClickNotShowAnymore] =
    useState<boolean>(false);
  const [showHaveJoinedRaveModal, setShowHaveJoinedRaveModal] =
    useState<boolean>(false);
  const [joinRaveNotLogin, setJoinRaveNotLogin] = useState<boolean>(false);

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
    {
      key: Rave,
      label: (
        <div>
          <span>{Rave}</span>
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
      // dispatch(eventDetailGetJoinRaveAction(id));
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

  const logPageViewTrack = () => {
    const pageViewTrackPayload = {
      userId: 0,
      session: localStorage.getItem(LocalStorageKeys.pageViewTrackKeys) || '',
      pageType: DefaultPageType,
      platform: DefaultPlatform,
      operatingSys: checkOperatingSys(),
      deviceType: (isDesktop && 'PC') || 'Phone',
      userAgent: cookies.getCookie(CookieKeys.userLoginEmail) || '',
      browser: browserName,
      objectId: eventDetailData.id,
      referer:
        document.referrer ||
        (previousPage && previousPage) ||
        window.location.hostname + window.location.pathname,
      timestamp: new Date().getTime().toString(),
      userTime: new Date().toString(),
      timezone: new Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    if (cookies.getCookie(CookieKeys.userLoginId)) {
      pageViewTrackPayload.userId = Number(
        cookies.getCookie(CookieKeys.userLoginId)
      );
    }
    dispatch(logPageViewAction(pageViewTrackPayload));
  };

  const localStorageJoinRavePopup = (joined: boolean) => {
    let joinRavePopupItems = [];
    if (localStorage.getItem(LocalStorageKeys.joinRavePopupKey)) {
      joinRavePopupItems = JSON.parse(
        localStorage.getItem(LocalStorageKeys.joinRavePopupKey) as string
      );
      joinRavePopupItems.push({
        event: id,
        time: new Date().getTime(),
        joined: false,
      });
      localStorage.setItem(
        LocalStorageKeys.joinRavePopupKey,
        JSON.stringify(joinRavePopupItems)
      );
    } else {
      localStorage.setItem(
        LocalStorageKeys.joinRavePopupKey,
        JSON.stringify([
          { event: id, time: new Date().getTime(), joined: joined },
        ])
      );
    }
  };

  const handleJoinRave = (needLocalStorage: boolean) => {
    if (needLocalStorage) {
      localStorageJoinRavePopup(true);
    }
    if (cookies.getCookie(CookieKeys.userLoginToken)) {
      if (itemTabs.current) {
        eventDetailContainer.current.scrollTop =
          itemTabs.current.offsetTop + 500 || 0;
        setShowJoinRaveModal(false);
        setTimeout(() => {
          setShowHaveJoinedRaveModal(true);
        }, 300);
      }
    } else {
      router.push({
        pathname: RouterKeys.login,
        query: `redirect=${window.location.pathname}-previous=rave`,
      });
    }
  };

  const ravesPopUpClose = () => {
    setShowJoinRaveModal(false);
    if (clickNotShowAnymore) {
      localStorageJoinRavePopup(false);
    }
  };

  useEffect(() => {
    const { eventId } = router.query;
    if (eventId) {
      const parameterArr = (eventId as string).split('-');
      if (last(parameterArr)?.includes('previous=')) {
        if (parameterArr[parameterArr.length - 1] === 'previous=rave') {
          setShowJoinRaveModal(false);
          setJoinRaveNotLogin(true);
        }
        if (parameterArr[parameterArr.length - 2]) {
          setEventId(parameterArr[parameterArr.length - 2] || '');
        } else {
          setEventCorrect(false);
        }
        setPreviousPage(
          `${window.location.hostname}/${last(parameterArr)?.split('=')[1]}`
        );
        return;
      }
      if (last(parameterArr)) {
        setEventId(last(parameterArr) || '');
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
      logPageViewTrack();
      if (joinRaveNotLogin) {
        handleJoinRave(false);
      }
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
      if (localStorage.getItem(LocalStorageKeys.joinRavePopupKey)) {
        const currentTime = new Date().getTime();
        const response: CloseRavesPopUpProps[] = JSON.parse(
          localStorage.getItem(LocalStorageKeys.joinRavePopupKey) as string
        );
        const currentEvent: any = response.find((item) => item.event === id);
        if (currentEvent) {
          if (
            !currentEvent.joined &&
            Math.abs(currentTime - currentEvent.time) >= 2 * 60 * 60 * 1000
          ) {
            setShowJoinRaveModal(true);
          }
        } else {
          setShowJoinRaveModal(true);
        }
      } else {
        setShowJoinRaveModal(true);
      }
    }
  }, [id]);

  useEffect(() => {
    if (!localStorage.getItem(LocalStorageKeys.pageViewTrackKeys)) {
      localStorage.setItem(
        LocalStorageKeys.pageViewTrackKeys,
        generateRandomString()
      );
    }
    return () => {
      dispatch(resetEventDatail());
      dispatch(resetError());
      dispatch(resetEventDetailLoading());
      dispatch(setTabActiveKey(PrimaryMarket));
    };
  }, []);

  const testJoinRaveItems = [
    {
      id: 1,
      img: 'https://crowdserve-ticket-images-dev.s3-ap-southeast-1.amazonaws.com/events/1687166891215-LUwj.png',
      name: 'Free Drink',
    },
    {
      id: 2,
      img: 'https://crowdserve-ticket-images-dev.s3-ap-southeast-1.amazonaws.com/events/1687166891215-LUwj.png',
      name: 'Free Ticket',
    },
  ];

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
            <EventDetailContainer ref={eventDetailContainer}>
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
                        <Col span={24} className="info-item-status">
                          {EventStatus.map((status) => {
                            if (
                              status.key === eventDetailData.status &&
                              status.text
                            ) {
                              return (
                                <StatusContainer
                                  key={status.key}
                                  bgColor={status.bgColor}
                                  textColor={status.color}
                                >
                                  {status.text}
                                </StatusContainer>
                              );
                            }
                            return null;
                          })}
                        </Col>
                        <Col span={24} className="info-title">
                          {eventDetailData.name}
                        </Col>
                        <Col
                          span={24}
                          className="info-description-short"
                          dangerouslySetInnerHTML={{
                            __html: formatDescription(
                              eventDetailData.descriptionShort
                            ),
                          }}
                        />
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
                                  <p
                                    className="detail-description"
                                    dangerouslySetInnerHTML={{
                                      __html: formatDescription(
                                        eventDetailData.description
                                      ),
                                    }}
                                  />
                                )}
                                <ImageSizeLayoutComponent
                                  images={
                                    eventDetailData.descriptionImages || []
                                  }
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
                    <div ref={itemTabs} className="item-tabs">
                      <Tabs
                        defaultActiveKey={tabActiveKey}
                        items={tabsItem}
                        onChange={(activeKey) =>
                          dispatch(setTabActiveKey(activeKey))
                        }
                      />
                      <Row>
                        <Col span={24} className="dividing-line" />
                      </Row>
                      {tabActiveKey === PrimaryMarket && (
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
                                  className={
                                    ((!item.onSale || item.stock === 0) &&
                                      'no-click') ||
                                    ''
                                  }
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
                                        <div className="out-stock-mask">
                                          NOT ON SALE YET
                                        </div>
                                      )}
                                      {item.stock === 0 && item.onSale && (
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
                                      <div
                                        className={
                                          ((item.stock === 0 || !item.onSale) &&
                                            'type-info-content opacity') ||
                                          'type-info-content'
                                        }
                                      >
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
                      )}
                      {tabActiveKey === PurchaseFromFan && (
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
                      {tabActiveKey === Rave && <Raves />}
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
              <RavesPopUp open={showJoinRaveModal} onClose={ravesPopUpClose}>
                <JoinRaveModalContent>
                  <Col className="content-title">
                    Join the rave, complete <br /> missions and earn rewards!
                  </Col>
                  <Col
                    className={
                      (testJoinRaveItems.length > 2 &&
                        'content-banner scroll') ||
                      'content-banner'
                    }
                  >
                    <div className="banner-items">
                      {testJoinRaveItems.map((item) => (
                        <JoinRaveModalBannerItem
                          key={item.id}
                          className={
                            (testJoinRaveItems.length > 2 && 'scroll-item') ||
                            ''
                          }
                        >
                          <div className="gradient-box">
                            <div className="items-img">
                              <img src={item.img} alt="" />
                            </div>
                            <div className="item-name">{item.name}</div>
                            <img
                              className="free-icon"
                              src={Images.FreeIcon.src}
                              alt=""
                            />
                          </div>
                        </JoinRaveModalBannerItem>
                      ))}
                    </div>
                  </Col>
                  <Col className="content-users">
                    <Avatar.Group>
                      {generateRandomLetters(6).map((item) => (
                        <Avatar key={item}>{item}</Avatar>
                      ))}
                    </Avatar.Group>
                    <div className="users-count">
                      20+ users have joined the Rave
                    </div>
                  </Col>
                  <Col className="content-button">
                    <Button onClick={() => handleJoinRave(true)}>
                      Join Rave
                    </Button>
                  </Col>
                  <Col className="content-checkbox">
                    <Checkbox
                      onChange={(e) => setClickNotShowAnymore(e.target.checked)}
                    >
                      Don't show me anymore
                    </Checkbox>
                  </Col>
                </JoinRaveModalContent>
              </RavesPopUp>
              <RavesPopUp
                open={showHaveJoinedRaveModal}
                onClose={() => setShowHaveJoinedRaveModal(false)}
              >
                <HaveJoinedRaveModalContent>
                  <Col className="content-mascotsIcon">
                    <img src={Images.MascotsIcon.src} alt="" />
                  </Col>
                  <Col className="content-title">You have joined the rave!</Col>
                  <Col className="content-count">
                    <span>
                      <span>+ </span>2
                    </span>
                    <span>
                      <img src={Images.FireGifIcon.src} alt="" />
                    </span>
                  </Col>
                </HaveJoinedRaveModalContent>
              </RavesPopUp>
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
          last(parameterArr) as string
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
