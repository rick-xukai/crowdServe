import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Row, Col, message, Button } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { useRouter } from 'next/router';
import _ from 'lodash';

import AuthHoc from '../../../components/hoc/AuthHoc';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Images } from '../../../theme';
import Messages from '../../../constants/Messages';
import { RouterKeys } from '../../../constants/Keys';
import {
  TicketSaleStatus,
  ListPageScrollDifference,
  DefaultPageSize,
} from '../../../constants/General';
import {
  getMyCollectiblesOrganizerInfoAction,
  selectMyCollectiblesOrganizerInfo,
  selectError,
  selectMyCollectiblesOrganizerTickets,
  selectCollectionDetaiLoading,
  getMyCollectiblesOrganizerTicketsAction,
  resetCollectiblesOrganizerTickets,
} from '../../../slice/myCollectibles.slice';
import {
  setScrollValue,
  setIsGetAllData,
  setIsDisableRequest,
  setCurrentPage,
  setCollectiblesOrganizerTicketsForAll,
  selectCollectiblesOrganizerTicketsForAll,
  selectCurrentPage,
  selectIsDisableRequest,
  selectIsGetAllData,
  selectScrollValue,
} from '../../../slice/collectionDetailCache.slice';
import { resetMyCollectiblesCache } from '../../../slice/myCollectiblesCache.slice';
import { MyTicketItemContainer } from '../../../styles/myTicketsEventDetail.style';
import { CollectionDetailContainer } from '../../../styles/collectionDetail.style';
import PageHearderComponent from '../../../components/pageHearder';
import PageHearderResponsive from '../../../components/pageHearderResponsive';
import ClientModalComponent from '../../../components/clientModal';
import PageNotFound from '../../404';

const CollectionDetail = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const collectionDetailListRef = useRef<any>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const loading = useAppSelector(selectCollectionDetaiLoading);
  const error = useAppSelector(selectError);
  const organizerInfo = useAppSelector(selectMyCollectiblesOrganizerInfo);
  const organizerTickets = useAppSelector(selectMyCollectiblesOrganizerTickets);
  const currentPage = useAppSelector(selectCurrentPage);
  const isDisableRequest = useAppSelector(selectIsDisableRequest);
  const isGetAllData = useAppSelector(selectIsGetAllData);
  const listScrollValue = useAppSelector(selectScrollValue);
  const collectiblesOrganizerTicketsForAll = useAppSelector(
    selectCollectiblesOrganizerTicketsForAll
  );

  const [collectibleCorrect, setCollectibleCorrect] = useState<boolean>(true);
  const [requestId, setRequestId] = useState<string>('');
  const [isPageBottom, setIsPageBottom] = useState<boolean>(false);
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [showNoCollectibleModal, setShowNoCollectibleModal] =
    useState<boolean>(false);

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
    dispatch(setScrollValue(collectionDetailListRef.current.scrollTop));
  };

  const handleNoCollectible = () => {
    setShowNoCollectibleModal(false);
    dispatch(resetMyCollectiblesCache());
    router.push(RouterKeys.myCollectibles);
  };

  useEffect(() => {
    if (isPageBottom && !loading) {
      dispatch(setCurrentPage(currentPage + 1));
    }
  }, [isPageBottom]);

  useEffect(() => {
    if (isDisableRequest || isGetAllData || !requestId) {
      return;
    }
    dispatch(getMyCollectiblesOrganizerInfoAction(requestId));
    dispatch(
      getMyCollectiblesOrganizerTicketsAction({
        id: requestId,
        page: currentPage,
        size: DefaultPageSize,
      })
    ).then((response: any) => {
      if (
        response.type ===
        getMyCollectiblesOrganizerTicketsAction.fulfilled.toString()
      ) {
        if (
          !response.payload.length ||
          response.payload.length < DefaultPageSize
        ) {
          dispatch(setIsGetAllData(true));
          dispatch(setIsDisableRequest(true));
          if (collectionDetailListRef && collectionDetailListRef.current) {
            collectionDetailListRef.current.removeEventListener(
              'scroll',
              scrollListener,
              true
            );
          }
        }
      }
    });
  }, [currentPage, requestId]);

  useEffect(() => {
    if (organizerTickets) {
      dispatch(
        setCollectiblesOrganizerTicketsForAll(
          _.uniqWith(
            [...collectiblesOrganizerTicketsForAll, ...organizerTickets],
            _.isEqual
          )
        )
      );
    }
  }, [organizerTickets]);

  useEffect(() => {
    if (!loading && !collectiblesOrganizerTicketsForAll.length) {
      setShowNoCollectibleModal(true);
    }
    if (collectionDetailListRef && collectionDetailListRef.current) {
      setTimeout(() => {
        if (collectionDetailListRef && collectionDetailListRef.current) {
          collectionDetailListRef.current.scrollTop = listScrollValue;
        }
      });
    }
  }, [collectiblesOrganizerTicketsForAll]);

  useEffect(() => {
    const { organizerName } = router.query;
    if (organizerName) {
      const parameterArr = (organizerName as string).split('-');
      if (_.last(parameterArr)) {
        setRequestId(_.last(parameterArr) as string);
      } else {
        setCollectibleCorrect(false);
      }
    }
  }, [router.isReady]);

  useEffect(() => {
    if (!isFirstRender && error) {
      if (
        error.code === Messages.notFound.code ||
        error.code === Messages.invalidUnlawful.code ||
        error.code === Messages.eventMismatch.code
      ) {
        setCollectibleCorrect(false);
      }
      messageApi.open({
        content: error.message,
        className: 'error-message-event',
      });
    }
  }, [error]);

  useEffect(() => {
    setIsFirstRender(false);
    if (
      !isGetAllData &&
      collectionDetailListRef &&
      collectionDetailListRef.current
    ) {
      collectionDetailListRef.current.addEventListener(
        'scroll',
        scrollListener,
        true
      );
    }
    return () => {
      dispatch(resetCollectiblesOrganizerTickets());
      if (collectionDetailListRef && collectionDetailListRef.current) {
        collectionDetailListRef.current.removeEventListener(
          'scroll',
          scrollListener,
          true
        );
      }
    };
  }, []);

  return (
    <>
      {(collectibleCorrect && (
        <>
          {(loading && !collectiblesOrganizerTicketsForAll.length && (
            <CollectionDetailContainer ref={collectionDetailListRef}>
              <div className="page-loading">
                <LoadingOutlined />
              </div>
            </CollectionDetailContainer>
          )) || (
            <CollectionDetailContainer ref={collectionDetailListRef}>
              <Col md={24} xs={0}>
                <PageHearderResponsive saveScrollValue={saveScrollValue} />
              </Col>
              <Col md={0} xs={24}>
                <PageHearderComponent saveScrollValue={saveScrollValue} />
              </Col>
              <div className="page-main">
                <div
                  className={
                    (organizerInfo.banner && 'banner') || 'banner no-background'
                  }
                >
                  {(organizerInfo.banner && (
                    <Image
                      src={organizerInfo.banner}
                      alt=""
                      layout="fill"
                      onError={(e: any) => {
                        e.target.onerror = null;
                        e.target.src = Images.StarBackground.src;
                      }}
                    />
                  )) || <Image src={Images.StarBackground} alt="" />}
                </div>
                <div className="collectible-detail">
                  <Row className="detail-content">
                    <Col span={24} className="logo">
                      {(organizerInfo.logo && (
                        <div className="logo-flex">
                          <div className="logo-content">
                            <Image
                              src={organizerInfo.logo}
                              alt=""
                              layout="fill"
                              onError={(e: any) => {
                                e.target.onerror = null;
                                e.target.src = Images.BackgroundLogo.src;
                              }}
                            />
                          </div>
                        </div>
                      )) || (
                        <div className="logo-name">
                          {organizerInfo.name.charAt(0)}
                        </div>
                      )}
                    </Col>
                    <Col span={24} className="name">
                      {organizerInfo.name}
                    </Col>
                    {organizerInfo.description && (
                      <Col span={24} className="description">
                        {organizerInfo.description}
                      </Col>
                    )}
                  </Row>
                  <Row
                    gutter={[
                      { xs: 15, sm: 15, md: 24 },
                      { xs: 15, sm: 15, md: 24 },
                    ]}
                  >
                    {collectiblesOrganizerTicketsForAll.map((item) => (
                      <Col key={item.id} xl={6} md={8} sm={12} xs={12}>
                        <MyTicketItemContainer
                          className="collectible"
                          onClick={() => {
                            const { organizerName } = router.query;
                            saveScrollValue();
                            router.push(
                              RouterKeys.collectibleDetail
                                .replace(
                                  ':orgname-slug',
                                  organizerName?.toString() ||
                                    organizerInfo.name
                                )
                                .replace(':slug', item.slug)
                            );
                          }}
                        >
                          <div className="item-background">
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
                          <div className="item-detail">
                            <Row>
                              <Col
                                span={
                                  (item.saleStatus ===
                                    TicketSaleStatus.onsale.status &&
                                    18) ||
                                  24
                                }
                              >
                                <div className="name-content">
                                  <p className="item-detail-name">
                                    {item.name || '-'}
                                  </p>
                                </div>
                              </Col>
                              {item.saleStatus ===
                                TicketSaleStatus.onsale.status && (
                                <Col span={6}>
                                  <div className="item-detail-status">
                                    {item.saleStatus ===
                                      TicketSaleStatus.onsale.status && (
                                      <div className="item-detail-icon ticket-onsale">
                                        <Image src={Images.OnSaleIcon} alt="" />
                                      </div>
                                    )}
                                  </div>
                                </Col>
                              )}
                            </Row>
                          </div>
                        </MyTicketItemContainer>
                      </Col>
                    ))}
                  </Row>
                </div>
                {loading && collectiblesOrganizerTicketsForAll.length && (
                  <div className="load-more">
                    <LoadingOutlined />
                    Loading...
                  </div>
                )}
              </div>
              {contextHolder}
              <ClientModalComponent
                title=""
                modalShow={showNoCollectibleModal}
                closable={false}
                footer={[
                  <Button key="OK" type="primary" onClick={handleNoCollectible}>
                    OK
                  </Button>,
                ]}
              >
                <p>{`You don't have any collectibles for this collection yet.`}</p>
              </ClientModalComponent>
            </CollectionDetailContainer>
          )}
        </>
      )) || <PageNotFound />}
    </>
  );
};

export default AuthHoc(CollectionDetail);
