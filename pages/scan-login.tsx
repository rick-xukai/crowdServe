import React, { useState, useEffect } from 'react';
import { Input, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Router from 'next/router';

import { Encrypt, Decrypt } from '../constants/General';
import { LocalStorageKeys, RouterKeys, CookieKeys } from '../constants/Keys';
import { dataEncryption, isEmail } from '../utils/func';
import users from '../users';
import { LoginContainer } from '../styles/scan-login.style';
import { useCookie } from '../hooks';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  scannerLoginAction,
  selectScannerLoginLoading,
  selectError,
} from '@/slice/user.slice';

const ScanLogin = ({ currentEventId }: { currentEventId: string }) => {
  const dispatch = useAppDispatch();

  const loginLoading = useAppSelector(selectScannerLoginLoading);
  const error = useAppSelector(selectError);

  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isValidUser, setIsValidUser] = useState<boolean>(true);
  const [userNameChanged, setUserNameChanged] = useState<boolean>(false);
  const [passwordChanged, setPasswordChanged] = useState<boolean>(false);

  const cookies = useCookie([CookieKeys.scannerLoginToken]);

  useEffect(() => {
    if (error) {
      message.open({
        content: error.message,
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

  const signIn = async () => {
    const response = await dispatch(
      scannerLoginAction({ email: userEmail, password })
    );
    if (response.type === scannerLoginAction.fulfilled.toString()) {
      const { payload } = response;
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
      cookies.setCookie(CookieKeys.scannerLoginToken, userInfo);
      if (currentEventId) {
        Router.push(RouterKeys.scanQrCode.replace(':eventId', currentEventId));
      } else {
        Router.push(RouterKeys.eventsScan);
      }
    }
    // const validUser = users.filter(
    //   (item) => item.user === userName && item.password === password
    // );
    // if (validUser.length === 1) {
    //   const userInfo = dataEncryption(
    //     JSON.stringify({
    //       username: userName,
    //       password: password,
    //     }),
    //     Encrypt
    //   );
    //   if (rememberMe) {
    //     localStorage.setItem(LocalStorageKeys.rememberMe, userInfo);
    //   } else {
    //     localStorage.removeItem(LocalStorageKeys.rememberMe);
    //   }
    //   cookies.setCookie(CookieKeys.authUser, userInfo);
    //   Router.push(RouterKeys.scanQrCode.replace(':eventId', currentEventId));
    // } else {
    //   setIsValidUser(false);
    // }
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
          <input className="hidden-auto-complete" type="password" />
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
        {!isValidUser && (
          <p className="error-message-invalid">
            Username and password are invalid.
          </p>
        )}
      </div>
    </LoginContainer>
  );
};

ScanLogin.getInitialProps = async (ctx: any) => {
  const { query } = ctx;
  let currentEventId = '';
  try {
    currentEventId = query.eventId;
  } catch (_) {}
  return { currentEventId };
};

export default ScanLogin;
