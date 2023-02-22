import React, { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import Image from 'next/image';
import { Row, Col, Spin, Drawer, QRCode, Button, message, FloatButton } from 'antd';
import TextTruncate from 'react-text-truncate';
import { LoadingOutlined, ArrowLeftOutlined } from '@ant-design/icons';

import AuthHoc from '../../components/hoc/AuthHoc';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { checkStatusIcon, formatTimeStrByTimeString } from '../../utils/func';
import { Images } from '../../theme';
import {
  reset,
  resetQrcodeError,
  getTicketDetailAction,
  getTicketQrcodeAction,
  selectTicketDetailData,
  selectTicketQrcodeData,
  selectQrcodeLoading,
  selectError,
  selectQrcodeError,
  selectTicketDetailLoading,
} from '../../slice/tickets.slice';
import { RouterKeys } from '../../constants/Keys';
import Messages from '../../constants/Messages';
import { TicketStatus, DefaultCodeRefreshTime, FormatTimeKeys, PriceUnit } from '../../constants/General';
import { TicketDetailContainer } from '../../styles/ticketDetail.style';
import { TicketStatusContainer } from '../../styles/tickets.style';

let timer: NodeJS.Timer | null = null;

const TicketDetail = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const ticketDetailData = useAppSelector(selectTicketDetailData);
  const qrcodeData = useAppSelector(selectTicketQrcodeData);
  const qrcodeLoading = useAppSelector(selectQrcodeLoading);
  const error = useAppSelector(selectError);
  const qrcodeError = useAppSelector(selectQrcodeError);
  const ticketDetailLoading = useAppSelector(selectTicketDetailLoading);

  const [id, setTicketId] = useState<string>('');
  const [showQrcode, setShowQrcode] = useState<boolean>(false);
  const [textShowMore, setTextShowMore] = useState<boolean>(false);
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

  useEffect(() => {
    const { ticketId } = router.query;
    if (ticketId) {
      setTicketId(ticketId as string);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (error) {
      messageApi.open({
        content: error.message,
        className: 'error-message-tickets',
      });
    }
  }, [error]);

  useEffect(() => {
    if (qrcodeError && qrcodeError.code === Messages.ticketSold.code) {
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

  // eslint-disable-next-line
  useEffect(() => {
    return () => {
      clearInterval(Number(timer));
      dispatch(reset());
    };
  }, []);

  return (
    <>
      {!ticketDetailLoading && (
        <TicketDetailContainer>
          <img src={Images.QrcodeNetworkError.src} alt="" style={{ display: 'none' }} />
          <Row>
            <Col span={24} className="detail-background">
              {ticketDetailData.imageType === 'Video' && (
                <video
                  src={ticketDetailData.image}
                  autoPlay
                  loop
                />
              ) || (
                <img
                  src={ticketDetailData.image}
                  alt=""
                  onError={(e: any) => {
                    e.target.onerror = null;
                    e.target.src = Images.BackgroundLogo.src;
                  }}
                />
              )}
            </Col>
            <div
              className="goback-icon"
              onClick={() =>
                Router.push(RouterKeys.ticketsList)
              }
            >
              <ArrowLeftOutlined />
            </div>
          </Row>
          <div
            className={`detail-info ${
              ticketDetailData.status !== TicketStatus[0].key &&
              'detail-info-no-code' ||
            ''}`}
          >
            <div className="info-container">
              <Row className="container-top">
                <Col span={24} className="ticket-name">
                  {ticketDetailData.name || '-'}
                </Col>
                <Col span={24}>
                  {TicketStatus.map((status) => {
                    if (status.key === ticketDetailData.status && status.text) {
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
                <Col span={24} className="organizer-name">
                  By {ticketDetailData.organizerName || '-'}
                </Col>
                <Col span={24} className="ticket-description">
                  {textShowMore && (
                    <p className="whole-description">
                      {ticketDetailData.description}
                    </p>
                  ) || (
                    <TextTruncate
                      line={2}
                      element="span"
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
                  <div className="circle-left" />
                  <div className="circle-right" />
                </Col>
                {checkStatusIcon(ticketDetailData.status) && (
                  <div className="ticket-status-icon">
                    <Image src={checkStatusIcon(ticketDetailData.status)} alt="" />
                  </div>
                )}
              </Row>
              <Row className="border-line">
                <Col span={24} style={{ textAlign: 'center' }}>
                  <Image src={Images.BorderLine} alt="" />
                </Col>
              </Row>
              <div className="container-info-item">
                <Row className="info-item-row">
                  <Col span={24} className="info-item-title">
                    Location
                  </Col>
                  <Col span={24} className="info-item-value">
                    {ticketDetailData.location || '-'}
                  </Col>
                </Row>
                <Row className="info-item-row-flex">
                  <Col span={12}>
                    <Row className="info-item-row">
                      <Col span={24} className="info-item-title">
                        Date
                      </Col>
                      <Col span={24} className="info-item-value">
                        {ticketDetailData.startTime && (
                          formatTimeStrByTimeString(
                            ticketDetailData.startTime,
                            FormatTimeKeys.mdy,
                          )
                        ) || '-'}
                      </Col>
                    </Row>
                  </Col>
                  <Col span={12}>
                    <Row className="info-item-row">
                      <Col span={24} className="info-item-title">
                        Time
                      </Col>
                      <Col span={24} className="info-item-value">
                        {ticketDetailData.startTime && ticketDetailData.endTime && (
                          `${formatTimeStrByTimeString(
                            ticketDetailData.startTime,
                            FormatTimeKeys.hm,
                          )}~${formatTimeStrByTimeString(
                            ticketDetailData.endTime,
                            FormatTimeKeys.hm,
                          )}`
                        ) || '-'}
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="info-item-row-flex">
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
                <Row className="info-item-row-flex">
                  <Col span={12}>
                    <Row className="info-item-row">
                      <Col span={24} className="info-item-title">
                        Price
                      </Col>
                      <Col span={24} className="info-item-value">
                        {`${ticketDetailData.price.toFixed(2)} ${PriceUnit}`}
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
              {ticketDetailData.collections.length && (
                <Row className="container-bottom">
                  <Col span={24} style={{ textAlign: 'center' }}>
                    <div>
                      <Image src={Images.GoToLinkIcon} alt="" />
                      <span className="view-blockchain">
                        <a href={ticketDetailData.collections[0].address} target="_blank">
                          VIEW ON BLOCKCHAIN
                        </a>
                      </span>
                    </div>
                  </Col>
                </Row>
              ) || null}
            </div>
          </div>
          {(!showQrcode && ticketDetailData.status === TicketStatus[0].key) && (
            <FloatButton
              onClick={() => setShowQrcode(true)}
              icon={<Image src={Images.QrcodeIcon} alt="" />}
            />
          ) || (
            <Drawer
              placement="bottom"
              open={showQrcode}
              closable={false}
              keyboard={false}
              onClose={() => setShowQrcode(false)}
            >
              {!qrcodeError && (
                <div style={{ height: '100%' }}>
                  {!qrcodeLoading && (
                    <>
                      <QRCode
                        value={qrcodeData}
                        bordered={false}
                        size={270}
                        status="expired"
                        onRefresh={() => setCountdownNumber(0)}
                      />
                      <p className="code-refreshes">
                        QR Code refreshes in: {`${countdownNumber < 10 && '00:0' || '00:'}${countdownNumber}`}
                      </p>
                      <p className="code-info">
                        This QR code is your admission voucher, do not <br />
                        take screenshot or send to others!
                      </p>
                    </>
                  ) || (
                    <Spin spinning indicator={<LoadingOutlined spin />} size="large">
                      <div />
                    </Spin>
                  )}
                </div>
              ) || (
                <div className="code-network-error-box">
                  <Image src={Images.QrcodeNetworkError} alt="" />
                  <p className="error-title">
                    Network request failed
                  </p>
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
                    This QR code is your admission voucher, do not <br />
                    take screenshot or send to others!
                  </p>
                </div>
              )}
            </Drawer>
          )}
          {contextHolder}
        </TicketDetailContainer>
      ) || (
        <Spin spinning indicator={<LoadingOutlined spin />} size="large">
          <div />
        </Spin>
      )}
    </>
  );
};

export default AuthHoc(TicketDetail);
