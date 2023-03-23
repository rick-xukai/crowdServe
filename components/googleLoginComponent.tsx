import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import Image from 'next/image';
import { useGoogleLogin } from '@react-oauth/google';

import { Colors, Images } from '../theme';

const GoogleLoginContainer = styled.div`
  margin-bottom: 24px;
  .google-login-btn {
    margin-top: 0;
    width: 100%;
    color: ${Colors.grayScale10};
    background: transparent;
    border-radius: 2px;
    font-weight: 700;
    font-size: 15px;
    height: 45px;
    border: 1px solid ${Colors.white};
    position: relative;
    > :first-child {
      position: absolute !important;
      left: 15px;
      top: 14px;
    }
    > :last-child {
      padding-top: 5px;
    }
    &:disabled {
      background: ${Colors.brandingGray};
      color: ${Colors.grayScale30};
    }
    &.ant-btn-default:not(:disabled):active {
      color: ${Colors.grayScale10};
      border-color: ${Colors.white};
    }
    &.ant-btn-default:not(:disabled):hover {
      color: ${Colors.grayScale10};
      border-color: ${Colors.white}; 
    }
  }
`;

const GoogleLoginComponent = ({ buttonText }: { buttonText: string }) => {
  const googleLogin = useGoogleLogin({
    onSuccess: tokenResponse => console.log(tokenResponse),
  });

  return (
    <GoogleLoginContainer>
      <Button
        className="google-login-btn"
        onClick={() => googleLogin()}
      >
        <Image src={Images.GoogleIcon} alt="" />
        {buttonText}
      </Button>
    </GoogleLoginContainer>
  );
};

export default GoogleLoginComponent;
