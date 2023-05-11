import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Row, Col, Progress, Button, message } from 'antd';
import { useRouter } from 'next/router';
import { LoadingOutlined } from '@ant-design/icons';
import Image from 'next/image';
import TextTruncate from 'react-text-truncate';
import _ from 'lodash';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Images } from '../theme';
import { toPercent, getTimeDifference } from '../utils/func';
import { RouterKeys } from '../constants/Keys';
import {
  DefaultCrowdFundListPageSize,
  CrowdFundStatus,
  ListPageScrollDifference,
} from '../constants/General';
import {
  CrowdFundListContainer,
  ListItemContainer,
} from '../styles/crowdFund.style';
import {
  resetError,
  resetCrowdFundListData,
  selectError,
  selectLoading,
  selectCrowdFundListData,
  getCrowdFundListAction,
  CrowdFundListResponseType,
} from '../slice/crowdFund.slice';
import {
  selectCurrentPage,
  selectCrowdFundDataForAll,
  selectIsDisableRequest,
  selectIsGetAllData,
  selectScrollValue,
  setCrowdFundDataForAll,
  setCurrentPage,
  setIsDisableRequest,
  setIsGetAllData,
  setScrollValue,
} from '../slice/crowdFundCache.slice';
import PageHearderComponent from '../components/pageHearder';
import PageHearderResponsive from '../components/pageHearderResponsive';
import PageBottomComponent from '../components/pageBottomComponent';

const CrowdFundList = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const crowdFundListRef = useRef<any>(null);
  const dispatch = useAppDispatch();

  const data = useAppSelector(selectCrowdFundListData);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const currentPage = useAppSelector(selectCurrentPage);
  const isDisableRequest = useAppSelector(selectIsDisableRequest);
  const isGetAllData = useAppSelector(selectIsGetAllData);
  const listScrollValue = useAppSelector(selectScrollValue);
  const crowdFundDataForAll = useAppSelector(selectCrowdFundDataForAll);

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
    dispatch(setScrollValue(crowdFundListRef.current.scrollTop));
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
      getCrowdFundListAction({
        page: currentPage,
        size: DefaultCrowdFundListPageSize,
      })
    ).then((response: any) => {
      if (response.type === getCrowdFundListAction.fulfilled.toString()) {
        if (
          !response.payload.length ||
          response.payload.length < DefaultCrowdFundListPageSize
        ) {
          dispatch(setIsGetAllData(true));
          dispatch(setIsDisableRequest(true));
          if (crowdFundListRef && crowdFundListRef.current) {
            crowdFundListRef.current.removeEventListener(
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
    if (!isFirstRender && error) {
      messageApi.open({
        content: error.message,
        className: 'error-message-event',
      });
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      dispatch(
        setCrowdFundDataForAll(
          _.uniqWith([...crowdFundDataForAll, ...data], _.isEqual)
        )
      );
    }
  }, [data]);

  useEffect(() => {
    if (crowdFundListRef && crowdFundListRef.current) {
      setTimeout(() => {
        crowdFundListRef.current.scrollTop = listScrollValue;
      });
    }
  }, [crowdFundDataForAll]);

  useEffect(() => {
    setIsFirstRender(false);
    if (!isGetAllData && crowdFundListRef && crowdFundListRef.current) {
      crowdFundListRef.current.addEventListener('scroll', scrollListener, true);
    }
    return () => {
      dispatch(resetCrowdFundListData());
      dispatch(resetError());
      if (crowdFundListRef && crowdFundListRef.current) {
        crowdFundListRef.current.removeEventListener(
          'scroll',
          scrollListener,
          true
        );
      }
    };
  }, []);

  return (
    <>
      {(loading && !crowdFundDataForAll.length && (
        <CrowdFundListContainer ref={crowdFundListRef}>
          <div className="page-loading">
            <LoadingOutlined />
          </div>
        </CrowdFundListContainer>
      )) || (
        <CrowdFundListContainer ref={crowdFundListRef} className="star-bg">
          <Col md={24} xs={0}>
            <PageHearderResponsive
              backgroundTransparent
              saveScrollValue={saveScrollValue}
            />
          </Col>
          <Col md={0} xs={24}>
            <PageHearderComponent
              saveScrollValue={saveScrollValue}
              backgroundTransparent
              setMenuState={setMenuState}
            />
          </Col>
          <div className="page-banner">
            <Image src={Images.CrowdFundListBanner} alt="" />
          </div>
          <div className="page-main">
            <div className="page-main-content">
              <Row>
                <Col span={24} className="content-title">
                  HELP MAKE THESE EVENTS A REALITY
                </Col>
              </Row>
              <Row className="crowd-fund-list">
                {(crowdFundDataForAll.length &&
                  crowdFundDataForAll.map((item: CrowdFundListResponseType) => (
                    <ListItemContainer md={11} span={24} key={item.id}>
                      <div
                        onClick={() => {
                          router.push(
                            RouterKeys.crowdFundDetail.replace(
                              ':crowdFundId',
                              item.id
                            )
                          );
                          saveScrollValue();
                        }}
                      >
                        <div className="list-item-image">
                          <Image
                            src={item.image || Images.BackgroundLogo.src}
                            alt=""
                            layout="fill"
                            onError={(e: any) => {
                              e.target.onerror = null;
                              e.target.src = Images.BackgroundLogo.src;
                            }}
                          />
                          {item.status !== CrowdFundStatus.inProgress && (
                            <div className="bg-mask" />
                          )}
                          {item.status === CrowdFundStatus.succeeded && (
                            <div className="fund-icon">
                              <Image src={Images.FundIcon} alt="" />
                            </div>
                          )}
                        </div>
                        <Row>
                          <Col
                            span={24}
                            className={
                              (item.status !== CrowdFundStatus.inProgress &&
                                'list-item-name gray-mask') ||
                              'list-item-name'
                            }
                          >
                            {item.name}
                          </Col>
                        </Row>
                        <Row>
                          <Col
                            span={24}
                            className={
                              (item.status !== CrowdFundStatus.inProgress &&
                                'list-item-label gray-mask') ||
                              'list-item-label'
                            }
                          >
                            {(item.organizer && item.organizer.name) || '-'}
                          </Col>
                        </Row>
                        <Row>
                          <Col
                            xl={24}
                            span={0}
                            className={
                              (item.status !== CrowdFundStatus.inProgress &&
                                'list-item-description gray-mask') ||
                              'list-item-description'
                            }
                          >
                            <TextTruncate
                              line={2}
                              element="div"
                              truncateText="…"
                              containerClassName="text-typography"
                              text={item.description || '-'}
                            />
                          </Col>
                          <Col
                            xs={24}
                            sm={24}
                            xl={0}
                            className={
                              (item.status !== CrowdFundStatus.inProgress &&
                                'list-item-description gray-mask') ||
                              'list-item-description'
                            }
                          >
                            <TextTruncate
                              line={3}
                              element="div"
                              truncateText="…"
                              containerClassName="text-typography"
                              text={item.description || '-'}
                            />
                          </Col>
                        </Row>
                        {(item.status === CrowdFundStatus.failed &&
                          item.raisedNumber === 0 && (
                            <div className="list-item-raised" />
                          )) || (
                          <Row>
                            <Col span={24} className="list-item-raised">
                              {(toPercent(
                                item.raisedNumber,
                                item.goalNumber
                              ) === 0 && (
                                <span
                                  className="raised-text"
                                  style={{ marginLeft: 0 }}
                                >
                                  Waiting for your pledge
                                </span>
                              )) || (
                                <>
                                  <span className="price">
                                    {item.raisedNumber.toLocaleString()}
                                  </span>
                                  <span className="raised-text">
                                    {`${
                                      (item.raisedNumber <= 1 &&
                                        'Ticket Pledged') ||
                                      'Tickets Pledged'
                                    }`}
                                  </span>
                                </>
                              )}
                            </Col>
                          </Row>
                        )}
                        <Row>
                          <Col
                            span={14}
                            className={
                              (item.status === CrowdFundStatus.failed &&
                                'progress-disabled') ||
                              ''
                            }
                          >
                            <Progress
                              percent={toPercent(
                                item.raisedNumber,
                                item.goalNumber
                              )}
                              status={
                                (item.status !== CrowdFundStatus.failed &&
                                  'active') ||
                                'normal'
                              }
                            />
                          </Col>
                          <Col span={10} className="list-item-days-left">
                            {(item.status !== CrowdFundStatus.inProgress && (
                              <div className="content">
                                <span>
                                  {(item.status === CrowdFundStatus.succeeded &&
                                    'Fully Funded') ||
                                    'Ended'}
                                </span>
                              </div>
                            )) || (
                              <div className="content date-text">
                                <Image src={Images.HourglassIcon} alt="" />
                                <div>
                                  <b style={{ fontWeight: 500 }}>
                                    {(getTimeDifference(item.endTime).days !==
                                      0 &&
                                      getTimeDifference(item.endTime).days) ||
                                      (getTimeDifference(item.endTime).hours ===
                                        0 &&
                                        1) ||
                                      getTimeDifference(item.endTime).hours}
                                  </b>{' '}
                                  {`${
                                    (getTimeDifference(item.endTime).days < 1 &&
                                      ((getTimeDifference(item.endTime).hours >
                                        1 &&
                                        'hours') ||
                                        'hour')) ||
                                    (getTimeDifference(item.endTime).days > 1 &&
                                      'days') ||
                                    'day'
                                  } left`}
                                </div>
                              </div>
                            )}
                          </Col>
                        </Row>
                      </div>
                      <Row>
                        <Col span={24} className="list-item-button">
                          {item.status === CrowdFundStatus.inProgress && (
                            <a href={item.externalLink} target="_blank">
                              <Button>SUPPORT EVENT</Button>
                            </a>
                          )}
                          {item.status === CrowdFundStatus.succeeded && (
                            <Button
                              onClick={() => {
                                router.push(
                                  RouterKeys.eventDetail.replace(
                                    ':eventId',
                                    item.eventId.toString()
                                  )
                                );
                                saveScrollValue();
                              }}
                            >
                              VIEW EVENT DETAIL
                            </Button>
                          )}
                          {item.status === CrowdFundStatus.failed && (
                            <Button disabled>FUNDS REFUNDED</Button>
                          )}
                        </Col>
                      </Row>
                    </ListItemContainer>
                  ))) || (
                  <Col span={24} className="no-crowd-fund">
                    <Image src={Images.NoCrowdFundIcon} alt="" />
                    <p className="text">No CrowdFund events now.</p>
                  </Col>
                )}
              </Row>
            </div>
            {loading && crowdFundDataForAll.length && (
              <div className="load-more">
                <LoadingOutlined />
                Loading...
              </div>
            )}
          </div>
          {contextHolder}
          {!menuState && <PageBottomComponent />}
        </CrowdFundListContainer>
      )}
    </>
  );
};

export default CrowdFundList;
