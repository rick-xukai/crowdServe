import React, { useState, useEffect } from 'react';
import { Input, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Router from 'next/router';

import { Encrypt, Decrypt, TokenExpire } from '../constants/General';
import { LocalStorageKeys, RouterKeys, CookieKeys } from '../constants/Keys';
import { dataEncryption, isEmail } from '../utils/func';
import { LoginContainer } from '../styles/scan-login.style';
import { useCookie } from '../hooks';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  scannerLoginAction,
  selectScannerLoginLoading,
  selectError,
  selectScannerLoginResponse,
} from '@/slice/user.slice';
import Messages from '@/constants/Messages';
import { reset as resetScannerCache } from '@/slice/scannerCache.slice';

const ScanLogin = ({ currentEventId }: { currentEventId: string }) => {
  const dispatch = useAppDispatch();

  const loginLoading = useAppSelector(selectScannerLoginLoading);
  const error = useAppSelector(selectError);
  const data = useAppSelector(selectScannerLoginResponse);

  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const cookies = useCookie([CookieKeys.scannerLoginToken]);

  useEffect(() => {
    if (error) {
      let errorMessage = error.message;
      if (error.code === Messages.notFound.code) {
        errorMessage = 'There is no account associated with the email.';
      }
      if (error.code === Messages.invalidPassword.code) {
        errorMessage = Messages.invalidPassword.text;
      }
      message.open({
        content: errorMessage,
        className: 'error-message-event',
      });
    }
  }, [error]);

  useEffect(() => {
    if (localStorage.getItem(LocalStorageKeys.scannerLoginRememberMe)) {
      const rememberMeData = JSON.parse(
        dataEncryption(
          localStorage.getItem(LocalStorageKeys.scannerLoginRememberMe),
          Decrypt
        )
      );
      if (rememberMe) {
        setUserEmail(rememberMeData.userEmail);
        setPassword(rememberMeData.password);
      }
    }
  }, []);

  useEffect(() => {
    if (data.token) {
      const currentDate = new Date();
      const userInfo = dataEncryption(
        JSON.stringify({
          userEmail: userEmail,
          password: password,
        }),
        Encrypt
      );
      if (rememberMe) {
        localStorage.setItem(LocalStorageKeys.scannerLoginRememberMe, userInfo);
      } else {
        localStorage.removeItem(LocalStorageKeys.scannerLoginRememberMe);
      }
      cookies.setCookie(CookieKeys.scannerLoginToken, data.token, {
        expires: new Date(currentDate.getTime() + TokenExpire),
        path: '/',
        domain: window.location.hostname,
      });
      cookies.setCookie(CookieKeys.scannerLoginUser, data.user.name, {
        expires: new Date(currentDate.getTime() + TokenExpire),
        path: '/',
        domain: window.location.hostname,
      });
      dispatch(resetScannerCache());
      if (currentEventId) {
        Router.push(RouterKeys.scanQrCode.replace(':eventId', currentEventId));
      } else {
        Router.push(RouterKeys.eventsScan);
      }
    }
  }, [data]);

  const signIn = () => {
    dispatch(scannerLoginAction({ email: userEmail, password }));
  };

  return (
    <LoginContainer>
      <div className="login-form">
        <p className="form-title">WELCOME TO CROWDSERVE!</p>
        <div className="form-input">
          <Input
            value={userEmail}
            name="user-name"
            placeholder="User Name"
            onChange={(e) => setUserEmail(e.target.value)}
          />
        </div>
        <div className="form-input input-password">
          <Input.Password
            value={password}
            name="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-checkbox">
          <input
            name="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <span>Remember me</span>
        </div>
        <div>
          <button
            disabled={!isEmail(userEmail) || !password || loginLoading}
            onClick={signIn}
          >
            Sign In
            {loginLoading && <LoadingOutlined />}
          </button>
        </div>
      </div>
    </LoginContainer>
  );
};

ScanLogin.getInitialProps = async (ctx: any) => {
  const { query, req, res } = ctx;
  let currentEventId = '';

  try {
    const token = req.cookies[CookieKeys.scannerLoginToken];
    if (token) {
      res.writeHead(302, { Location: RouterKeys.eventsScan });
      res.end();
    }
    currentEventId = query.eventId;
  } catch (_) {}
  return { currentEventId };
};

export default ScanLogin;
