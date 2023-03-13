import styled from 'styled-components';
import { Colors } from '../theme';

const EventListContainer = styled.div`
  padding: 20px;
  height: 100%;
  overflow: auto;
  max-width: 765px;
  margin: auto;
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
    margin-top: 50px;
    .event-list {
      .load-more {
        color: ${Colors.white};
        text-align: center;
        .anticon {
          margin-right: 10px;
        }
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
      padding-bottom: 80px;
    }
    .ant-input-group-addon {
      display: none;
    }
    .ant-input-affix-wrapper:focus, .ant-input-affix-wrapper-focused {
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
`;

const EventItemContainer = styled.div`
  border-radius: 4px;
  padding: 10px;
  min-height: 223px;
  margin-bottom: 20px;
  position: relative;
  .event-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    img, video {
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

export { EventListContainer, EventItemContainer };
