import styled from 'styled-components';

import { Colors } from '../theme';

interface TicketStatusContainerProps {
  bgColor: string;
  textColor: string;
}

const TicketsContainer = styled.div`
  padding: 20px;
  height: 100%;
  overflow: auto;
  max-width: 1280px;
  margin: auto;
  .page-loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    display: flex;
    align-items: center;
    color: ${Colors.branding};
    .anticon-loading {
      margin: auto;
      font-size: 30px;
    }
  }
  ::-webkit-scrollbar {
    display: none;
  }
  .page-title {
    margin-bottom: 20px;
    .title {
      font-weight: 700;
      font-size: 28px;
      color: ${Colors.white};
      font-family: 'Oswald';
    }
  }
  .ant-spin-nested-loading {
    height: unset;
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
    margin-top: 90px;
    padding-bottom: 30px;
    .tickets-list {
      .load-more {
        color: ${Colors.white};
        text-align: center;
        .anticon {
          margin-right: 10px;
        }
      }
      > :last-child {
        margin-bottom: 0;
      }
    }
    .no-ticket-row {
      align-items: center;
      height: calc(100vh - 200px);
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
    &.open-app {
      padding-bottom: 80px;
    }
  }
  .ant-spin {
    max-height: unset !important;
    background: rgba(0, 0, 0, 0.5);
    .anticon {
      color: ${Colors.branding};
    }
  }
  .ant-spin-container,
  .ant-spin-nested-loading {
    opacity: unset;
  }
  .ant-spin-nested-loading {
    position: unset;
  }
  .ant-spin-nested-loading .ant-spin-blur::after {
    opacity: 0;
  }
  .tickets-list-container {
    @media (min-width: 767px) {
      margin: auto;
      display: grid;
      grid-template-columns: repeat(auto-fill, 320px);
      grid-gap: 12px;
      justify-content: center;
    }
    @media (min-width: 1023px) {
      grid-template-columns: repeat(auto-fill, 320px);
      grid-gap: 12px;
    }
  }
  .open-app-collectibles {
    display: flex;
    align-items: center;
    padding: 20px;
    position: relative;
    max-width: 1240px;
    margin: auto;
    position: fixed;
    width: 100%;
    background: ${Colors.backgorund};
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    z-index: 1;
    .page-main-collectibles {
      text-align: center;
      margin: auto;
      .title {
        margin-top: 20px;
        margin-bottom: 10px;
        font-weight: 700;
        font-size: 20px;
        color: ${Colors.grayScale20};
      }
      .info {
        margin: 0;
        font-weight: 400;
        font-size: 15px;
        color: ${Colors.grayScale40};
      }
    }
    .page-bottom {
      margin-top: 100px;
      .ant-btn {
        height: 45px;
        padding: 12px 10px;
        background: ${Colors.branding};
        border-radius: 2px;
        color: ${Colors.grayScale10};
        font-weight: 700;
        font-size: 15px;
        border: none;
        width: 100%;
      }
    }
  }
  @media (min-width: 1200px) {
    max-width: 1007px;
    padding: 0;
    .ant-tabs-tab-btn {
      cursor: pointer;
    }
    .page-main {
      margin-top: 160px;
      padding-bottom: 80px;
    }
    .show-tabs {
      background: ${Colors.backgorund};
    }
    .page-tabs {
      max-width: 1008px;
      margin: auto;
      right: 0;
      top: 80px;
      padding-left: 0;
      padding-right: 0;
      background: ${Colors.backgorund};
    }
  }
  @media (min-width: 768px) and (max-width: 1200px) {
    max-width: 688px;
    padding: 0;
    .page-tabs {
      max-width: 688px;
      margin: auto;
      right: 0;
      top: 60px;
      padding-left: 0;
      padding-right: 0;
      background: ${Colors.backgorund};
    }
    .page-main {
      margin-top: 140px;
      padding-bottom: 70px;
    }
    .open-app-collectibles {
      max-width: 688px;
      padding: 0;
    }
  }
`;

const TicketItemContainer = styled.div`
  border-radius: 4px;
  padding: 10px;
  min-height: 223px;
  margin-bottom: 20px;
  position: relative;
  @media (min-width: 767px) {
    margin-bottom: 0;
  }
  @media (min-width: 1023px) {
    min-width: 315px;
  }
  @media (min-width: 1280px) {
    min-width: 292px;
    max-width: 292px;
  }
  .ticket-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    img,
    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
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
    position: absolute;
    bottom: 0;
    width: 100%;
    left: 0;
    padding: 15px;
    background: rgba(0, 0, 0, 0.7);
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
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));
    z-index: 1;
    border-radius: 4px;
  }
  .status-warpper {
    position: absolute;
    right: 10px;
  }
`;

const TicketStatusContainer = styled.span`
  display: inline-block;
  height: 22px;
  line-height: 24px;
  padding: 0 6px;
  border-radius: 4px;
  background: ${(props: TicketStatusContainerProps) => props.bgColor};
  color: ${(props: TicketStatusContainerProps) => props.textColor};
  font-weight: 700;
  font-size: 12px;
`;

export { TicketsContainer, TicketItemContainer, TicketStatusContainer };
