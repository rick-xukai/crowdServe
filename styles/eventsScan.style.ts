import styled from 'styled-components';
import { Row } from 'antd';

import { Colors } from '@/theme';

const EventsScanContainer = styled.div`
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
  .page-header {
    padding: 10px 20px;
    border-bottom: 1px solid ${Colors.grayScale70};
    position: fixed;
    width: 100%;
    background: ${Colors.backgorund};
    z-index: 1;
    .logo-img {
      height: 30px;
      img {
        width: 76px;
        height: 30px;
      }
    }
    .header-dropdown {
      height: 30px;
      .content {
        display: flex;
        align-items: center;
        height: 100%;
        justify-content: end;
      }
      .ant-dropdown-trigger {
        color: ${Colors.white};
        font-size: 15px;
        font-weight: 400;
        display: flex;
        align-items: center;
        text-transform: uppercase;
        img {
          margin-left: 10px;
        }
      }
    }
  }
  .page-main {
    padding: 66px 20px 75px 20px;
    .title {
      color: ${Colors.white};
      font-family: Oswald;
      font-size: 20px;
      font-weight: 700;
      line-height: 28px;
    }
    .event-list {
      margin-top: 20px;
    }
    .ant-checkbox-wrapper {
      width: 100%;
      padding: 10px;
      border-radius: 4px;
      background: ${Colors.grayScale70};
      margin-bottom: 10px;
      position: relative;
      .ant-checkbox {
        position: absolute;
        top: 14px;
      }
      .ant-checkbox+span {
        padding-left: 35px;
      }
    }
    .event-name {
      color: ${Colors.white};
      font-size: 15px;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .event-date {
      color: ${Colors.grayScale40};
      font-size: 13px;
      font-weight: 400;
      margin-top: 5px;
    }
  }
  .ant-checkbox-checked {
    .ant-checkbox-inner {
      background: ${Colors.branding};
    }
  }
  /* .ant-checkbox {
    margin-right: 5px;
  } */
  .ant-checkbox-inner {
    background: transparent;
    border: 1px solid ${Colors.white};
    border-radius: 2px;
  }
  .ant-checkbox-wrapper:not(.ant-checkbox-wrapper-disabled):hover
    .ant-checkbox-inner,
  .ant-checkbox:not(.ant-checkbox-disabled):hover .ant-checkbox-inner {
    border-color: ${Colors.white};
  }
  .ant-checkbox-wrapper:not(.ant-checkbox-wrapper-disabled):hover
    .ant-checkbox-checked:not(.ant-checkbox-disabled)
    .ant-checkbox-inner {
    background-color: ${Colors.branding};
  }
  .ant-checkbox-wrapper:not(.ant-checkbox-wrapper-disabled):hover
    .ant-checkbox-checked:not(.ant-checkbox-disabled):after {
    border-color: ${Colors.white};
  }
  .ant-checkbox-checked:after {
    border: none !important;
  }
  .ant-checkbox-checked {
    .ant-checkbox-inner {
      border: none !important;
    }
  }
  .page-bottom {
    padding: 15px 20px;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(2.5px);
    position: fixed;
    width: 100%;
    bottom: 0;
    .content {
      align-items: center;
    }
    .ant-checkbox-wrapper {
      .ant-checkbox {
        margin-top: -4px;
      }
      .all {
        color: ${Colors.white};
        font-size: 15px;
        font-weight: 700;
      }
    }
    .ant-btn {
      padding: 0;
      height: 45px;
      color: ${Colors.grayScale30};
      font-size: 15px;
      font-weight: 700;
      text-transform: uppercase;
      line-height: 45px;
      width: 100%;
      border-radius: 2px;
      background: ${Colors.branding};
      border: none;
    }
    .ant-btn-default:disabled {
      background: ${Colors.brandingGray};
    }
  }
  .no-data {
    text-align: center;
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    left: 0;
    right: 0;
    p {
      color: ${Colors.grayScale20};
      font-size: 17px;
      font-weight: 500;
      margin: 20px 0 0 0;
    }
  }
  @media (max-width: 1024px) {
    .page-bottom {
      .ant-checkbox-wrapper {
        cursor: default;
      }
    }
  }
`;

const EventItem = styled(Row)`
  @media (max-width: 1024px) {
    .ant-checkbox-wrapper {
      cursor: default;
    }
  }
`;

export { EventsScanContainer, EventItem };
