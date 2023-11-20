import styled from 'styled-components';

import { Colors } from '@/theme';

const ProfileContainer = styled.div`
  height: 100%;
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
  .page-main {
    margin: auto;
    padding-bottom: 50px;
    .profile-avatar {
      .avatar-email {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background: ${Colors.grayScale10};
        font-weight: 700;
        font-size: 40px;
        color: ${Colors.backgorund};
        font-family: 'Oswald';
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: -62px;
        border: 2px solid ${Colors.backgorund};
      }
      .avatar-image {
        width: 120px;
        height: 120px;
        margin-top: -62px;
        border: 2px solid ${Colors.backgorund};
        border-radius: 50%;
        object-fit: cover;
      }
      /* .ant-avatar {
        width: 120px;
        height: 120px;
        margin-top: -62px;
        border: 2px solid ${Colors.backgorund};
      } */
    }
    .profile-edit {
      text-align: right;
      .ant-btn {
        border-radius: 2px;
        border: 1px solid ${Colors.grayScale10};
        color: ${Colors.grayScale10};
        font-size: 13px;
        font-weight: 700;
        background: transparent;
        margin-top: 24px;
      }
    }
    .profile-name {
      color: ${Colors.white};
      font-size: 20px;
      font-weight: 700;
      line-height: 28px;
      margin-top: 20px;
      &.no-filled {
        color: ${Colors.grayScale50};
      }
    }
    .profile-joined {
      color: ${Colors.grayScale40};
      font-size: 15px;
      font-weight: 400;
      line-height: 21px;
      margin-top: 5px;
      .anticon {
        margin-right: 6px;
      }
    }
    .profile-items-content {
      margin-top: 24px;
      > :last-child {
        .item {
          border-bottom: none;
        }
      }
      .item {
        border-bottom: 0.5px solid ${Colors.grayScale90};
        padding: 12px 0;
      }
      .item-info {
        display: flex;
        align-items: center;
        .info-icon {
          margin-right: 12px;
          display: flex;
          align-items: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: ${Colors.grayScale90};
          justify-content: center;
        }
        .info-value {
          .title {
            color: ${Colors.grayScale40};
            font-size: 13px;
            font-weight: 300;
          }
          .value {
            color: ${Colors.white};
            font-size: 15px;
            font-weight: 400;
            &.no-filled {
              color: ${Colors.grayScale50};
            }
          }
          @media (max-width: 420px) {
            .value {
              max-width: 280px;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }
        }
      }
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
  .profile-background {
    height: 240px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .profile-popup-content {
    .ant-modal-content {
      overflow: unset;
    }
  }
  .ant-modal {
    max-width: calc(100vw - 40px);
  }
  .ant-modal-content {
    border-radius: 4px;
    background: ${Colors.grayScale70};
    box-shadow: 0px 2px 14px 0px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(5px);
    padding: 24px !important;
  }
  .ant-form-item-explain-connected {
    color: ${Colors.branding};
    font-size: 12px;
    font-weight: 300;
    line-height: 17px;
  }
  .phone-number-error {
    color: ${Colors.branding};
    font-size: 12px;
    font-weight: 300;
  }
  .ant-select-selection-item {
    color: ${Colors.white};
    font-size: 17px;
    font-weight: 300;
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
  .ant-picker:not(.ant-picker-disabled).ant-picker-status-error,
  .ant-picker:not(.ant-picker-disabled).ant-picker-status-error:not([disabled]):hover {
    background: transparent;
    border: none;
  }
  @media (min-width: 1200px) {
    .page-main {
      max-width: 1008px;
      padding-bottom: 90px;
    }
  }
  @media (min-width: 768px) and (max-width: 1200px) {
    .page-main {
      max-width: 688px;
      padding-bottom: 90px;
    }
  }
  @media (max-width: 767px) {
    .profile-background {
      height: 130px;
    }
    .page-main {
      padding: 0 20px 50px 20px;
      .profile-avatar {
        .avatar-image {
          width: 100px;
          height: 100px;
          margin-top: -52px;
        }
        .avatar-email {
          width: 100px;
          height: 100px;
          margin-top: -52px;
        }
        /* .ant-avatar {
          width: 100px;
          height: 100px;
          margin-top: -52px;
        } */
      }
      .profile-edit {
        .ant-btn {
          margin-top: 20px;
        }
      }
      .profile-name {
        margin-top: 12px;
      }
    }
  }
  @media (max-width: 576px) {
    .profile-popup-content {
      .ant-modal-content {
        overflow: unset;
        max-height: 607px;
      }
    }
    .ant-modal-content {
      max-height: 595px;
      overflow: auto;
      ::-webkit-scrollbar {
        display: none;
      }
    }
  }
`;

const EditerContent = styled.div`
  min-height: 560px;
  .avatar-col {
    text-align: center;
    .avatar-uploader {
      .ant-upload-select {
        border-radius: 50%;
        margin: 0;
        margin-inline-end: unset;
        width: 86px;
        height: 86px;
        border: none;
        position: relative;
        :hover {
          .upload-mask {
            display: flex;
          }
        }
        .avatar-email {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: ${Colors.grayScale10};
          font-weight: 700;
          font-size: 40px;
          color: ${Colors.backgorund};
          font-family: 'Oswald';
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
    .uploaded-avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
    .upload-mask {
      display: flex;
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 50%;
      align-items: center;
      justify-content: center;
    }
  }
  .ant-form {
    margin-top: 24px;
    .action-button {
      margin-top: 24px;
      margin-bottom: 0;
      .cancel {
        width: 100%;
        height: 45px;
        background: transparent;
        border-radius: 2px;
        border: 1px solid ${Colors.grayScale10};
        color: ${Colors.grayScale10};
        font-size: 15px;
        font-weight: 700;
      }
      .save {
        width: 100%;
        height: 45px;
        border-radius: 2px;
        background: ${Colors.branding};
        color: ${Colors.grayScale10};
        font-size: 15px;
        font-weight: 700;
        border: none;
      }
      .ant-btn-default:disabled {
        background: ${Colors.brandingGray};
      }
    }
  }
  .editer-row {
    margin-bottom: 12px;
    .error-message {
      color: ${Colors.branding};
      font-size: 12px;
      font-weight: 300;
      margin-bottom: 0;
      margin-top: 2px;
    }
  }
  .editer-field {
    padding-top: 8px;
    /* padding-bottom: 8px;
    border-bottom: 0.7px solid ${Colors.grayScale90}; */
    &.country {
      .ant-form-item-control-input-content {
        padding-bottom: 0px !important;
      }
    }
    input {
      &::placeholder {
        color: ${Colors.grayScale50};
        font-size: 15px;
      }
    }
    .ant-select-selection-placeholder {
      color: ${Colors.grayScale50};
      font-size: 15px;
    }
    .title {
      color: ${Colors.grayScale50};
      font-size: 13px;
      font-weight: 400;
      /* margin-bottom: 5px; */
    }
    .ant-form-item {
      margin-top: 5px;
      margin-bottom: 0;
      /* padding-bottom: 8px;
      border-bottom: 0.7px solid ${Colors.grayScale90}; */
      &.ant-form-item-has-error {
        .ant-form-item-control-input-content {
          border-bottom: 1px solid ${Colors.branding};
        }
      }
      .ant-form-item-explain-error {
        margin-top: 2px;
        color: ${Colors.branding};
        font-size: 12px;
        font-weight: 300;
      }
      .ant-form-item-control-input-content {
        padding-bottom: 8px;
        border-bottom: 1px solid ${Colors.grayScale90};
      }
      .ant-form-item-control-input-content {
        .ant-input {
          background: transparent;
          border: none;
          padding: 0;
          color: ${Colors.white};
          font-size: 17px;
          font-weight: 300;
          &.ant-input-disabled {
            color: ${Colors.grayScale50};
            font-size: 17px;
            font-weight: 300;
          }
        }
        .ant-input:focus {
          box-shadow: unset;
        }
      }
    }
    .ant-select-selector {
      background: transparent;
      border: none;
      padding: 0;
      color: ${Colors.white};
      font-size: 17px;
      font-weight: 300;
    }
    .ant-select-focused.ant-select:not(.ant-select-disabled):not(.ant-select-customize-input):not(.ant-pagination-size-changer)
      .ant-select-selector {
      border: none;
      box-shadow: unset;
    }
    .ant-select-arrow {
      right: 0;
      font-size: 20px;
      color: ${Colors.grayScale50};
    }
    .ant-select-single.ant-select-open .ant-select-selection-item {
      color: ${Colors.white};
    }
    .ant-picker-focused {
      box-shadow: unset;
    }
    .ant-picker {
      width: 100%;
      background: transparent;
      border: none;
      padding: 0;
      .ant-picker-input {
        input {
          color: ${Colors.white};
          font-size: 17px;
          font-weight: 300;
        }
      }
      .ant-picker-suffix {
        .anticon {
          font-size: 18px;
          color: ${Colors.grayScale50};
        }
      }
    }
    .search-select-country {
      background: transparent;
      border: none;
      padding: 0;
      .country-name {
        color: ${Colors.white};
        font-size: 17px;
        font-weight: 300;
      }
      .anticon {
        color: ${Colors.grayScale50};
      }
    }
    /* .ant-input-affix-wrapper {
      background: transparent;
      border: none;
      padding: 0;
    }
    .ant-input-affix-wrapper-focused {
      border: none;
      box-shadow: unset;
    } */
  }
  .phone-number-info {
    display: flex;
    margin-top: 5px;
    .anticon {
      color: ${Colors.orange};
      margin-right: 4px;
      margin-top: 2px;
    }
    span {
      display: block;
    }
    .text {
      color: ${Colors.white};
      font-size: 12px;
      font-weight: 300;
    }
  }
`;

export { ProfileContainer, EditerContent };
