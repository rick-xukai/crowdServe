import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Spin, Row, Col, Tabs, Tooltip, message } from 'antd';
import { isAndroid, isIOS } from 'react-device-detect';
import type { TabsProps } from 'antd';
import {
  LoadingOutlined,
  QuestionCircleOutlined,
  RightOutlined,
} from '@ant-design/icons';
import Image from 'next/image';
import { NextSeo } from 'next-seo';
import TextTruncate from 'react-text-truncate';
import { getAnalytics, logEvent } from 'firebase/analytics';

import { formatTimeStrByTimeString, openApp } from '../../utils/func';
import {
  FormatTimeKeys,
  PriceUnit,
  PrimaryMarket,
  PurchaseFromFan,
  AppLandingPage,
  FirebaseEventEnv,
  AppDomain,
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
} from '../../slice/event.slice';
import { TicketDetailResponseType } from '../../slice/tickets.slice';
import {
  EventDetailContainer,
  TicketTypeItem,
} from '../../styles/eventDetail.style';
import PageHearderComponent from '../../components/pageHearder';
import PageHearderResponsive from '../../components/pageHearderResponsive';
import PageBottomComponent from '../../components/pageBottomComponent';
import firebaseApp from '../../firebase';
import EventService from '../../services/API/Event/Event.service';

const EventDetail = ({
  openGraphDetail,
}: {
  openGraphDetail: TicketDetailResponseType;
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const openAppInIos = useRef<any>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const error = useAppSelector(selectEventDetailError);
  const loading = useAppSelector(selectEventDetailLoading);
  const eventTicketTypeData = useAppSelector(selectEventTicketTypeData);
  const eventDetailData = useAppSelector(selectEventDetailData);

  const [id, setEventId] = useState<string>('');
  const [textShowMore, setTextShowMore] = useState<boolean>(false);
  const [menuState, setMenuState] = useState<boolean>(false);
  const [tabActiveKey, setTabActiveKey] = useState<string>(PrimaryMarket);
  const [eventTicketTypeFilter, setEventTicketTypeFilter] = useState<
    EventTicketTypeResponseType[]
  >([]);

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

  const getData = async (payload: string) => {
    const response = await dispatch(getEventDetailAction(payload));
    if (response.type === getEventDetailAction.fulfilled.toString()) {
      dispatch(getEventTicketTypeAction(id));
    }
  };

  const handleOpenApp = () => {
    if (isIOS) {
      openAppInIos.current.click();
    } else if (isAndroid) {
      openApp();
    }
  };

  const toShopify = (link: string, stock: number) => {
    if (stock === 0 || !link) {
      return;
    }
    window.open(link, '_blank');
  };

  useEffect(() => {
    const { eventId } = router.query;
    if (eventId) {
      setEventId(eventId as string);
    }
  }, [router.isReady]);

  useEffect(() => {
    const { source, ticket } = router.query;
    if (eventDetailData.name && source === 'sharing' && ticket) {
      const analytics = getAnalytics(firebaseApp);
      logEvent(analytics, `web_event_page_view${FirebaseEventEnv}`, {
        ticketMark: `<${ticket}>: ${eventDetailData.name}`,
      });
    }
  }, [eventDetailData]);

  useEffect(() => {
    if (error) {
      messageApi.open({
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
      dispatch(resetError());
    };
  }, []);

  return (
    <>
      <NextSeo
        title="CrowdServe"
        description="CrowdServe Web App"
        openGraph={{
          type: 'website',
          title: (openGraphDetail && openGraphDetail.name) || '',
          url: AppDomain,
          description: (openGraphDetail && openGraphDetail.description) || '',
          images: [
            {
              url: openGraphDetail.image,
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
                      src={Images.LocationIcon}
                      alt=""
                      className="info-item-icon"
                    />
                    <div className="info-description">
                      {eventDetailData.location || '-'}
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
                  {eventDetailData.crowdfundLink && (
                    <Col span={24} className="crowd-fund-link">
                      <a href={eventDetailData.crowdfundLink} target="_blank">
                        View CrowdFund Progress <RightOutlined />
                      </a>
                    </Col>
                  )}
                  <Col span={24} className="ticket-description">
                    {(textShowMore && (
                      <p className="whole-description">
                        {eventDetailData.description}
                      </p>
                    )) || (
                      <TextTruncate
                        line={2}
                        element="div"
                        truncateText="…"
                        containerClassName="text-typography"
                        text={eventDetailData.description || '-'}
                        textTruncateChild={
                          <span
                            className="show-more"
                            onClick={() => setTextShowMore(true)}
                          >
                            Show More
                          </span>
                        }
                      />
                    )}
                  </Col>
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
                  <Row gutter={[10, 10]}>
                    {(eventTicketTypeFilter.length && (
                      <>
                        {eventTicketTypeFilter.map((item) => (
                          <TicketTypeItem
                            span={12}
                            md={6}
                            xl={4}
                            lg={6}
                            key={item.id}
                            onClick={() =>
                              toShopify(item.externalLink, item.stock)
                            }
                          >
                            <div className="type-img">
                              <img
                                src={item.thumbnailUrl}
                                alt=""
                                onError={(e: any) => {
                                  e.target.onerror = null;
                                  e.target.src = Images.BackgroundLogo.src;
                                }}
                              />
                              {item.stock === 0 && (
                                <div className="out-stock-mask">
                                  OUT OF STOCK
                                </div>
                              )}
                            </div>
                            <div
                              className={
                                (item.stock === 0 && 'type-info out-stock') ||
                                'type-info'
                              }
                            >
                              <div className="line">
                                <img src={Images.EventLineIcon.src} alt="" />
                              </div>
                              <div className="info-des">
                                <p className="title">{item.name}</p>
                                <p className="price">
                                  {`${item.price.toFixed(2)} ${PriceUnit}`}
                                </p>
                              </div>
                            </div>
                          </TicketTypeItem>
                        ))}
                      </>
                    )) || (
                      <Col span={24} className="all-ticket-sold">
                        <div style={{ textAlign: 'center', marginTop: 20 }}>
                          <Image src={Images.AllTicketSold} alt="" />
                          <p>All tickets are sold.</p>
                        </div>
                      </Col>
                    )}
                  </Row>
                )) || (
                  <div className="install-app">
                    <Image src={Images.InstallIcon} alt="" />
                    <p>Buy Secondary Tickets on our app!</p>
                    <p className="install-btn" onClick={handleOpenApp}>
                      OPEN APP NOW
                    </p>
                    <a
                      ref={openAppInIos}
                      href={AppLandingPage}
                      style={{ display: 'none' }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          {contextHolder}
          {!menuState && <PageBottomComponent />}
        </EventDetailContainer>
      )) || (
        <Spin spinning indicator={<LoadingOutlined spin />} size="large">
          <div />
        </Spin>
      )}
    </>
  );
};

EventDetail.getInitialProps = async (ctx: any) => {
  const { query } = ctx;
  if (query.ticket && query.source === 'sharing') {
    try {
      const response = await EventService.getEventDetail(query.eventId);
      if (response.code === 200) {
        return { openGraphDetail: response.data };
      }
    } catch (error) {
      return {
        props: {},
      };
    }
  }
  return {
    props: {},
  };
};

export default EventDetail;
