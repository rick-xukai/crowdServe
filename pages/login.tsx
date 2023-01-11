import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Row, Col, Form, Input, Button } from 'antd';

import { useCookie } from '../hooks';
import { CookieKeys } from '../constants/Keys';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  loginAction,
  LoginPayloadType,
  selectError,
  selectLoading,
  selectData,
  reset,
} from '../slice/login.slice';
import { Images } from '../theme';
import { LoginContainer } from '../styles/login-style';

const Login = () => {
  const dispatch = useAppDispatch();
  const cookies = useCookie([CookieKeys.userLoginToken]);

  const error = useAppSelector(selectError);
  const loading = useAppSelector(selectLoading);
  const data = useAppSelector(selectData);

  const [errorMessageShow, setErrorMessageShow] = useState<boolean>(false);
  const [loginFormValue, setLoginFormValue] = useState<LoginPayloadType>({
    email: '',
    password: '',
  });

  const onFinish = (values: LoginPayloadType) => {
    dispatch(loginAction(values));
  };

  useEffect(() => {
    if (data.token) {
      cookies.setCookie(CookieKeys.userLoginToken, data.token);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      setErrorMessageShow(true);
    }
  }, [error]);

  // eslint-disable-next-line
  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, []);

  return (
    <LoginContainer>
      <div className="page-main">
        <Row className="main-title">
          <Col span={24} className="logo">
            <div><Image src={Images.Logo} alt="" /></div>
          </Col>
          <Col span={24} className="title">
            LOGIN TO YOUR ACCOUNT
          </Col>
        </Row>
        <Form onFinish={onFinish}>
          <Form.Item name="email">
            <Input
              className={`${(loginFormValue.email && 'border-white') || ''}`}
              placeholder="Email"
              bordered={false}
              onFocus={() => setErrorMessageShow(false)}
              onChange={(e) =>
                setLoginFormValue({
                  ...loginFormValue,
                  email: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item name="password">
            <div>
              <Input.Password
                className={`${(loginFormValue.password && 'border-white') || ''}`}
                placeholder="Password"
                bordered={false}
                visibilityToggle={false}
                onFocus={() => setErrorMessageShow(false)}
                onChange={(e) =>
                  setLoginFormValue({
                    ...loginFormValue,
                    password: e.target.value,
                  })
                }
              />
              <p className="forgot-password">
                FORGOT PASSWORD?
              </p>
            </div>
          </Form.Item>
          <Form.Item>
            <Button
              className="signin-btn"
              disabled={
                !loginFormValue.email ||
                !loginFormValue.password ||
                loading
              }
              type="primary"
              htmlType="submit"
            >
              SIGN IN
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="page-bottom">
        <p className="registered">
          Haven't registered?
        </p>
        <p className="activate">
          ACTIVATE ACCOUNT
        </p>
      </div>
      {errorMessageShow && (
        <div className="error-message">
          Wrong email or password.
        </div>
      )}
    </LoginContainer>
  );
};

export default Login;
