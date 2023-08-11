import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Row, Col, Button, message, Modal, Drawer } from 'antd';
import { LoadingOutlined, LoginOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Dropdown from 'rc-dropdown';
import 'rc-dropdown/assets/index.css';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { useRouter } from 'next/router';
import _ from 'lodash';
import html2canvas from 'html2canvas';
import copy from 'copy-to-clipboard';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import AuthHoc from '../../../components/hoc/AuthHoc';
import { Images } from '../../../theme';
import {
  formatTimeStrByTimeString,
  loadChart,
  formatChartLabelDate,
  bodyOverflow,
} from '../../../utils/func';
import {
  CopyLink,
  SaveImage,
  FirebaseEventEnv,
  TicketStatus,
  FormatTimeKeys,
  TicketSaleStatus,
  PrivilegeType,
  LinkCopied,
  ImageSaveFailed,
  ShareEventLink,
  ShareCollectibleLink,
} from '../../../constants/General';
import Messages from '../../../constants/Messages';
import firebaseApp from '../../../firebase';
import {
  reset,
  getCollectibleDetailAction,
  getConnectedEventsAction,
  selectLoading,
  selectError,
  selectCollectibleDetail,
  selectConnectedEvents,
  defaultConnectedEventItem,
  ConnectedEventsResponseType,
  selectPriceChartData,
  getPriceChartDataAction,
} from '../../../slice/collectible.slice';
import {
  CollectibleDetailContainer,
  EventDetailCard,
  ConnectedEventsItem,
} from '../../../styles/collectibleDetail.style';
import { MyEventStatusContainer } from '../../../styles/myTickets.style';
import PageHearderComponent from '../../../components/pageHearder';
import PageHearderResponsive from '../../../components/pageHearderResponsive';
import TicketQRCodeComponent from '../../../components/ticketQRCode';
import ShowQRCodeElementComponent from '../../../components/showQRCodeElement';
import EventDetailPopupElement from '../../../components/eventDetailPopupElement';
import ConnectedEventPopupElement from '../../../components/connectedEventPopupElement';
import PageNotFound from '../../404';

const CollectibleDetail = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const collectibleDetailRef: any = useRef(null);
  const chartRef: any = useRef(null);
  const saveImageElement: any = useRef(null);

  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const collectibleDetail = useAppSelector(selectCollectibleDetail);
  const connectedEvents = useAppSelector(selectConnectedEvents);
  const priceChartData = useAppSelector(selectPriceChartData);

  const [requestId, setRequestId] = useState<string>('');
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [collectibleCorrect, setCollectibleCorrect] = useState<boolean>(true);
  const [showEventDetail, setShowEventDetail] = useState<boolean>(false);
  const [showShareMenu, setShowShareMenu] = useState<boolean>(false);
  const [saveImageUrl, setSaveImageUrl] = useState<any>('');
  const [showEventDetailDrawer, setShowEventDetailDrawer] =
    useState<boolean>(false);
  const [showQrCodeModal, setShowQrCodeModal] = useState<boolean>(false);
  const [showQrCodeDrawer, setShowQrCodeDrawer] = useState<boolean>(false);
  const [showConnectedEventModal, setShowConnectedEventModal] =
    useState<boolean>(false);
  const [showConnectedEventDrawer, setShowConnectedEventDrawer] =
    useState<boolean>(false);
  const [currentConnectedEvent, setCurrentConnectedEvent] =
    useState<ConnectedEventsResponseType>(defaultConnectedEventItem);

  const copyUrl = () => {
    setShowShareMenu(false);
    const analytics = getAnalytics(firebaseApp);
    if (
      collectibleDetail.status ===
      TicketStatus.find((item) => item.text === 'UPCOMING')?.key
    ) {
      copy(
        ShareEventLink.replace(
          '{eventName}',
          collectibleDetail.event.name
        ).replace('{currentLink}', collectibleDetail.sharePage)
      );
    } else {
      copy(
        ShareCollectibleLink.replace(
          '{collectibleName}',
          collectibleDetail.name
        ).replace('{currentLink}', collectibleDetail.sharePage)
      );
    }

    logEvent(analytics, `web_copy_link_click${FirebaseEventEnv}`);
    messageApi.open({
      content: LinkCopied,
      className: 'default-message',
    });
  };

  const saveImage = () => {
    setShowShareMenu(false);
    const analytics = getAnalytics(firebaseApp);
    logEvent(analytics, `web_save_image_click${FirebaseEventEnv}`);
    setSaveImageUrl('');
    let request = new XMLHttpRequest();
    request.open('get', collectibleDetail.image, true);
    request.responseType = 'blob';
    request.setRequestHeader('Cache-Control', 'no-cache');
    messageApi.open({
      content: (
        <div className="message-content">
          <img
            className="image-ani-hourglass"
            src={Images.HourglassWhite.src}
            alt=""
          />
          <div>
            Downloading
            <span className="dot-ani" />
          </div>
        </div>
      ),
      className: 'default-message default-message-download',
      duration: 0,
    });
    request.onload = function () {
      if (this.status === 200) {
        let blob = this.response;
        if (collectibleDetail.imageType) {
          if (
            collectibleDetail.imageType.toLowerCase().includes('video') ||
            collectibleDetail.imageType.toLowerCase().includes('gif')
          ) {
            const elA = document.createElement('a');
            const objectUrl = window.URL.createObjectURL(blob);
            elA.download = `${collectibleDetail.name}.${
              (collectibleDetail.imageType.toLowerCase().includes('gif') &&
                'gif') ||
              'mp4'
            }`;
            elA.href = objectUrl;
            elA.click();
            window.URL.revokeObjectURL(objectUrl);
            elA.remove();
          } else {
            let oFileReader = new FileReader();
            oFileReader.onloadend = function (e: any) {
              const base64 = e.target.result;
              setSaveImageUrl(base64);
            };
            oFileReader.readAsDataURL(blob);
          }
        }
        messageApi.destroy();
      }
    };
    request.send();
    request.onreadystatechange = () => {
      if (request.status !== 200) {
        messageApi.destroy();
        messageApi.open({
          content: ImageSaveFailed,
          className: 'default-message',
        });
      }
    };
  };

  const handleScrollHiddenChartTooltip = () => {
    const tooltipEl = document.getElementById('chartjs-tooltip');
    if (tooltipEl) {
      tooltipEl.style.opacity = '0';
    }
  };

  const scrollListener = useCallback(() => {
    handleScrollHiddenChartTooltip();
  }, []);

  const handleQRCodeError = () => {
    setShowQrCodeDrawer(false);
    setShowQrCodeModal(false);
    dispatch(getCollectibleDetailAction(requestId));
    dispatch(getConnectedEventsAction(requestId));
    dispatch(getPriceChartDataAction(requestId));
  };

  const screenResize = (e: any) => {
    if (e.target.innerWidth > 576) {
      setShowEventDetailDrawer(false);
      setShowConnectedEventDrawer(false);
      setShowQrCodeDrawer(false);
    }
    if (e.target.innerWidth <= 576) {
      setShowEventDetail(false);
      setShowConnectedEventModal(false);
      setShowQrCodeModal(false);
    }
  };

  const checkIsShowQRCodeBottom = () => {
    let showBottom = false;
    const upcomingStatus = connectedEvents.filter(
      (connectedEventsItem) =>
        connectedEventsItem.status ===
          TicketStatus.find((statusItem) => statusItem.text === 'UPCOMING')
            ?.key &&
        connectedEventsItem.privilegeType !== PrivilegeType.discount.status
    );
    if (collectibleDetail.saleStatus === TicketSaleStatus.onsale.status) {
      showBottom = false;
    } else {
      if (
        collectibleDetail.status ===
          TicketStatus.find((ticketStatus) => ticketStatus.text === 'UPCOMING')
            ?.key ||
        upcomingStatus.length
      ) {
        showBottom = true;
      }
    }
    return showBottom;
  };

  useEffect(() => {
    if (saveImageUrl) {
      html2canvas(saveImageElement.current, {
        allowTaint: true,
        useCORS: true,
        removeContainer: true,
      }).then((canvas) => {
        const imageBase64 = canvas.toDataURL('image/png');
        const elA = document.createElement('a');
        elA.download = `${collectibleDetail.name}.png`;
        elA.href = imageBase64;
        elA.click();
        elA.remove();
        messageApi.destroy();
      });
    }
  }, [saveImageUrl]);

  useEffect(() => {
    if (showShareMenu) {
      const analytics = getAnalytics(firebaseApp);
      logEvent(analytics, `web_share_button_click${FirebaseEventEnv}`);
    }
  }, [showShareMenu]);

  useEffect(() => {
    const { collectibleId } = router.query;
    if (collectibleId) {
      const parameterArr = (collectibleId as string).split('-');
      if (_.last(parameterArr)) {
        setRequestId(_.last(parameterArr) as string);
      } else {
        setCollectibleCorrect(false);
      }
    }
  }, [router.isReady]);

  useEffect(() => {
    if (requestId) {
      dispatch(getCollectibleDetailAction(requestId));
      dispatch(getConnectedEventsAction(requestId));
      dispatch(getPriceChartDataAction(requestId));
    }
  }, [requestId]);

  useEffect(() => {
    if (!isFirstRender && error) {
      if (
        error.code === Messages.notFound.code ||
        error.code === Messages.invalidUnlawful.code ||
        error.code === Messages.eventMismatch.code
      ) {
        setCollectibleCorrect(false);
      }
      messageApi.open({
        content: error.message,
        className: 'error-message-event',
      });
    }
  }, [error]);

  useEffect(() => {
    if (priceChartData.length) {
      if (chartRef && chartRef.current) {
        const ctx = chartRef.current.getContext('2d');
        const labelItems: string[] = [];
        const dataItems: number[] = [];
        priceChartData.forEach((item) => {
          labelItems.push(
            formatTimeStrByTimeString(
              formatChartLabelDate(item.date),
              FormatTimeKeys.md
            )
          );
          dataItems.push(Number(item.price));
        });
        loadChart(ctx, labelItems, dataItems, 'line');
      }
    }
  }, [priceChartData]);

  useEffect(() => {
    try {
      if (
        showQrCodeDrawer ||
        showQrCodeModal ||
        showEventDetail ||
        showEventDetailDrawer ||
        showConnectedEventDrawer ||
        showConnectedEventModal
      ) {
        bodyOverflow('hidden');
      } else {
        bodyOverflow('scroll');
      }
    } catch (e) {}
  }, [
    showQrCodeDrawer,
    showQrCodeModal,
    showEventDetail,
    showEventDetailDrawer,
    showConnectedEventDrawer,
    showConnectedEventModal,
  ]);

  useEffect(() => {
    window.addEventListener('resize', screenResize);
    if (collectibleDetailRef && collectibleDetailRef.current) {
      collectibleDetailRef.current.addEventListener(
        'scroll',
        scrollListener,
        true
      );
    }
    setIsFirstRender(false);
    return () => {
      dispatch(reset());
      handleScrollHiddenChartTooltip();
      window.removeEventListener('resize', screenResize);
      if (collectibleDetailRef && collectibleDetailRef.current) {
        collectibleDetailRef.current.removeEventListener(
          'scroll',
          scrollListener,
          true
        );
      }
    };
  }, []);

  return (
    <>
      {(collectibleCorrect && (
        <>
          {(loading && (
            <CollectibleDetailContainer ref={collectibleDetailRef}>
              <div className="page-loading">
                <LoadingOutlined />
              </div>
            </CollectibleDetailContainer>
          )) || (
            <CollectibleDetailContainer ref={collectibleDetailRef}>
              <div className="container-wrap">
                <Col md={24} xs={0}>
                  <PageHearderResponsive />
                </Col>
                <Col md={0} xs={24}>
                  <PageHearderComponent />
                </Col>
                <div
                  className={
                    (checkIsShowQRCodeBottom() &&
                      'page-main page-bottom-show') ||
                    'page-main'
                  }
                >
                  <Row>
                    <Col xl={12} span={24} className="collectible-info">
                      <Col className="collectible-info-image">
                        {(collectibleDetail.imageType &&
                          collectibleDetail.imageType
                            .toLowerCase()
                            .includes('video') && (
                            <video
                              src={collectibleDetail.image}
                              playsInline
                              muted
                              autoPlay
                              loop
                            />
                          )) || (
                          <img
                            src={collectibleDetail.image}
                            alt=""
                            onError={(e: any) => {
                              e.target.onerror = null;
                              e.target.src = Images.BackgroundLogo.src;
                              e.target.className = 'error-full-image';
                            }}
                          />
                        )}
                        {collectibleDetail.saleStatus ===
                          TicketSaleStatus.onsale.status && (
                          <div className="on-sale-icon">
                            <Image src={Images.OnSaleIcon} alt="" />
                          </div>
                        )}
                      </Col>
                      <Row style={{ alignItems: 'start' }}>
                        <Col span={20} className="info-name">
                          {collectibleDetail.name || '-'}
                        </Col>
                        <Col span={4} className="info-share-button">
                          <div className="share-content">
                            <Dropdown
                              trigger={['click']}
                              animation="slide-up"
                              overlay={
                                <div className="share-menu">
                                  <ul>
                                    <li onClick={copyUrl}>
                                      <span>{CopyLink}</span>
                                    </li>
                                    <li onClick={saveImage}>
                                      <span>{SaveImage}</span>
                                    </li>
                                  </ul>
                                </div>
                              }
                              onVisibleChange={(status) => {
                                if (status) {
                                  const analytics = getAnalytics(firebaseApp);
                                  logEvent(
                                    analytics,
                                    `web_share_button_click${FirebaseEventEnv}`
                                  );
                                }
                              }}
                            >
                              <button className="dropdown-btn">
                                <Col xl={0} span={24}>
                                  <Image src={Images.ShareIcon} alt="" />
                                </Col>
                                <Col xl={24} span={0}>
                                  <div className="share-trigger">
                                    <Image src={Images.ShareIcon} alt="" />
                                    <span className="share-text">Share</span>
                                  </div>
                                </Col>
                              </button>
                            </Dropdown>
                          </div>
                        </Col>
                      </Row>
                      <Col span={24} className="info-organiser">
                        <div style={{ fontWeight: 300, marginRight: 5 }}>
                          By
                        </div>
                        <div>{collectibleDetail.organizerName || '-'}</div>
                      </Col>
                      <Col span={24} className="info-view-blockchain">
                        <LoginOutlined />
                        <a
                          href={collectibleDetail.blockchainUrl}
                          target="_blank"
                        >
                          VIEW ON BLOCKCHAIN
                        </a>
                      </Col>
                      <Col className="info-description">
                        {collectibleDetail.description}
                      </Col>
                    </Col>
                    <Col xl={12} span={24} className="event-info">
                      <Col className="event-info-top">
                        <Col className="event-info-title">EVENT DETAILS</Col>
                        <EventDetailCard
                          onClick={() => {
                            if (window.innerWidth <= 576) {
                              setShowEventDetailDrawer(true);
                            } else {
                              setShowEventDetail(true);
                            }
                          }}
                        >
                          <div className="event-background">
                            <Image
                              src={
                                collectibleDetail.event.image ||
                                Images.BackgroundLogo.src
                              }
                              layout="fill"
                              alt=""
                              onError={(e: any) => {
                                e.target.onerror = null;
                                e.target.src = Images.BackgroundLogo.src;
                              }}
                            />
                          </div>
                          <div className="item-info">
                            <Row className="item-info-row">
                              <Col span={24}>
                                {TicketStatus.map((status) => {
                                  if (
                                    status.key === collectibleDetail.status &&
                                    status.text
                                  ) {
                                    return (
                                      <MyEventStatusContainer
                                        key={status.key}
                                        bgColor={status.bgColor}
                                        textColor={status.color}
                                      >
                                        {status.text}
                                      </MyEventStatusContainer>
                                    );
                                  }
                                  return null;
                                })}
                              </Col>
                              <Col span={24} className="info-title">
                                {collectibleDetail.event.name || '-'}
                              </Col>
                              <Col span={24} className="info-item">
                                <Image
                                  className="info-item-icon"
                                  src={Images.ClockIcon}
                                  alt=""
                                />
                                <div className="info-detail-description">
                                  {(collectibleDetail.event.startTime &&
                                    collectibleDetail.event.endTime &&
                                    `${formatTimeStrByTimeString(
                                      collectibleDetail.event.startTime,
                                      FormatTimeKeys.norm
                                    )} - ${formatTimeStrByTimeString(
                                      collectibleDetail.event.endTime,
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
                                <div className="info-detail-description">
                                  {(collectibleDetail.event.location &&
                                    `${collectibleDetail.event.location}${
                                      (collectibleDetail.event.address &&
                                        `, ${collectibleDetail.event.address}`) ||
                                      ''
                                    }`) ||
                                    '-'}
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </EventDetailCard>
                      </Col>
                      {(connectedEvents.length && (
                        <Col className="connected-events">
                          <Col className="connected-events-title">
                            CONNECTED EVENTS
                          </Col>
                          {connectedEvents.map(
                            (item: ConnectedEventsResponseType) => (
                              <ConnectedEventsItem
                                key={item.id}
                                onClick={() => {
                                  setCurrentConnectedEvent(item);
                                  if (window.innerWidth <= 576) {
                                    setShowConnectedEventDrawer(true);
                                  } else {
                                    setShowConnectedEventModal(true);
                                  }
                                }}
                              >
                                <Col xs={24} sm={0} className="info-title-col">
                                  <p>{item.event.name || '-'}</p>
                                </Col>
                                <Row className="desktop-event-row">
                                  <Col span={20}>
                                    <Row>
                                      <Col
                                        span={7}
                                        className="event-background"
                                      >
                                        <Image
                                          src={
                                            item.ticketType.thumbnailUrl ||
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
                                        {item.privilegeType !==
                                          PrivilegeType.discount.status && (
                                          <div className="status-bar">
                                            {TicketStatus.map((status) => {
                                              if (
                                                status.key === item.status &&
                                                status.text
                                              ) {
                                                return (
                                                  <MyEventStatusContainer
                                                    key={status.key}
                                                    bgColor={status.bgColor}
                                                    textColor={status.color}
                                                  >
                                                    {status.text}
                                                  </MyEventStatusContainer>
                                                );
                                              }
                                              return null;
                                            })}
                                          </div>
                                        )}
                                      </Col>
                                      <Col span={17}>
                                        <div className="item-info">
                                          <Row className="item-info-row">
                                            <Col
                                              xs={0}
                                              sm={24}
                                              className="info-title"
                                            >
                                              {item.event.name || '-'}
                                            </Col>
                                            <Col
                                              span={24}
                                              className="info-item"
                                            >
                                              <Image
                                                src={Images.TicketsIcon}
                                                alt=""
                                                className="info-item-icon"
                                              />
                                              <span className="info-detail-description">
                                                {item.ticketType.name}
                                              </span>
                                            </Col>
                                            <Col
                                              span={24}
                                              className="info-item"
                                            >
                                              <Image
                                                className="info-item-icon"
                                                src={Images.ClockIcon}
                                                alt=""
                                              />
                                              <div className="info-detail-description">
                                                {(item.event.startTime &&
                                                  `${formatTimeStrByTimeString(
                                                    item.event.startTime,
                                                    FormatTimeKeys.norm
                                                  )}`) ||
                                                  '-'}
                                              </div>
                                            </Col>
                                            <Col
                                              span={24}
                                              className="info-item"
                                            >
                                              <Image
                                                src={Images.LocationIcon}
                                                alt=""
                                                className="info-item-icon"
                                              />
                                              <div className="info-detail-description">
                                                {item.event.location || '-'}
                                              </div>
                                            </Col>
                                          </Row>
                                        </div>
                                      </Col>
                                    </Row>
                                  </Col>
                                  <Col span={4}>
                                    <div className="right-icon">
                                      {(item.privilegeType ===
                                        PrivilegeType.discount.status && (
                                        <Image src={Images.CouponIcon} alt="" />
                                      )) || (
                                        <Image
                                          src={
                                            Images.ConnectedEventsDetailTrigger
                                          }
                                          alt=""
                                        />
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                              </ConnectedEventsItem>
                            )
                          )}
                        </Col>
                      )) ||
                        null}
                      <Col className="chart-content">
                        <Col className="chart-title">ALL TIME AVG.PRICE</Col>
                        {(priceChartData.length && (
                          <Col>
                            <div>
                              <canvas
                                ref={chartRef}
                                aria-label="ALL TIME AVG.PRICE"
                                role="img"
                              />
                            </div>
                          </Col>
                        )) || (
                          <Col>
                            <div className="no-chart">
                              <Image src={Images.ChartIcon} alt="" />
                              <p>No data yet.</p>
                            </div>
                          </Col>
                        )}
                      </Col>
                    </Col>
                  </Row>
                </div>
                {checkIsShowQRCodeBottom() && (
                  <div className="page-bottom">
                    <Button
                      onClick={() => {
                        if (window.innerWidth <= 576) {
                          setShowQrCodeDrawer(true);
                        } else {
                          setShowQrCodeModal(true);
                        }
                      }}
                    >
                      CHECK TICKET QR CODE
                    </Button>
                  </div>
                )}
                <Drawer
                  placement="bottom"
                  open={showEventDetailDrawer}
                  closable={false}
                  keyboard={false}
                  destroyOnClose
                  getContainer={false}
                  className="eventDetailDrawer"
                  onClose={() => setShowEventDetailDrawer(false)}
                >
                  <EventDetailPopupElement
                    collectibleDetail={collectibleDetail}
                  />
                </Drawer>
                <Modal
                  title=""
                  centered
                  closable={false}
                  footer={null}
                  open={showEventDetail}
                  className="eventDetailModal"
                  destroyOnClose
                  getContainer={false}
                  onCancel={() => setShowEventDetail(false)}
                >
                  <EventDetailPopupElement
                    collectibleDetail={collectibleDetail}
                  />
                  <div className="close-modal">
                    <Image
                      src={Images.CloseIcon}
                      alt=""
                      onClick={() => setShowEventDetail(false)}
                    />
                  </div>
                </Modal>
                <Modal
                  title=""
                  centered
                  closable={false}
                  footer={null}
                  open={showConnectedEventModal}
                  className="connectedEventDetailModal"
                  destroyOnClose
                  getContainer={false}
                  onCancel={() => setShowConnectedEventModal(false)}
                >
                  <ConnectedEventPopupElement
                    connectedEventItemDetail={currentConnectedEvent}
                  />
                  <div className="close-modal">
                    <Image
                      src={Images.CloseIcon}
                      alt=""
                      onClick={() => setShowConnectedEventModal(false)}
                    />
                  </div>
                </Modal>
                <Drawer
                  placement="bottom"
                  open={showConnectedEventDrawer}
                  closable={false}
                  keyboard={false}
                  destroyOnClose
                  getContainer={false}
                  className="connectedEventDetailDrawer"
                  onClose={() => setShowConnectedEventDrawer(false)}
                >
                  <ConnectedEventPopupElement
                    connectedEventItemDetail={currentConnectedEvent}
                  />
                </Drawer>
                <ShowQRCodeElementComponent
                  showDrawer={showQrCodeDrawer}
                  showModal={showQrCodeModal}
                  setShowDrawer={setShowQrCodeDrawer}
                  setShowModal={setShowQrCodeModal}
                >
                  <TicketQRCodeComponent
                    requestId={requestId}
                    handleError={handleQRCodeError}
                  />
                </ShowQRCodeElementComponent>
                {contextHolder}
                <div ref={saveImageElement} className="ticket-poster">
                  <div className="poster">
                    <img src={saveImageUrl} alt="" />
                  </div>
                  <div className="poster-info">
                    <div className="poster-name">
                      <p>{collectibleDetail.name || '-'}</p>
                    </div>
                    <div className="poster-organizerName">
                      <div>
                        <span style={{ fontWeight: 400, marginRight: 5 }}>
                          By
                        </span>
                        {`${collectibleDetail.organizerName.slice(0, 32)}${
                          (collectibleDetail.organizerName.length > 32 &&
                            '...') ||
                          ''
                        }`}
                      </div>
                    </div>
                    <div className="poster-logo">
                      <img src={Images.LogoNameIcon.src} alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </CollectibleDetailContainer>
          )}
        </>
      )) || <PageNotFound />}
    </>
  );
};

export default AuthHoc(CollectibleDetail);
