import styled from 'styled-components';

import { Colors } from '../theme';

const BackgroundLogoPath = '../static/images/background-logo.png';

interface TicketStatusContainerProps {
  bgColor: string;
  textColor: string;
}

const TickersContainer = styled.div`
  padding: 20px;
  .page-title {
    margin-bottom: 20px;
    .title {
      font-weight: 700;
      font-size: 28px;
      color: ${Colors.white};
      font-family: 'Oswald';
    }
  }
  .page-main {
    margin-top: 25px;
    .tickets-list {
      height: calc(100vh - 100px);
      overflow: auto;
      ::-webkit-scrollbar {
        display: none;
      }
      .load-more {
        color: ${Colors.white};
        text-align: center;
        .anticon {
          margin-right: 10px;
        }
      }
      > :nth-last-child(2) {
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
  }
  .ant-spin {
    max-height: unset !important;
    background: rgba(0, 0, 0, 0.5);
    .anticon {
      color: ${Colors.branding};
    }
  }
  .ant-spin-container,
  .ant-spin-nested-loading{
    opacity: unset;
  }
  .ant-spin-nested-loading {
    position: unset;
  }
  .ant-spin-nested-loading .ant-spin-blur::after {
    opacity: 0;
  }
`;

const TicketItemContainer = styled.div`
  border-radius: 4px;
  padding: 10px;
  min-height: 223px;
  margin-bottom: 20px;
  position: relative;
  .ticket-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    img, video {
      width: 100%;
      height: 100%;
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

export {
  TickersContainer,
  TicketItemContainer,
  TicketStatusContainer,
  BackgroundLogoPath,
};
