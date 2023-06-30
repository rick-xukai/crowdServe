import styled from 'styled-components';

import { Colors } from '../theme';

const LoginContainer = styled.div`
  padding: 20px;
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
  max-width: 400px;
  margin: auto;
  .page-loading {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    font-size: 30px;
    color: ${Colors.branding};
    .anticon {
      margin: auto;
    }
  }
  .skip-login {
    position: absolute;
    color: ${Colors.white};
    top: 20px;
    right: 20px;
    font-weight: 400;
    font-size: 15px;
    z-index: 1;
    cursor: pointer;
  }
  .page-main {
    width: 100%;
    position: relative;
    max-width: 375px;
    margin: auto;
    .ant-select-selection-item,
    .ant-select-selection-placeholder {
      padding-top: 8px;
    }
    .main-logo {
      .logo {
        display: flex;
        justify-content: center;
        div {
          width: 62px;
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
        padding-top: 15px;
      }
      &.border-white {
        border-bottom: 1px solid ${Colors.white};
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
      border-radius: unset;
      background: transparent;
      color: ${Colors.white};
      padding: 0;
      padding-top: 15px;
      &.ant-input-status-success {
        color: ${Colors.white};
      }
      &::placeholder {
        color: ${Colors.grayScale50};
      }
      &.border-white {
        border-bottom: 1px solid ${Colors.white};
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
    .tips {
      font-weight: 400;
      font-size: 13px;
      color: ${Colors.grayScale50};
      &.signup-email {
        margin-top: 5px;
        font-weight: 400;
        font-size: 17px;
        color: ${Colors.white};
        margin-bottom: 15px;
      }
    }
    .user-email {
      font-size: 17px;
      color: ${Colors.white};
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
      @media (min-width: 1024px) {
        cursor: pointer;
      }
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
  .ant-checkbox-wrapper:not(.ant-checkbox-wrapper-disabled):hover
    .ant-checkbox-checked:not(.ant-checkbox-disabled)
    .ant-checkbox-inner {
    background-color: ${Colors.branding};
  }
  .ant-checkbox-wrapper:not(.ant-checkbox-wrapper-disabled):hover
    .ant-checkbox-checked:not(.ant-checkbox-disabled):after {
    border-color: ${Colors.branding} !important;
    border-radius: 2px;
  }
  .code-sent {
    margin-bottom: 30px;
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
  .ant-divider-horizontal.ant-divider-with-text {
    margin: 24px 0;
  }
  .ant-divider-inner-text {
    font-weight: 400;
    font-size: 15px;
    color: ${Colors.grayScale20};
    padding-top: 3px;
  }
  .ant-divider-horizontal.ant-divider-with-text::before,
  .ant-divider-horizontal.ant-divider-with-text::after {
    background: ${Colors.grayScale50};
  }
  .ant-select:not(.ant-select-disabled):not(.ant-select-customize-input):not(.ant-pagination-size-changer):hover
    .ant-select-selector {
    border-color: ${Colors.grayScale50};
  }
  .ant-select:not(.ant-select-customize-input) .ant-select-selector input {
    cursor: default;
  }
  .ant-select-focused.ant-select:not(.ant-select-disabled):not(.ant-select-customize-input):not(.ant-pagination-size-changer)
    .ant-select-selector {
    box-shadow: none;
  }
  .ant-select-focused {
    border: none;
  }
  .ant-select-focused.ant-select:not(.ant-select-disabled):not(.ant-select-customize-input):not(.ant-pagination-size-changer)
    .ant-select-selector {
    border-color: ${Colors.grayScale50};
  }
  .ant-select-single .ant-select-selector .ant-select-selection-item {
    line-height: 50px;
    color: ${Colors.white};
  }
  .ant-picker-focused {
    box-shadow: none;
  }
  .ant-picker .ant-picker-input > input:focus {
    border-color: ${Colors.grayScale50};
  }
  .ant-picker {
    height: 50px;
    width: 100%;
    background: ${Colors.backgorund};
    border: none;
    border-bottom: 0.7px solid ${Colors.grayScale50};
    border-radius: 0;
    padding: 0;
    padding-top: 15px;
    &.border-white {
      border-bottom: 1px solid ${Colors.white};
      .ant-picker-suffix {
        color: ${Colors.white};
      }
    }
    .ant-picker-input {
      input {
        color: ${Colors.white};
        background: ${Colors.backgorund};
        &::placeholder {
          color: ${Colors.grayScale50};
        }
      }
    }
    .ant-picker-suffix {
      color: ${Colors.grayScale50};
    }
  }
  .gender-select {
    cursor: default;
    &.border-white {
      .ant-select-selector {
        border-bottom: 1px solid ${Colors.white};
      }
      .ant-select-arrow {
        color: ${Colors.white};
      }
    }
    .ant-select-selector {
      height: 50px;
      background: transparent;
      border: none;
      border-bottom: 0.7px solid ${Colors.grayScale50};
      padding: 0;
      border-radius: 0;
      .ant-select-selection-search {
        width: 100%;
        inset-inline-start: unset;
        inset-inline-end: unset;
      }
      .ant-select-selection-search-input {
        height: 50px;
      }
    }
    .ant-select-arrow {
      font-size: 20px;
      inset-inline-end: -2px;
      color: ${Colors.grayScale50};
      padding-top: 15px;
    }
    .ant-select-selection-placeholder {
      line-height: 50px;
      color: ${Colors.grayScale50};
      font-weight: 300;
      font-size: 14px;
    }
  }
  @media (min-width: 1024px) {
    .forgot-password {
      cursor: pointer;
    }
  }
`;

export { LoginContainer };
