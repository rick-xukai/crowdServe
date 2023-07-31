import styled from 'styled-components';
import { Col } from 'antd';
import { Colors } from '../theme';

const EventDetailContainer = styled.div`
  padding-top: 45px;
  height: 100%;
  background: ${Colors.backgorund};
  overflow-y: scroll;
  overflow-x: hidden;
  .container-wrap {
    max-width: 1008px;
    margin: auto;
  }
  ::-webkit-scrollbar {
    display: none;
  }
  .page-main {
    padding-bottom: 50px;
  }
  .detail-background {
    width: 100%;
    height: 188px;
    background: ${Colors.black};
    > :first-child {
      position: relative !important;
      width: 100% !important;
      height: 100% !important;
      img {
        inset: unset !important;
        width: 100% !important;
        height: 100% !important;
        object-fit: contain;
        object-position: center;
        &.error-full-image {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover;
        }
      }
    }
  }
  .event-detail-container {
    padding: 20px;
    background: ${Colors.backgorund};
    position: relative;
    .item-info {
      .item-info-row {
        > :last-child {
          margin-bottom: 0;
        }
      }
      .info-title {
        font-family: 'Oswald';
        font-weight: 700;
        font-size: 24px;
        color: ${Colors.white};
        margin-bottom: 10px;
        max-width: 100%;
      }
      .crowd-fund-link {
        font-weight: 400;
        font-size: 13px;
        color: ${Colors.branding};
        margin-top: 8px;
        a:hover {
          color: ${Colors.branding};
        }
        .anticon {
          margin-left: 5px;
          vertical-align: -0.24em;
        }
      }
      .info-item {
        margin-bottom: 5px;
        display: flex;
        img {
          width: 16px !important;
        }
        .info-item-icon {
          margin: unset !important;
          margin-top: 2px !important;
          min-width: 16px !important;
          min-height: 16px !important;
        }
      }
      .info-description {
        font-weight: 400;
        font-size: 15px;
        color: ${Colors.white};
        margin-left: 8px;
        max-width: 90%;
      }
    }
    .dividing-line {
      height: 0.6px;
      background: ${Colors.grayScale90};
      margin-top: -16px;
      margin-bottom: 15px;
    }
    .all-ticket-sold {
      p {
        margin-top: 10px;
        margin-bottom: 0
        font-weight: 400;
        font-size: 15px;
        color: ${Colors.grayScale20};
      }
    }
  }
  .ticket-description {
    margin-top: 8px;
    position: relative;
  }
  .whole-description {
    color: ${Colors.grayScale40};
    font-weight: 300;
    font-size: 13px;
    margin: 0;
    white-space: pre-wrap;
  }
  .text-typography {
    color: ${Colors.grayScale40};
    font-weight: 300;
    font-size: 13px;
    margin-bottom: 0;
    .show-more {
      font-weight: 400;
      font-size: 13px;
      color: ${Colors.white};
    }
  }
  .ant-tabs {
    margin-top: 30px;
    @media (max-width: 576px) {
      .ant-tabs-nav-wrap {
        margin: auto;
      }
    }
  }
  .ant-tabs-nav {
    height: 35px;
    margin: 0 0 13px 0;
  }
  .ant-tabs-top >.ant-tabs-nav::before {
    border-bottom: none;
  }
  @media (max-width: 374px) {
    .ant-tabs .ant-tabs-tab+.ant-tabs-tab {
      margin: 0 0 0 10px;
    }
  }
  .ant-tabs-tab {
    padding: 0 0 6px 0;
    align-items: unset;
    font-weight: 400;
    font-size: 17px;
    color: ${Colors.grayScale50};
    cursor: unset;
    .anticon {
      margin-left: 5px;
      margin-right: 0;
      font-size: 14px;
    }
  }
  .ant-tabs-tab-btn {
    font-weight: 500;
    font-size: 15px;
    @media (max-width: 374px) {
      font-size: 14px;
    }
  }
  .ant-tabs .ant-tabs-tab:hover {
    color: ${Colors.grayScale50};
  }
  .ant-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: ${Colors.white};
  }
  .ant-tabs .ant-tabs-tab-btn:active {
    color: ${Colors.grayScale50};
  }
  .ant-tabs-ink-bar {
    height: 3px !important;
    background: transparent;
    text-align: center;
    overflow: hidden;
  }
  .ant-tabs-ink-bar::after {
    content: "";
    position: absolute;
    width: 40px;
    height: 100%;
    -ms-transform: translateX(-50%);
    transform: translateX(-50%);
    background: ${Colors.white};
    border-radius: 2px;
  }
  .ant-tabs-nav-list {
    width: 100%;
    overflow: hidden;
    @media (min-width: 767px) {
      display: block !important;
    }
    @media (max-width: 375px) {
      justify-content: space-between;
    }
  }
  .install-app {
    text-align: center;
    margin-top: 20px;
    margin-bottom: 20px;
    img {
      margin-bottom: 10px;
    }
    p {
      margin: 0;
      font-weight: 400;
      font-size: 15px;
      color: ${Colors.grayScale20};
    }
    .install-btn {
      color: ${Colors.branding};
      margin-top: 10px;
    }
  }
  @media (min-width: 1200px) {
    padding-top: 0;
    .page-main {
      margin-top: 104px;
      padding-bottom: 90px;
      .detail-background {
        height: 504px;
      }
      .show-more {
        cursor: pointer;
      }
      .event-detail-container {
        padding-left: 12px;
        padding-right: 12px;
        margin-top: 0;
        border-radius: 0;
      }
    }
    .item-tabs {
      margin-top: 55px;
    }
    .ant-tabs-tab-btn,
    .install-btn {
      cursor: pointer;
    }
    .ant-tabs-nav {
      margin-bottom: 28px;
    }
  }
  @media(min-width: 1200px) {
    .dividing-line {
      margin-top: -28px !important;
    }
  }
  @media (min-width: 768px) and (max-width: 1200px) {
    padding-top: 0;
    .container-wrap {
      max-width: 688px;
    }
    .page-main {
      padding-top: 84px;
      padding-bottom: 90px;
      .detail-background {
        height: 344px;
      }
      .event-detail-container {
        margin-top: 24px;
        padding: 0;
        border-radius: 0;
      }
    }
    .ant-tabs-nav {
      margin-bottom: 22px;
    }
    .item-tabs {
      margin-top: 35px;
      .dividing-line {
        margin-top: -22px;
      }
    }
  }
`;

const TicketTypeItem = styled(Col)`
  background: ${Colors.backgorund};
  border-radius: 6px;
  .type-img {
    height: 162px;
    padding: 6px;
    border-radius: 6px;
    background: ${Colors.grayScale70};
    position: relative;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }
  }
  .type-info {
    background: ${Colors.grayScale70};
    border-radius: 6px;
    overflow: hidden;
    height: calc(100% - 162px);
    .line {
      text-align: center;
      position: relative;
      img {
        width: 90%;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        margin: auto;
      }
    }
    .info-des {
      text-align: center;
      margin-bottom: 6px;
    }
    .title,
    .price {
      font-weight: 500;
      font-size: 15px;
      margin: 0;
    }
    .title-content {
      max-height: 68px;
      min-height: 68px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .title {
      margin-top: 6px;
      color: ${Colors.white};
      margin-bottom: 6px;
      padding-left: 10px;
      padding-right: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      text-align: center;
    }
    .price {
      color: ${Colors.branding};
    }
    &.out-stock {
      .title {
        color: ${Colors.whiteMask};
      }
      .price {
        color: ${Colors.brandingMask};
      }
    }
  }
  .out-stock-mask {
    position: absolute;
    top: 6px;
    left: 0;
    width: calc(100% - 12px);
    height: calc(100% - 12px);
    right: 0;
    margin: auto;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 6px;
    font-weight: 700;
    font-size: 20px;
    color: ${Colors.grayScale10};
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  @media (min-width: 1200px) {
    cursor: pointer;
  }
`;

const SecondaryMarketItem = styled.div`
  position: relative;
  border-radius: 4px;
  padding: 6px;
  height: 167px;
  .item-background {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }
  }
  .item-price {
    position: absolute;
    bottom: 0px;
    width: 100%;
    left: 0px;
    padding: 8px;
    background: rgba(78, 78, 78, 0.7);
    backdrop-filter: blur(8px);
    border-radius: 0px 0px 4px 4px;
    span {
      font-weight: 700;
      font-size: 18px;
      color: ${Colors.white};
    }
  }
  .item-type {
    line-height: 24px;
    padding-top: 0;
    padding-bottom: 0;
    white-space: nowrap;
    max-width: 75px;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0px 6px;
    background: ${Colors.grayScale10};
    border-radius: 6px;
    font-weight: 700;
    font-size: 15px;
    color: ${Colors.grayScale70};
    position: absolute;
    right: 6px;
  }
  @media (min-width: 1200px) {
    cursor: pointer;
  }
`;

export { EventDetailContainer, TicketTypeItem, SecondaryMarketItem };
