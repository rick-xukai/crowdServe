import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Row, Col, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { useRouter } from 'next/router';
import _ from 'lodash';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Images } from '../theme';
import {
  EventStatus,
  FormatTimeKeys,
  DefaultPageSize,
  ListPageScrollDifference,
  DifferentEmailErrorMessafe,
} from '../constants/General';
import { checkStatusIcon, formatTimeStrByTimeString } from '../utils/func';
import AuthHoc from '../components/hoc/AuthHoc';
import PageHearderComponent from '../components/pageHearder';
import PageHearderResponsive from '../components/pageHearderResponsive';
import PageBottomComponent from '../components/pageBottomComponent';
import {
  MyEventsContainer,
  EventItemContainer,
  MyEventStatusContainer,
} from '../styles/myTickets.style';
import {
  resetError,
  resetMyTicketsListData,
  getMyTicketsUserEventsAction,
  selectLoading,
  selectError,
  selectTicketsUserEvents,
} from '../slice/myTickets.slice';
import {
  setMyTicketsUserEventsForAll,
  setCurrentPage,
  setIsDisableRequest,
  setIsGetAllData,
  setScrollValue,
  selectMyTicketsUserEventsForAll,
  selectCurrentPage,
  selectIsDisableRequest,
  selectIsGetAllData,
  selectScrollValue,
} from '../slice/myTicketsCache.slice';
import { RouterKeys } from '../constants/Keys';

const MyTicketsPage = ({ isSameAccount }: { isSameAccount: boolean }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useAppDispatch();
  const myTicketsUserEventsRef = useRef<any>(null);
  const router = useRouter();

  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const myTicketsUserEvents = useAppSelector(selectTicketsUserEvents);
  const currentPage = useAppSelector(selectCurrentPage);
  const isDisableRequest = useAppSelector(selectIsDisableRequest);
  const isGetAllData = useAppSelector(selectIsGetAllData);
  const listScrollValue = useAppSelector(selectScrollValue);
  const myTicketsUserEventsForAll = useAppSelector(
    selectMyTicketsUserEventsForAll
  );

  const [menuState, setMenuState] = useState<boolean>(false);
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [isPageBottom, setIsPageBottom] = useState<boolean>(false);

  const handleScroll = (event: any) => {
    const { clientHeight, scrollHeight, scrollTop } = event.target;
    dispatch(setScrollValue(scrollTop));
    if (scrollTop + clientHeight + ListPageScrollDifference > scrollHeight) {
      dispatch(setIsDisableRequest(false));
    }
    setIsPageBottom(
      scrollTop + clientHeight + ListPageScrollDifference > scrollHeight
    );
  };

  const scrollListener = useCallback((e: any) => {
    handleScroll(e);
  }, []);

  const saveScrollValue = () => {
    dispatch(setScrollValue(myTicketsUserEventsRef.current.scrollTop));
  };

  useEffect(() => {
    if (isPageBottom && !loading) {
      dispatch(setCurrentPage(currentPage + 1));
    }
  }, [isPageBottom]);

  useEffect(() => {
    if (isDisableRequest || isGetAllData) {
      return;
    }
    dispatch(
      getMyTicketsUserEventsAction({
        page: currentPage,
        size: DefaultPageSize,
      })
    ).then((response: any) => {
      if (response.type === getMyTicketsUserEventsAction.fulfilled.toString()) {
        if (
          !response.payload.length ||
          response.payload.length < DefaultPageSize
        ) {
          dispatch(setIsGetAllData(true));
          dispatch(setIsDisableRequest(true));
          if (myTicketsUserEventsRef && myTicketsUserEventsRef.current) {
            myTicketsUserEventsRef.current.removeEventListener(
              'scroll',
              scrollListener,
              true
            );
          }
        }
      }
    });
  }, [currentPage]);

  useEffect(() => {
    if (myTicketsUserEvents) {
      dispatch(
        setMyTicketsUserEventsForAll(
          _.uniqWith(
            [...myTicketsUserEventsForAll, ...myTicketsUserEvents],
            _.isEqual
          )
        )
      );
    }
  }, [myTicketsUserEvents]);

  useEffect(() => {
    if (myTicketsUserEventsRef && myTicketsUserEventsRef.current) {
      setTimeout(() => {
        if (myTicketsUserEventsRef && myTicketsUserEventsRef.current) {
          myTicketsUserEventsRef.current.scrollTop = listScrollValue;
        }
      });
    }
  }, [myTicketsUserEventsForAll]);

  useEffect(() => {
    if (!isFirstRender && error) {
      messageApi.open({
        content: error.message,
        className: 'error-message-tickets',
      });
    }
  }, [error]);

  useEffect(() => {
    if (isSameAccount !== undefined) {
      if (!isSameAccount) {
        message.open({
          content: DifferentEmailErrorMessafe,
          className: 'error-message-tickets',
        });
      }
    }
  }, [isSameAccount]);

  useEffect(() => {
    setIsFirstRender(false);
    if (
      !isGetAllData &&
      myTicketsUserEventsRef &&
      myTicketsUserEventsRef.current
    ) {
      myTicketsUserEventsRef.current.addEventListener(
        'scroll',
        scrollListener,
        true
      );
    }
    return () => {
      dispatch(resetMyTicketsListData());
      dispatch(resetError());
      if (myTicketsUserEventsRef && myTicketsUserEventsRef.current) {
        myTicketsUserEventsRef.current.removeEventListener(
          'scroll',
          scrollListener,
          true
        );
      }
    };
  }, []);

  return (
    <>
      {(loading && !myTicketsUserEventsForAll.length && (
        <MyEventsContainer ref={myTicketsUserEventsRef}>
          <div className="page-loading">
            <LoadingOutlined />
          </div>
        </MyEventsContainer>
      )) || (
        <MyEventsContainer ref={myTicketsUserEventsRef}>
          <div className="container-wrap">
            <Col md={24} xs={0}>
              <PageHearderResponsive saveScrollValue={saveScrollValue} />
            </Col>
            <Col md={0} xs={24}>
              <PageHearderComponent
                saveScrollValue={saveScrollValue}
                setMenuState={setMenuState}
              />
            </Col>
            <Col className="page-main">
              {(myTicketsUserEventsForAll.length && (
                <Row
                  gutter={[{ md: 24 }, { xs: 24, md: 32 }]}
                  className="list-row"
                >
                  {myTicketsUserEventsForAll.map((item) => (
                    <Col key={item.id} xl={8} md={12} span={24}>
                      <EventItemContainer
                        onClick={() => {
                          router.push(
                            RouterKeys.myTicketsEventDetail.replace(
                              ':slug',
                              item.slug
                            )
                          );
                          saveScrollValue();
                        }}
                      >
                        {item.status &&
                          item.status !==
                            EventStatus.find(
                              (status) => status.text === 'UPCOMING'
                            )?.key && <div className="background-mask" />}
                        <div className="event-background">
                          <Image
                            src={item.image || Images.BackgroundLogo.src}
                            layout="fill"
                            alt=""
                            onError={(e: any) => {
                              e.target.onerror = null;
                              e.target.src = Images.BackgroundLogo.src;
                            }}
                          />
                        </div>
                        {checkStatusIcon(item.status) && (
                          <div className="on-sale-icon">
                            <Image src={checkStatusIcon(item.status)} alt="" />
                          </div>
                        )}
                        <div
                          className="status-warpper"
                          style={{ textAlign: 'right' }}
                        >
                          {EventStatus.map((status) => {
                            if (status.key === item.status && status.text) {
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
                        <div className="item-info">
                          <Row className="item-info-row">
                            <Col span={24} className="info-title">
                              {item.name}
                            </Col>
                            <Col span={24} className="info-item">
                              <Image
                                className="info-item-icon"
                                src={Images.ClockIcon}
                                alt=""
                              />
                              <div className="info-description">
                                {(item.startTime &&
                                  item.endTime &&
                                  `${formatTimeStrByTimeString(
                                    item.startTime,
                                    FormatTimeKeys.norm
                                  )} - ${formatTimeStrByTimeString(
                                    item.endTime,
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
                                {item.location || '-'}
                              </div>
                            </Col>
                            <Col span={24} className="info-item">
                              <Image
                                src={Images.OrganiserIcon}
                                alt=""
                                className="info-item-icon"
                              />
                              <span className="info-description">
                                {item.organizerName || '-'}
                              </span>
                            </Col>
                          </Row>
                        </div>
                      </EventItemContainer>
                    </Col>
                  ))}
                </Row>
              )) || (
                <>
                  {!myTicketsUserEventsForAll.length && !loading && (
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
              {loading && myTicketsUserEventsForAll.length && (
                <div className="load-more">
                  <LoadingOutlined />
                  Loading...
                </div>
              )}
            </Col>
            {contextHolder}
            {!menuState && <PageBottomComponent />}
          </div>
        </MyEventsContainer>
      )}
    </>
  );
};

MyTicketsPage.getInitialProps = async (ctx: any) => {
  const { query } = ctx;
  let isSameAccount = true;
  if (!_.isEmpty(query)) {
    if (query.sameAccount && query.sameAccount === 'false') {
      isSameAccount = false;
    }
  }
  return { isSameAccount };
};

export default AuthHoc(MyTicketsPage);
