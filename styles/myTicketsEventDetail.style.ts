import styled from 'styled-components';

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
    height: 220px;
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
        align-items: start;
        span {
          height: 100% !important;
        }
        img {
          width: 16px !important;
        }
        .info-item-icon {
          margin: unset !important;
          /* margin-top: 2px !important; */
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
  @media (min-width: 1200px) {
    padding-top: 0;
    .page-main {
      margin-top: 104px;
      padding-bottom: 40px;
      .detail-background {
        height: 504px;
      }
      .show-more {
        cursor: pointer;
      }
      .event-detail-container {
        padding-left: 0;
        padding-right: 0;
        margin-top: 0;
        border-radius: 0;
      }
      .ant-divider {
        margin-top: 40px;
        margin-bottom: 40px;
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
      .detail-background {
        height: 344px;
      }
      .event-detail-container {
        margin-top: 24px;
        padding: 0;
        border-radius: 0;
      }
      .ant-divider {
        margin-top: 40px;
        margin-bottom: 40px;
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

export {
  MyTicketsEventDetailContainer,
  StatusContainer,
  MyTicketItemContainer,
};
