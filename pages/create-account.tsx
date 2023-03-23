import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Row, Col, Form, Input, Button, message, Checkbox } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import Image from 'next/image';

import { useCookie } from '../hooks';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { isEmail, isPassword, getErrorMessage, base64Encrypt, isUserName } from '../utils/func';
import { TermsConditionsLink, PrivacyPolicyLink, TokenExpire } from '../constants/General';
import { Images } from '../theme';
import { RouterKeys, CookieKeys } from '../constants/Keys';
import { LoginContainer } from '../styles/login-style';
import {
  reset,
  selectData,
  selectError,
  selectLoading,
  verifyUserAction,
  registerAccountAction,
  RegisterAccountPayload,
  verificationCodeAction,
} from '../slice/user.slice';
import GoogleDocComponent from '../components/googleDocComponent';
import OpenAppComponent from '../components/openAppComponent';
// import GoogleLoginComponent from '../components/googleLoginComponent';
import Messages from '../constants/Messages';

const CreateAccount = () => {
  const cookies = useCookie([CookieKeys.userLoginToken, CookieKeys.userLoginEmail]);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const data = useAppSelector(selectData);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);

  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [isOpenAppShow, setIsOpenAppShow] = useState<boolean>(true);
  const [checked, setChecked] = useState<boolean>(false);
  const [isTextShak, setTextShak] = useState<boolean>(false);
  const [checkGoogleDoc, setCheckGoogleDoc] = useState<boolean>(false);
  const [googleDocLink, setgoogleDocLink] = useState<string>('');
  const [isVerificationEmail, setIsVerificationEmail] = useState<boolean>(false);
  const [isVerificationCode, setIsVerificationCode] = useState<boolean>(false);
  const [createAccountValue, setCreateAccountValue] = useState<RegisterAccountPayload>({
    email: '',
    username: '',
    code: '',
    password: '',
  });

  const onFinish = async (values: any) => {
    if (!isVerificationEmail) {
      if (checked) {
        const result = await dispatch(verifyUserAction({ email: createAccountValue.email }));
        if (result.type === verifyUserAction.fulfilled.toString()) {
          router.push(`${RouterKeys.activateAccountNormalFlow}?${base64Encrypt({ email: createAccountValue.email })}`);
        }
      } else {
        setTextShak(true);
      }
      return;
    }
    if (!isVerificationCode) {
      const result = await dispatch(verificationCodeAction({
        ...values,
        email: createAccountValue.email,
        type: 1,
      }));
      if (result.type === verificationCodeAction.fulfilled.toString()) {
        setIsVerificationCode(true);
      }
      return;
    }
    if (isVerificationEmail && isVerificationCode) {
      dispatch(registerAccountAction({
        ...values,
        code: createAccountValue.code,
        email: createAccountValue.email,
        username: createAccountValue.username,
      }));
    }
  };

  const checkGoogleDocAction = (link: string) => {
    setCheckGoogleDoc(true);
    setgoogleDocLink(link);
  };

  useEffect(() => {
    if (data.token) {
      const currentDate = new Date();
      cookies.setCookie(CookieKeys.userLoginToken, data.token, {
        expires: new Date(currentDate.getTime() + TokenExpire),
        path: '/',
        domain: window.location.hostname,
      });
      cookies.setCookie(CookieKeys.userLoginEmail, createAccountValue.email, {
        expires: new Date(currentDate.getTime() + TokenExpire),
        path: '/',
        domain: window.location.hostname,
      });
      router.push(RouterKeys.ticketsList);
    }
  }, [data]);

  useEffect(() => {
    if (!isFirstRender && error) {
      if (error.code === Messages.continueToRegister.code) {
        setIsVerificationEmail(true);
      } else {
        messageApi.open({
          content:
            error.code === Messages.activateAccountUserAlreadyExist.code &&
              'This email address is already registered. Please log in or use a different email address.' ||
              getErrorMessage(error.code),
          className: 'error-message-login',
        });
      }
    }
  }, [error]);

  // eslint-disable-next-line
  useEffect(() => {
    setIsFirstRender(false);
    return () => {
      dispatch(reset());
    };
  }, []);

  return (
    <LoginContainer>
      <div className="skip-login" onClick={() => router.push(RouterKeys.eventList)}>
        <span>Skip</span>
      </div>
      {!checkGoogleDoc && (
        <div className="page-main">
          <Row className="main-logo">
            <Col span={24} className="logo">
              <div><Image src={Images.Logo} alt="" /></div>
            </Col>
          </Row>
          <div>
            <Row className="main-title">
              <Col span={24} className="title">
                CREATE AN ACCOUNT
              </Col>
            </Row>
            {!isVerificationEmail && (
              <Form onFinish={onFinish}>
                <Form.Item name="email" style={{ marginBottom: 0 }}>
                  <Input
                    className={`${(createAccountValue.email && 'border-white') || ''}`}
                    placeholder="Email"
                    bordered={false}
                    onChange={(e) =>
                      setCreateAccountValue({
                        ...createAccountValue,
                        email: isEmail(e.target.value) && e.target.value || '',
                      })
                    }
                  />
                </Form.Item>
                <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                  <Input
                    className={`${(createAccountValue.username && 'border-white') || ''}`}
                    placeholder="User name (at least 3 chars)"
                    value={createAccountValue.username}
                    maxLength={20}
                    bordered={false}
                    onChange={(e) =>
                      setCreateAccountValue({
                        ...createAccountValue,
                        username: e.target.value.replace(/[^a-zA-Z0-9\s]/g, ''),
                      })
                    }
                  />
                </Form.Item>
                <Form.Item style={{ marginBottom: 0, marginTop: 30 }} className={isTextShak && 'text-shak' || ''}>
                  <div className="agreement-wrapper">
                    <Checkbox
                      className={`${!checked && 'checkbox-show-error' || ''}`}
                      checked={checked}
                      onChange={(e) => setChecked(e.target.checked)}
                    />
                    <div style={{ marginLeft: 8 }}>
                      <span className="agreement-label">
                        I agree to CrowdServe <span className="agreement-label-action" onClick={() => checkGoogleDocAction(TermsConditionsLink)}>Terms&Conditions</span>
                        and <span className="agreement-label-action"onClick={() => checkGoogleDocAction(PrivacyPolicyLink)}>Privacy Policy.</span>
                      </span>
                    </div>
                  </div>
                </Form.Item>
                <Form.Item>
                  <Button
                    style={{ marginTop: 24 }}
                    className="signin-btn"
                    disabled={
                      !createAccountValue.email ||
                      loading ||
                      !isUserName(createAccountValue.username) ||
                      createAccountValue.username.length < 3
                    }
                    type="primary"
                    htmlType="submit"
                    onClick={() => setTextShak(false)}
                  >
                    CONTINUE
                  </Button>
                </Form.Item>
                {/* <Divider>OR</Divider>
                <GoogleLoginComponent buttonText="CONTINUE WITH GOOGLE" /> */}
              </Form>
            )}
            {!isVerificationCode && isVerificationEmail && (
              <>
                <Row className="code-sent">
                  <Col span={24} className="title">
                    Verification code has been sent to
                  </Col>
                  <Col span={24} className="value">
                    {createAccountValue.email}
                  </Col>
                </Row>
                <Form onFinish={onFinish}>
                  <Form.Item name="code" style={{ marginBottom: 0 }}>
                    <Input
                      className={`${(createAccountValue.code && 'border-white') || ''}`}
                      placeholder="Enter verification code"
                      bordered={false}
                      onChange={(e) =>
                        setCreateAccountValue({
                          ...createAccountValue,
                          code: e.target.value,
                        })
                      }
                    />
                  </Form.Item>
                  <Form.Item style={{ marginBottom: 25 }}>
                    <Button
                      className="signin-btn"
                      disabled={!createAccountValue.code || loading}
                      type="primary"
                      htmlType="submit"
                    >
                      NEXT
                    </Button>
                  </Form.Item>
                </Form>
              </>
            )}
            {isVerificationCode && isVerificationEmail && (
              <Form onFinish={onFinish}>
                <Form.Item name="password" style={{ marginBottom: 0 }}>
                  <Input.Password
                    className={`${(createAccountValue.password && 'border-white') || ''}`}
                    placeholder="Set your password (at least 8 characters)"
                    bordered={false}
                    maxLength={20}
                    iconRender={(visible) =>
                      (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)
                    }
                    onChange={(e) =>
                      setCreateAccountValue({
                        ...createAccountValue,
                        password: isPassword(e.target.value) && e.target.value || '',
                      })
                    }
                  />
                </Form.Item>
                <Form.Item style={{ marginBottom: 25 }}>
                  <Button
                    className="signin-btn"
                    disabled={!createAccountValue.password || loading}
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
      ) || (
        <GoogleDocComponent
          docLink={googleDocLink}
          checkGoogleDoc={setCheckGoogleDoc}
        />
      )}
      <OpenAppComponent setIsOpenAppShow={setIsOpenAppShow} />
      {contextHolder}
    </LoginContainer>
  );
};

export default CreateAccount;
