import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Col, Carousel, Row, Grid, message } from 'antd';

import { useRouter } from 'next/router';
import _, { isEmpty } from 'lodash';
import AuthHoc from '../components/hoc/AuthHoc';

import {
  BlankBlock,
  CarouselItem,
  CarouselItemImg,
  Empty,
  FireIcon,
  PageContainer,
  PageTitle,
  RaveItem,
} from '@/styles/myRaves.style';
import PageHearderResponsive from '@/components/pageHearderResponsive';
import PageHearderComponent from '@/components/pageHearder';
import PageBottomComponent from '@/components/pageBottomComponent';
import { Images } from '@/theme';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RaveStatus, setTabActiveKey } from '@/slice/event.slice';
import {
  DefaultPageSize,
  ListPageScrollDifference,
  Rave,
} from '@/constants/General';
import {
  getMyRavesAction,
  setDataForAll,
  setCurrentPage,
  setIsDisableRequest,
  setIsGetAllData,
  setScrollValue,
  selectDataForAll,
  selectCurrentPage,
  selectIsDisableRequest,
  selectIsGetAllData,
  selectScrollValue,
  resetError,
  // resetListData,
  selectError,
  selectmyRavesLoading,
  selectmyRavesData,
} from '@/slice/myRaves.slice';
import { RouterKeys } from '@/constants/Keys';

const imgList = [
  'https://crowdserve-ticket-images-dev.s3-ap-southeast-1.amazonaws.com/events/1687145233259-r06z.jpeg',
  'https://crowdserve-ticket-images-dev.s3-ap-southeast-1.amazonaws.com/events/1693277132950-YxY5.png',
  'https://crowdserve-ticket-images-dev.s3-ap-southeast-1.amazonaws.com/events/1687167250641-TNUA.jpeg',
  'https://crowdserve-ticket-images-dev.s3-ap-southeast-1.amazonaws.com/events/1690860909864-gWxk.jpg',
];

const { useBreakpoint } = Grid;

const matchStatus: any = {
  [RaveStatus.inProgress]: 'ongoing',
  [RaveStatus.end]: 'end',
};

const MyRaves = () => {
  const [menuState, setMenuState] = useState<boolean>(false);
  const loading = useAppSelector(selectmyRavesLoading);
  const { lg } = useBreakpoint();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentPage = useAppSelector(selectCurrentPage);
  const isDisableRequest = useAppSelector(selectIsDisableRequest);
  const isGetAllData = useAppSelector(selectIsGetAllData);
  const listScrollValue = useAppSelector(selectScrollValue);
  const dataForAll = useAppSelector(selectDataForAll);
  const [isPageBottom, setIsPageBottom] = useState<boolean>(false);
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const listRef = useRef<any>(null);
  const error = useAppSelector(selectError);
  const [messageApi, contextHolder] = message.useMessage();
  const data = useAppSelector(selectmyRavesData);

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
  useEffect(() => {
    if (isDisableRequest || isGetAllData) {
      return;
    }
    dispatch(getMyRavesAction({ page: currentPage, size: 10 })).then((response: any) => {
      if (response.type === getMyRavesAction.fulfilled.toString()) {
        if (
          !response.payload.length ||
          response.payload.length < DefaultPageSize
        ) {
          dispatch(setIsGetAllData(true));
          dispatch(setIsDisableRequest(true));
          if (listRef && listRef.current) {
            listRef.current.removeEventListener('scroll', scrollListener, true);
          }
        }
      }
    });
  }, [currentPage]);

  useEffect(() => {
    if (listRef && listRef.current) {
      setTimeout(() => {
        listRef.current.scrollTop = listScrollValue;
      });
    }
  }, [dataForAll]);

  useEffect(() => {
    if (data) {
      dispatch(setDataForAll(_.uniqWith([...dataForAll, ...data], _.isEqual)));
    }
  }, [data]);
  useEffect(() => {
    if (isPageBottom && !loading) {
      dispatch(setCurrentPage(currentPage + 1));
    }
  }, [isPageBottom]);
  const goToRaveDetail = (slug: string) => () => {
    dispatch(setTabActiveKey(Rave));
    router.push(RouterKeys.eventDetail.replace(':slug', slug));
  };

  const saveScrollValue = () => {
    dispatch(setScrollValue(listRef.current.scrollTop));
  };

  useEffect(() => {
    if (listRef && listRef.current) {
      setTimeout(() => {
        listRef.current.scrollTop = listScrollValue;
      });
    }
  }, [dataForAll]);

  useEffect(() => {
    setIsFirstRender(false);
    if (!isGetAllData && listRef && listRef.current) {
      listRef.current.addEventListener('scroll', scrollListener, true);
    }
    return () => {
      // dispatch(resetListData());
      dispatch(resetError());
      if (listRef && listRef.current) {
        listRef.current.removeEventListener('scroll', scrollListener, true);
      }
    };
  }, []);

  useEffect(() => {
    if (!isFirstRender && error) {
      messageApi.open({
        content: error.message,
        className: 'error-message-event',
      });
    }
  }, [error]);
  return (
    <>
      {(loading && (
        <div className='page-loading' ref={listRef}>
          <LoadingOutlined />
        </div>
      )) || (
        <PageContainer>
          <div className='container-wrap'>
            <Col md={24} xs={0}>
              <PageHearderResponsive saveScrollValue={saveScrollValue} />
            </Col>
            <Col md={0} xs={24}>
              <PageHearderComponent
                saveScrollValue={saveScrollValue}
                setMenuState={setMenuState}
              />
            </Col>
            <Col className='page-main'>
              <PageTitle>Upcoming Raves</PageTitle>
              <Carousel autoplay>
                {imgList.map((item) => (
                  <CarouselItem key={item}>
                    <CarouselItemImg src={item} alt='' />
                  </CarouselItem>
                ))}
              </Carousel>
              <BlankBlock size={lg ? 32 : 20} />
              <PageTitle>My Raves</PageTitle>
              <Row gutter={[16, 16]} ref={listRef}>
                {isEmpty(data) ? (
                  <Empty>
                    <img src={Images.MyRavesEmptyIcon.src} alt='empty' />
                    <p>
                      {`You haven't joined any raves yet. Click `}
                      <a onClick={() => router.push(RouterKeys.eventList)}>
                        here
                      </a>
                      {` to discover more and join the fun!`}
                    </p>
                  </Empty>
                ) : (
                  data.map((item) => (
                    <Col span={24} md={12} key={item.name}>
                      <RaveItem
                        status={matchStatus[item.status]}
                        onClick={goToRaveDetail(item.eventSlug)}
                      >
                        <div className='head'>
                          <span className='title'>{item.name}</span>
                          <span className='badge'>
                            {matchStatus[item.status]}
                          </span>
                        </div>
                        <p className='description'>{item.description}</p>
                        <div className='flame'>
                          {item.status === RaveStatus.inProgress ? (
                            <FireIcon src={Images.FireGifIcon.src} />
                          ) : (
                            <FireIcon src={Images.FireDisabledIcon.src} />
                          )}
                          {item.flamePoint}
                        </div>
                      </RaveItem>
                    </Col>
                  ))
                )}
              </Row>
            </Col>
            {!menuState && <PageBottomComponent />}
          </div>
          {contextHolder}
        </PageContainer>
      )}
    </>
  );
};

export default AuthHoc(MyRaves);
