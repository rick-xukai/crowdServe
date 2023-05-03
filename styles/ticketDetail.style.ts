import styled from 'styled-components';
import { Colors } from '../theme';

const TicketDetailContainer = styled.div`
  height: 100%;
  position: relative;
  background: ${Colors.backgorund};
  max-width: 335px;
  margin: auto;
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
    border-radius: 6px;
    img,
    video {
      width: 100%;
      height: 100%;
      border-radius: 6px;
    }
  }
  .detail-info {
    background: ${Colors.backgorund};
    overflow: hidden;
    padding-bottom: 90px;
    padding-top: 20px;
    &.detail-info-no-code {
      padding-bottom: 70px;
    }
    ::-webkit-scrollbar {
      display: none;
    }
    .info-container {
      background: ${Colors.backgorund};
      .container-top {
        position: relative;
      }
      .border-line {
        margin-bottom: 15px;
        span {
          width: 100% !important;
        }
        img {
          left: 3px !important;
          object-fit: cover;
        }
      }
      .ticket-name {
        font-weight: 700;
        font-size: 24px;
        color: ${Colors.white};
        text-transform: uppercase;
      }
      .share-button {
        padding-top: 4px;
        text-align: right;
        z-index: 1;
        .share-text {
          font-weight: 700;
          font-size: 16px;
          color: ${Colors.grayScale10};
          margin-left: 8px;
        }
        .share-trigger {
          display: flex;
          align-items: center;
          justify-content: end;
          span {
            cursor: pointer;
          }
        }
      }
      .organizer-name {
        margin-top: 10px;
        font-weight: 400;
        font-size: 15px;
        color: ${Colors.grayScale30};
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
      .container-info-item {
        margin-top: 20px;
        .info-item-row {
          padding: 10px 12px;
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
      @media (min-width: 1023px) {
        display: none;
      }
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
      @media (min-width: 1023px) {
        display: none;
      }
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
    background: ${Colors.black};
    z-index: 9999;
    .ant-float-btn-body {
      background: ${Colors.branding};
      box-shadow: 0px 1px 12px rgb(0 0 0 / 25%);
    }
    .ant-float-btn-icon {
      width: 40px !important;
      height: 40px !important;
    }
  }
  .ticket-poster {
    width: 335px;
    min-height: 338px;
    background: ${Colors.grayScale90};
    padding: 12px;
    position: absolute;
    bottom: -90px;
    z-index: -99999999;
    .poster {
      min-height: 200px;
      border-radius: 8px;
      margin-bottom: 24px;
      position: relative;
      img {
        width: 100% !important;
        height: 100% !important;
        border-radius: 8px;
      }
    }
    .poster-name {
      font-weight: 700;
      font-size: 18px;
      color: ${Colors.grayScale10};
      margin-bottom: 8px;
      text-align: center;
    }
    .poster-organizerName {
      font-weight: 500;
      font-size: 15px;
      color: ${Colors.grayScale20};
      margin-bottom: 8px;
      text-align: center;
    }
    .poster-logo {
      text-align: center;
      img {
        width: 68px;
        height: 27px;
      }
    }
  }
  .ticket-status-icon {
    width: 62px;
    height: 62px;
    position: absolute;
    right: 0;
    bottom: 0;
  }
  @media (min-width: 1200px) {
    max-width: 1007px;
    padding: 0;
    .detail-background {
      margin-top: 104px;
      height: 504px;
      img,
      video {
        object-fit: cover;
      }
    }
    .detail-info {
      padding: 24px 0 103px 0;
      &.detail-info-no-code {
        padding-bottom: 80px;
      }
    }
    .container-info-item {
      margin-top: 40px;
    }
    .info-item-row-flex {
      margin-bottom: 10px;
    }
    .ticket-status-icon {
      width: 148px;
      height: 148px;
    }
  }
  @media (min-width: 768px) and (max-width: 1200px) {
    max-width: 688px;
    padding: 0;
    .detail-background {
      margin-top: 85px;
    }
    .detail-info {
      padding: 0;
      padding-top: 20px;
      padding-bottom: 70px;
    }
    .info-item-row-flex {
      margin-bottom: 10px;
    }
    .container-info-item {
      margin-top: 20px;
    }
    .ticket-status-icon {
      width: 85px;
      height: 85px;
    }
  }
`;

export { TicketDetailContainer };
