import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Row, Col, Spin, message } from 'antd';
import { ViewportList } from 'react-viewport-list';
import { LoadingOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Router from 'next/router';

import { formatTimeStrByTimeString, checkStatusIcon } from '../utils/func';
import { RouterKeys, CookieKeys } from '../constants/Keys';
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

  const handleScroll = (event: any) => {
    const { clientHeight, scrollHeight, scrollTop } = event.target;
    setIsPageBottom(scrollTop + clientHeight + 20 > scrollHeight);
  };

  const scrollListener = useCallback((e: any) => {
    handleScroll(e);
  }, []);

  useEffect(() => {
    if (error) {
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
    dispatch(getTicketsListAction({
      page: currentPage,
      size: DefaultPageSize,
    }));
  }, [currentPage]);

  useEffect(() => {
    if (data) {
      setTicketsListData([...ticketsListData, ...data]);
      if (!data.length && !loading) {
        document.removeEventListener('scroll', scrollListener, true);
      }
    }
  }, [data]);

  useEffect(() => {
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
                        itemImage={item.image as any}
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
                        {checkStatusIcon(item.status) && (
                          <div className="on-sale-icon">
                            <Image src={checkStatusIcon(item.status)} alt="" />
                          </div>
                        )}
                        <p style={{ margin: 0, textAlign: 'right' }}>
                          {TicketStatus.map((status) => {
                            if (status.key === item.status) {
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
                        </p>
                        <div className="item-info">
                          <Row className="item-info-row">
                            <Col span={24} className="info-title">{item.name}</Col>
                            <Col span={24} className="info-item">
                              <span>
                                <Image src={Images.CalendarIcon} alt="" />
                              </span>
                              <span className="info-description">
                                {`${formatTimeStrByTimeString(
                                  item.startTime,
                                  FormatTimeKeys.mdy,
                                )} ${formatTimeStrByTimeString(
                                  item.startTime,
                                  FormatTimeKeys.hm,
                                )}~${formatTimeStrByTimeString(
                                  item.endTime,
                                  FormatTimeKeys.hm,
                                )}`}
                              </span>
                            </Col>
                            <Col span={24} className="info-item">
                              <Image src={Images.LocationIcon} alt="" className="info-icon" />
                              <span className="info-description">
                                {item.location}
                              </span>
                            </Col>
                            <Col span={24} className="info-item">
                              <Image src={Images.OrganiserIcon} alt="" className="info-icon" />
                              <span className="info-description">
                                {item.organizerName}
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

export async function getServerSideProps(ctx: any) {
  const { req, res } = ctx;
  const handleAuth = () => {
    const token = req.cookies[CookieKeys.userLoginToken];
    if (!token) {
      res.writeHead(302, { Location: RouterKeys.login });
      res.end();
      return {
        props: {}
      };
    }
  };
  await handleAuth();
  return {
    props: {}
  };
};

export default Tickets;
