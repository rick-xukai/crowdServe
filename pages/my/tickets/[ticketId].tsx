import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';
import NextImage from 'next/image';
import {
  Row,
  Col,
  Spin,
  Drawer,
  QRCode,
  Button,
  message,
  FloatButton,
} from 'antd';
import TextTruncate from 'react-text-truncate';
import { LoadingOutlined, RightOutlined } from '@ant-design/icons';
import copy from 'copy-to-clipboard';
import html2canvas from 'html2canvas';
import { getAnalytics, logEvent } from 'firebase/analytics';
import Dropdown from 'rc-dropdown';
import 'rc-dropdown/assets/index.css';

import { useCookie } from '../../../hooks';
import AuthHoc from '../../../components/hoc/AuthHoc';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  checkStatusIcon,
  formatTimeStrByTimeString,
} from '../../../utils/func';
import { Images } from '../../../theme';
import {
  resetDetail,
  resetQrcodeError,
  getTicketDetailAction,
  getTicketQrcodeAction,
  selectTicketDetailData,
  selectTicketQrcodeData,
  selectQrcodeLoading,
  selectError,
  selectQrcodeError,
  selectTicketDetailLoading,
} from '../../../slice/tickets.slice';
import {
  selectTicketsDataForAllStatus,
  setTicketsDataForAllStatus,
} from '../../../slice/ticketsCache.slice';
import Messages from '../../../constants/Messages';
import { CookieKeys, RouterKeys } from '../../../constants/Keys';
import {
  TicketStatus,
  DefaultCodeRefreshTime,
  FormatTimeKeys,
  PriceUnit,
  CopyLink,
  SaveImage,
  ShareEventLink,
  LinkCopied,
  ImageSaveFailed,
  FirebaseEventEnv,
  AppDomain,
} from '../../../constants/General';
import { TicketDetailContainer } from '../../../styles/ticketDetail.style';
import { TicketStatusContainer } from '../../../styles/tickets.style';
import PageHearderComponent from '../../../components/pageHearder';
import PageHearderResponsive from '../../../components/pageHearderResponsive';
import PageBottomComponent from '../../../components/pageBottomComponent';
import firebaseApp from '../../../firebase';
import PageNotFound from '../../404';

let timer: NodeJS.Timer | null = null;

const TicketDetail = ({ notFound }: { notFound: boolean }) => {
  const saveImageElement: any = useRef(null);

  const cookie = useCookie([CookieKeys.userLoginToken]);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const ticketDetailData = useAppSelector(selectTicketDetailData);
  const qrcodeData = useAppSelector(selectTicketQrcodeData);
  const qrcodeLoading = useAppSelector(selectQrcodeLoading);
  const error = useAppSelector(selectError);
  const qrcodeError = useAppSelector(selectQrcodeError);
  const ticketDetailLoading = useAppSelector(selectTicketDetailLoading);
  const ticketsDataForAllStatus = useAppSelector(selectTicketsDataForAllStatus);

  const [id, setTicketId] = useState<string>('');
  const [saveImageUrl, setSaveImageUrl] = useState<any>('');
  const [menuState, setMenuState] = useState<boolean>(false);
  const [showQrcode, setShowQrcode] = useState<boolean>(false);
  const [textShowMore, setTextShowMore] = useState<boolean>(false);
  const [showShareMenu, setShowShareMenu] = useState<boolean>(false);
  const [ticketCorrect, setTicketCorrect] = useState<boolean>(true);
  const [countdownNumber, setCountdownNumber] = useState<
    number | ((prevTime: number) => void)
  >(DefaultCodeRefreshTime);

  const timerMethod = () => {
    setCountdownNumber(DefaultCodeRefreshTime);
    if (timer) {
      clearInterval(timer);
    }
    timer = setInterval(() => {
      setCountdownNumber((prevTime: number) => {
        if (prevTime > 0) {
          return prevTime - 1;
        }
        return 0;
      });
    }, 1000);
  };

  const copyUrl = () => {
    setShowShareMenu(false);
    const parameterArr = ticketDetailData.slug.split('-');
    parameterArr.pop();
    parameterArr.push(ticketDetailData.eventId.toString());
    const analytics = getAnalytics(firebaseApp);
    const link = `${AppDomain}${RouterKeys.eventDetail.replace(
      ':slug',
      parameterArr.join('-')
    )}?ticket=${ticketDetailData.id}&source=sharing`;
    copy(
      ShareEventLink.replace('{eventName}', ticketDetailData.name)
        .replace('{OrganizerName}', ticketDetailData.organizerName)
        .replace('{currentLink}', link)
    );
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
    request.open('get', ticketDetailData.image, true);
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
        if (
          ticketDetailData.imageType.toLowerCase().includes('video') ||
          ticketDetailData.imageType.toLowerCase().includes('gif')
        ) {
          const elA = document.createElement('a');
          const objectUrl = window.URL.createObjectURL(blob);
          elA.download = `${ticketDetailData.name}.${
            (ticketDetailData.imageType.toLowerCase().includes('gif') &&
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

  useEffect(() => {
    if (saveImageUrl) {
      html2canvas(saveImageElement.current, {
        allowTaint: true,
        useCORS: true,
        removeContainer: true,
      }).then((canvas) => {
        const imageBase64 = canvas.toDataURL('image/png');
        const elA = document.createElement('a');
        elA.download = `${ticketDetailData.name}.png`;
        elA.href = imageBase64;
        elA.click();
        elA.remove();
        messageApi.destroy();
      });
    }
  }, [saveImageUrl]);

  useEffect(() => {
    const { ticketId } = router.query;
    if (ticketId) {
      const parameterArr = (ticketId as string).split('-');
      if (!notFound) {
        setTicketId(_.last(parameterArr) || '');
      }
    }
  }, [router.isReady]);

  useEffect(() => {
    const { ticketId } = router.query;
    if (ticketDetailData.slug) {
      if (ticketDetailData.slug !== ticketId) {
        router.push(
          RouterKeys.ticketDetail.replace(':slug', ticketDetailData.slug)
        );
      } else {
        if (ticketDetailData.id !== 0) {
          const allTickets = _.cloneDeep(ticketsDataForAllStatus);
          allTickets.forEach((item, index) => {
            if (item.id === ticketDetailData.id) {
              allTickets.splice(index, 1, {
                ...item,
                status: ticketDetailData.status,
              });
            }
          });
          dispatch(setTicketsDataForAllStatus(allTickets));
        }
      }
    }
  }, [ticketDetailData]);

  useEffect(() => {
    if (error) {
      if (
        error.code === Messages.notFound.code ||
        error.code === Messages.invalidUnlawful.code ||
        error.code === Messages.eventMismatch.code
      ) {
        setTicketCorrect(false);
      }
      messageApi.open({
        content: error.message,
        className: 'error-message-tickets',
      });
    }
  }, [error]);

  useEffect(() => {
    if (qrcodeError && qrcodeError.code === Messages.redeemed.code) {
      setShowQrcode(false);
      dispatch(getTicketDetailAction(id));
    }
  }, [qrcodeError]);

  useEffect(() => {
    if (id) {
      dispatch(getTicketDetailAction(id));
    }
  }, [id]);

  useEffect(() => {
    if (showQrcode) {
      dispatch(getTicketQrcodeAction(id));
    } else {
      dispatch(resetQrcodeError());
      clearInterval(Number(timer));
    }
  }, [showQrcode]);

  useEffect(() => {
    if (!qrcodeLoading) {
      timerMethod();
    }
  }, [qrcodeLoading]);

  useEffect(() => {
    if (countdownNumber === 0) {
      setTimeout(() => {
        dispatch(getTicketQrcodeAction(id));
      }, 100);
    }
  }, [countdownNumber]);

  useEffect(() => {
    if (showShareMenu) {
      const analytics = getAnalytics(firebaseApp);
      logEvent(analytics, `web_share_button_click${FirebaseEventEnv}`);
    }
  }, [showShareMenu]);

  // eslint-disable-next-line
  useEffect(() => {
    return () => {
      if (!cookie.getCookie(CookieKeys.userLoginToken)) {
        router.push(RouterKeys.login);
      }
      clearInterval(Number(timer));
      dispatch(resetDetail());
    };
  }, []);

  return (
    <>
      {((notFound || !ticketCorrect) && <PageNotFound />) || (
        <>
          {(!ticketDetailLoading && (
            <TicketDetailContainer
              style={{ overflow: (menuState && 'hidden') || 'unset' }}
            >
              <Col md={24} xs={0}>
                <PageHearderResponsive />
              </Col>
              <Col md={0} xs={24}>
                <PageHearderComponent setMenuState={setMenuState} />
              </Col>
              <Row style={{ position: 'relative' }}>
                <Col span={24} className="detail-background">
                  {(ticketDetailData.imageType
                    .toLowerCase()
                    .includes('video') && (
                    <video
                      src={ticketDetailData.image}
                      playsInline
                      muted
                      autoPlay
                      loop
                    />
                  )) || (
                    <img
                      src={ticketDetailData.image}
                      alt=""
                      onError={(e: any) => {
                        e.target.onerror = null;
                        e.target.src = Images.BackgroundLogo.src;
                        e.target.className = 'error-full-image';
                      }}
                    />
                  )}
                </Col>
                {checkStatusIcon(ticketDetailData.status) && (
                  <div className="ticket-status-icon">
                    <NextImage
                      src={checkStatusIcon(ticketDetailData.status)}
                      alt=""
                    />
                  </div>
                )}
              </Row>
              <div
                className={`detail-info ${
                  (ticketDetailData.status !== TicketStatus[0].key &&
                    'detail-info-no-code') ||
                  ''
                }`}
              >
                <div className="info-container">
                  <Row className="container-top">
                    <Col span={24}>
                      {TicketStatus.map((status) => {
                        if (
                          status.key === ticketDetailData.status &&
                          status.text
                        ) {
                          return (
                            <TicketStatusContainer
                              key={status.key}
                              bgColor={status.bgColor}
                              textColor={status.color}
                            >
                              {status.text}
                            </TicketStatusContainer>
                          );
                        }
                        return null;
                      })}
                    </Col>
                    <Col span={24}>
                      <Row style={{ marginTop: 20 }}>
                        <Col span={20} className="ticket-name">
                          {ticketDetailData.name || '-'}
                        </Col>
                        <Col span={4} className="share-button">
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
                                <NextImage src={Images.ShareIcon} alt="" />
                              </Col>
                              <Col xl={24} span={0}>
                                <div className="share-trigger">
                                  <NextImage src={Images.ShareIcon} alt="" />
                                  <span className="share-text">Share</span>
                                </div>
                              </Col>
                            </button>
                          </Dropdown>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={24} className="organizer-name">
                      By {ticketDetailData.organizerName || '-'}
                    </Col>
                    {ticketDetailData.crowdfundLink && (
                      <Col span={24} className="crowd-fund-link">
                        <a
                          href={ticketDetailData.crowdfundLink}
                          target="_blank"
                        >
                          View CrowdFund Progress <RightOutlined />
                        </a>
                      </Col>
                    )}
                    <Col span={24} className="ticket-description">
                      {(textShowMore && (
                        <p className="whole-description">
                          {ticketDetailData.description}
                        </p>
                      )) || (
                        <TextTruncate
                          line={2}
                          element="div"
                          truncateText="…"
                          containerClassName="text-typography"
                          text={ticketDetailData.description || '-'}
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
                  <div className="container-info-item">
                    <Row
                      gutter={{ md: 20, xs: 10 }}
                      className="info-item-row-flex"
                    >
                      <Col md={12} span={24} className="info-item-responsive">
                        <Row className="info-item-row">
                          <Col span={24} className="info-item-title">
                            Location
                          </Col>
                          <Col span={24} className="info-item-value">
                            {ticketDetailData.location || '-'}
                          </Col>
                        </Row>
                      </Col>
                      <Col md={12} span={24} className="info-item-responsive">
                        <Row className="info-item-row">
                          <Col span={24} className="info-item-title">
                            Date
                          </Col>
                          <Col span={24} className="info-item-value">
                            {(ticketDetailData.startTime &&
                              ticketDetailData.endTime &&
                              `${formatTimeStrByTimeString(
                                ticketDetailData.startTime,
                                FormatTimeKeys.norm
                              )} - ${formatTimeStrByTimeString(
                                ticketDetailData.endTime,
                                FormatTimeKeys.norm
                              )}`) ||
                              '-'}
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row
                      gutter={{ md: 20, xs: 10 }}
                      className="info-item-row-flex"
                    >
                      <Col span={12}>
                        <Row className="info-item-row">
                          <Col span={24} className="info-item-title">
                            Type
                          </Col>
                          <Col span={24} className="info-item-value">
                            {ticketDetailData.type || '-'}
                          </Col>
                        </Row>
                      </Col>
                      <Col span={12}>
                        <Row className="info-item-row">
                          <Col span={24} className="info-item-title">
                            Seat Number
                          </Col>
                          <Col span={24} className="info-item-value">
                            {ticketDetailData.seat || '-'}
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row
                      gutter={{ md: 20, xs: 10 }}
                      className="info-item-row-flex"
                    >
                      <Col span={12}>
                        <Row className="info-item-row">
                          <Col span={24} className="info-item-title">
                            Price
                          </Col>
                          <Col span={24} className="info-item-value">
                            {`${ticketDetailData.price.toFixed(
                              2
                            )} ${PriceUnit}`}
                          </Col>
                        </Row>
                      </Col>
                      <Col span={12}>
                        <Row className="info-item-row">
                          <Col span={24} className="info-item-title">
                            Ticket Number
                          </Col>
                          <Col span={24} className="info-item-value">
                            {ticketDetailData.ticketNo || '-'}
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                  {(ticketDetailData.collections &&
                    ticketDetailData.collections.length && (
                      <Row className="container-bottom">
                        <Col span={24} style={{ textAlign: 'center' }}>
                          <div>
                            <NextImage src={Images.GoToLinkIcon} alt="" />
                            <span className="view-blockchain">
                              <a
                                href={ticketDetailData.collections[0].address}
                                target="_blank"
                              >
                                VIEW ON BLOCKCHAIN
                              </a>
                            </span>
                          </div>
                        </Col>
                      </Row>
                    )) ||
                    null}
                </div>
              </div>
              {(!showQrcode &&
                ticketDetailData.status === TicketStatus[0].key &&
                !menuState && (
                  <FloatButton
                    onClick={() => setShowQrcode(true)}
                    icon={<NextImage src={Images.QrcodeIcon} alt="" />}
                  />
                )) || (
                <Drawer
                  placement="bottom"
                  open={showQrcode}
                  closable={false}
                  keyboard={false}
                  onClose={() => setShowQrcode(false)}
                >
                  {(!qrcodeError && (
                    <div style={{ height: '100%' }}>
                      {(!qrcodeLoading && (
                        <>
                          <div>
                            <QRCode
                              errorLevel="L"
                              value={qrcodeData}
                              bordered={false}
                              size={270}
                              status="expired"
                              onRefresh={() => setCountdownNumber(0)}
                            />
                          </div>
                          <p className="code-refreshes">
                            QR Code refreshes in:{' '}
                            {`${
                              (countdownNumber < 10 && '00:0') || '00:'
                            }${countdownNumber}`}
                          </p>
                          <p className="code-info">
                            This QR code is your admission voucher, do not take
                            screenshot or send to others!
                          </p>
                        </>
                      )) || (
                        <Spin
                          spinning
                          indicator={<LoadingOutlined spin />}
                          size="large"
                        >
                          <div />
                        </Spin>
                      )}
                    </div>
                  )) || (
                    <div className="code-network-error-box">
                      <NextImage src={Images.QrcodeNetworkError} alt="" />
                      <p className="error-title">Network request failed</p>
                      <p className="error-info">
                        QR code failed to get, please refresh the page
                      </p>
                      <Button
                        className="refresh-btn"
                        onClick={() => dispatch(getTicketQrcodeAction(id))}
                      >
                        REFRESH
                      </Button>
                      <p className="code-info">
                        This QR code is your admission voucher, do not take
                        screenshot or send to others!
                      </p>
                    </div>
                  )}
                </Drawer>
              )}
              {contextHolder}
              {!menuState && <PageBottomComponent />}
              <div ref={saveImageElement} className="ticket-poster">
                <div className="poster">
                  <img src={saveImageUrl} alt="" />
                </div>
                <div className="poster-info">
                  <div className="poster-name">
                    <TextTruncate
                      line={2}
                      element="div"
                      truncateText="…"
                      containerClassName="text-typography"
                      text={ticketDetailData.name || '-'}
                    />
                  </div>
                  <div className="poster-organizerName">
                    <div>
                      <span style={{ fontWeight: 400, marginRight: 5 }}>
                        By
                      </span>
                      {`${ticketDetailData.organizerName.slice(0, 32)}${
                        (ticketDetailData.organizerName.length > 32 && '...') ||
                        ''
                      }`}
                    </div>
                  </div>
                  <div className="poster-logo">
                    <img src={Images.LogoNameIcon.src} alt="" />
                  </div>
                </div>
              </div>
            </TicketDetailContainer>
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

TicketDetail.getInitialProps = async (ctx: any) => {
  const { query } = ctx;
  const { ticketId } = query;
  if (ticketId) {
    const parameterArr = (ticketId as string).split('-');
    const lastItem = Number(_.last(parameterArr));
    if (isNaN(lastItem) || lastItem === 0) {
      return { notFound: true };
    }
    return {
      props: {},
    };
  }
  return {
    props: {},
  };
};

export default AuthHoc(TicketDetail);
