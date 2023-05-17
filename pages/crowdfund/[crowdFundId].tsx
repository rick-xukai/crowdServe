import React, { useState, useEffect } from 'react';
import { Row, Col, Progress, Button, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { RouterKeys } from '../../constants/Keys';
import Messages from '../../constants/Messages';
import { Images } from '../../theme';
import { PriceUnit, CrowdFundStatus } from '../../constants/General';
import { getTimeDifference, toPercent } from '../../utils/func';
import {
  resetDetail,
  getCrowdFundDetailAction,
  selectCrowdFundDetailData,
  selectCrowdFundDetailLoading,
  selectCrowdFundDetailError,
} from '../../slice/crowdFund.slice';
import { CrowdFundDetailContainer } from '../../styles/crowdFundDetail.style';
import PageBottomComponent from '../../components/pageBottomComponent';
import PageHearderComponent from '../../components/pageHearder';
import PageHearderResponsive from '../../components/pageHearderResponsive';
import PageNotFound from '../404';

const CrowdFundDetail = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const data = useAppSelector(selectCrowdFundDetailData);
  const loading = useAppSelector(selectCrowdFundDetailLoading);
  const error = useAppSelector(selectCrowdFundDetailError);

  const [requestId, setRequestId] = useState<string>('');
  const [menuState, setMenuState] = useState<boolean>(false);
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [crowdFundCorrect, setCrowdFundCorrect] = useState<boolean>(true);

  const formatDateText = (date: string) => {
    let text = 'day';
    if (date) {
      if (getTimeDifference(date).days > 1) {
        text = 'days';
      }
      if (getTimeDifference(date).days < 1) {
        if (getTimeDifference(date).hours > 1) {
          text = 'hours';
        } else {
          text = 'hour';
        }
      }
    }
    return text;
  };

  const endDate = (date: string) => {
    const dateString = new Date(date).toString();
    return dateString.split('(')[0];
  };

  useEffect(() => {
    const { crowdFundId } = router.query;
    if (crowdFundId) {
      setRequestId(crowdFundId as string);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (requestId) {
      dispatch(getCrowdFundDetailAction(requestId));
    }
  }, [requestId]);

  useEffect(() => {
    if (!isFirstRender && error) {
      if (
        error.code === Messages.notFound.code ||
        error.code === Messages.invalidUnlawful.code ||
        error.code === Messages.eventMismatch.code
      ) {
        setCrowdFundCorrect(false);
      }
      messageApi.open({
        content: error.message,
        className: 'error-message-event',
      });
    }
  }, [error]);

  useEffect(() => {
    setIsFirstRender(false);
    return () => {
      dispatch(resetDetail());
    };
  }, []);

  return (
    <>
      {(loading && (
        <CrowdFundDetailContainer>
          <div className="page-loading">
            <LoadingOutlined />
          </div>
        </CrowdFundDetailContainer>
      )) || (
        <>
          {(crowdFundCorrect && (
            <CrowdFundDetailContainer>
              <Col md={24} xs={0}>
                <PageHearderResponsive backgroundTransparent />
              </Col>
              <Col md={0} xs={24}>
                <PageHearderComponent
                  backgroundTransparent
                  setMenuState={setMenuState}
                />
              </Col>
              <div className="page-main">
                <div className="page-main-content">
                  <Row>
                    <Col span={24} className="detail-banner">
                      <Image
                        src={data.image || Images.BackgroundLogo.src}
                        alt=""
                        layout="fill"
                        onError={(e: any) => {
                          e.target.onerror = null;
                          e.target.src = Images.BackgroundLogo.src;
                        }}
                      />
                    </Col>
                  </Row>
                  <Col xs={24} sm={24} xl={0}>
                    <Col className="detail-info">
                      <Col className="info-name">{data.name || '-'}</Col>
                      <Col>
                        <Col className="info-item">
                          <div className="info-item-icon">
                            <Image src={Images.OrganiserIcon} alt="" />
                          </div>
                          <div className="info-item-description">
                            {data.organizer.name || '-'}
                          </div>
                        </Col>
                        <Col className="info-item">
                          <div className="info-item-icon">
                            <Image src={Images.ClockIcon} alt="" />
                          </div>
                          <div className="info-item-description">
                            {data.estimatedTime || 'To be Determined'}
                          </div>
                        </Col>
                        <Col className="info-item">
                          <div className="info-item-icon">
                            <Image src={Images.LocationIcon} alt="" />
                          </div>
                          <div className="info-item-description">
                            {data.address || 'To be Determined'}
                          </div>
                        </Col>
                      </Col>
                      <Row className="info-card">
                        {data.status === CrowdFundStatus.inProgress && (
                          <Col span={24} className="ticket-number">
                            <span>
                              <span>{data.raisedNumber.toLocaleString()}</span>/
                              {data.goalNumber.toLocaleString()}
                            </span>
                            <span className="">{`${
                              (data.raisedNumber <= 1 && 'Ticket Pledged') ||
                              'Tickets Pledged'
                            }`}</span>
                          </Col>
                        )}
                        <Col
                          span={24}
                          className={
                            (data.status === CrowdFundStatus.failed &&
                              'progress-disabled') ||
                            ''
                          }
                        >
                          <Progress
                            percent={toPercent(
                              data.raisedNumber,
                              data.goalNumber
                            )}
                            status={
                              (data.status !== CrowdFundStatus.failed &&
                                'active') ||
                              'normal'
                            }
                          />
                        </Col>
                        <Col xs={24} md={0} className="info-card-price">
                          {(data.status !== CrowdFundStatus.failed && (
                            <>
                              {(data.status === CrowdFundStatus.succeeded && (
                                <Col className="price-content">
                                  <div className="price">{`${PriceUnit} $${(
                                    data.unitPrice * data.raisedNumber
                                  ).toLocaleString()}`}</div>
                                  <div className="price-text">{`by ${
                                    data.raisedNumber
                                  } ${
                                    (data.raisedNumber <= 1 && 'backer') ||
                                    'backers'
                                  } help bring this project to life.`}</div>
                                </Col>
                              )) || (
                                <>
                                  <Col className="price-content">
                                    <div className="price">{`${PriceUnit} $${(
                                      data.unitPrice * data.raisedNumber
                                    ).toLocaleString()}`}</div>
                                    <div className="price-text">
                                      total raised
                                    </div>
                                  </Col>
                                  <Col>
                                    <div className="days">
                                      {(data.endTime &&
                                        ((getTimeDifference(data.endTime)
                                          .days === 0 &&
                                          ((getTimeDifference(data.endTime)
                                            .hours === 0 &&
                                            1) ||
                                            getTimeDifference(data.endTime)
                                              .hours)) ||
                                          getTimeDifference(data.endTime)
                                            .days)) ||
                                        '-'}
                                    </div>
                                    <div className="days-text">{`${formatDateText(
                                      data.endTime
                                    )} to go`}</div>
                                  </Col>
                                </>
                              )}
                            </>
                          )) || (
                            <div className="price-text">
                              This event is closed, full refunds will be issued.
                            </div>
                          )}
                        </Col>
                        <Col md={24} xs={0} className="info-card-price">
                          {(data.status !== CrowdFundStatus.failed && (
                            <Row>
                              {(data.status !== CrowdFundStatus.succeeded && (
                                <>
                                  <Col span={12}>
                                    <div className="price">{`${PriceUnit} $${(
                                      data.unitPrice * data.raisedNumber
                                    ).toLocaleString()}`}</div>
                                    <div className="price-text">
                                      total raised
                                    </div>
                                  </Col>
                                  <Col span={12}>
                                    <div className="days">
                                      {(data.endTime &&
                                        ((getTimeDifference(data.endTime)
                                          .days === 0 &&
                                          ((getTimeDifference(data.endTime)
                                            .hours === 0 &&
                                            1) ||
                                            getTimeDifference(data.endTime)
                                              .hours)) ||
                                          getTimeDifference(data.endTime)
                                            .days)) ||
                                        '-'}
                                    </div>
                                    <div className="days-text">{`${formatDateText(
                                      data.endTime
                                    )} to go`}</div>
                                  </Col>
                                </>
                              )) || (
                                <Col>
                                  <div className="price">{`${PriceUnit} $${(
                                    data.unitPrice * data.raisedNumber
                                  ).toLocaleString()}`}</div>
                                  <div className="price-text">{`by ${
                                    data.raisedNumber
                                  } ${
                                    (data.raisedNumber <= 1 && 'backer') ||
                                    'backers'
                                  } help bring this project to life.`}</div>
                                </Col>
                              )}
                            </Row>
                          )) || (
                            <div className="price-text">
                              This event is closed, full refunds will be issued.
                            </div>
                          )}
                        </Col>
                        {data.status === CrowdFundStatus.succeeded && (
                          <div className="fund-icon">
                            <Image src={Images.FundIcon} alt="" />
                          </div>
                        )}
                      </Row>
                      <Col className="action-button">
                        {data.status === CrowdFundStatus.inProgress && (
                          <a href={data.externalLink} target="_blank">
                            <Button>SUPPORT EVENT</Button>
                          </a>
                        )}
                        {data.status === CrowdFundStatus.succeeded && (
                          <Button
                            onClick={() => {
                              router.push(
                                RouterKeys.eventDetail.replace(
                                  ':eventId',
                                  data.eventId.toString()
                                )
                              );
                            }}
                          >
                            VIEW EVENT DETAIL
                          </Button>
                        )}
                        {data.status === CrowdFundStatus.failed && (
                          <Button disabled>FUNDS REFUNDED</Button>
                        )}
                      </Col>
                      {data.status === CrowdFundStatus.inProgress && (
                        <Col className="info-card-description">
                          <p>
                            {`This event will only be funded if it reaches its goal by ${endDate(
                              data.endTime
                            )}`}
                          </p>
                          <p>
                            Full refunds will be issued to all users if the
                            event goal is not met
                          </p>
                        </Col>
                      )}
                      <Col className="campaign-details-title">
                        Campaign Details
                      </Col>
                      <Col className="campaign-detail-text">
                        {data.description || '-'}
                      </Col>
                    </Col>
                  </Col>
                  <Col xl={24} span={0}>
                    <Row className="detail-info" justify="space-between">
                      <Col span={12}>
                        <Col className="info-name">{data.name || '-'}</Col>
                        <Col className="info-item">
                          <div className="info-item-icon">
                            <Image src={Images.OrganiserIcon} alt="" />
                          </div>
                          <div className="info-item-description">
                            {data.organizer.name || '-'}
                          </div>
                        </Col>
                        <Col className="info-item">
                          <div className="info-item-icon">
                            <Image src={Images.ClockIcon} alt="" />
                          </div>
                          <div className="info-item-description">
                            {data.estimatedTime || 'To be Determined'}
                          </div>
                        </Col>
                        <Col span={24} className="info-item">
                          <div className="info-item-icon">
                            <Image src={Images.LocationIcon} alt="" />
                          </div>
                          <div className="info-item-description">
                            {data.address || 'To be Determined'}
                          </div>
                        </Col>
                        <div className="campaign-details-title">
                          Campaign Details
                        </div>
                        <div className="campaign-detail-text">
                          {data.description || '-'}
                        </div>
                      </Col>
                      <Col span={12} className="right-col">
                        <Row className="info-card">
                          {data.status === CrowdFundStatus.inProgress && (
                            <Col span={24} className="ticket-number">
                              <span>
                                <span>
                                  {data.raisedNumber.toLocaleString()}
                                </span>
                                /{data.goalNumber.toLocaleString()}
                              </span>
                              <span className="">{`${
                                (data.raisedNumber <= 1 && 'Ticket Pledged') ||
                                'Tickets Pledged'
                              }`}</span>
                            </Col>
                          )}
                          <Col
                            span={24}
                            className={
                              (data.status === CrowdFundStatus.failed &&
                                'progress-disabled') ||
                              ''
                            }
                          >
                            <Progress
                              percent={toPercent(
                                data.raisedNumber,
                                data.goalNumber
                              )}
                              status={
                                (data.status !== CrowdFundStatus.failed &&
                                  'active') ||
                                'normal'
                              }
                            />
                          </Col>
                          <Col span={24} className="info-card-price">
                            {(data.status !== CrowdFundStatus.failed && (
                              <Row>
                                {(data.status !== CrowdFundStatus.succeeded && (
                                  <>
                                    <Col span={16}>
                                      <div className="price">{`${PriceUnit} $${(
                                        data.unitPrice * data.raisedNumber
                                      ).toLocaleString()}`}</div>
                                      <div className="price-text">
                                        total raised
                                      </div>
                                    </Col>
                                    <Col span={8}>
                                      <div className="days">
                                        {(data.endTime &&
                                          ((getTimeDifference(data.endTime)
                                            .days === 0 &&
                                            ((getTimeDifference(data.endTime)
                                              .hours === 0 &&
                                              1) ||
                                              getTimeDifference(data.endTime)
                                                .hours)) ||
                                            getTimeDifference(data.endTime)
                                              .days)) ||
                                          '-'}
                                      </div>
                                      <div className="days-text">
                                        {`${formatDateText(
                                          data.endTime
                                        )} to go`}
                                      </div>
                                    </Col>
                                  </>
                                )) || (
                                  <Col>
                                    <div className="price">{`${PriceUnit} $${(
                                      data.unitPrice * data.raisedNumber
                                    ).toLocaleString()}`}</div>
                                    <div className="price-text">{`by ${
                                      data.raisedNumber
                                    } ${
                                      (data.raisedNumber <= 1 && 'backer') ||
                                      'backers'
                                    } help bring this project to life.`}</div>
                                  </Col>
                                )}
                              </Row>
                            )) || (
                              <div className="price-text">
                                This event is closed, full refunds will be
                                issued.
                              </div>
                            )}
                          </Col>
                          {data.status === CrowdFundStatus.succeeded && (
                            <div className="fund-icon">
                              <Image src={Images.FundIcon} alt="" />
                            </div>
                          )}
                        </Row>
                        <Col className="action-button">
                          {data.status === CrowdFundStatus.inProgress && (
                            <a href={data.externalLink} target="_blank">
                              <Button>SUPPORT EVENT</Button>
                            </a>
                          )}
                          {data.status === CrowdFundStatus.succeeded && (
                            <Button
                              onClick={() => {
                                router.push(
                                  RouterKeys.eventDetail.replace(
                                    ':eventId',
                                    data.eventId.toString()
                                  )
                                );
                              }}
                            >
                              VIEW EVENT DETAIL
                            </Button>
                          )}
                          {data.status === CrowdFundStatus.failed && (
                            <Button disabled>FUNDS REFUNDED</Button>
                          )}
                        </Col>
                        {data.status === CrowdFundStatus.inProgress && (
                          <Col className="info-card-description">
                            <p>
                              {`This event will only be funded if it reaches its goal by ${endDate(
                                data.endTime
                              )}`}
                            </p>
                            <p>
                              Full refunds will be issued to all users if the
                              event goal is not met
                            </p>
                          </Col>
                        )}
                      </Col>
                    </Row>
                  </Col>
                </div>
              </div>
              {contextHolder}
              {!menuState && <PageBottomComponent />}
            </CrowdFundDetailContainer>
          )) || <PageNotFound />}
        </>
      )}
    </>
  );
};

export default CrowdFundDetail;
