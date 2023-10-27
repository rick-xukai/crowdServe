import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { MenuProps } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { Row, Col, Dropdown, Checkbox, Button, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';

import { base64Encrypt } from '@/utils/func';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { Images } from '@/theme';
import { useCookie } from '@/hooks';
import {
  CookieKeys,
  // LocalStorageKeys,
  RouterKeys,
  // SessionStorageKeys,
} from '@/constants/Keys';
import { EventsScanContainer, EventItem } from '@/styles/eventsScan.style';
import { resetScannerLoginResponse } from '@/slice/user.slice';
import {
  reset,
  getScannerEventListAction,
  selectScannerEventList,
  selectError,
  selectLoading,
  // setPage,
  // setSize,
  selectPage,
  selectSize,
  // selectIsDisableRequest,
  // setIsDisableRequest,
} from '@/slice/scanner.slice';
import { reset as userSliceReset } from '@/slice/user.slice';
import Messages from '@/constants/Messages';
// import {
//   DefaultPage,
//   DefaultPageSize,
//   ListPageScrollDifference,
// } from '@/constants/General';

const CheckboxGroup = Checkbox.Group;

const EventsScan = () => {
  const cookie = useCookie([
    CookieKeys.scannerLoginToken,
    CookieKeys.scannerLoginUser,
  ]);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const eventsListContainer = useRef<any>(null);

  const page = useAppSelector(selectPage);
  const size = useAppSelector(selectSize);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const scannerEventList = useAppSelector(selectScannerEventList);
  // const isDisableRequest = useAppSelector(selectIsDisableRequest);

  const [listOptions, setListOptions] = useState<any[]>([]);
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);
  const [scannerName, setScannerName] = useState<string>('');
  // const [isPageBottom, setIsPageBottom] = useState<boolean>(false);

  const items: MenuProps['items'] = [
    {
      label: 'Logout',
      key: 'logout',
    },
  ];

  const handleChange = (list: CheckboxValueType[]) => {
    setCheckedList(list);
    // sessionStorage.setItem(
    //   SessionStorageKeys.scannerSelectEvent,
    //   JSON.stringify(list)
    // );
  };

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    // if (!e.target.checked) {
    //   sessionStorage.removeItem(SessionStorageKeys.scannerSelectEvent);
    // } else {
    //   sessionStorage.setItem(
    //     SessionStorageKeys.scannerSelectEvent,
    //     JSON.stringify(listOptions.map((item) => item.value))
    //   );
    // }
    setCheckedList(
      (e.target.checked && listOptions.map((item) => item.value)) || []
    );
  };

  const onClick = () => {
    dispatch(userSliceReset());
    dispatch(resetScannerLoginResponse());
    cookie.removeCookie(CookieKeys.scannerLoginToken, {
      path: '/',
      domain: window.location.hostname,
    });
    router.push(RouterKeys.scanLogin);
  };

  const startScanCode = () => {
    router.push(
      RouterKeys.scanQrCode.replace(':eventId', base64Encrypt(checkedList))
    );
  };

  useEffect(() => {
    if (error) {
      if (error.code === Messages.userTokenDeprecated.code) {
        message.open({
          content: Messages.userTokenDeprecated.text,
          className: 'error-message-event',
        });
        onClick();
      } else {
        message.open({
          content: error.message,
          className: 'error-message-event',
        });
      }
    }
  }, [error]);

  useEffect(() => {
    setListOptions(
      scannerEventList.map((item) => {
        return {
          label: (
            <Col>
              <div className="event-name">{item.name}</div>
              <div className="event-date">{item.time}</div>
            </Col>
          ),
          value: item.uuid,
        };
      })
    );
  }, [scannerEventList]);

  useEffect(() => {
    dispatch(
      getScannerEventListAction({
        page,
        size,
      })
    );
  }, [page]);

  // useEffect(() => {
  //   if (isPageBottom && !loading) {
  //     dispatch(setPage(page + 1));
  //   }
  // }, [isPageBottom]);

  // const handleScroll = (event: any) => {
  //   const { clientHeight, scrollHeight, scrollTop } = event.target;
  //   if (scrollTop + clientHeight + ListPageScrollDifference > scrollHeight) {
  //     dispatch(setIsDisableRequest(false));
  //   }
  //   setIsPageBottom(
  //     scrollTop + clientHeight + ListPageScrollDifference > scrollHeight
  //   );
  // };

  // const scrollListener = useCallback((e: any) => {
  //   handleScroll(e);
  // }, []);

  useEffect(() => {
    // if (eventsListContainer && eventsListContainer.current) {
    //   eventsListContainer.current.addEventListener(
    //     'scroll',
    //     scrollListener,
    //     true
    //   );
    // }
    setScannerName(cookie.getCookie(CookieKeys.scannerLoginUser) || '');
    // const localCheckedEvents = sessionStorage.getItem(
    //   SessionStorageKeys.scannerSelectEvent
    // );
    // if (localCheckedEvents) {
    //   setCheckedList(JSON.parse(localCheckedEvents));
    // }
    return () => {
      dispatch(reset());
    };
  }, []);

  return (
    <>
      {(loading && (
        <EventsScanContainer>
          <div className="page-loading">
            <LoadingOutlined />
          </div>
        </EventsScanContainer>
      )) || (
        <EventsScanContainer ref={eventsListContainer}>
          <div className="page-header">
            <Row>
              <Col span={12} className="logo-img">
                <img src={Images.LogoNameIcon.src} alt="" />
              </Col>
              <Col span={12} className="header-dropdown">
                <div className="content">
                  <Dropdown menu={{ items, onClick }}>
                    <div>
                      {scannerName}
                      <img src={Images.ArrowDown.src} alt="" />
                    </div>
                  </Dropdown>
                </div>
              </Col>
            </Row>
          </div>
          <div className="page-main">
            {(scannerEventList.length && (
              <>
                <Row>
                  <Col className="title">UPCOMING EVENTS</Col>
                </Row>
                <div className="event-list">
                  <EventItem>
                    <CheckboxGroup
                      value={checkedList}
                      options={listOptions}
                      onChange={handleChange}
                    />
                  </EventItem>
                </div>
              </>
            )) || (
              <div className="no-data">
                <img src={Images.NoTicketsIcon.src} alt="" />
                <p>No Upcoming Events</p>
              </div>
            )}
          </div>
          {(scannerEventList.length && (
            <div className="page-bottom">
              <Row className="content">
                <Col span={6}>
                  <Checkbox
                    onChange={onCheckAllChange}
                    checked={
                      listOptions.length === checkedList.length &&
                      listOptions.length !== 0
                    }
                  >
                    <span className="all">ALL</span>
                  </Checkbox>
                </Col>
                <Col span={18}>
                  <Button
                    disabled={!checkedList.length}
                    onClick={startScanCode}
                  >
                    Rock N' Roll
                  </Button>
                </Col>
              </Row>
            </div>
          )) ||
            null}
        </EventsScanContainer>
      )}
    </>
  );
};

EventsScan.getInitialProps = async (ctx: any) => {
  const { req, res } = ctx;
  try {
    const token = req.cookies[CookieKeys.scannerLoginToken];
    if (!token) {
      res.writeHead(302, { Location: RouterKeys.scanLogin });
      res.end();
    }
  } catch (error) {
    return {
      props: {},
    };
  }
  return {
    props: {},
  };
};

export default EventsScan;
