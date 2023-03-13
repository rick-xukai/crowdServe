import styled from 'styled-components';
import { Colors } from '../theme';

const TicketDetailContainer = styled.div`
  height: 100%;
  position: relative;
  background: ${Colors.backgorund};
  .goback-icon {
    position: absolute;
    color: ${Colors.white};
    font-size: 22px;
    top: 10px;
    left: 10px;
  }
  .detail-background {
    width: 100%;
    margin-top: 45px;
    img, video {
      width: 100%;
      height: 100%;
    }
  }
  .detail-info {
    padding: 10px 10px 103px 10px;
    background: ${Colors.backgorund};
    overflow: hidden;
    &.detail-info-no-code {
      padding-bottom: 10px;
    }
    ::-webkit-scrollbar {
      display: none;
    }
    .info-container {
      background: ${Colors.grayScale70};
      border: 1px solid rgba(113, 113, 121, 0.5);
      box-shadow: 0px 3px 30px rgba(0, 0, 0, 0.25);
      border-radius: 10px;
      padding: 20px 15px;
      .container-top {
        position: relative;
        .ticket-status-icon {
          width: 72px;
          height: 72px;
          position: absolute;
          right: 0;
        }
      }
      .border-line {
        margin-bottom: 15px;
        img {
          left: 3px !important;
        }
      }
      .ticket-name {
        font-weight: 700;
        font-size: 24px;
        color: ${Colors.white};
        text-transform: uppercase;
        margin-bottom: 10px;
      }
      .organizer-name {
        margin-top: 10px;
        font-weight: 400;
        font-size: 15px;
        color: ${Colors.grayScale30};
      }
      .container-info-item {
        .info-item-row {
          padding: 8px 10px;
          border-radius: 4px;
          background: ${Colors.grayScale90};
          margin-bottom: 8px;
          height: calc(100% - 10px);
          .info-item-title {
            font-weight: 300;
            font-size: 13px;
            color: ${Colors.grayScale40};
            margin-bottom: 5px;
          }
          .info-item-value {
            font-weight: 500;
            font-size: 15px;
            color: ${Colors.white};
          }
        }
        .info-item-row-flex {
          .info-item-row {
            margin-right: 8px;
            height: calc(100% - 10px);
          }
          > :last-child {
            .info-item-row {
              margin-right: 0px;
            }
          }
        }
      }
      .container-bottom {
        margin-top: 15px;
        .view-blockchain {
          font-weight: 400;
          font-size: 13px;
          color: ${Colors.grayScale10};
          margin-left: 8px;
        }
      }
    }
  }
  .ticket-description {
    margin-top: 8px;
    position: relative;
    .circle-left {
      position: absolute;
      border-radius: 0 50% 50% 0;
      border-right: 1px solid rgba(113, 113, 121, 0.5);
      height: 30px;
      width: 30px;
      background: ${Colors.backgorund};
      z-index: 1;
      left: -30px;
      bottom: -28px;
    }
    .circle-right {
      position: absolute;
      border-radius: 50% 0 0 50%;
      border-left: 1px solid rgba(113, 113, 121, 0.5);
      height: 30px;
      width: 30px;
      background: ${Colors.backgorund};
      z-index: 1;
      right: -30px;
      bottom: -28px;
    }
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
  .whole-description {
    color: ${Colors.grayScale40};
    font-weight: 300;
    font-size: 13px;
    margin: 0;
    white-space: pre-wrap;
  }
  .ant-float-btn {
    left: 0;
    right: 0;
    bottom: 15px;
    margin: auto;
    width: 72px;
    height: 72px;
    .ant-float-btn-body {
      background: ${Colors.branding};
      box-shadow: 0px 1px 12px rgb(0 0 0 / 25%);
    }
    .ant-float-btn-icon {
      width: 40px !important;
      height: 40px !important;
    }
  }
`;

export { TicketDetailContainer };
