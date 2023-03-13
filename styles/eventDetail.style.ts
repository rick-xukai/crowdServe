import styled from 'styled-components';
import { Col } from 'antd';
import { Colors } from '../theme';

const EventDetailContainer = styled.div`
  padding-top: 45px;
  height: 100%;
  background: ${Colors.backgorund};
  .detail-background {
    width: 100%;
    height: 250px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .event-detail-container {
    padding: 20px;
    background: ${Colors.backgorund};
    border-radius: 20px 20px 0px 0px;
    margin-top: -20px;
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
      margin-top: 20px;
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
  .ant-tabs-nav {
    height: 35px;
  }
  @media (max-width: 374px) {
    .ant-tabs .ant-tabs-tab+.ant-tabs-tab {
      margin: 0 0 0 10px;
    }
  }
  .ant-tabs-tab {
    padding: 0;
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
    font-weight: 400;
    font-size: 17px;
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
    justify-content: space-between;
    width: 100%;
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
`;

const TicketTypeItem = styled(Col)`
  background: ${Colors.backgorund};
  border-radius: 6px;
  position: relative;
  .type-img {
    height: 162px;
    padding: 6px;
    border-radius: 6px;
    background: ${Colors.grayScale70};
    img {
      width: 100%;
      height: 100%;
      border-radius: 4px;
    }
  }
  .type-info {
    background: ${Colors.grayScale70};
    border-radius: 6px;
    overflow: hidden;
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
    .title, .price {
      font-weight: 500;
      font-size: 15px;
      margin: 0;
    }
    .title {
      margin-top: 6px;
      color: ${Colors.white};
      margin-bottom: 6px;
    }
    .price {
      color: ${Colors.branding};
    }
  }
  .out-stock-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% - 10px);
    right: 0;
    margin: auto;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 6px;
    font-weight: 700;
    font-size: 20px;
    color: ${Colors.grayScale10};
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
`;

export { EventDetailContainer, TicketTypeItem };
