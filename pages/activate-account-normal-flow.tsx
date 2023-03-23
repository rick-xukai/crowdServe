import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Input, Button, message } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { useCookie } from '../hooks';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { isPassword, getErrorMessage, base64Decrypt } from '../utils/func';
import { TokenExpire } from '../constants/General';
import { RouterKeys, CookieKeys } from '../constants/Keys';
import { Images } from '../theme';
import { LoginContainer } from '../styles/login-style';
import OpenAppComponent from '../components/openAppComponent';
import {
  selectData,
  loginAction,
  verificationCodeAction,
  selectError,
  selectLoading,
  reset,
} from '../slice/user.slice';

const ActivateAccountNormalFlow = ({ accountEmail }: { accountEmail: string }) => {
  const cookies = useCookie([CookieKeys.userLoginToken, CookieKeys.userLoginEmail]);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const data = useAppSelector(selectData);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);

  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [isOpenAppShow, setIsOpenAppShow] = useState<boolean>(true);
  const [verificationCodeSuccess, setVerificationCodeSuccess] = useState<boolean>(false);
  const [activateAccountValue, setActivateAccountValue] = useState({
    email: accountEmail,
    code: '',
    password: '',
  });

  const onFinish = async (values: any) => {
    if (!verificationCodeSuccess) {
      const result = await dispatch(
        verificationCodeAction({
          ...values,
          email: activateAccountValue.email,
          type: 1,
        }),
      );
      if (result.type === verificationCodeAction.fulfilled.toString()) {
        setVerificationCodeSuccess(true);
      }
      return;
    }
    if (verificationCodeSuccess) {
      dispatch(loginAction({
        ...activateAccountValue,
        password: activateAccountValue.password,
      }));
    }
  };

  useEffect(() => {
    if (data.token) {
      const currentDate = new Date();
      cookies.setCookie(CookieKeys.userLoginToken, data.token, {
        expires: new Date(currentDate.getTime() + TokenExpire),
        path: '/',
      });
      cookies.setCookie(CookieKeys.userLoginEmail, activateAccountValue.email, {
        expires: new Date(currentDate.getTime() + TokenExpire),
        path: '/',
      });
      router.push(RouterKeys.ticketsList);
    }
  }, [data]);

  useEffect(() => {
    if (error && !isFirstRender) {
      messageApi.open({
        content: getErrorMessage(error.code),
        className: 'error-message-login',
      });
    }
  }, [error]);

  useEffect(() => {
    setIsFirstRender(false);
    messageApi.open({
      content: 'Your account has not been activated yet. Please activate your account to continue.',
      className: 'error-message-login',
    });
    return () => {
      dispatch(reset());
    };
  }, []);

  return (
    <LoginContainer>
      <div className="skip-login" onClick={() => router.push(RouterKeys.eventList)}>
        <span>Skip</span>
      </div>
      <div className="page-main">
        <Row className="main-logo">
          <Col span={24} className="logo">
            <div><Image src={Images.Logo} alt="" /></div>
          </Col>
        </Row>
        <div>
          <Row className="main-title">
            <Col span={24} className="title">
              ACTIVATE YOUR ACCOUNT
            </Col>
          </Row>
          {!verificationCodeSuccess && (
            <>
              <Row className="code-sent">
                <Col span={24} className="title">
                  Verification code has been sent to
                </Col>
                <Col span={24} className="value">
                  {activateAccountValue.email}
                </Col>
              </Row>
              <Form onFinish={onFinish}>
                <Form.Item name="code" style={{ marginBottom: 0 }}>
                  <Input
                    className={`${(activateAccountValue.code && 'border-white') || ''}`}
                    placeholder="Enter verification code"
                    bordered={false}
                    onChange={(e) =>
                      setActivateAccountValue({
                        ...activateAccountValue,
                        code: e.target.value,
                      })
                    }
                   />
                </Form.Item>
                <Form.Item style={{ marginBottom: 25 }}>
                  <Button
                    className="signin-btn"
                    disabled={!activateAccountValue.code || loading}
                    type="primary"
                    htmlType="submit"
                  >
                    NEXT
                  </Button>
                </Form.Item>
              </Form>
            </>
          )}
          {verificationCodeSuccess && (
            <Form onFinish={onFinish}>
              <Form.Item name="password" style={{ marginBottom: 0 }}>
                <Input.Password
                  className={`${(activateAccountValue.password && 'border-white') || ''}`}
                  placeholder="Set your password (at least 8 characters)"
                  bordered={false}
                  maxLength={20}
                  iconRender={(visible) =>
                    (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)
                  }
                  onChange={(e) =>
                    setActivateAccountValue({
                      ...activateAccountValue,
                      password: isPassword(e.target.value) && e.target.value || '',
                    })
                  }
                />
              </Form.Item>
              <Form.Item style={{ marginBottom: 25 }}>
                <Button
                  className="signin-btn"
                  disabled={!activateAccountValue.password || loading}
                  type="primary"
                  htmlType="submit"
                >
                  DONE
                </Button>
              </Form.Item>
            </Form>
          )}
        </div>
        <div className={isOpenAppShow && 'page-bottom open-app' || 'page-bottom'}>
          <p className="registered">
            Already have an account?
          </p>
          <p
            className="activate"
            onClick={() => router.push(RouterKeys.login)}
          >
            LOGIN
          </p>
        </div>
      </div>
      <OpenAppComponent setIsOpenAppShow={setIsOpenAppShow} />
      {contextHolder}
    </LoginContainer>
  );
};

ActivateAccountNormalFlow.getInitialProps = async (ctx: any) => {
  const { query } = ctx;
  let accountEmail = '';
  try {
    const parameters = base64Decrypt(Object.keys(query)[0]);
    accountEmail = parameters.email;
  } catch (_) {}
  return { accountEmail };
};

export default ActivateAccountNormalFlow;
