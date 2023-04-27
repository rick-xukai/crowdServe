import styled from 'styled-components';

import { Colors } from '../theme';

const CrowdFundDetailContainer = styled.div`
  padding-bottom: 75px;
  background: ${Colors.backgorund};
  .page-main {
    margin-top: 60px;
    .page-main-content {
      max-width: 350px;
      margin: auto;
      padding: 10px;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(5px);
      border-radius: 8px;
      .detail-banner {
        height: 170px;
        position: relative;
        border-radius: 4px;
        span {
          height: 100% !important;
          img {
            object-fit: cover;
            border-radius: 4px;
          }
        }
      }
    }
  }
  .detail-info {
    margin-top: 10px;
    .info-name {
      font-family: 'Oswald';
      font-weight: 700;
      font-size: 28px;
      color: ${Colors.grayScale70};
      margin-bottom: 16px;
    }
    .info-item {
      display: flex;
      font-weight: 400;
      font-size: 15px;
      margin-top: 5px;
      .info-item-description {
        margin-left: 8px;
        color: ${Colors.grayScale70};
      }
      .info-item-icon {
        width: 16px;
        padding-top: 2px;
        span {
          min-width: 100% !important;
          width: 100% !important;
          img {
            min-width: 16px !important;
            min-height: 16px !important;
            width: 16px !important;
            height: 16px !important;
          }
        }
      }
    }
    .campaign-details-title {
      font-weight: 700;
      font-size: 16px;
      color: ${Colors.grayScale90};
      margin-top: 32px;
    }
    .campaign-detail-text {
      font-weight: 300;
      font-size: 13px;
      color: ${Colors.grayScale90};
      margin-top: 12px;
      margin-bottom: 12px;
    }
    .info-card {
      margin-top: 20px;
      padding: 20px 24px;
      background: ${Colors.grayScale10};
      border-radius: 4px;
      position: relative;
    }
    .info-card-price {
      margin-top: 10px;
      .price,
      .days {
        font-weight: 700;
        font-size: 24px;
        color: ${Colors.grayScale70};
      }
      .price-text,
      .days-text {
        font-weight: 400;
        font-size: 13px;
        color: ${Colors.grayScale40};
      }
      .price-content {
        margin-bottom: 16px;
      }
    }
    .action-button {
      margin-top: 24px;
      .ant-btn {
        height: 45px;
        width: 100%;
        padding: 12px 10px;
        background: ${Colors.branding};
        border-radius: 2px;
        border: none;
        font-weight: 700;
        font-size: 15px;
        color: ${Colors.grayScale10};
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
    .fund-icon {
      position: absolute;
      right: 10px;
      width: 80px;
      height: 80px;
      bottom: 10px;
      opacity: 0.3;
    }
    .info-card-description {
      margin-top: 16px;
      font-weight: 300;
      font-size: 12px;
      color: ${Colors.grayScale50};
      p {
        margin: 0;
      }
    }
    .ticket-number {
      > :first-child {
        font-size: 17px;
        color: ${Colors.grayScale90};
        span {
          font-weight: 700;
          font-size: 24px;
          color: ${Colors.branding};
        }
      }
      > :last-child {
        font-weight: 400;
        font-size: 13px;
        color: ${Colors.grayScale40};
        margin-left: 5px;
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
  @media (min-width: 768px) and (max-width: 1200px) {
    .page-main {
      margin-top: 84px;
      .page-main-content {
        max-width: 688px;
        margin: auto;
        padding: 17px 20px;
        .detail-banner {
          height: 324px;
          span {
            height: 100% !important;
            img {
              object-fit: cover;
            }
          }
        }
      }
    }
  }
  @media (min-width: 1200px) {
    .page-main {
      margin-top: 130px;
      .page-main-content {
        max-width: 1008px;
        margin: auto;
        padding: 40px;
        .detail-banner {
          height: 465px;
          span {
            height: 100% !important;
            img {
              object-fit: cover;
            }
          }
        }
        .detail-info {
          margin-top: 40px;
          .campaign-details-title {
            margin-top: 24px;
          }
        }
      }
      .info-card {
        margin-top: 10px;
      }
    }
    .right-col {
      max-width: 360px;
    }
    .action-button {
      margin-top: 30px;
    }
  }
`;

export { CrowdFundDetailContainer };
