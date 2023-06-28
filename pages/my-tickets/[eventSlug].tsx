import React, { useState, useEffect } from 'react';
import { Row, Col, Divider, Modal, Drawer, Button, message } from 'antd';
import { RightOutlined, LoadingOutlined } from '@ant-design/icons';
import Image from 'next/image';
import TextTruncate from 'react-text-truncate';
import { useRouter } from 'next/router';
import _ from 'lodash';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import AuthHoc from '../../components/hoc/AuthHoc';
import { Images } from '../../theme';
import {
  FormatTimeKeys,
  EventStatus,
  TicketStatus,
  PriceUnit,
  TicketSaleStatus,
} from '../../constants/General';
import Messages from '../../constants/Messages';
import { formatTimeStrByTimeString, bodyOverflow } from '../../utils/func';
import PageHearderComponent from '../../components/pageHearder';
import PageHearderResponsive from '../../components/pageHearderResponsive';
import {
  getMyTicketUserEventDetailAction,
  getMyEventTicketListAction,
  resetMyTicketEventDetail,
  selectEventDetailLoading,
  selectEventDetailError,
  selectTicketUserEventDetail,
  selectMyEventTicketList,
  getCollectibleDetailAction,
  MyEventTicketListResponseType,
} from '../../slice/myTickets.slice';
import { setCollectibleDetailLoading } from '../../slice/collectible.slice';
import { resetMyTicketsCache } from '../../slice/myTicketsCache.slice';
import { resetCollectionDetailCache } from '../../slice/collectionDetailCache.slice';
import { setCollectiblesOrganizerDetailLoading } from '../../slice/myCollectibles.slice';
import {
  MyTicketsEventDetailContainer,
  StatusContainer,
  MyTicketItemContainer,
} from '../../styles/myTicketsEventDetail.style';
import PageNotFound from '../404';
import TicketQRCodeComponent from '../../components/ticketQRCode';
import ClientModalComponent from '../../components/clientModal';
import ShowQRCodeElementComponent from '../../components/showQRCodeElement';
import { RouterKeys } from '../../constants/Keys';

const TicketDetailTabletAndMobile = ({
  detailData,
  checkCollectibleDetail,
  buttonAction,
}: {
  detailData: MyEventTicketListResponseType;
  checkCollectibleDetail: () => void;
  buttonAction: () => void;
}) => {
  const [showDescriptionMoreMobile, setShowDescriptionMoreMobile] =
    useState<boolean>(false);

  return (
    <>
      <div className="detail-image">
        {(detailData.animationType &&
          detailData.animationType.toLowerCase().includes('video') && (
            <video
              src={detailData.animationUrl}
              playsInline
              muted
              autoPlay
              loop
            />
          )) || (
          <img
            src={detailData.image}
            alt=""
            onError={(e: any) => {
              e.target.onerror = null;
              e.target.src = Images.BackgroundLogo.src;
              e.target.className = 'error-full-image';
            }}
          />
        )}
        {detailData.saleStatus === TicketSaleStatus.onsale.status && (
          <div className="ticket-sale-status">
            <Image src={Images.OnSaleIcon} alt="" />
          </div>
        )}
      </div>
      <div className="info-item-status">
        {TicketStatus.map((status) => {
          if (status.key === detailData.status && status.text) {
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
      </div>
      <div className="info-name">
        <p>{detailData.name || '-'}</p>
      </div>
      <Col span={24} className="ticket-description" style={{ marginTop: 10 }}>
        {(showDescriptionMoreMobile && (
          <p className="whole-description">{detailData.description}</p>
        )) || (
          <TextTruncate
            line={2}
            element="div"
            truncateText="…"
            containerClassName="text-typography"
            text={detailData.description || '-'}
            textTruncateChild={
              <span
                className="show-more"
                onClick={() => setShowDescriptionMoreMobile(true)}
              >
                Show More
              </span>
            }
          />
        )}
      </Col>
      <div className="info-description">
        <Row gutter={[6, 6]}>
          <Col span={12} className="info-description-item">
            <Row className="item-row">
              <Col span={24} className="title">
                Type
              </Col>
              <Col span={24} className="value">
                {detailData.name || '-'}
              </Col>
            </Row>
          </Col>
          <Col span={12} className="info-description-item">
            <Row className="item-row">
              <Col span={24} className="title">
                Seat Number
              </Col>
              <Col span={24} className="value">
                {detailData.seat || '-'}
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={[6, 6]} style={{ marginTop: 6 }}>
          <Col span={12} className="info-description-item">
            <Row className="item-row">
              <Col span={24} className="title">
                Price
              </Col>
              <Col span={24} className="value">
                {`${((detailData.price && detailData.price) || 0).toFixed(
                  2
                )} ${PriceUnit}`}
              </Col>
            </Row>
          </Col>
          <Col span={12} className="info-description-item">
            <Row className="item-row">
              <Col span={24} className="title">
                Ticket Number
              </Col>
              <Col span={24} className="value">
                {detailData.ticketNo || '-'}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <Col className="detail-action" span={24}>
        {detailData.status === 0 &&
          detailData.saleStatus === TicketSaleStatus.unsale.status && (
            <div className="qr-code-btn-content">
              <Button onClick={buttonAction}>CHECK TICKET QR CODE</Button>
            </div>
          )}
        <p
          className={
            (detailData.status === 0 &&
              detailData.saleStatus === TicketSaleStatus.unsale.status &&
              'check-collectible-detail') ||
            'check-collectible-detail no-check-code'
          }
          onClick={checkCollectibleDetail}
        >
          CHECK COLLECTIBLE DETAIL
        </p>
      </Col>
    </>
  );
};

const MyTicketsEventDetail = () => {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useAppDispatch();

  const loadingForEventDetail = useAppSelector(selectEventDetailLoading);
  const eventDetail = useAppSelector(selectTicketUserEventDetail);
  const errorForEventDetail = useAppSelector(selectEventDetailError);
  const ticketList = useAppSelector(selectMyEventTicketList);

  const [noTicketListModalShow, setNoTicketListModalShow] =
    useState<boolean>(false);
  const [eventCorrect, setEventCorrect] = useState<boolean>(true);
  const [requestId, setRequestId] = useState<string>('');
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [textShowMore, setTextShowMore] = useState<boolean>(false);
  const [showQrCodeModal, setShowQrCodeModal] = useState<boolean>(false);
  const [showQrCodeDrawer, setShowQrCodeDrawer] = useState<boolean>(false);
  const [currentCheckTicketId, setCurrentCheckTicketId] = useState<string>('');
  const [checkCollectibleDetailLoading, setCheckCollectibleDetailLoading] =
    useState<boolean>(false);
  const [checkCollectibleDetailNotFound, setCheckCollectibleDetailNotFound] =
    useState<boolean>(false);
  const [showDescriptionMore, setShowDescriptionMore] =
    useState<boolean>(false);
  const [currentShowPopupTicket, setCurrentShowPopupTicket] =
    useState<MyEventTicketListResponseType>({
      blockchainUrl: '',
      animationType: '',
      animationUrl: '',
      id: '',
      image: '',
      name: '',
      saleStatus: 0,
      slug: '',
      organizerSlug: '',
      description: '',
      status: 0,
      ticketNo: '',
      price: 0,
      seat: 0,
    });
  const [popupBackgroundImage, setPopupBackgroundImage] = useState<{
    backgroundImage: string;
  }>({
    backgroundImage: '',
  });
  const [showTicketItemDetailModal, setShowTicketItemDetailModal] =
    useState<boolean>(false);
  const [showTicketItemDetailDrawer, setShowTicketItemDetailDrawer] =
    useState<boolean>(false);

  const handleNoTicketList = () => {
    setNoTicketListModalShow(false);
    dispatch(resetMyTicketsCache());
    router.push(RouterKeys.myTickets);
  };

  const handleGetMyEventTicketList = async (id: string) => {
    const response: any = await dispatch(getMyEventTicketListAction(id));
    if (response.type === getMyEventTicketListAction.fulfilled.toString()) {
      if (response.payload && !response.payload.length) {
        setNoTicketListModalShow(true);
      }
    }
  };

  const handleCheckCollectibleDetail = async () => {
    setCheckCollectibleDetailLoading(true);
    const response: any = await dispatch(
      getCollectibleDetailAction(currentShowPopupTicket.id)
    );
    setShowTicketItemDetailDrawer(false);
    setShowTicketItemDetailModal(false);
    setCheckCollectibleDetailLoading(false);
    if (response.type === getCollectibleDetailAction.fulfilled.toString()) {
      const { payload } = response;
      if (payload && payload.saleStatus === TicketSaleStatus.sold.status) {
        setCheckCollectibleDetailNotFound(true);
      } else {
        dispatch(setCollectibleDetailLoading(true));
        router.push(
          RouterKeys.collectibleDetail
            .replace(':orgname-slug', currentShowPopupTicket.organizerSlug)
            .replace(':slug', currentShowPopupTicket.slug)
        );
      }
    } else {
      const { error } = response;
      if (error) {
        if (
          error.code === Messages.invalidUnlawful.code ||
          error.code === Messages.notFound.code
        ) {
          setCheckCollectibleDetailNotFound(true);
        } else {
          messageApi.open({
            content: error.message,
            className: 'error-message-event',
          });
        }
      }
    }
  };

  const screenResize = (e: any) => {
    if (e.target.innerWidth >= 1200) {
      setPopupBackgroundImage({
        backgroundImage: `url('${Images.TicketDetailContainerBackgroundDesktop.src}')`,
      });
    }
    if (e.target.innerWidth >= 576 && e.target.innerWidth < 1200) {
      setShowTicketItemDetailDrawer(false);
    }
    if (e.target.innerWidth < 576) {
      setShowTicketItemDetailModal(false);
      setPopupBackgroundImage({
        backgroundImage: `url('${Images.TicketDetailContainerBackground.src}')`,
      });
    }
  };

  const handleQRCodeError = () => {
    setShowQrCodeDrawer(false);
    setShowQrCodeModal(false);
    dispatch(getMyTicketUserEventDetailAction(requestId));
    handleGetMyEventTicketList(requestId);
  };

  const checkEventTicketsNameCol = (
    point: string,
    item: MyEventTicketListResponseType
  ) => {
    let colNum = 24;
    if (
      item.status ===
        TicketStatus.find((status) => status.text === 'UPCOMING')?.key ||
      item.saleStatus === TicketSaleStatus.onsale.status
    ) {
      colNum = (point === 'xs' && 20) || 18;
    }
    return colNum;
  };

  useEffect(() => {
    const { eventSlug } = router.query;
    if (eventSlug) {
      const parameterArr = (eventSlug as string).split('-');
      if (_.last(parameterArr)) {
        setRequestId(_.last(parameterArr) as string);
      } else {
        setEventCorrect(false);
      }
    }
  }, [router.isReady]);

  useEffect(() => {
    if (requestId) {
      dispatch(getMyTicketUserEventDetailAction(requestId));
      handleGetMyEventTicketList(requestId);
    }
  }, [requestId]);

  useEffect(() => {
    if (!isFirstRender && errorForEventDetail) {
      if (
        errorForEventDetail.code === Messages.notFound.code ||
        errorForEventDetail.code === Messages.invalidUnlawful.code ||
        errorForEventDetail.code === Messages.eventMismatch.code
      ) {
        setEventCorrect(false);
      }
      messageApi.open({
        content: errorForEventDetail.message,
        className: 'error-message-event',
      });
    }
  }, [errorForEventDetail]);

  useEffect(() => {
    try {
      if (
        showQrCodeDrawer ||
        showQrCodeModal ||
        showTicketItemDetailDrawer ||
        showTicketItemDetailModal
      ) {
        bodyOverflow('hidden');
      } else {
        bodyOverflow('scroll');
      }
      if (!showTicketItemDetailDrawer && !showTicketItemDetailModal) {
        setShowDescriptionMore(false);
      }
    } catch (error) {}
  }, [
    showQrCodeDrawer,
    showQrCodeModal,
    showTicketItemDetailDrawer,
    showTicketItemDetailModal,
  ]);

  useEffect(() => {
    if (window.innerWidth >= 1200) {
      setPopupBackgroundImage({
        backgroundImage: `url('${Images.TicketDetailContainerBackgroundDesktop.src}')`,
      });
    }
    setIsFirstRender(false);
    window.addEventListener('resize', screenResize);
    return () => {
      dispatch(resetMyTicketEventDetail());
      window.removeEventListener('resize', screenResize);
    };
  }, []);

  return (
    <>
      {(loadingForEventDetail && eventCorrect && (
        <MyTicketsEventDetailContainer>
          <div className="page-loading">
            <LoadingOutlined />
          </div>
        </MyTicketsEventDetailContainer>
      )) || (
        <>
          {(!eventCorrect && <PageNotFound />) || (
            <MyTicketsEventDetailContainer>
              <div className="container-wrap">
                <Col md={24} xs={0}>
                  <PageHearderResponsive />
                </Col>
                <Col md={0} xs={24}>
                  <PageHearderComponent />
                </Col>
                <div className="page-main">
                  <Row>
                    <Col span={24} className="detail-background">
                      <Image
                        src={eventDetail.image}
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
                              status.key === eventDetail.status &&
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
                          {eventDetail.name || '-'}
                        </Col>
                        <Col span={24} className="info-item">
                          <Image
                            className="info-item-icon"
                            src={Images.ClockIcon}
                            alt=""
                          />
                          <div className="info-description">
                            {(eventDetail.startTime &&
                              eventDetail.endTime &&
                              `${formatTimeStrByTimeString(
                                eventDetail.startTime,
                                FormatTimeKeys.norm
                              )} - ${formatTimeStrByTimeString(
                                eventDetail.endTime,
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
                            {eventDetail.location || '-'}
                          </div>
                        </Col>
                        <Col span={24} className="info-item">
                          <Image
                            src={Images.OrganiserIcon}
                            alt=""
                            className="info-item-icon"
                          />
                          <span
                            className="info-description organizer"
                            onClick={() => {
                              dispatch(resetCollectionDetailCache());
                              dispatch(
                                setCollectiblesOrganizerDetailLoading(true)
                              );
                              router.push(
                                RouterKeys.collectionDetail.replace(
                                  ':slug',
                                  eventDetail.organizerSlug
                                )
                              );
                            }}
                          >
                            {eventDetail.organizerName || '-'}
                          </span>
                        </Col>
                        {eventDetail.crowdfundLink && (
                          <Col span={24} className="crowd-fund-link">
                            <a href={eventDetail.crowdfundLink} target="_blank">
                              View CrowdFund Progress <RightOutlined />
                            </a>
                          </Col>
                        )}
                        <Col span={24} className="ticket-description">
                          {(textShowMore && (
                            <p className="whole-description">
                              {eventDetail.description || '-'}
                            </p>
                          )) || (
                            <TextTruncate
                              line={2}
                              element="div"
                              truncateText="…"
                              containerClassName="text-typography"
                              text={eventDetail.description || '-'}
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
                        <Col span={24}>
                          <Divider />
                        </Col>
                      </Row>
                    </div>
                    <div className="my-ticket-items">
                      <Row>
                        <Col span={24} className="title">
                          MY TICKETS
                        </Col>
                      </Row>
                      {(ticketList.length && (
                        <Row className="items-row" gutter={[20, 20]}>
                          {ticketList.map((item, index) => (
                            <Col
                              key={item.id + index}
                              xs={24}
                              sm={12}
                              md={8}
                              xl={6}
                            >
                              <MyTicketItemContainer
                                onClick={() => {
                                  setCurrentShowPopupTicket(item);
                                  if (window.innerWidth < 576) {
                                    setShowTicketItemDetailDrawer(true);
                                  } else {
                                    setShowTicketItemDetailModal(true);
                                  }
                                }}
                              >
                                <div className="item-background">
                                  <Image
                                    src={
                                      item.image || Images.BackgroundLogo.src
                                    }
                                    layout="fill"
                                    alt=""
                                    onError={(e: any) => {
                                      e.target.onerror = null;
                                      e.target.src = Images.BackgroundLogo.src;
                                    }}
                                  />
                                </div>
                                <div className="item-detail">
                                  <Row>
                                    <Col
                                      xs={checkEventTicketsNameCol('xs', item)}
                                      sm={checkEventTicketsNameCol('sm', item)}
                                    >
                                      <p className="item-detail-name">
                                        {item.name || '-'}
                                      </p>
                                      {TicketStatus.map((status) => {
                                        if (
                                          status.key === item.status &&
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
                                    {(item.status ===
                                      TicketStatus.find(
                                        (status) => status.text === 'UPCOMING'
                                      )?.key ||
                                      item.saleStatus ===
                                        TicketSaleStatus.onsale.status) && (
                                      <>
                                        <Col xs={4} sm={0}>
                                          <div className="item-detail-status">
                                            {item.saleStatus ===
                                              TicketSaleStatus.unsale
                                                .status && (
                                              <div className="item-detail-icon">
                                                <Image
                                                  src={Images.QrCodeButton}
                                                  alt=""
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setCurrentCheckTicketId(
                                                      item.id
                                                    );
                                                    if (
                                                      window.innerWidth < 576
                                                    ) {
                                                      setShowQrCodeDrawer(true);
                                                    } else {
                                                      setShowQrCodeModal(true);
                                                    }
                                                  }}
                                                />
                                              </div>
                                            )}
                                            {item.saleStatus ===
                                              TicketSaleStatus.onsale
                                                .status && (
                                              <div className="item-detail-icon ticket-onsale">
                                                <Image
                                                  src={Images.TicketsOnSaleIcon}
                                                  alt=""
                                                />
                                              </div>
                                            )}
                                          </div>
                                        </Col>
                                        <Col sm={6} xs={0}>
                                          <div className="item-detail-status">
                                            {item.saleStatus ===
                                              TicketSaleStatus.unsale
                                                .status && (
                                              <div className="item-detail-icon">
                                                <Image
                                                  src={Images.QrCodeButton}
                                                  alt=""
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setCurrentCheckTicketId(
                                                      item.id
                                                    );
                                                    if (
                                                      window.innerWidth < 576
                                                    ) {
                                                      setShowQrCodeDrawer(true);
                                                    } else {
                                                      setShowQrCodeModal(true);
                                                    }
                                                  }}
                                                />
                                              </div>
                                            )}
                                            {item.saleStatus ===
                                              TicketSaleStatus.onsale
                                                .status && (
                                              <div className="item-detail-icon ticket-onsale">
                                                <Image
                                                  src={Images.TicketsOnSaleIcon}
                                                  alt=""
                                                />
                                              </div>
                                            )}
                                          </div>
                                        </Col>
                                      </>
                                    )}
                                  </Row>
                                </div>
                              </MyTicketItemContainer>
                            </Col>
                          ))}
                        </Row>
                      )) ||
                        null}
                    </div>
                  </div>
                </div>
                <ClientModalComponent
                  title=""
                  modalShow={noTicketListModalShow}
                  closable={false}
                  footer={[
                    <Button
                      key="OK"
                      type="primary"
                      onClick={handleNoTicketList}
                    >
                      OK
                    </Button>,
                  ]}
                >
                  <p>
                    You do not have any available tickets for this event yet.
                  </p>
                </ClientModalComponent>
                <ClientModalComponent
                  title=""
                  modalShow={checkCollectibleDetailNotFound}
                  closable={false}
                  footer={[
                    <Button
                      key="OK"
                      type="primary"
                      onClick={() => {
                        setCheckCollectibleDetailNotFound(false);
                        dispatch(getMyTicketUserEventDetailAction(requestId));
                        handleGetMyEventTicketList(requestId);
                      }}
                    >
                      OK
                    </Button>,
                  ]}
                >
                  <p>Collectible is sold. Please check again.</p>
                </ClientModalComponent>
                <ShowQRCodeElementComponent
                  showDrawer={showQrCodeDrawer}
                  showModal={showQrCodeModal}
                  setShowDrawer={setShowQrCodeDrawer}
                  setShowModal={setShowQrCodeModal}
                >
                  <TicketQRCodeComponent
                    requestId={currentCheckTicketId}
                    relatedEvent={requestId}
                    handleError={handleQRCodeError}
                  />
                </ShowQRCodeElementComponent>
                <Modal
                  title=""
                  centered
                  closable={false}
                  footer={null}
                  destroyOnClose
                  open={showTicketItemDetailModal}
                  className="ticketDetailModal"
                  onCancel={() => setShowTicketItemDetailModal(false)}
                  style={{ ...popupBackgroundImage }}
                >
                  {(checkCollectibleDetailLoading && (
                    <div className="page-loading">
                      <LoadingOutlined />
                    </div>
                  )) || (
                    <>
                      <Col
                        xl={24}
                        span={0}
                        className="desktop"
                        style={{ maxHeight: '100%' }}
                      >
                        <Row>
                          <Col span={12} className="detail-image">
                            <div className="image-content">
                              {(currentShowPopupTicket.animationType &&
                                currentShowPopupTicket.animationType
                                  .toLowerCase()
                                  .includes('video') && (
                                  <video
                                    src={currentShowPopupTicket.animationUrl}
                                    playsInline
                                    muted
                                    autoPlay
                                    loop
                                  />
                                )) || (
                                <img
                                  src={currentShowPopupTicket.image}
                                  alt=""
                                  onError={(e: any) => {
                                    e.target.onerror = null;
                                    e.target.src = Images.BackgroundLogo.src;
                                    e.target.className = 'error-full-image';
                                  }}
                                />
                              )}
                              {currentShowPopupTicket.saleStatus ===
                                TicketSaleStatus.onsale.status && (
                                <div className="ticket-sale-status">
                                  <Image src={Images.OnSaleIcon} alt="" />
                                </div>
                              )}
                            </div>
                            <div className="dividing-line">
                              <Image
                                src={Images.LineTicketDetailDesktop}
                                alt=""
                              />
                            </div>
                          </Col>
                          <Col span={12} className="detail-info">
                            <div className="detail-info-wrap">
                              <div className="detail-info-content">
                                <div className="info-item-status">
                                  {TicketStatus.map((status) => {
                                    if (
                                      status.key ===
                                        currentShowPopupTicket.status &&
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
                                </div>
                                <div className="info-name">
                                  <p>{currentShowPopupTicket.name || '-'}</p>
                                </div>
                                <Col span={24} className="ticket-description">
                                  {(showDescriptionMore && (
                                    <p className="whole-description">
                                      {currentShowPopupTicket.description}
                                    </p>
                                  )) || (
                                    <TextTruncate
                                      line={2}
                                      element="div"
                                      truncateText="…"
                                      containerClassName="text-typography"
                                      text={
                                        currentShowPopupTicket.description ||
                                        '-'
                                      }
                                      textTruncateChild={
                                        <span
                                          className="show-more"
                                          onClick={() =>
                                            setShowDescriptionMore(true)
                                          }
                                        >
                                          Show More
                                        </span>
                                      }
                                    />
                                  )}
                                </Col>
                                <div className="info-description">
                                  <Row gutter={[6, 6]}>
                                    <Col
                                      span={12}
                                      className="info-description-item"
                                    >
                                      <Row className="item-row">
                                        <Col span={24} className="title">
                                          Type
                                        </Col>
                                        <Col span={24} className="value">
                                          {currentShowPopupTicket.name || '-'}
                                        </Col>
                                      </Row>
                                    </Col>
                                    <Col
                                      span={12}
                                      className="info-description-item"
                                    >
                                      <Row className="item-row">
                                        <Col span={24} className="title">
                                          Seat Number
                                        </Col>
                                        <Col span={24} className="value">
                                          {currentShowPopupTicket.seat || '-'}
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                  <Row gutter={[6, 6]} style={{ marginTop: 6 }}>
                                    <Col
                                      span={12}
                                      className="info-description-item"
                                    >
                                      <Row className="item-row">
                                        <Col span={24} className="title">
                                          Price
                                        </Col>
                                        <Col span={24} className="value">
                                          {`${(
                                            (currentShowPopupTicket.price &&
                                              currentShowPopupTicket.price) ||
                                            0
                                          ).toFixed(2)} ${PriceUnit}`}
                                        </Col>
                                      </Row>
                                    </Col>
                                    <Col
                                      span={12}
                                      className="info-description-item"
                                    >
                                      <Row className="item-row">
                                        <Col span={24} className="title">
                                          Ticket Number
                                        </Col>
                                        <Col span={24} className="value">
                                          {currentShowPopupTicket.ticketNo ||
                                            '-'}
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                </div>
                                <Col className="detail-action" span={24}>
                                  {currentShowPopupTicket.status === 0 &&
                                    currentShowPopupTicket.saleStatus ===
                                      TicketSaleStatus.unsale.status && (
                                      <Button
                                        onClick={() => {
                                          setCurrentCheckTicketId(
                                            currentShowPopupTicket.id
                                          );
                                          setShowTicketItemDetailModal(false);
                                          setShowQrCodeModal(true);
                                        }}
                                      >
                                        CHECK TICKET QR CODE
                                      </Button>
                                    )}
                                  <p onClick={handleCheckCollectibleDetail}>
                                    CHECK COLLECTIBLE DETAIL
                                  </p>
                                </Col>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                      <Col sm={24} xl={0} span={0} className="tablet">
                        <TicketDetailTabletAndMobile
                          detailData={currentShowPopupTicket}
                          checkCollectibleDetail={handleCheckCollectibleDetail}
                          buttonAction={() => {
                            setCurrentCheckTicketId(currentShowPopupTicket.id);
                            setShowTicketItemDetailModal(false);
                            setShowQrCodeModal(true);
                          }}
                        />
                      </Col>
                    </>
                  )}
                  <div className="close-modal">
                    <Image
                      src={Images.CloseIcon}
                      alt=""
                      onClick={() => setShowTicketItemDetailModal(false)}
                    />
                  </div>
                </Modal>
                <Drawer
                  rootClassName="ticket-detail-mobile"
                  placement="bottom"
                  open={showTicketItemDetailDrawer}
                  closable={false}
                  keyboard={false}
                  destroyOnClose
                  onClose={() => setShowTicketItemDetailDrawer(false)}
                >
                  {(checkCollectibleDetailLoading && (
                    <div className="page-loading">
                      <LoadingOutlined />
                    </div>
                  )) || (
                    <Col className="ticket-detail-mobile-content">
                      <TicketDetailTabletAndMobile
                        detailData={currentShowPopupTicket}
                        checkCollectibleDetail={handleCheckCollectibleDetail}
                        buttonAction={() => {
                          setCurrentCheckTicketId(currentShowPopupTicket.id);
                          setShowTicketItemDetailDrawer(false);
                          setShowQrCodeDrawer(true);
                        }}
                      />
                    </Col>
                  )}
                </Drawer>
                {contextHolder}
              </div>
            </MyTicketsEventDetailContainer>
          )}
        </>
      )}
    </>
  );
};

export default AuthHoc(MyTicketsEventDetail);
