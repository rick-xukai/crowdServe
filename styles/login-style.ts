import styled from 'styled-components';

import { Colors } from '../theme';

const LoginContainer = styled.div`
  padding: 20px;
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
  .skip-login {
    position: absolute;
    color: ${Colors.white};
    top: 20px;
    right: 20px;
    font-weight: 400;
    font-size: 15px;
  }
  .page-main {
    width: 100%;
    position: relative;
    .main-logo {
      .logo {
        display: flex;
        justify-content: center;
        div {
          width: 122px;
          height: 62px;
        }
      }
    }
    .main-title {
      margin-bottom: 38px;
      .title {
        margin-top: 30px;
        font-weight: 700;
        font-size: 28px;
        font-family: 'Oswald';
        color: ${Colors.white};
        text-align: center;
      }
    }
    .ant-input-affix-wrapper {
      width: 100%;
      display: inline-flex;
      border-bottom: 0.7px solid ${Colors.grayScale50};
      border-radius: 0;
      padding: 0;
      .ant-input-suffix {
        display: flex;
        align-items: center;
      }
      &.border-white {
        border-bottom: 0.7px solid ${Colors.white};
        .anticon {
          color: ${Colors.white};
        }
      }
      .ant-input {
        border: none;
        color: ${Colors.white};
      }
      .anticon {
        font-size: 18px;
        color: ${Colors.grayScale50};
      }
    }
    input:-internal-autofill-previewed,
    input:-internal-autofill-selected {
      -webkit-text-fill-color: ${Colors.white} !important;
      transition: background-color 5000s ease-in-out 0s !important;
    }
    .ant-input {
      width: 100%;
      height: 50px;
      border: none;
      border-bottom: 0.7px solid ${Colors.grayScale50};
      padding: 4px 4px;
      border-radius: unset;
      background: transparent; 
      &.ant-input-status-success {
        color: ${Colors.white};
      }
      &::placeholder {
        color: ${Colors.grayScale50};
      }
      &.border-white {
        border-bottom: 0.7px solid ${Colors.white};
      }
    }
    .signin-btn {
      margin-top: 45px;
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
    display: flex;
    justify-content: center;
    width: 100%;
    left: 0;
    &.open-app {
      padding-bottom: 120px;
    }
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
  .agreement-wrapper {
    display: flex;
    .change-text {
      margin-left: 5px;
      .agreement-label {
        font-size: 12px;
      }
    }
    .change-text-checkbox {
      .ant-checkbox-inner {
        width: 15px;
        height: 15px;
      }
    }
    .checkbox-show-error {
      .ant-checkbox-inner {
        border: 1px solid ${Colors.branding};
      }
    }
  }
  .agreement-label {
    font-weight: 400;
    font-size: 13px;
    color: ${Colors.grayScale40};
    .agreement-label-action {
      margin-left: 3px;
      margin-right: 3px;
      color: ${Colors.white};
    }
  }
  .ant-checkbox-wrapper {
    height: 18px;
    .ant-checkbox {
      top: 0.1em;
      width: 18px;
      height: 18px;
    }
    .ant-checkbox-inner {
      background: transparent;
      border-radius: 2px;
      width: 18px;
      height: 18px;
      border: 1px solid ${Colors.grayScale10};
    }
    .ant-checkbox-input {
      display: none;
    }
  }
  .ant-checkbox-checked:after {
    border: 1px solid ${Colors.branding};
  }
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: ${Colors.branding};
    border-color: ${Colors.branding};
  }
  .ant-checkbox-wrapper:not(.ant-checkbox-wrapper-disabled):hover .ant-checkbox-checked:not(.ant-checkbox-disabled) .ant-checkbox-inner {
    background-color: ${Colors.branding};
  }
  .ant-checkbox-wrapper:not(.ant-checkbox-wrapper-disabled):hover .ant-checkbox-checked:not(.ant-checkbox-disabled):after {
    border-color: ${Colors.branding} !important;
    border-radius: 2px;
  }
  .code-sent {
    margin-bottom: 40px;
    .title {
      font-weight: 300;
      font-size: 17px;
      color: ${Colors.grayScale20};
    }
    .value {
      font-weight: 500;
      font-size: 17px;
      color: ${Colors.grayScale20};
    }
  }
`;

export { LoginContainer };
