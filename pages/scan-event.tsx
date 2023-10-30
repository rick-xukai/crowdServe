import React, { useState, useEffect, useRef } from 'react';
import type { MenuProps } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { Row, Col, Dropdown, Checkbox, Button, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import _ from 'lodash';

import { base64Encrypt } from '@/utils/func';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { Images } from '@/theme';
import { useCookie } from '@/hooks';
import { CookieKeys, RouterKeys } from '@/constants/Keys';
import { EventsScanContainer, EventItem } from '@/styles/eventsScan.style';
import {
  resetScannerLoginResponse,
  reset as userSliceReset,
} from '@/slice/user.slice';
import {
  reset,
  getScannerEventListAction,
  selectScannerEventList,
  selectError,
  selectLoading,
} from '@/slice/scanner.slice';
import {
  setPage,
  selectPage,
  selectSize,
  selectIsDisableRequest,
  setIsDisableRequest,
  selectScannerEventListForAll,
  setIsGetAllData,
  selectIsGetAllData,
  setScannerEventListForAll,
} from '@/slice/scannerCache.slice';
import Messages from '@/constants/Messages';
import { DefaultPageSize } from '@/constants/General';

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
  const isDisableRequest = useAppSelector(selectIsDisableRequest);
  const scannerEventListForAll = useAppSelector(selectScannerEventListForAll);
  const isGetAllData = useAppSelector(selectIsGetAllData);

  const [listOptions, setListOptions] = useState<any[]>([]);
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);
  const [scannerName, setScannerName] = useState<string>('');
  const [isPageBottom, setIsPageBottom] = useState<boolean>(false);

  const items: MenuProps['items'] = [
    {
      label: 'Logout',
      key: 'logout',
    },
  ];

  const handleChange = (list: CheckboxValueType[]) => {
    setCheckedList(list);
  };

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
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

  const handleScroll = () => {
    const { scrollHeight, clientHeight, scrollTop } =
      eventsListContainer.current;
    setIsPageBottom(scrollHeight - clientHeight <= scrollTop + 1);
    if (scrollHeight - clientHeight <= scrollTop + 1) {
      dispatch(setIsDisableRequest(false));
    }
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
      scannerEventListForAll.map((item) => ({
        label: (
          <Col>
            <div className="event-name">{item.name}</div>
            <div className="event-date">{item.time}</div>
          </Col>
        ),
        value: item.uuid,
      }))
    );
  }, [scannerEventListForAll]);

  useEffect(() => {
    if (scannerEventList) {
      dispatch(
        setScannerEventListForAll(
          _.uniqWith(
            [...scannerEventListForAll, ...scannerEventList],
            _.isEqual
          )
        )
      );
    }
  }, [scannerEventList]);

  useEffect(() => {
    if (isDisableRequest || isGetAllData) {
      return;
    }
    dispatch(
      getScannerEventListAction({
        page,
        size,
      })
    ).then((response: any) => {
      if (response.type === getScannerEventListAction.fulfilled.toString()) {
        if (
          !response.payload.length ||
          response.payload.length < DefaultPageSize
        ) {
          dispatch(setIsGetAllData(true));
          dispatch(setIsDisableRequest(true));
        }
      }
    });
  }, [page]);

  useEffect(() => {
    if (isPageBottom && !loading) {
      dispatch(setPage(page + 1));
    }
  }, [isPageBottom]);

  useEffect(() => {
    setScannerName(cookie.getCookie(CookieKeys.scannerLoginUser) || '');
    return () => {
      dispatch(reset());
    };
  }, []);

  return (
    <>
      {(loading && !scannerEventListForAll.length && (
        <EventsScanContainer>
          <div className="page-loading">
            <LoadingOutlined />
          </div>
        </EventsScanContainer>
      )) || (
        <EventsScanContainer ref={eventsListContainer} onScroll={handleScroll}>
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
            {(scannerEventListForAll.length && (
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
                {loading && (
                  <div className="load-more-loading">
                    <LoadingOutlined />
                    <span className="loading-text">loading...</span>
                  </div>
                )}
              </>
            )) || (
              <div className="no-data">
                <img src={Images.NoTicketsIcon.src} alt="" />
                <p>No Upcoming Events</p>
              </div>
            )}
          </div>
          {(scannerEventListForAll.length && (
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
