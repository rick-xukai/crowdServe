import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Row, Col, Spin, message } from 'antd';
import _ from 'lodash';
import { LoadingOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Router from 'next/router';
import { isSafari } from 'react-device-detect';

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
  getTicketsListAction,
  selectLoading,
  selectError,
  selectTicketsListData,
  resetError,
} from '../slice/tickets.slice';
import {
  setTicketsDataForAllStatus,
  selectTicketsDataForAllStatus,
  setCurrentPage,
  selectCurrentPage,
  setRequestStatusKey,
  selectRequestStatusKey,
  setIsDisableRequest,
  selectIsDisableRequest,
  setIsGetAllData,
  selectIsGetAllData,
  setScrollValue,
  selectScrollValue,
} from '../slice/ticketsCache.slice';
import { Images } from '../theme';
import OpenAppComponent from '../components/openAppComponent';
import PageHearderComponent from '../components/pageHearder';
import {
  TickersContainer,
  TicketItemContainer,
  TicketStatusContainer,
} from '../styles/tickets.style';

const Tickets = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useAppDispatch();
  const ticketsListRef = useRef<any>(null);

  const data = useAppSelector(selectTicketsListData);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const ticketsDataForAllStatus = useAppSelector(selectTicketsDataForAllStatus);
  const currentPage = useAppSelector(selectCurrentPage);
  const requestStatusKey = useAppSelector(selectRequestStatusKey);
  const isDisableRequest = useAppSelector(selectIsDisableRequest);
  const isGetAllData = useAppSelector(selectIsGetAllData);
  const listScrollValue = useAppSelector(selectScrollValue);

  const [isPageBottom, setIsPageBottom] = useState<boolean>(false);
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [isOpenAppShow, setIsOpenAppShow] = useState<boolean>(false);

  const handleScroll = (event: any) => {
    const { clientHeight, scrollHeight, scrollTop } = event.target;
    dispatch(setScrollValue(scrollTop));
    if (scrollTop + clientHeight + 20 > scrollHeight) {
      dispatch(setIsDisableRequest(false));
    }
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
      if (ticketsListRef && ticketsListRef.current) {
        ticketsListRef.current.removeEventListener('scroll', scrollListener, true);
      }
    }
  }, [error]);

  useEffect(() => {
    if (isPageBottom && !loading) {
      dispatch(setCurrentPage(currentPage + 1));
    }
  }, [isPageBottom]);

  useEffect(() => {
    if (isDisableRequest || isGetAllData) {
      return;
    }
    if (requestStatusKey === TicketStatus[0].key) {
      dispatch(getTicketsListAction({
        status: TicketStatus[0].key,
        page: currentPage,
        size: DefaultPageSize,
      })).then((response: any) => {
        if (response.type === getTicketsListAction.fulfilled.toString()) {
          if (
            !response.payload.length ||
            response.payload.length < DefaultPageSize
          ) {
            dispatch(setRequestStatusKey(TicketStatus[1].key));
            dispatch(setCurrentPage(DefaultPage));
          }
        }
      });
    } else if (requestStatusKey === TicketStatus[1].key) {
      dispatch(getTicketsListAction({
        status: TicketStatus[1].key,
        page: currentPage,
        size: DefaultPageSize,
      })).then((response: any) => {
        if (response.type === getTicketsListAction.fulfilled.toString()) {
          if (
            !response.payload.length ||
            response.payload.length < DefaultPageSize
          ) {
            dispatch(setRequestStatusKey(TicketStatus[2].key));
            dispatch(setCurrentPage(DefaultPage));
          }
        }
      });
    } else if (requestStatusKey === TicketStatus[2].key) {
      dispatch(getTicketsListAction({
        status: TicketStatus[2].key,
        page: currentPage,
        size: DefaultPageSize,
      })).then((response: any) => {
        if (response.type === getTicketsListAction.fulfilled.toString()) {
          if (
            !response.payload.length ||
            response.payload.length < DefaultPageSize
          ) {
            dispatch(setIsDisableRequest(true));
            dispatch(setIsGetAllData(true));
            if (ticketsListRef && ticketsListRef.current) {
              ticketsListRef.current.removeEventListener('scroll', scrollListener, true);
            }
          }
        }
      });
    }
  }, [currentPage, requestStatusKey]);

  useEffect(() => {
    if (data) {
      dispatch(
        setTicketsDataForAllStatus(
          _.uniqWith(
            [...ticketsDataForAllStatus, ...data],
            _.isEqual
          )
        ),
      );
    }
  }, [data]);

  useEffect(() => {
    if (ticketsListRef && ticketsListRef.current) {
      setTimeout(() => {
        ticketsListRef.current.scrollTop = listScrollValue;
      });
    }
  }, [ticketsDataForAllStatus]);

  useEffect(() => {
    setIsFirstRender(false);
    if (!isGetAllData && ticketsListRef && ticketsListRef.current) {
      ticketsListRef.current.addEventListener('scroll', scrollListener, true);
    }
    return () => {
      dispatch(resetError());
      if (ticketsListRef && ticketsListRef.current) {
        ticketsListRef.current.removeEventListener('scroll', scrollListener, true);
      }
    };
  }, []);

  return (
    <TickersContainer ref={ticketsListRef}>
      <PageHearderComponent />
      <Spin
        spinning={loading && !ticketsDataForAllStatus.length}
        indicator={<LoadingOutlined spin />}
        size="large"
      >
        <div className={isOpenAppShow && 'page-main open-app' || 'page-main'}>
          <Row>
            <Col className="tickets-list" span={24}>
              <div className="page-title">
                <Row>
                  <Col span={24} className="title">MY TICKETS</Col>
                </Row>
              </div>
              {ticketsDataForAllStatus.length && (
                <>
                  {ticketsDataForAllStatus.map((item) => (
                    <TicketItemContainer
                      key={item.id}
                      onClick={() => {
                        Router.push(
                          RouterKeys.ticketDetail.replace(
                            ':ticketId',
                            item.id.toString()
                          ),
                        );
                        dispatch(setIsDisableRequest(true));
                        dispatch(setScrollValue(ticketsListRef.current.scrollTop));
                      }}
                    >
                      {item.status === TicketStatus.find((v) => v.key === 5)?.key && (
                        <div className="background-mask" />
                      )}
                      <div className="ticket-background">
                        {item.thumbnailType === 'Video' && (
                          <>
                            {isSafari && (
                              <video src={item.thumbnailUrl} autoPlay={false} poster={Images.BackgroundLogo.src} />
                            ) || (
                              <video src={item.thumbnailUrl} autoPlay={false} />
                            )}
                          </>
                        ) || (
                          <Image
                            src={item.thumbnailUrl || Images.BackgroundLogo.src}
                            layout="fill"
                            alt=""
                            onError={(e: any) => {
                              e.target.onerror = null;
                              e.target.src = Images.BackgroundLogo.src;
                            }}
                          />
                        )}
                      </div>
                      {checkStatusIcon(item.status) && (
                        <div className="on-sale-icon">
                          <Image src={checkStatusIcon(item.status)} alt="" />
                        </div>
                      )}
                      <div className="status-warpper" style={{ textAlign: 'right' }}>
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
                                  FormatTimeKeys.norm,
                                )}~${formatTimeStrByTimeString(
                                  item.endTime,
                                  FormatTimeKeys.norm,
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
                  ))}
                  {loading && ticketsDataForAllStatus.length && (
                    <div className="load-more">
                      <LoadingOutlined />
                      Loading...
                    </div>
                  )}
                </>
              ) || (
                <>
                  {!ticketsDataForAllStatus.length && !loading && (
                    <Row className="no-ticket-row">
                      <Col span={24} className="no-ticket">
                        <div style={{ margin: 'auto', textAlign: 'center' }}>
                          <Image src={Images.NoTicketsIcon} alt="" />
                          <p>No Tickets Available</p>
                        </div>
                      </Col>
                    </Row>
                  )}
                </>
              )}
            </Col>
          </Row>
        </div>
      </Spin>
      <OpenAppComponent setIsOpenAppShow={setIsOpenAppShow} />
      {contextHolder}
    </TickersContainer>
  );
};

export default AuthHoc(Tickets);
