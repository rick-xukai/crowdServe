import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Row, Col, message, Tabs, Button } from 'antd';
import _ from 'lodash';
import { LoadingOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { isSafari, isMobile, isIOS, isAndroid } from 'react-device-detect';
import type { TabsProps } from 'antd';

import AuthHoc from '../components/hoc/AuthHoc';
import {
  formatTimeStrByTimeString,
  checkStatusIcon,
  openApp,
} from '../utils/func';
import { RouterKeys } from '../constants/Keys';
import {
  TicketStatus,
  FormatTimeKeys,
  DefaultPageSize,
  DefaultPage,
  DifferentEmailErrorMessafe,
  MyTickets,
  MyCollectibles,
  AppLandingPage,
  ListPageScrollDifference,
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
import PageHearderResponsive from '../components/pageHearderResponsive';
import PageBottomComponent from '../components/pageBottomComponent';
import {
  TicketsContainer,
  TicketItemContainer,
  TicketStatusContainer,
} from '../styles/tickets.style';

const Tickets = ({ isSameAccount }: { isSameAccount: boolean }) => {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useAppDispatch();
  const ticketsListRef = useRef<any>(null);
  const openAppInIos = useRef<any>(null);

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
  const [showMyCollectibles, setShowMyCollectibles] = useState<boolean>(false);
  const [showMyAssetsTabs, setShowMyAssetsTabs] = useState<boolean>(true);
  const [currentTabsKeys, setCurrentTabsKeys] = useState<string>(MyTickets);
  const [menuState, setMenuState] = useState<boolean>(false);

  const tabsItem: TabsProps['items'] = [
    {
      key: MyTickets,
      label: (
        <div>
          <span>My Tickets</span>
        </div>
      ),
      children: '',
    },
    {
      key: MyCollectibles,
      label: (
        <div>
          <span>My Collectibles</span>
        </div>
      ),
      children: '',
    },
  ];

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
    dispatch(setScrollValue(ticketsListRef.current.scrollTop));
  };

  const handleOpenApp = () => {
    if (isIOS) {
      openAppInIos.current.click();
    } else if (isAndroid) {
      openApp();
    }
  };

  useEffect(() => {
    if (!isFirstRender && error) {
      messageApi.open({
        content: error.message,
        className: 'error-message-tickets',
      });
      if (ticketsListRef && ticketsListRef.current) {
        ticketsListRef.current.removeEventListener(
          'scroll',
          scrollListener,
          true
        );
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
      dispatch(
        getTicketsListAction({
          status: TicketStatus[0].key,
          page: currentPage,
          size: DefaultPageSize,
        })
      ).then((response: any) => {
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
      dispatch(
        getTicketsListAction({
          status: TicketStatus[1].key,
          page: currentPage,
          size: DefaultPageSize,
        })
      ).then((response: any) => {
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
      dispatch(
        getTicketsListAction({
          status: TicketStatus[2].key,
          page: currentPage,
          size: DefaultPageSize,
        })
      ).then((response: any) => {
        if (response.type === getTicketsListAction.fulfilled.toString()) {
          if (
            !response.payload.length ||
            response.payload.length < DefaultPageSize
          ) {
            dispatch(setIsDisableRequest(true));
            dispatch(setIsGetAllData(true));
            if (ticketsListRef && ticketsListRef.current) {
              ticketsListRef.current.removeEventListener(
                'scroll',
                scrollListener,
                true
              );
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
          _.uniqWith([...ticketsDataForAllStatus, ...data], _.isEqual)
        )
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
    try {
      if (showMyCollectibles) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'scroll';
      }
    } catch (e) {}
  }, [showMyCollectibles]);

  useEffect(() => {
    setIsFirstRender(false);
    if (!isGetAllData && ticketsListRef && ticketsListRef.current) {
      ticketsListRef.current.addEventListener('scroll', scrollListener, true);
    }
    return () => {
      dispatch(resetError());
      if (ticketsListRef && ticketsListRef.current) {
        ticketsListRef.current.removeEventListener(
          'scroll',
          scrollListener,
          true
        );
      }
    };
  }, []);

  if (loading && !ticketsDataForAllStatus.length) {
    return (
      <TicketsContainer ref={ticketsListRef}>
        <div className="page-loading">
          <LoadingOutlined />
        </div>
      </TicketsContainer>
    );
  }

  return (
    <TicketsContainer ref={ticketsListRef}>
      <Col md={24} xs={0}>
        <PageHearderResponsive saveScrollValue={saveScrollValue} />
      </Col>
      <Col md={0} xs={24}>
        <PageHearderComponent
          saveScrollValue={saveScrollValue}
          setMenuState={setMenuState}
          showTabs
          setShowTabs={setShowMyAssetsTabs}
        />
      </Col>
      {showMyAssetsTabs && (
        <div className="page-tabs">
          <Tabs
            defaultActiveKey={currentTabsKeys}
            items={tabsItem}
            onChange={(activeKey) => {
              setCurrentTabsKeys(activeKey);
              setShowMyCollectibles(activeKey === MyCollectibles);
            }}
          />
        </div>
      )}
      <div className={(isOpenAppShow && 'page-main open-app') || 'page-main'}>
        <Row>
          <Col className="tickets-list" span={24}>
            {(ticketsDataForAllStatus.length && (
              <div className="tickets-list-container">
                {ticketsDataForAllStatus.map((item) => (
                  <TicketItemContainer
                    key={item.id}
                    onClick={() => {
                      router.push(
                        RouterKeys.ticketDetail.replace(':slug', item.slug)
                      );
                      dispatch(setIsDisableRequest(true));
                      dispatch(
                        setScrollValue(ticketsListRef.current.scrollTop)
                      );
                    }}
                  >
                    {item.status ===
                      TicketStatus.find((v) => v.key === 5)?.key && (
                      <div className="background-mask" />
                    )}
                    <div className="ticket-background">
                      {(item.thumbnailType.toLowerCase().includes('video') && (
                        <>
                          {(isSafari && (
                            <video
                              src={item.thumbnailUrl}
                              autoPlay={false}
                              poster={Images.BackgroundLogo.src}
                            />
                          )) || (
                            <video src={item.thumbnailUrl} autoPlay={false} />
                          )}
                        </>
                      )) || (
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
                    <div
                      className="status-warpper"
                      style={{ textAlign: 'right' }}
                    >
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
                        <Col span={24} className="info-title">
                          {item.name}
                        </Col>
                        <Col span={24} className="info-item">
                          <Image
                            className="info-item-icon"
                            src={Images.CalendarIcon}
                            alt=""
                          />
                          <div className="info-description">
                            {(item.startTime &&
                              formatTimeStrByTimeString(
                                item.startTime,
                                FormatTimeKeys.norm
                              )) ||
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
                  </TicketItemContainer>
                ))}
                {loading && ticketsDataForAllStatus.length && isMobile && (
                  <div className="load-more">
                    <LoadingOutlined />
                    Loading...
                  </div>
                )}
              </div>
            )) || (
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
            <div
              className="open-app-collectibles"
              style={{ display: (showMyCollectibles && 'flex') || 'none' }}
            >
              <div className="page-main-collectibles">
                <Image src={Images.MyCollectiblesIcon} alt="" />
                <p className="title">
                  Open the app to access the full functionality.
                </p>
                <div className="page-bottom">
                  <Button onClick={handleOpenApp}>OPEN NOW</Button>
                </div>
              </div>
              <a
                ref={openAppInIos}
                href={AppLandingPage}
                style={{ display: 'none' }}
              />
            </div>
          </Col>
        </Row>
      </div>
      {isMobile && <OpenAppComponent setIsOpenAppShow={setIsOpenAppShow} />}
      {contextHolder}
      {!menuState && <PageBottomComponent />}
    </TicketsContainer>
  );
};

Tickets.getInitialProps = async (ctx: any) => {
  const { query } = ctx;
  let isSameAccount = true;
  if (!_.isEmpty(query)) {
    if (query.sameAccount && query.sameAccount === 'false') {
      isSameAccount = false;
    }
  }
  return { isSameAccount };
};

export default AuthHoc(Tickets);
