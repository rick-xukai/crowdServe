import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Row, Col, Spin, message } from 'antd';
import { ViewportList } from 'react-viewport-list';
import { LoadingOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Router from 'next/router';

import AuthHoc from '../components/hoc/AuthHoc';
import { formatTimeStrByTimeString, checkStatusIcon } from '../utils/func';
import { RouterKeys } from '../constants/Keys';
import {
  TicketStatus,
  FormatTimeKeys,
  DefaultPageSize,
  DefaultPage,
} from '../constants/General';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  reset,
  getTicketsListAction,
  selectLoading,
  selectError,
  selectTicketsListData,
  TicketsListResponseType,
} from '../slice/tickets.slice';
import { Images } from '../theme';
import PageHearderComponent from '../components/pageHearder';
import {
  TickersContainer,
  TicketItemContainer,
  TicketStatusContainer,
  BackgroundLogoPath,
} from '../styles/tickets.style';

const Tickets = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useAppDispatch();
  const ticketsListRef = useRef(null);

  const data = useAppSelector(selectTicketsListData);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);

  const [isPageBottom, setIsPageBottom] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(DefaultPage);
  const [ticketsListData, setTicketsListData] = useState<TicketsListResponseType[]>([]);
  const [requestStatusKey, setRequestStatusKey] = useState<number>(0);
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);

  const handleScroll = (event: any) => {
    const { clientHeight, scrollHeight, scrollTop } = event.target;
    setIsPageBottom(scrollTop + clientHeight + 20 > scrollHeight);
  };

  const scrollListener = useCallback((e: any) => {
    handleScroll(e);
  }, []);

  useEffect(() => {
    if (!isFirstRender && error) {
      messageApi.open({
        content: error.message,
        className: 'error-message-tickets',
      });
      document.removeEventListener('scroll', scrollListener, true);
    }
  }, [error]);

  useEffect(() => {
    if (isPageBottom && !loading) {
      setCurrentPage(currentPage + 1);
    }
  }, [isPageBottom]);

  useEffect(() => {
    if (requestStatusKey === TicketStatus[0].key) {
      dispatch(getTicketsListAction({
        status: TicketStatus[0].key,
        page: currentPage,
        size: DefaultPageSize,
      })).then((response: any) => {
        if (
          !response.payload.length ||
          response.payload.length < DefaultPageSize
        ) {
          setRequestStatusKey(TicketStatus[1].key);
          setCurrentPage(DefaultPage);
        }
      });
    } else if (requestStatusKey === TicketStatus[1].key) {
      dispatch(getTicketsListAction({
        status: TicketStatus[1].key,
        page: currentPage,
        size: DefaultPageSize,
      })).then((response: any) => {
        if (
          !response.payload.length ||
          response.payload.length < DefaultPageSize
        ) {
          setRequestStatusKey(TicketStatus[2].key);
          setCurrentPage(DefaultPage);
        }
      });
    } else if (requestStatusKey === TicketStatus[2].key) {
      dispatch(getTicketsListAction({
        status: TicketStatus[2].key,
        page: currentPage,
        size: DefaultPageSize,
      })).then((response: any) => {
        if (
          !response.payload.length ||
          response.payload.length < DefaultPageSize
        ) {
          document.removeEventListener('scroll', scrollListener, true);
        }
      });
    }
  }, [currentPage, requestStatusKey]);

  useEffect(() => {
    if (data) {
      setTicketsListData([...ticketsListData, ...data]);
    }
  }, [data]);

  useEffect(() => {
    setIsFirstRender(false);
    document.addEventListener('scroll', scrollListener, true);
    return () => {
      dispatch(reset());
      document.removeEventListener('scroll', scrollListener, true);
    };
  }, []);

  return (
    <TickersContainer>
      <PageHearderComponent isBack={false} />
      <Spin
        spinning={loading && !ticketsListData.length}
        indicator={<LoadingOutlined spin />}
        size="large"
      >
        <div className="page-main">
          <Row>
            <Col className="tickets-list" span={24} ref={ticketsListRef}>
              <div className="page-title">
                <Row>
                  <Col span={24} className="title">MY TICKETS</Col>
                </Row>
              </div>
              {ticketsListData.length && (
                <>
                  <ViewportList
                    viewportRef={ticketsListRef}
                    items={ticketsListData}
                  >
                    {(item: TicketsListResponseType) => (
                      <TicketItemContainer
                        className={item.status === TicketStatus.find((item) => item.key === 5)?.key && 'background-mask' || ''}
                        key={item.id}
                        onClick={() =>
                          Router.push(
                            RouterKeys.ticketDetail.replace(
                              ':ticketId',
                              item.id.toString()
                            )
                          )
                        }
                      >
                        <div className="ticket-background">
                          {item.imageType === 'Video' && (
                            <video src={item.image} autoPlay={false} />
                          ) || (
                            <img
                              src={item.image} 
                              alt=""
                              onError={(e: any) => {
                                e.target.onerror = null;
                                e.target.src = BackgroundLogoPath;
                              }}
                            />
                          )}
                        </div>
                        {checkStatusIcon(item.status) && (
                          <div className="on-sale-icon">
                            <Image src={checkStatusIcon(item.status)} alt="" />
                          </div>
                        )}
                        <div style={{ textAlign: 'right' }}>
                          {TicketStatus.map((status) => {
                            if (status.key === item.status && status.text) {
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
                        </div>
                        <div className="item-info">
                          <Row className="item-info-row">
                            <Col span={24} className="info-title">{item.name}</Col>
                            <Col span={24} className="info-item">
                              <Image className="info-item-icon" src={Images.CalendarIcon} alt="" />
                              <div className="info-description">
                                {item.startTime && item.endTime && (
                                  `${formatTimeStrByTimeString(
                                    item.startTime,
                                    FormatTimeKeys.mdy,
                                  )} ${formatTimeStrByTimeString(
                                    item.startTime,
                                    FormatTimeKeys.hm,
                                  )}~${formatTimeStrByTimeString(
                                    item.endTime,
                                    FormatTimeKeys.hm,
                                  )}`
                                ) || '-'}
                              </div>
                            </Col>
                            <Col span={24} className="info-item">
                              <Image src={Images.LocationIcon} alt="" className="info-item-icon" />
                              <div className="info-description">
                                {item.location || '-'}
                              </div>
                            </Col>
                            <Col span={24} className="info-item">
                              <Image src={Images.OrganiserIcon} alt="" className="info-item-icon" />
                              <span className="info-description">
                                {item.organizerName || '-'}
                              </span>
                            </Col>
                          </Row>
                        </div>
                      </TicketItemContainer>
                    )}
                  </ViewportList>
                  {loading && ticketsListData.length && (
                    <div className="load-more">
                      <LoadingOutlined />
                      Loading...
                    </div>
                  )}
                </>
              ) || (
                <Row className="no-ticket-row">
                  <Col span={24} className="no-ticket">
                    <div style={{ margin: 'auto', textAlign: 'center' }}>
                      <Image src={Images.NoTicketsIcon} alt="" />
                      <p>No Tickets Available</p>
                    </div>
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
        </div>
      </Spin>
      {contextHolder}
    </TickersContainer>
  );
};

export default AuthHoc(Tickets);
