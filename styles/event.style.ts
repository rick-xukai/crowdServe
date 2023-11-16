import styled from 'styled-components';
import { Colors } from '../theme';

const EventListContainer = styled.div`
  height: 100%;
  overflow: auto;
  position: relative;
  .container-wrap {
    max-width: 1008px;
    margin: auto;
  }
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
  .carousel-banner {
    position: absolute;
    left: 0;
    width: 100%;
    height: 189px;
    z-index: 1;
    .banner-item {
      height: 189px;
      position: relative;
      background: ${Colors.black};
      cursor: pointer;
      img {
        max-width: 100%;
        max-height: 100%;
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center;
      }
    }
    .slick-dots {
      bottom: 0;
    }
  }
  .fire-disabled {
    right: 0px;
    bottom: 0;
    width: 20px;
  }
  .fire-gif-icon {
    right: 0px;
    width: 40px;
    bottom: 0;
  }
  @media (max-width: 768px) {
    .fire-gif-icon {
      right: 8px !important;
      bottom: 8px;
    }
    .fire-disabled {
      right: 8px !important;
      bottom: 8px;
    }
  }
  @media (min-width: 768px) and (max-width: 1200px) {
    .container-wrap {
      max-width: 688px;
    }
    .banner-item {
      height: 345px;
      position: relative;
      background: ${Colors.black};
      img {
        max-width: 100%;
        max-height: 100%;
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center;
      }
    }
  }
  ::-webkit-scrollbar {
    display: none;
  }
  .ant-spin-nested-loading .ant-spin-blur::after {
    opacity: 0;
  }
  .page-title {
    margin-bottom: 20px;
    .title {
      font-weight: 700;
      font-size: 28px;
      color: ${Colors.white};
      font-family: 'Oswald';
    }
    .ant-input-affix-wrapper {
      margin-top: 12px;
      height: 35px;
      padding: 8px 10px;
      background: ${Colors.grayScale70};
      border: 1px solid ${Colors.grayScale90};
      border-radius: 6px;
      input {
        background: ${Colors.grayScale70};
        font-weight: 400;
        font-size: 13px;
        color: ${Colors.grayScale40};
      }
      input::-webkit-input-placeholder {
        color: ${Colors.grayScale40};
      }
      .ant-input-prefix {
        color: ${Colors.grayScale40};
        font-size: 16px;
        margin-inline-end: 10px;
      }
    }
  }
  .page-main {
    padding: 0px 20px 70px 20px;
    margin-top: 50px;
    .event-list {
      .load-more {
        color: ${Colors.white};
        text-align: center;
        .anticon {
          margin-right: 10px;
        }
      }
      &.mobile {
        padding-top: 215px;
      }
    }
    .no-event-row {
      align-items: center;
      height: calc(100vh - 400px);
    }
    .no-event {
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
      padding-bottom: 100px;
    }
    .ant-input-group-addon {
      display: none;
    }
    .ant-input-affix-wrapper:focus,
    .ant-input-affix-wrapper-focused {
      border: 1px solid ${Colors.grayScale10};
      input {
        color: ${Colors.white};
      }
    }
    .ant-input-suffix {
      margin-inline-start: 8px;
    }
    .ant-input-clear-icon {
      display: flex;
      align-items: center;
    }
    &.desktop-responsive {
      padding: 0 0 70px 0;
      .ant-carousel {
        margin-bottom: 30px;
        margin-top: 30px;
      }
      @media (min-width: 768px) and (max-width: 1200px) {
        .ant-carousel {
          margin-top: 9px;
        }
        .page-title {
          .ant-input-affix-wrapper {
            height: 40px;
          }
        }
        .banner-item {
          height: 345px;
        }
        .event-list-container-responsive {
          > :nth-last-child(2) {
            margin-bottom: 0;
          }
        }
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
  .event-list-container {
    > :last-child {
      margin-bottom: 0;
    }
    &.event-list-container-responsive {
      display: flex;
      flex-wrap: wrap;
      > :nth-child(2n) {
        margin-right: 0;
      }
    }
  }
  @media (min-width: 1200px) {
    .banner-item {
      height: 505px;
      position: relative;
      background: ${Colors.black};
      cursor: pointer;
      img {
        max-width: 100%;
        max-height: 100%;
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center;
      }
    }
    .ant-input-affix-wrapper {
      max-width: 496px;
    }
  }
  .transfer-status-modal {
    .ant-modal-body {
      color: ${Colors.grayScale50};
      font-size: 15px;
      font-weight: 400;
      line-height: 21px;
    }
  }
`;

const EventItemContainer = styled.div`
  border-radius: 4px;
  padding: 10px;
  min-height: 223px;
  margin-bottom: 20px;
  position: relative;
  @media (min-width: 767px) {
    min-width: 358px;
  }
  @media (min-width: 1023px) {
    min-width: 315px;
  }
  @media (min-width: 1280px) {
    min-width: 292px;
    max-width: 292px;
  }
  .event-background {
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
    padding: 8px;
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
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));
    z-index: 1;
    border-radius: 4px;
  }
  .status-warpper {
    position: absolute;
    right: 10px;
  }
`;

const DesktopEventItemContainer = styled.div`
  padding: 12px;
  width: 496px;
  height: 120px;
  background: ${Colors.grayScale70};
  border-radius: 4px;
  margin-right: 16px;
  margin-bottom: 16px;
  cursor: pointer;
  .event-background {
    height: 96px;
    border-radius: 4px;
    img,
    video {
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
    padding-left: 20px;
    margin-top: -2px;
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
  @media (min-width: 768px) and (max-width: 1200px) {
    width: 330px;
    height: 306px;
    margin-right: 26px;
    margin-bottom: 26px;
    padding: 8px;
    .desktop-event-row {
      display: block;
    }
    .event-background {
      height: 158px;
      img,
      video {
        object-fit: cover;
        border-radius: 4px;
      }
    }
    .item-info {
      padding: 18px 8px 8px 8px;
    }
  }
`;

export { EventListContainer, EventItemContainer, DesktopEventItemContainer };
