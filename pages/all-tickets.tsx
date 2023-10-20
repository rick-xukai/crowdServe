import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Row, Col, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { useRouter } from 'next/router';
import _ from 'lodash';

import AuthHoc from '../components/hoc/AuthHoc';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Images } from '../theme';
import {
  ListPageScrollDifference,
  DefaultPageSize,
  TicketSaleStatus,
  TransferStatus,
} from '../constants/General';
import { RouterKeys } from '../constants/Keys';
import {
  MyCollectiblesContainer,
  CollectiblesItem,
} from '../styles/myCollectibles.style';
import {
  getMyCollectiblesListAction,
  selectLoading,
  selectError,
  selectMyCollectiblesListData,
  resetMyCollectiblesListData,
  resetError,
  MyCollectiblesListResponseType,
  setCollectiblesOrganizerDetailLoading,
} from '../slice/myCollectibles.slice';
import {
  setMyCollectiblesListForAll,
  setCurrentPage,
  setIsDisableRequest,
  setIsGetAllData,
  setScrollValue,
  selectMyCollectiblesListForAll,
  selectCurrentPage,
  selectIsDisableRequest,
  selectIsGetAllData,
  selectScrollValue,
} from '../slice/myCollectiblesCache.slice';
import { resetCollectionDetailCache } from '../slice/collectionDetailCache.slice';
import PageHearderComponent from '../components/pageHearder';
import PageHearderResponsive from '../components/pageHearderResponsive';
import PageBottomComponent from '../components/pageBottomComponent';

const MyCollectibles = () => {
  const router = useRouter();
  const myCollectiblesListRef = useRef<any>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useAppDispatch();

  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const myCollectiblesList = useAppSelector(selectMyCollectiblesListData);
  const currentPage = useAppSelector(selectCurrentPage);
  const isDisableRequest = useAppSelector(selectIsDisableRequest);
  const isGetAllData = useAppSelector(selectIsGetAllData);
  const listScrollValue = useAppSelector(selectScrollValue);
  const myCollectiblesListForAll = useAppSelector(
    selectMyCollectiblesListForAll
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
    dispatch(setScrollValue(myCollectiblesListRef.current.scrollTop));
  };

  const collectibleItemElement = (
    item: MyCollectiblesListResponseType,
    colSpan: number,
    showTicketNumber: number
  ) => (
    <>
      <Row className="collectible-item-image">
        {item.tickets.slice(0, showTicketNumber).map((ticket, index) => (
          <Col key={index} span={colSpan} className="image-card">
            <Image
              src={ticket.image || Images.BackgroundLogo}
              layout="fill"
              alt=""
              onError={(e: any) => {
                e.target.onerror = null;
                e.target.src = Images.BackgroundLogo.src;
              }}
            />
            {item.owned - showTicketNumber > 0 &&
              index === item.tickets.slice(0, showTicketNumber).length - 1 && (
                <div className="count-mask">
                  {`+${item.owned - showTicketNumber}`}
                </div>
              )}
            {ticket.saleStatus === TicketSaleStatus.onsale.status && (
              <div className="sale-icon">
                <Image src={Images.OnSaleIcon} alt="" />
              </div>
            )}
            {ticket.transferStatus === TransferStatus.PENDING && (
              <div className="sale-icon">
                <Image src={Images.TransferIcon} alt="" />
              </div>
            )}
          </Col>
        ))}
        {item.tickets.slice(0, showTicketNumber).length === 1 && (
          <Col span={colSpan} className="image-card" />
        )}
      </Row>
      <Row className="collectible-item-info">
        <Col span={24} className="info-name">
          {item.name}
        </Col>
        <Col span={24} className="info-owned">
          {`Owned: ${item.owned.toLocaleString()}`}
        </Col>
      </Row>
    </>
  );

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
      getMyCollectiblesListAction({
        page: currentPage,
        size: DefaultPageSize,
      })
    ).then((response: any) => {
      if (response.type === getMyCollectiblesListAction.fulfilled.toString()) {
        if (
          !response.payload.length ||
          response.payload.length < DefaultPageSize
        ) {
          dispatch(setIsGetAllData(true));
          dispatch(setIsDisableRequest(true));
          if (myCollectiblesListRef && myCollectiblesListRef.current) {
            myCollectiblesListRef.current.removeEventListener(
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
    if (myCollectiblesList) {
      dispatch(
        setMyCollectiblesListForAll(
          _.uniqWith(
            [...myCollectiblesListForAll, ...myCollectiblesList],
            _.isEqual
          )
        )
      );
    }
  }, [myCollectiblesList]);

  useEffect(() => {
    if (myCollectiblesListRef && myCollectiblesListRef.current) {
      setTimeout(() => {
        if (myCollectiblesListRef && myCollectiblesListRef.current) {
          myCollectiblesListRef.current.scrollTop = listScrollValue;
        }
      });
    }
  }, [myCollectiblesListForAll]);

  useEffect(() => {
    if (!isFirstRender && error) {
      messageApi.open({
        content: error.message,
        className: 'error-message-tickets',
      });
    }
  }, [error]);

  useEffect(() => {
    setIsFirstRender(false);
    if (
      !isGetAllData &&
      myCollectiblesListRef &&
      myCollectiblesListRef.current
    ) {
      myCollectiblesListRef.current.addEventListener(
        'scroll',
        scrollListener,
        true
      );
    }
    return () => {
      dispatch(resetMyCollectiblesListData());
      dispatch(resetError());
      if (myCollectiblesListRef && myCollectiblesListRef.current) {
        myCollectiblesListRef.current.removeEventListener(
          'scroll',
          scrollListener,
          true
        );
      }
    };
  }, []);

  return (
    <>
      {(loading && !myCollectiblesListForAll.length && (
        <MyCollectiblesContainer ref={myCollectiblesListRef}>
          <div className="page-loading">
            <LoadingOutlined />
          </div>
        </MyCollectiblesContainer>
      )) || (
        <MyCollectiblesContainer ref={myCollectiblesListRef}>
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
              {(myCollectiblesListForAll.length && (
                <Row gutter={[24, 24]}>
                  {myCollectiblesListForAll.map((item) => (
                    <Col key={item.id} xl={8} md={12} sm={12} xs={24}>
                      <CollectiblesItem
                        onClick={() => {
                          dispatch(resetCollectionDetailCache());
                          dispatch(setCollectiblesOrganizerDetailLoading(true));
                          router.push(
                            RouterKeys.collectionDetail.replace(
                              ':slug',
                              item.slug
                            )
                          );
                          saveScrollValue();
                        }}
                      >
                        <Col sm={24} xs={0} className="content">
                          {collectibleItemElement(item, 12, 2)}
                        </Col>
                        <Col sm={0} xs={24} className="content">
                          {collectibleItemElement(item, 8, 3)}
                        </Col>
                      </CollectiblesItem>
                    </Col>
                  ))}
                </Row>
              )) || (
                <div className="no-collectibles">
                  <div className="page-main-no-collectibles">
                    <Image src={Images.MyCollectiblesIcon} alt="" />
                    <p className="title">No Collectibles.</p>
                  </div>
                </div>
              )}
              {loading && myCollectiblesListForAll.length && (
                <div className="load-more">
                  <LoadingOutlined />
                  Loading...
                </div>
              )}
            </Col>
            {contextHolder}
            {!menuState && <PageBottomComponent />}
          </div>
        </MyCollectiblesContainer>
      )}
    </>
  );
};

export default AuthHoc(MyCollectibles);
