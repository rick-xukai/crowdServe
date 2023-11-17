import styled from 'styled-components';

import { Colors } from '@/theme';

const CountryCodePhoneNumberContainer = styled.div`
  .country-code {
    .phone-code-tigger {
      margin-right: 30px;
      color: ${Colors.white};
      font-size: 17px;
      font-weight: 300;
      line-height: 24px;
      padding-bottom: 5px;
      cursor: pointer;
      &.placeholder {
        color: ${Colors.grayScale50};
        font-size: 15px;
        .anticon {
          font-size: 17px;
        }
      }
      > :first-child {
        margin-right: 30px;
      }
    }
    &.error {
      .ant-form-item-control-input-content {
        border-bottom: 1px solid ${Colors.branding} !important;
      }
    }
    .ant-form-item-control-input-content {
      padding-bottom: 2.5px !important;
      padding-right: 15px;
    }
    .ant-select-selection-search {
      inset-inline-start: 0;
      inset-inline-end: 0;
    }
    .country-code-label {
      color: ${Colors.white};
      font-size: 17px;
      font-weight: 300;
      line-height: 24px;
      > :last-child {
        display: none;
      }
    }
    .ant-select-selection-item {
      color: ${Colors.white};
      font-size: 17px;
      font-weight: 300;
    }
    .anticon {
      margin-top: -5px;
      font-size: 15px;
    }
    .ant-input-group-addon {
      padding-left: 0;
      padding-right: 20px;
      border: none;
    }
    .ant-input-group .ant-input-group-addon .ant-select {
      margin: 0;
    }
    .ant-select-selector {
      border: none;
    }
    .ant-select-single.ant-select-show-arrow .ant-select-selection-item {
      padding-inline-end: 30px;
    }
    .ant-input-group
      .ant-input-group-addon
      .ant-select-open
      .ant-select-selector,
    .ant-input-group
      .ant-input-group-addon
      .ant-select-focused
      .ant-select-selector {
      color: ${Colors.white};
    }
    .ant-select:not(.ant-select-disabled):not(.ant-select-customize-input):not(.ant-pagination-size-changer):hover
      .ant-select-selector {
      border: none;
    }
    .ant-input-group
      .ant-input-group-addon
      .ant-select.ant-select-single:not(.ant-select-customize-input)
      .ant-select-selector {
      border: none;
    }
    .ant-select-single.ant-select-show-arrow .ant-select-selection-placeholder {
      padding-inline-end: 30px;
    }
  }
  .phone-number-item {
    .phone-code-tigger {
      margin-right: 30px;
      color: ${Colors.backgorund};
      font-size: 14px;
      cursor: pointer;
      &.placeholder {
        color: ${Colors.grayScale40};
        font-weight: 400;
        font-size: 14px;
        .anticon {
          font-size: 14px;
        }
      }
      > :first-child {
        margin-right: 30px;
      }
    }
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
        font-weight: 400;
        font-size: 14px;
        color: ${Colors.grayScale40};
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
`;

export { CountryCodePhoneNumberContainer };
