import styled from 'styled-components';

import { Colors, Images } from '../theme';

const LoginContainer = styled.div`
  padding: 20px;
  height: 100%;
  position: relative;
  /* background-image: url(${Images.AnimatedBackground.src});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover; */
  .ant-form-item-explain-error {
    font-size: 12px;
    margin-bottom: 10px;
    margin-top: 5px;
  }
  .ant-input:focus {
    box-shadow: unset;
  }
  .page-background {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    object-fit: cover;
  }
  &.country-items-index {
    .page-main {
      z-index: 100;
    }
  }
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
  .phone-code-drawer {
    .ant-drawer-content-wrapper {
      box-shadow: unset;
    }
    .ant-drawer-content {
      background: ${Colors.backgorund};
    }
    .ant-drawer-header {
      display: none;
    }
    .ant-drawer-body {
      padding: 15px !important;
      ::-webkit-scrollbar {
        display: none;
      }
    }
    .ant-input {
      height: 40px;
      background: transparent;
      border: none;
      border-bottom: 1px solid ${Colors.grayScale90};
      border-radius: 0;
      color: ${Colors.white};
      font-size: 17px;
      font-weight: 300;
      padding: 0;
      &::placeholder {
        color: ${Colors.grayScale50};
        font-size: 15px;
      }
    }
    .ant-input:focus {
      box-shadow: unset;
    }
    .code-items {
      margin-top: 16px;
      > :first-child {
        color: ${Colors.white};
        font-size: 15px;
        font-weight: 400;
        line-height: 21px;
        margin-right: 10px;
      }
      > :last-child {
        color: ${Colors.grayScale40};
        font-size: 15px;
        font-weight: 400;
        line-height: 21px;
      }
    }
  }
  .page-main {
    width: 100%;
    height: calc(100% - 86px);
    position: relative;
    display: flex;
    align-items: center;
    overflow: auto;
    padding-bottom: 20px;
    .ant-select-selection-item,
    .ant-select-selection-placeholder {
      padding-top: 8px;
      color: ${Colors.grayScale40};
      font-weight: 400;
      font-size: 14px;
    }
    .main-form-content {
      width: 680px;
      margin: auto;
      border-radius: 4px;
      border: 1px solid ${Colors.backgorund};
      background: rgba(39, 39, 42, 0.3);
      backdrop-filter: blur(10px);
      padding: 80px 100px;
      .only-read-item {
        line-height: 19px;
        .ant-form-item-label {
          padding: 0;
          > label {
            height: auto;
            font-size: 13px;
            color: ${Colors.grayScale50};
            line-height: 19px;
            height: auto;
          }
        }
        .ant-form-item-control-input-content > input {
          height: 24px;
          padding: 1px;
          background: transparent;
          border: none;
          color: red;
          font-size: 17px;
          color: ${Colors.white};
        }
      }
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
      margin-bottom: 40px;
      .title {
        color: ${Colors.white};
        text-align: center;
        font-family: Baradig;
        font-size: 28px;
        font-weight: 700;
        text-transform: uppercase;
      }
    }
    .ant-input-affix-wrapper {
      width: 100%;
      display: inline-flex;
      border-radius: 0;
      padding: 0;
      .ant-input-suffix {
        display: flex;
        align-items: center;
        background: ${Colors.white};
        border-top: 1px solid ${Colors.grayScale70};
        border-bottom: 1px solid ${Colors.grayScale70};
        width: 1;
        margin-left: -1px;
        padding-right: 12px;
      }
      .anticon {
        font-size: 18px;
        color: ${Colors.grayScale40};
      }
    }
    input:-internal-autofill-previewed,
    input:-internal-autofill-selected {
      -webkit-text-fill-color: ${Colors.backgorund} !important;
      transition: background-color 5000s ease-in-out 0s !important;
    }
    .ant-form {
      /* padding: 0 60px; */
      .ant-form-item {
        margin-bottom: 16px;
      }
    }
    .ant-input {
      width: 100%;
      height: 44px;
      border: 1px solid ${Colors.grayScale70};
      background: ${Colors.white};
      color: ${Colors.backgorund};
      padding: 8px 12px;
      border-radius: 2px;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: 0;
      &::placeholder {
        color: ${Colors.grayScale40};
        font-weight: 400;
        font-size: 14px;
      }
    }
    .signin-btn {
      margin-top: 36px;
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
    display: flex;
    justify-content: center;
    width: 100%;
    .registered {
      font-weight: 300;
      font-size: 16px;
      color: ${Colors.white};
      margin: 0 5px 0 0;
      line-height: 22px;
    }
    .resend-count-down {
      color: ${Colors.grayScale40} !important;
    }
    .activate {
      font-weight: 400;
      font-size: 16px;
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
    /* padding: 0 60px; */
    .title {
      font-weight: 300;
      font-size: 17px;
      color: ${Colors.grayScale20};
      text-align: center;
    }
    .value {
      font-weight: 500;
      font-size: 17px;
      color: ${Colors.grayScale20};
      margin-top: 10px;
      text-align: center;
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
    line-height: 44px;
    color: ${Colors.backgorund};
    padding-left: 12px;
    padding-top: 0;
  }
  .ant-picker-focused {
    box-shadow: none;
  }
  .ant-picker .ant-picker-input > input:focus {
    border-color: ${Colors.grayScale50};
  }
  .ant-picker {
    height: 44px;
    width: 100%;
    background: ${Colors.white};
    border: none;
    border: 1px solid ${Colors.grayScale70};
    border-radius: 2px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    padding-top: 8px 12px;
    .ant-picker-input {
      input {
        color: ${Colors.backgorund};
        background: ${Colors.white};
        &::placeholder {
          color: ${Colors.grayScale40};
          font-weight: 400;
          font-size: 14px;
        }
      }
    }
    .ant-picker-suffix {
      color: ${Colors.grayScale40};
    }
  }
  .gender-select {
    cursor: default;
    &.country {
      .ant-select-selection-search-input {
        caret-color: transparent;
      }
    }
    &.border-white {
      .ant-select-selector {
        border-bottom: 1px solid ${Colors.white} !important;
      }
      .ant-select-arrow {
        color: ${Colors.white};
      }
    }
    .ant-select-selector {
      height: 44px;
      background: ${Colors.white};
      border: 1px solid ${Colors.grayScale70};
      border-right: none;
      border-radius: 2px;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      padding: 0;
      .ant-select-selection-search {
        width: 100%;
        inset-inline-start: unset;
        inset-inline-end: unset;
      }
      .ant-select-selection-search-input {
        height: 44px;
        padding: 8px 12px;
      }
    }
    .ant-select-arrow {
      font-size: 20px;
      inset-inline-end: -2px;
      color: ${Colors.grayScale40};
      padding-right: 12px;
      .anticon {
        color: ${Colors.grayScale40};
      }
    }
    .ant-select-selection-placeholder {
      line-height: 44px;
      color: ${Colors.grayScale40};
      font-weight: 400;
      font-size: 14px;
      padding: 0px 12px;
    }
  }
  .phone-number-error {
    color: ${Colors.branding};
    font-size: 12px;
    font-weight: 300;
    margin-top: 5px;
  }
  .phone-number-item {
    &.error {
      margin-bottom: 0 !important;
    }
    .country-code-label {
      > :last-child {
        display: none;
      }
    }
    .ant-input {
      border: none;
    }
    .ant-input-wrapper {
      > :last-child {
        margin-left: -1px;
      }
    }
    .ant-input-group-addon {
      background-color: ${Colors.white};
      border: none;
      border-radius: 2px;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      .ant-select-selection-placeholder {
        padding-top: 0;
        padding-inline-end: 30px;
        color: ${Colors.grayScale40};
        font-weight: 400;
        font-size: 14px;
      }
    }
    .ant-input-group
      .ant-input-group-addon
      .ant-select.ant-select-single:not(.ant-select-customize-input)
      .ant-select-selector {
      border: none;
    }
    .ant-select-single .ant-select-selector .ant-select-selection-item {
      padding-left: 0;
    }
    .ant-select-single .ant-select-selector .ant-select-selection-item {
      line-height: 35px;
    }
    .ant-select-single.ant-select-show-arrow .ant-select-selection-item {
      padding-inline-end: 35px;
    }
    .ant-select:not(.ant-select-disabled):not(.ant-select-customize-input):not(.ant-pagination-size-changer):hover
      .ant-select-selector {
      border: none;
    }
    .ant-input-group
      .ant-input-group-addon
      .ant-select-open
      .ant-select-selector,
    .ant-input-group
      .ant-input-group-addon
      .ant-select-focused
      .ant-select-selector {
      color: ${Colors.black};
    }
    .phone-number-item-input {
    }
  }
  @media (max-width: 768px) {
    .page-main {
      .main-form-content {
        width: 580px;
        padding: 60px 60px;
        /* .ant-form {
          padding: 0 40px;
        } */
      }
    }
  }
  @media (max-width: 576px) {
    padding: 10px;
    .page-main {
      .main-title {
        .title {
          font-size: 20px;
        }
      }
      .main-form-content {
        width: auto;
        min-width: 330px;
        padding: 20px 20px;
        .main-title {
          margin-bottom: 20px;
        }
        .ant-form {
          padding: 0 0;
        }
      }
      .ant-input,
      .search-select-country {
        height: 35px;
      }
      .signin-btn {
        height: 40px;
      }
    }
    .gender-select {
      .ant-select-selector {
        height: 35px;
        .ant-select-selection-search-input {
          height: 35px;
        }
        .ant-select-selection-placeholder,
        .ant-select-selection-item {
          line-height: 35px;
        }
      }
    }
    .ant-picker {
      height: 35px;
    }
  }
  @media (max-width: 375px) {
    .main-form-content {
      &.country-items-show {
        padding-bottom: 20px;
      }
    }
  }
  @media (min-width: 1024px) {
    .forgot-password {
      span {
        cursor: pointer;
      }
    }
  }
`;

export { LoginContainer };
