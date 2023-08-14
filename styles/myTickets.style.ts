import styled from 'styled-components';
import { Col } from 'antd';

import { Colors } from '../theme';

interface MyEventStatusContainerProps {
  bgColor: string;
  textColor: string;
}

const MyEventsContainer = styled.div`
  height: 100%;
  overflow: auto;
  .container-wrap {
    max-width: 1008px;
    margin: auto;
  }
  ::-webkit-scrollbar {
    display: none;
  }
  .page-tabs {
    position: fixed;
    top: 45px;
    width: 100%;
    left: 0;
    z-index: 999;
    background: ${Colors.black10};
    padding: 10px 20px 0 20px;
    .ant-tabs {
      color: ${Colors.grayScale50};
    }
    .ant-tabs-tab {
      cursor: unset;
    }
    .ant-tabs > .ant-tabs-nav {
      margin: 0;
    }
    .ant-tabs .ant-tabs-tab {
      padding: 0 0 5px 0;
    }
    .ant-tabs .ant-tabs-tab + .ant-tabs-tab {
      margin: 0 0 0 24px;
    }
    .ant-tabs .ant-tabs-tab:hover {
      color: ${Colors.white};
    }
    .ant-tabs-tab-btn {
      font-weight: 500;
      font-size: 17px;
    }
    .ant-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
      color: ${Colors.white};
    }
    .ant-tabs .ant-tabs-ink-bar {
      background: ${Colors.white};
    }
    .ant-tabs-ink-bar {
      height: 3px !important;
      background: transparent !important;
      text-align: center;
    }
    .ant-tabs-ink-bar::after {
      content: '';
      position: absolute;
      width: 40px;
      height: 3px;
      -ms-transform: translateX(-50%);
      transform: translateX(-50%);
      background: ${Colors.white};
      border-radius: 2px;
    }
    .ant-tabs > .ant-tabs-nav .ant-tabs-nav-wrap::before,
    .ant-tabs > .ant-tabs-nav .ant-tabs-nav-wrap::after {
      display: none;
    }
  }
  .page-main {
    padding: 20px 20px 70px 20px;
    margin-top: 45px;
    .no-ticket-row {
      align-items: center;
      height: calc(100vh - 150px);
    }
    .no-ticket {
      display: flex;
      align-items: center;
      p {
        margin: 20px 0 0 0;
        color: ${Colors.white};
        font-weight: 500;
        font-size: 17px;
      }
    }
    .load-more {
      color: ${Colors.white};
      text-align: center;
      margin-top: 10px;
      .anticon {
        margin-right: 10px;
      }
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
  @media (min-width: 1200px) {
    .page-main {
      padding: 20px 0 70px 0;
      margin-top: 80px;
    }
  }
  @media (min-width: 768px) and (max-width: 1200px) {
    .container-wrap {
      max-width: 688px;
    }
    .page-main {
      padding: 20px 0 70px 0;
      margin-top: 50px;
    }
  }
`;

const EventItemContainer = styled.div`
  border-radius: 4px;
  overflow: hidden;
  min-height: 223px;
  position: relative;
  .event-background {
    position: relative;
    width: 100%;
    aspect-ratio: 2 / 1;
    img,
    video {
      width: 100% !important;
      height: 100% !important;
      object-fit: cover;
    }
  }
  .on-sale-icon {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 65px;
    height: 65px;
  }
  .item-info {
    width: 100%;
    padding: 15px;
    background: ${Colors.grayScale70};
    border-radius: 0 0 4px 4px;
    .item-info-row {
      > :last-child {
        margin-bottom: 0;
      }
    }
    .info-title {
      font-weight: 700;
      font-size: 18px;
      color: ${Colors.white};
      margin-bottom: 8px;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .info-item {
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      img {
        width: 16px !important;
      }
      .info-item-icon {
        min-width: 16px !important;
        min-height: 16px !important;
      }
    }
    .info-description {
      font-weight: 300;
      font-size: 13px;
      color: ${Colors.grayScale20};
      margin-left: 8px;
      max-width: 90%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .background-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5));
    z-index: 1;
    border-radius: 4px;
  }
  .status-warpper {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 1;
  }
  @media (min-width: 1200px) {
    min-height: 284px;
    cursor: pointer;
  }
  @media (min-width: 768px) and (max-width: 1200px) {
    min-height: 284px;
  }
`;

const MyEventStatusContainer = styled.span`
  display: inline-block;
  height: 22px;
  line-height: 24px;
  padding: 0 6px;
  border-radius: 4px;
  background: ${(props: MyEventStatusContainerProps) => props.bgColor};
  color: ${(props: MyEventStatusContainerProps) => props.textColor};
  font-weight: 700;
  font-size: 12px;
`;

export { MyEventsContainer, EventItemContainer, MyEventStatusContainer };
