import styled from 'styled-components';
import { Col } from 'antd';

import { Colors, Images } from '../theme';

const CrowdFundListContainer = styled.div`
  height: 100%;
  overflow: auto;
  position: relative;
  ::-webkit-scrollbar {
    display: none;
  }
  &.star-bg {
    background-image: url(${Images.StarBackgroundIcon.src});
    background-repeat: repeat-y;
  }
  .page-banner {
    height: 162px;
    span {
      height: 100% !important;
    }
  }
  .page-main {
    height: auto;
    padding-bottom: 70px;
    .page-main-content {
      width: 350px;
      margin: auto;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(5px);
      border-radius: 8px;
      padding: 20px 10px 20px 10px;
      margin-top: -20px;
    }
    .content-title {
      font-family: 'Oswald';
      font-weight: 700;
      font-size: 20px;
      text-align: center;
      color: ${Colors.grayScale70};
      margin-bottom: 12px;
    }
  }
  .no-crowd-fund {
    margin-top: 60px;
    text-align: center;
    .text {
      font-weight: 500;
      font-size: 17px;
      color: ${Colors.grayScale50};
      margin-top: 25px;
      margin-bottom: 15px;
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
  .load-more {
    color: ${Colors.white};
    text-align: center;
    margin-top: 5px;
    .anticon {
      margin-right: 10px;
    }
  }
  @media (min-width: 768px) and (max-width: 1200px) {
    .page-banner {
      height: 330px;
    }
    .page-main {
      padding-bottom: 86px;
      .page-main-content {
        width: 688px;
        padding: 60px 20px 40px 20px;
        margin-top: -40px;
      }
    }
    .crowd-fund-list {
      justify-content: space-between;
    }
  }
  @media (min-width: 1200px) {
    .page-banner {
      height: 620px;
    }
    .page-main {
      padding-bottom: 86px;
      .page-main-content {
        width: 1008px;
        padding: 60px 55px 60px 55px;
        margin-top: -60px;
      }
    }
    .crowd-fund-list {
      justify-content: space-between;
    }
  }
`;

const ListItemContainer = styled(Col)`
  padding: 12px 12px 20px 12px;
  border-radius: 4px;
  background: ${Colors.grayScale10};
  margin-top: 20px;
  .list-item-image {
    width: 100%;
    height: 203px;
    margin-bottom: 16px;
    position: relative;
    span {
      height: 100% !important;
      img {
        object-fit: cover;
        border-radius: 4px;
      }
    }
    .bg-mask {
      position: absolute;
      background: linear-gradient(0deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7));
      border-radius: 4px;
      width: 100%;
      height: 100%;
    }
    .fund-icon {
      width: 108px;
      height: 108px;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      span {
        height: 100% !important;
      }
    }
  }
  .list-item-name {
    font-weight: 700;
    font-size: 18px;
    color: ${Colors.grayScale70};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &.gray-mask {
      opacity: 0.5;
    }
  }
  .list-item-label {
    font-weight: 400;
    font-size: 15px;
    color: ${Colors.grayScale70};
    margin-top: 5px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    &.gray-mask {
      opacity: 0.5;
    }
  }
  .list-item-description {
    font-weight: 400;
    font-size: 15px;
    color: ${Colors.grayScale50};
    margin-top: 6px;
    max-height: 75px;
    padding-bottom: 12px;
    border-bottom: 1px solid ${Colors.grayScale30};
    overflow: hidden;
    &.gray-mask {
      opacity: 0.5;
    }
  }
  .list-item-raised {
    margin-top: 12px;
    .price {
      font-weight: 700;
      font-size: 18px;
      color: ${Colors.branding};
    }
    .raised-text {
      font-weight: 400;
      font-size: 17px;
      color: ${Colors.grayScale50};
      margin-left: 5px;
    }
  }
  .list-item-days-left {
    text-align: right;
    font-size: 15px;
    font-weight: 500;
    color: ${Colors.grayScale90};
    .content {
      display: flex;
      justify-content: end;
      align-items: center;
      &.date-text {
        font-weight: 400;
        > :first-child {
          margin-right: 5px !important;
          margin-top: -2px !important;
        }
      }
    }
  }
  .list-item-button {
    margin-top: 12px;
    .ant-btn {
      width: 100%;
      height: 45px;
      background: ${Colors.branding};
      border-radius: 2px;
      font-weight: 700;
      font-size: 15px;
      color: ${Colors.grayScale10};
      border: none;
      padding-top: 12px;
      padding-bottom: 12px;
    }
    .ant-btn-default:disabled {
      background: ${Colors.grayScale30};
      color: ${Colors.grayScale40};
    }
  }
  .progress-disabled {
    .ant-progress-bg {
      background-color: unset;
      background: ${Colors.grayScale40};
    }
  }
  @media (min-width: 768px) and (max-width: 1200px) {
    min-width: 314px;
    .list-item-description {
      min-height: 75px;
    }
    .list-item-raised {
      min-height: 25px;
    }
    .list-item-label {
      min-height: 22px;
    }
  }
  @media (min-width: 1200px) {
    cursor: pointer;
    min-width: 429px;
    margin-top: 40px;
    .list-item-raised {
      min-height: 25px;
    }
    .list-item-label {
      min-height: 22px;
    }
    .list-item-description {
      min-height: 60px;
    }
  }
`;

export { CrowdFundListContainer, ListItemContainer };
