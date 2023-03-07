import React, { useState, useEffect, useCallback, useRef } from 'react';
import _ from 'lodash';
import { Row, Col, Input, message, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { SearchOutlined } from '@ant-design/icons';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useCookie } from '../hooks';
import { CookieKeys } from '../constants/Keys';
import { formatTimeStrByTimeString } from '../utils/func';
import { FormatTimeKeys, DefaultPageSize } from '../constants/General';
import { Images } from '../theme';
import {
  selectEventListData,
  getEventListAction,
  selectLoading,
  resetError,
  selectError,
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
} from '../slice/eventCache.slice';
import { EventListContainer, EventItemContainer } from '../styles/event.style';
import PageHearderComponent from '../components/pageHearder';
import OpenAppComponent from '../components/openAppComponent';

const EventList = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useAppDispatch();
  const cookie = useCookie([CookieKeys.userLoginToken]);
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

  const [isPageBottom, setIsPageBottom] = useState<boolean>(false);
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [userToken, setUserToken] = useState<string | undefined>(undefined);
  const [showSearchInput, setShowSearchInput] = useState<boolean>(false);
  const [isOpenAppShow, setIsOpenAppShow] = useState<boolean>(false);

  const searchInputChange = (value: string) => {
    if (!value) {
      dispatch(resetEventRelatedState());
    }
    dispatch(setSearchKeyword(value));
  };

  const handleSearch = useCallback(
    _.debounce((e: any) => searchInputChange(e.target.value), 300), []
  );

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
        className: 'error-message-event',
      });
      if (eventListRef && eventListRef.current) {
        eventListRef.current.removeEventListener('scroll', scrollListener, true);
      }
    }
  }, [error]);

  useEffect(() => {
    if (isPageBottom && !loading && !searchKeyword) {
      dispatch(setCurrentPage(currentPage + 1));
    }
  }, [isPageBottom]);

  useEffect(() => {
    if (eventListRef && eventListRef.current) {
      setTimeout(() => {
        eventListRef.current.scrollTop = listScrollValue;
      });
    }
  }, [eventDataForAll]);

  useEffect(() => {
    if (searchKeyword) {
      dispatch(getEventListAction({ keyword: searchKeyword }));
    } else {
      if (isDisableRequest || isGetAllData) {
        return;
      }
      dispatch(
        getEventListAction({
          page: currentPage,
          size: DefaultPageSize,
        }),
      ).then((response: any) => {
        if (response.type === getEventListAction.fulfilled.toString()) {
          if (
            !response.payload.length ||
            response.payload.length < DefaultPageSize
          ) {
            dispatch(setIsGetAllData(true));
            dispatch(setIsDisableRequest(true));
          }
        }
      });
    }
  }, [searchKeyword, currentPage]);

  useEffect(() => {
    if (data) {
      if (!searchKeyword) {
        dispatch(
          setEventDataForAll(
             _.uniqWith(
              [...eventDataForAll, ...data],
              _.isEqual
            )
          ),
        );
      } else {
        dispatch(setEventDataForAll(data));
      }
    }
  }, [data]);

  useEffect(() => {
    if (eventDataForAll.length) {
      setShowSearchInput(true);
    } else if (!eventDataForAll.length && !searchKeyword) {
      setShowSearchInput(false);
    }
  }, [eventDataForAll]);

  useEffect(() => {
    setIsFirstRender(false);
    setUserToken(cookie.getCookie(CookieKeys.userLoginToken));
    if (!isGetAllData && eventListRef && eventListRef.current) {
      eventListRef.current.addEventListener('scroll', scrollListener, true);
    }
    return () => {
      dispatch(resetError());
      if (eventListRef && eventListRef.current) {
        eventListRef.current.removeEventListener('scroll', scrollListener, true);
      }
    };
  }, []);

  return (
    <EventListContainer ref={eventListRef}>
      <PageHearderComponent showLogin={!userToken} />
      <Spin
        spinning={loading && !eventDataForAll.length}
        indicator={<LoadingOutlined spin />}
        size="large"
      >
        <div className={isOpenAppShow && 'page-main open-app' || 'page-main'}>
          <Row>
            <Col className="event-list" span={24}>
              <div className="page-title">
                <Row>
                  <Col span={24} className="title">EVENTS</Col>
                  {showSearchInput && (
                    <Col span={24}>
                      <Input.Search
                        allowClear
                        defaultValue={searchKeyword}
                        placeholder="Search events"
                        prefix={<SearchOutlined />}
                        onChange={handleSearch}
                        onSearch={() => {
                          dispatch(resetEventRelatedState());
                          dispatch(setEventDataForAll([]));
                        }}
                      />
                    </Col>
                  )}
                </Row>
              </div>
              {eventDataForAll.length && (
                <>
                  {eventDataForAll.map((item) => (
                    <EventItemContainer
                      key={item.id}
                      onClick={() => {
                        dispatch(setIsDisableRequest(true));
                        dispatch(setScrollValue(eventListRef.current.scrollTop));
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
                          <Col span={24} className="info-title">{item.name}</Col>
                          <Col span={24} className="info-item">
                            <Image className="info-item-icon" src={Images.ClockIcon} alt="" />
                            <div className="info-description">
                              {item.startTime && item.endTime && (
                                `${formatTimeStrByTimeString(
                                  item.startTime,
                                  FormatTimeKeys.norm,
                                )} - ${formatTimeStrByTimeString(
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
                    </EventItemContainer>
                  ))}
                  {loading && eventDataForAll.length && (
                    <div className="load-more">
                      <LoadingOutlined />
                      Loading...
                    </div>
                  )}
                </>
              ) || (
                <>
                  {!eventDataForAll.length && !loading && (
                    <Row className="no-event-row">
                      <Col span={24} className="no-event">
                        <div style={{ margin: 'auto', textAlign: 'center' }}>
                          <Image src={searchKeyword && Images.NoSearchEventIcon || Images.NoEventIcon} alt="" />
                          <p>
                            {searchKeyword && 'Aoh, no matching events found.' || 'Oops! No upcoming events for now.'}
                          </p>
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
    </EventListContainer>
  );
};

export default EventList;
