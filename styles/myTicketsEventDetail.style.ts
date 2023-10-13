import styled from 'styled-components';
import { Col } from 'antd';

import { Colors } from '../theme';

interface StatusContainerProps {
  bgColor: string;
  textColor: string;
}

const MyTicketsEventDetailContainer = styled.div`
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
  .detail-background {
    width: 100%;
    background: ${Colors.black};
    aspect-ratio: 2 / 1;
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
      .info-title {
        font-family: 'Oswald';
        font-weight: 700;
        font-size: 24px;
        color: ${Colors.white};
        margin-bottom: 12px;
        max-width: 100%;
      }
      .info-description-short {
        color: ${Colors.grayScale40};
        margin-bottom: 12px;
        font-size: 17px;
        font-weight: 400;
        line-height: 24px;
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
        align-items: start;
        .show-map-action {
          cursor: pointer;
          margin-left: 10px;
          color: ${Colors.branding};
          font-size: 13px;
          font-weight: 400;
          line-height: 19px;
          .anticon {
            margin-left: 5px;
          }
        }
        span {
          height: 100% !important;
        }
        img {
          width: 16px !important;
        }
        .info-item-icon {
          margin: unset !important;
          min-width: 16px !important;
          min-height: 16px !important;
        }
      }
      .info-description {
        font-weight: 300;
        font-size: 15px;
        color: ${Colors.white};
        margin-left: 8px;
        max-width: 90%;
        line-height: 19px;
        &.organizer {
          text-decoration: underline;
          @media (min-width: 1200px) {
            cursor: pointer;
          }
        }
      }
      .info-item-status {
        margin-bottom: 10px;
      }
      .ant-divider {
        background: ${Colors.grayScale90};
      }
    }
    .my-ticket-items {
      .title {
        font-family: 'Oswald';
        color: ${Colors.white};
        font-size: 16px;
        font-weight: 700;
        margin-bottom: 20px;
      }
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
  .google-map-content {
    width: 100%;
    height: 266px;
    border-radius: 4px;
    background: #fff;
    margin-top: 12px;
    > :first-child {
      height: 100% !important;
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
  .divider-content {
    margin-top: 40px;
    margin-bottom: 40px;
    &.show-more-divider {
      margin-top: 80px;
    }
    .ant-divider {
      margin-top: 0;
      margin-bottom: 0;
    }
  }
  @media (min-width: 1200px) {
    padding-top: 0;
    .page-main {
      margin-top: 104px;
      padding-bottom: 40px;
      .show-more {
        cursor: pointer;
      }
      .event-detail-container {
        padding-left: 0;
        padding-right: 0;
        margin-top: 0;
        border-radius: 0;
      }
      .my-ticket-items {
        .title {
          font-size: 24px;
        }
      }
    }
  }
  @media (min-width: 768px) and (max-width: 1200px) {
    padding-top: 0;
    .container-wrap {
      max-width: 688px;
    }
    .page-main {
      padding-top: 84px;
      padding-bottom: 40px;
      .event-detail-container {
        margin-top: 24px;
        padding: 0;
        border-radius: 0;
      }
      .my-ticket-items {
        .title {
          font-size: 24px;
        }
      }
    }
  }
`;

const StatusContainer = styled.span`
  display: inline-block;
  height: 22px;
  line-height: 24px;
  padding: 0 6px;
  border-radius: 4px;
  background: ${(props: StatusContainerProps) => props.bgColor};
  color: ${(props: StatusContainerProps) => props.textColor};
  font-weight: 700;
  font-size: 12px;
  margin-top: 5px;
`;

const MyTicketItemContainer = styled.div`
  border-radius: 4px;
  position: relative;
  min-height: 335px;
  &.collectible {
    max-height: 160px;
    min-height: 160px;
    .item-detail {
      height: 52px;
      .item-detail-name {
        font-weight: 400;
        margin-bottom: 0;
      }
      .item-detail-status {
        .item-detail-icon {
          width: 40px;
          height: 40px;
        }
        .ticket-onsale {
          width: 40px;
          height: 40px;
        }
      }
    }
    .name-content {
      height: 100%;
      display: flex;
      align-items: center;
    }
  }
  .item-background {
    width: 100%;
    height: 100%;
    img,
    video {
      width: 100% !important;
      height: 100% !important;
      object-fit: cover;
      border-radius: 4px;
    }
  }
  .item-detail {
    background: rgba(78, 78, 78, 0.7);
    backdrop-filter: blur(8px);
    border-radius: 4px;
    left: 0;
    position: absolute;
    right: 0;
    width: calc(100% - 12px);
    bottom: 6px;
    margin: auto;
    padding: 6px;
    display: flex;
    align-items: center;
    > :first-child {
      width: 100%;
    }
    .item-detail-name {
      margin: 0;
      font-weight: 500;
      font-size: 15px;
      color: ${Colors.white};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .item-detail-status {
      height: 100%;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: end;
      .item-detail-icon {
        width: 40px;
        height: 40px;
      }
      .ticket-onsale {
        width: 52px;
        &.transfer {
          height: 52px;
        }
        span {
          width: 100% !important;
          height: 100% !important;
        }
        img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover;
          border-radius: 4px;
        }
      }
    }
  }
  @media (min-width: 768px) and (max-width: 1200px) {
    min-height: 214px;
    .item-detail {
      height: 60px !important;
      .item-detail-status {
        .ticket-onsale {
          width: 53px;
          height: 50px;
          padding-left: 8px;
          &.transfer {
            height: 40px;
          }
        }
      }
    }
    &.collectible {
      max-height: 214px;
      min-height: 214px;
      .item-detail {
        padding-top: 10px;
        padding-bottom: 10px;
        .item-detail-name {
          font-weight: 500;
        }
        .item-detail-status {
          .item-detail-icon {
            width: 40px;
            height: 40px;
          }
          .ticket-onsale {
            width: 55px;
            height: 48px;
          }
        }
      }
    }
  }
  @media (min-width: 1200px) {
    min-height: 234px;
    cursor: pointer;
    .item-detail {
      height: 60px;
      .item-detail-status {
        .ticket-onsale {
          width: 53px;
          height: 50px;
          padding-left: 8px;
          &.transfer {
            height: 40px;
          }
        }
      }
    }
    &.collectible {
      max-height: 234px;
      min-height: 234px;
      .item-detail {
        padding-top: 10px;
        padding-bottom: 10px;
        .item-detail-name {
          font-weight: 500;
        }
        .item-detail-status {
          .item-detail-icon {
            width: 40px;
            height: 40px;
          }
          .ticket-onsale {
            width: 55px;
            height: 55px;
          }
        }
      }
    }
  }
`;

const EventDetailCard = styled(Col)`
  margin-top: 32px;
  .detail-title {
    color: ${Colors.white};
    font-size: 18px;
    font-weight: 700;
    line-height: 25px;
  }
  .detail-show-more-box {
    position: relative;
    .show-more-box-action {
      color: ${Colors.white};
      font-size: 13px;
      font-weight: 500;
      line-height: 19px;
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 1;
      background: linear-gradient(
        180deg,
        rgba(39, 39, 42, 0) 0%,
        ${Colors.backgorund} 100%
      );
      &.no-background {
        background: unset;
      }
      .anticon {
        margin-left: 5px;
      }
      > :first-child {
        text-align: center;
        position: absolute;
        width: 100%;
        bottom: -44px;
      }
      .action-button {
        display: flex;
        justify-content: center;
        align-items: center;
        span {
          cursor: pointer;
        }
        > :last-child {
          margin-top: 3px;
        }
      }
    }
    .show-box {
      &.no-show-more {
        height: auto !important;
      }
      &.event-detail {
        margin-bottom: 40px;
      }
      .detail-description,
      .refund-info {
        color: ${Colors.grayScale40};
        font-size: 13px;
        font-weight: 300;
        line-height: 19px;
        margin-top: 15px;
        margin-bottom: 24px;
      }
      .refund-info {
        margin-top: 24px;
        margin-bottom: 0px;
      }
    }
  }
`;

const TransferStatusContainer = styled.div`
  height: 32px;
  line-height: 32px;
  padding: 0 10px;
  position: absolute;
  z-index: 1;
  border-radius: 2px;
  background: ${Colors.greenRgb};
  backdrop-filter: blur(2px);
  color: ${Colors.white};
  font-family: Oswald;
  font-size: 20px;
  font-weight: 700;
  text-transform: uppercase;
  left: 5px;
  top: 5px;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  @media (max-width: 576px) {
    max-width: unset;
    width: 90%;
    text-align: center;
  }
`;

export {
  MyTicketsEventDetailContainer,
  StatusContainer,
  MyTicketItemContainer,
  EventDetailCard,
  TransferStatusContainer,
};
