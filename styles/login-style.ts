import styled from 'styled-components';

import { Colors } from '../theme';

const LoginContainer = styled.div`
  padding: 20px;
  height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  .page-main {
    width: 100%;
    height: 600px;
    .main-title {
      margin-bottom: 38px;
      .logo {
        display: flex;
        justify-content: center;
        div {
          width: 122px;
          height: 62px;
        }
      }
      .title {
        margin-top: 30px;
        font-weight: 700;
        font-size: 28px;
        font-family: 'Oswald';
        color: ${Colors.white};
        text-align: center;
      }
    }
    .ant-input {
      height: 50px;
      border-bottom: 0.7px solid ${Colors.grayScale50};
      padding: 4px 4px;
      border-radius: unset;
      color: ${Colors.white};
      &::placeholder {
        color: ${Colors.grayScale50};
      }
      &.border-white {
        border-bottom: 0.7px solid ${Colors.white};
      }
    }
    .signin-btn {
      margin-top: 65px;
      width: 100%;
      color: ${Colors.grayScale10};
      background: ${Colors.branding};
      border-radius: 2px;
      font-weight: 700;
      font-size: 15px;
      height: 45px;
      border: none;
      &:disabled {
        background: ${Colors.brandingGray};
        color: ${Colors.grayScale30};
      }
    }
    .forgot-password {
      font-weight: 400;
      font-size: 13px;
      color: ${Colors.branding};
      text-align: right;
      margin-top: 12px;
      margin-bottom: 0;
    }
  }
  .page-bottom {
    color: #fff;
    position: absolute;
    bottom: 50px;
    display: flex;
    justify-content: center;
    width: 100%;
    left: 0;
    .registered {
      font-weight: 300;
      font-size: 15px;
      color: ${Colors.grayScale40};
      margin: 0 5px 0 0;
      line-height: 22px;
    }
    .activate {
      font-weight: 400;
      font-size: 13px;
      color: ${Colors.branding};
      margin: 0;
      line-height: 22px;
    }
  }
  .error-message {
    padding: 10px 12px;
    font-weight: 400;
    font-size: 15px;
    color: ${Colors.grayScale20};
    background: ${Colors.grayScale50};
    opacity: 0.9;
    border-radius: 4px;
    position: absolute;
    top: -30px;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 200px;
    height: 40px;
  }
  .ant-message {
    top: 45%;
    font-weight: 400;
    font-size: 15px;
    color: ${Colors.grayScale20};
    .ant-message-notice-content {
      padding: 10px 12px;
      background: ${Colors.grayScale50};
      opacity: 0.9;
      border-radius: 4px;
      box-shadow: unset;
    }
  }
`;

export { LoginContainer };
