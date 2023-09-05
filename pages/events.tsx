import React, { useState, useEffect, useCallback, useRef } from 'react';
import _ from 'lodash';
import Router from 'next/router';
import { Row, Col, Input, message, Carousel } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { SearchOutlined } from '@ant-design/icons';
import { isMobile } from 'react-device-detect';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import { RouterKeys } from '../constants/Keys';
import { formatTimeStrByTimeString, formatLocation } from '../utils/func';
import {
  FormatTimeKeys,
  DefaultPageSize,
  DefaultEventListBannerPageSize,
  DefaultPage,
  ListPageScrollDifference,
} from '../constants/General';
import { Images } from '../theme';
import {
  resetEventListData,
  selectEventListData,
  getEventListAction,
  selectLoading,
  resetError,
  selectError,
  resetEventDetailLoading,
  selectEventListBanner,
  getEventListBannerAction,
} from '../slice/event.slice';
import {
  setEventDataForAll,
  selectEventDataForAll,
  setSearchKeyword,
  selectSearchKeyword,
  setCurrentPage,
  selectCurrentPage,
  setScrollValue,
  selectScrollValue,
  setIsDisableRequest,
  selectIsDisableRequest,
  setIsGetAllData,
  selectIsGetAllData,
  resetEventRelatedState,
  setEventDataForSearch,
  selectEventDataForSearch,
} from '../slice/eventCache.slice';
import {
  EventListContainer,
  EventItemContainer,
  DesktopEventItemContainer,
} from '../styles/event.style';
import PageHearderComponent from '../components/pageHearder';
import OpenAppComponent from '../components/openAppComponent';
import PageHearderResponsive from '../components/pageHearderResponsive';
import PageBottomComponent from '../components/pageBottomComponent';

const EventList = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useAppDispatch();
  const eventListRef = useRef<any>(null);

  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const data = useAppSelector(selectEventListData);
  const eventDataForAll = useAppSelector(selectEventDataForAll);
  const currentPage = useAppSelector(selectCurrentPage);
  const searchKeyword = useAppSelector(selectSearchKeyword);
  const isDisableRequest = useAppSelector(selectIsDisableRequest);
  const isGetAllData = useAppSelector(selectIsGetAllData);
  const listScrollValue = useAppSelector(selectScrollValue);
  const eventDataForSearch = useAppSelector(selectEventDataForSearch);
  const eventListBanner = useAppSelector(selectEventListBanner);

  const [isPageBottom, setIsPageBottom] = useState<boolean>(false);
  const [menuState, setMenuState] = useState<boolean>(false);
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [showSearchInput, setShowSearchInput] = useState<boolean>(false);
  const [isOpenAppShow, setIsOpenAppShow] = useState<boolean>(false);
  const [searchInputPlaceholder, setSearchInputPlaceholder] =
    useState<string>('Search events');

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

  const searchInputChange = (value: string) => {
    if (!value) {
      setSearchInputPlaceholder('Search events');
      dispatch(setEventDataForAll([]));
    }
    eventListRef.current.addEventListener('scroll', scrollListener, true);
    dispatch(resetEventRelatedState());
    dispatch(setSearchKeyword(value));
  };

  const handleSearch = useCallback(
    _.debounce((e: any) => searchInputChange(e.target.value), 300),
    []
  );

  const handleBlur = () => {
    if (searchKeyword) {
      return;
    }
    setSearchInputPlaceholder('Search events');
  };

  useEffect(() => {
    if (!isFirstRender && error) {
      messageApi.open({
        content: error.message,
        className: 'error-message-event',
      });
      if (eventListRef && eventListRef.current) {
        eventListRef.current.removeEventListener(
          'scroll',
          scrollListener,
          true
        );
      }
    }
  }, [error]);

  useEffect(() => {
    dispatch(setEventDataForSearch([]));
  }, [searchKeyword]);

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
      getEventListAction({
        page: currentPage,
        size: DefaultPageSize,
        keyword: searchKeyword,
      })
    ).then((response: any) => {
      if (response.type === getEventListAction.fulfilled.toString()) {
        if (
          !response.payload.length ||
          response.payload.length < DefaultPageSize
        ) {
          dispatch(setIsGetAllData(true));
          dispatch(setIsDisableRequest(true));
          if (eventListRef && eventListRef.current) {
            eventListRef.current.removeEventListener(
              'scroll',
              scrollListener,
              true
            );
          }
        }
      }
    });
  }, [currentPage, searchKeyword]);

  useEffect(() => {
    if (data) {
      if (!searchKeyword) {
        dispatch(
          setEventDataForAll(
            _.uniqWith([...eventDataForAll, ...data], _.isEqual)
          )
        );
      } else {
        dispatch(
          setEventDataForSearch(
            _.uniqWith([...eventDataForSearch, ...data], _.isEqual)
          )
        );
      }
    }
  }, [data]);

  useEffect(() => {
    if (eventListRef && eventListRef.current) {
      setTimeout(() => {
        eventListRef.current.scrollTop = listScrollValue;
      });
    }
    if (eventDataForAll.length) {
      setShowSearchInput(true);
    } else if (!eventDataForAll.length && !searchKeyword) {
      setShowSearchInput(false);
    }
  }, [eventDataForAll]);

  useEffect(() => {
    setIsFirstRender(false);
    if (!eventDataForAll.length) {
      dispatch(
        getEventListBannerAction({
          page: DefaultPage,
          size: DefaultEventListBannerPageSize,
        })
      );
    }
    if (!isGetAllData && eventListRef && eventListRef.current) {
      eventListRef.current.addEventListener('scroll', scrollListener, true);
    }
    return () => {
      dispatch(resetEventListData());
      dispatch(resetError());
      dispatch(resetEventDetailLoading());
      if (eventListRef && eventListRef.current) {
        eventListRef.current.removeEventListener(
          'scroll',
          scrollListener,
          true
        );
      }
    };
  }, []);

  const saveScrollValue = () => {
    dispatch(setScrollValue(eventListRef.current.scrollTop));
  };

  if (loading && !eventDataForAll.length) {
    return (
      <EventListContainer ref={eventListRef}>
        <div className="page-loading">
          <LoadingOutlined />
        </div>
      </EventListContainer>
    );
  }

  return (
    <EventListContainer ref={eventListRef}>
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
        <Col md={24} xs={0} className="page-main desktop-responsive">
          {(eventListBanner && eventListBanner.length && (
            <Row>
              <Col span={24}>
                <Carousel autoplay>
                  {eventListBanner &&
                    eventListBanner.map((item) => (
                      <div key={item.link} className="banner-item">
                        <a href={item.link} target="_blank">
                          <img src={item.image} alt="" />
                        </a>
                      </div>
                    ))}
                </Carousel>
              </Col>
            </Row>
          )) ||
            null}
          <Row>
            <Col
              className="event-list"
              span={24}
              style={{
                marginTop:
                  !eventListBanner || (!eventListBanner.length && 20) || 0,
              }}
            >
              <div className="page-title">
                <Row>
                  <Col span={24} className="title">
                    EVENTS
                  </Col>
                  {showSearchInput && (
                    <Col md={24} lg={24} xl={12}>
                      <Input.Search
                        allowClear={{
                          clearIcon: <Image src={Images.ClearIcon} alt="" />,
                        }}
                        defaultValue={searchKeyword}
                        placeholder={searchInputPlaceholder}
                        prefix={<SearchOutlined />}
                        onChange={handleSearch}
                        onFocus={() => setSearchInputPlaceholder('')}
                        onBlur={handleBlur}
                      />
                    </Col>
                  )}
                </Row>
              </div>
              {(((searchKeyword && eventDataForSearch) || eventDataForAll)
                .length && (
                <div className="event-list-container event-list-container-responsive">
                  {(
                    (searchKeyword && eventDataForSearch) ||
                    eventDataForAll
                  ).map((item) => (
                    <DesktopEventItemContainer
                      key={item.id}
                      onClick={() => {
                        Router.push(
                          RouterKeys.eventDetail.replace(
                            ':slug',
                            `${item.slug}-previous=events`
                          )
                        );
                        dispatch(setIsDisableRequest(true));
                        dispatch(
                          setScrollValue(eventListRef.current.scrollTop)
                        );
                      }}
                    >
                      <Row className="desktop-event-row">
                        <Col
                          md={24}
                          lg={24}
                          xl={9}
                          className="event-background"
                        >
                          <Image
                            src={item.image || Images.BackgroundLogo.src}
                            layout="fill"
                            alt=""
                            onError={(e: any) => {
                              e.target.onerror = null;
                              e.target.src = Images.BackgroundLogo.src;
                            }}
                          />
                        </Col>
                        <Col md={24} lg={24} xl={15}>
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
                                  src={Images.OrganiserIcon}
                                  alt=""
                                  className="info-item-icon"
                                />
                                <span className="info-description">
                                  {item.organizerName || '-'}
                                </span>
                              </Col>
                              <Col span={24} className="info-item">
                                <Image
                                  src={Images.LocationIcon}
                                  alt=""
                                  className="info-item-icon"
                                />
                                <div className="info-description">
                                  {formatLocation(item.location, item.address)}
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      </Row>
                    </DesktopEventItemContainer>
                  ))}
                  {loading &&
                    ((searchKeyword && eventDataForSearch) || eventDataForAll)
                      .length &&
                    isMobile && (
                      <div className="load-more">
                        <LoadingOutlined />
                        Loading...
                      </div>
                    )}
                </div>
              )) || (
                <>
                  {!((searchKeyword && eventDataForSearch) || eventDataForAll)
                    .length &&
                    !loading && (
                      <Row className="no-event-row">
                        <Col span={24} className="no-event">
                          <div style={{ margin: 'auto', textAlign: 'center' }}>
                            <Image
                              src={
                                (searchKeyword && Images.NoSearchEventIcon) ||
                                Images.NoEventIcon
                              }
                              alt=""
                            />
                            <p>
                              {(searchKeyword &&
                                'Aoh, no matching events found.') ||
                                'Oops! No upcoming events for now.'}
                            </p>
                          </div>
                        </Col>
                      </Row>
                    )}
                </>
              )}
            </Col>
          </Row>
        </Col>
        <Col
          md={0}
          xs={24}
          className={(isOpenAppShow && 'page-main open-app') || 'page-main'}
        >
          {(eventListBanner && eventListBanner.length && (
            <div className="carousel-banner">
              <Row>
                <Col span={24}>
                  <Carousel autoplay>
                    {eventListBanner &&
                      eventListBanner.map((item) => (
                        <div key={item.link} className="banner-item">
                          <a href={item.link} target="_blank">
                            <img src={item.image} alt="" />
                          </a>
                        </div>
                      ))}
                  </Carousel>
                </Col>
              </Row>
            </div>
          )) ||
            null}
          <Row>
            <Col
              className="event-list mobile"
              span={24}
              style={{
                paddingTop:
                  (eventListBanner && eventListBanner.length && 215) || 0,
              }}
            >
              <div className="page-title">
                <Row>
                  <Col span={24} md={12} className="title">
                    EVENTS
                  </Col>
                  {showSearchInput && (
                    <Col span={24} md={12}>
                      <Input.Search
                        allowClear={{
                          clearIcon: <Image src={Images.ClearIcon} alt="" />,
                        }}
                        defaultValue={searchKeyword}
                        placeholder={searchInputPlaceholder}
                        prefix={<SearchOutlined />}
                        onChange={handleSearch}
                        onFocus={() => setSearchInputPlaceholder('')}
                        onBlur={handleBlur}
                      />
                    </Col>
                  )}
                </Row>
              </div>
              {searchKeyword && (
                <>
                  {(eventDataForSearch.length && (
                    <div className="event-list-container">
                      {eventDataForSearch.map((item) => (
                        <EventItemContainer
                          key={item.id}
                          onClick={() => {
                            Router.push(
                              RouterKeys.eventDetail.replace(
                                ':slug',
                                `${item.slug}&previous=${
                                  window.location.hostname +
                                  window.location.pathname
                                }`
                              )
                            );
                            dispatch(setIsDisableRequest(true));
                            dispatch(
                              setScrollValue(eventListRef.current.scrollTop)
                            );
                          }}
                        >
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
                                  src={Images.OrganiserIcon}
                                  alt=""
                                  className="info-item-icon"
                                />
                                <span className="info-description">
                                  {item.organizerName || '-'}
                                </span>
                              </Col>
                              <Col span={24} className="info-item">
                                <Image
                                  src={Images.LocationIcon}
                                  alt=""
                                  className="info-item-icon"
                                />
                                <div className="info-description">
                                  {formatLocation(item.location, item.address)}
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </EventItemContainer>
                      ))}
                      {loading && eventDataForSearch.length && isMobile && (
                        <div className="load-more">
                          <LoadingOutlined />
                          Loading...
                        </div>
                      )}
                    </div>
                  )) || (
                    <>
                      {!loading && (
                        <Row className="no-event-row">
                          <Col span={24} className="no-event">
                            <div
                              style={{ margin: 'auto', textAlign: 'center' }}
                            >
                              <Image
                                src={
                                  (searchKeyword && Images.NoSearchEventIcon) ||
                                  Images.NoEventIcon
                                }
                                alt=""
                              />
                              <p>Aoh, no matching events found.</p>
                            </div>
                          </Col>
                        </Row>
                      )}
                    </>
                  )}
                </>
              )}
              {!searchKeyword && (
                <>
                  {(eventDataForAll.length && (
                    <div className="event-list-container">
                      {eventDataForAll.map((item) => (
                        <EventItemContainer
                          key={item.id}
                          onClick={() => {
                            Router.push(
                              RouterKeys.eventDetail.replace(
                                ':slug',
                                `${item.slug}-previous=events`
                              )
                            );
                            dispatch(setIsDisableRequest(true));
                            dispatch(
                              setScrollValue(eventListRef.current.scrollTop)
                            );
                          }}
                        >
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
                                  src={Images.OrganiserIcon}
                                  alt=""
                                  className="info-item-icon"
                                />
                                <span className="info-description">
                                  {item.organizerName || '-'}
                                </span>
                              </Col>
                              <Col span={24} className="info-item">
                                <Image
                                  src={Images.LocationIcon}
                                  alt=""
                                  className="info-item-icon"
                                />
                                <div className="info-description">
                                  {formatLocation(item.location, item.address)}
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </EventItemContainer>
                      ))}
                      {loading && eventDataForAll.length && isMobile && (
                        <div className="load-more">
                          <LoadingOutlined />
                          Loading...
                        </div>
                      )}
                    </div>
                  )) || (
                    <>
                      {!loading && (
                        <Row className="no-event-row">
                          <Col span={24} className="no-event">
                            <div
                              style={{ margin: 'auto', textAlign: 'center' }}
                            >
                              <Image
                                src={
                                  (searchKeyword && Images.NoSearchEventIcon) ||
                                  Images.NoEventIcon
                                }
                                alt=""
                              />
                              <p>Oops! No upcoming events for now.</p>
                            </div>
                          </Col>
                        </Row>
                      )}
                    </>
                  )}
                </>
              )}
            </Col>
          </Row>
        </Col>
        {isMobile && <OpenAppComponent setIsOpenAppShow={setIsOpenAppShow} />}
        {contextHolder}
        {!menuState && <PageBottomComponent />}
      </div>
    </EventListContainer>
  );
};

export default EventList;
