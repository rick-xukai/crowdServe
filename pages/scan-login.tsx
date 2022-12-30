import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import Image from 'next/image';

import { Images } from '../theme';
import { Encrypt, Decrypt } from '../constants/General';
import { LocalStorageKeys, RouterKeys, CookieKeys } from '../constants/Keys';
import { dataEncryption } from '../utils/func';
import users from '../users';
import { LoginContainer } from '../styles/scan-login.style';
import { useCookie } from '../hooks';

const ScanLogin = () => {
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isValidUser, setIsValidUser] = useState<boolean>(true);
  const [passwordShow, setPasswordShow] = useState<boolean>(false);
  const [userNameChanged, setUserNameChanged] = useState<boolean>(false);
  const [passwordChanged, setPasswordChanged] = useState<boolean>(false);

  const cookies = useCookie([CookieKeys.authUser]);

  useEffect(() => {
    if (localStorage.getItem(LocalStorageKeys.rememberMe)) {
      const rememberMeData = JSON.parse(
        dataEncryption(
          localStorage.getItem(LocalStorageKeys.rememberMe),
          Decrypt
        ),
      );
      if (rememberMe) {
        setUserName(rememberMeData.username);
        setPassword(rememberMeData.password);
      }
    }
  }, []);

  const signIn = () => {
    const validUser = users.filter(
      (item) => item.user === userName && item.password === password
    );
    if (validUser.length === 1) {
      const userInfo = dataEncryption(
        JSON.stringify({
          username: userName,
          password: password,
        }),
        Encrypt,
      );
      if (rememberMe) {
        localStorage.setItem(
          LocalStorageKeys.rememberMe,
          userInfo,
        );
      } else {
        localStorage.removeItem(LocalStorageKeys.rememberMe);
      }
      cookies.setCookie(CookieKeys.authUser, userInfo);
      Router.push(RouterKeys.scanQrCode);
    } else {
      setIsValidUser(false);
    }
  };

  return (
    <LoginContainer>
      <div className="login-form">
        <p className="form-title">WELCOME TO CROWDSERVE!</p>
        <div className="form-input">
          <input
            value={userName}
            name="user-name"
            placeholder="User Name"
            onChange={(e) => {
              setUserName(e.target.value);
              setUserNameChanged(true);
            }}
          />
        </div>
        {!userName && userNameChanged && (
          <p className="error-message">Please input your username!</p>
        )}
        <div className="form-input input-password">
          <input
            value={password}
            name="password"
            placeholder="Password"
            type={!passwordShow && 'password' || 'text'}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordChanged(true);
            }}
          />
          <span
            className="password-icon"
            onClick={() => setPasswordShow(!passwordShow)}
          >
            <Image src={(!passwordShow && Images.PasswordHidden) || Images.PasswordShow} alt="" />
          </span>
        </div>
        {!password && passwordChanged && (
          <p className="error-message">Please input your password!</p>
        )}
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
          <button onClick={signIn}>Sign In</button>
        </div>
        {!isValidUser && <p className="error-message-invalid">Username and password are invalid.</p>}
      </div>
    </LoginContainer>
  );
};

export default ScanLogin;
