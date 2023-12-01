import styled from 'styled-components';
import { Col } from 'antd';
import { Colors } from '../theme';

const EventDetailContainer = styled.div`
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
  .page-main {
    padding-bottom: 50px;
  }
  .detail-background {
    width: 100%;
    height: 188px;
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
        .info-item-status {
          margin-bottom: 10px;
        }
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
        img {
          width: 16px !important;
        }
        .info-item-icon {
          margin: unset !important;
          margin-top: 2px !important;
          min-width: 16px !important;
          min-height: 16px !important;
        }
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
      .info-description {
        font-weight: 400;
        font-size: 15px;
        color: ${Colors.white};
        margin-left: 8px;
        max-width: 90%;
      }
    }
    .dividing-line {
      height: 0.6px;
      background: ${Colors.grayScale90};
      margin-top: -16px;
      margin-bottom: 15px;
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
  .item-tabs {
    &.tabs-rave {
      @media (max-width: 420px) {
        .ant-tabs-tab {
          margin: 0 0 0 18px;
        }
        .ant-tabs-tab-btn {
          font-size: 14px;
        }
        .ant-tabs-nav-list {
          > :first-child {
            margin: 0 0 0 0;
          }
        }
      }
    }
  }
  .ant-tabs {
    margin-top: 30px;
    @media (max-width: 576px) {
      .ant-tabs-nav-wrap {
        margin: auto;
      }
    }
  }
  .ant-tabs-nav {
    height: 35px;
    margin: 0 0 13px 0;
  }
  .ant-tabs-top >.ant-tabs-nav::before {
    border-bottom: none;
  }
  @media (max-width: 374px) {
    .ant-tabs .ant-tabs-tab+.ant-tabs-tab {
      margin: 0 0 0 10px;
    }
  }
  .ant-tabs-tab {
    padding: 0 0 6px 0;
    align-items: unset;
    font-weight: 400;
    font-size: 17px;
    color: ${Colors.grayScale50};
    cursor: unset;
    .anticon {
      margin-left: 5px;
      margin-right: 0;
      font-size: 14px;
    }
  }
  .ant-tabs-tab-btn {
    font-weight: 500;
    font-size: 15px;
    @media (max-width: 374px) {
      font-size: 14px;
    }
  }
  .ant-tabs .ant-tabs-tab:hover {
    color: ${Colors.grayScale50};
  }
  .ant-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: ${Colors.white};
  }
  .ant-tabs .ant-tabs-tab-btn:active {
    color: ${Colors.grayScale50};
  }
  .ant-tabs-ink-bar {
    height: 3px !important;
    background: transparent;
    text-align: center;
    overflow: hidden;
  }
  .ant-tabs-ink-bar::after {
    content: "";
    position: absolute;
    width: 40px;
    height: 100%;
    -ms-transform: translateX(-50%);
    transform: translateX(-50%);
    background: ${Colors.white};
    border-radius: 2px;
  }
  .ant-tabs-nav-list {
    width: 100%;
    overflow: hidden;
    @media (min-width: 767px) {
      display: block !important;
    }
    @media (max-width: 375px) {
      justify-content: space-between;
    }
  }
  .install-app {
    text-align: center;
    margin-top: 20px;
    margin-bottom: 20px;
    img {
      margin-bottom: 10px;
    }
    p {
      margin: 0;
      font-weight: 400;
      font-size: 15px;
      color: ${Colors.grayScale20};
    }
    .install-btn {
      color: ${Colors.branding};
      margin-top: 10px;
    }
  }
  .items-skeleton {
    .type-img {
      > :first-child {
        width: 100%;
        height: 100%;
        display: inline-block;
        .react-loading-skeleton {
          height: 100%;
          line-height: unset;
        }
      }
    }
    .type-info-content-skeleton {
      width: 100%;
    }
  }
  @media (min-width: 1200px) {
    padding-top: 0;
    .page-main {
      margin-top: 104px;
      padding-bottom: 90px;
      .detail-background {
        height: 504px;
      }
      .show-more {
        cursor: pointer;
      }
      .event-detail-container {
        padding-left: 12px;
        padding-right: 12px;
        margin-top: 0;
        border-radius: 0;
      }
    }
    .item-tabs {
      margin-top: 55px;
    }
    .ant-tabs-tab-btn,
    .install-btn {
      cursor: pointer;
    }
    .ant-tabs-nav {
      margin-bottom: 28px;
    }
  }
  @media(min-width: 1200px) {
    .dividing-line {
      margin-top: -28px !important;
    }
  }
  @media (min-width: 768px) and (max-width: 1200px) {
    padding-top: 0;
    .container-wrap {
      max-width: 688px;
    }
    .page-main {
      padding-top: 84px;
      padding-bottom: 90px;
      .detail-background {
        height: 344px;
      }
      .event-detail-container {
        margin-top: 24px;
        padding: 0;
        border-radius: 0;
      }
    }
    .ant-tabs-nav {
      margin-bottom: 22px;
    }
    .item-tabs {
      margin-top: 35px;
      .dividing-line {
        margin-top: -22px;
      }
    }
  }
  .ant-modal-content {
    padding: 15px 15px !important;
  }
`;

const TicketTypeItem = styled(Col)`
  background: ${Colors.backgorund};
  border-radius: 6px;
  &.no-click {
    cursor: default;
  }
  .type-img {
    height: 140px;
    padding: 6px;
    border-radius: 6px;
    background: ${Colors.black10};
    position: relative;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }
    .not-sale {
      position: absolute;
      border-radius: 0px 0px 4px 4px;
      background: rgba(78, 78, 78, 0.7);
      backdrop-filter: blur(8px);
      color: ${Colors.white};
      text-align: center;
      font-size: 12px;
      font-weight: 700;
      line-height: 21px;
      height: 28px;
      width: calc(100% - 12px);
      bottom: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .type-info {
    background: ${Colors.black10};
    border-radius: 6px;
    overflow: hidden;
    padding: 20px;
    position: relative;
    .line {
      text-align: center;
      img {
        position: absolute;
        left: 0;
        top: 10px;
        right: 0;
      }
    }
    .type-info-content {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      &.opacity {
        opacity: 0.6;
      }
    }
    .title {
      color: ${Colors.white};
      margin-bottom: 6px;
      font-size: 15px;
      line-height: 21px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .description {
      color: ${Colors.grayScale40};
      font-size: 13px;
      font-weight: 400;
      line-height: 19px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
    .price {
      color: ${Colors.branding};
      font-size: 15px;
      font-weight: 500;
      line-height: 21px;
      margin-top: 16px;
    }
  }
  .out-stock-mask {
    text-align: center;
    position: absolute;
    top: 6px;
    left: 0;
    width: calc(100% - 12px);
    height: calc(100% - 12px);
    right: 0;
    margin: auto;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
    font-weight: 700;
    font-size: 20px;
    color: ${Colors.grayScale10};
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-family: Oswald;
  }
  @media (min-width: 1200px) {
    .type-img {
      height: 162px;
    }
    cursor: pointer;
  }
  @media (min-width: 768px) and (max-width: 1200px) {
    .type-img {
      height: 140px;
    }
    .type-info {
      .description {
        -webkit-line-clamp: 2;
      }
    }
  }
  @media (max-width: 768px) {
    .type-info {
      .description {
        -webkit-line-clamp: 1;
      }
    }
  }
`;

const SecondaryMarketItem = styled.div`
  position: relative;
  border-radius: 4px;
  padding: 2px;
  background: ${Colors.grayScale70};
  .owner-content {
    background: ${Colors.grayScale10};
    position: absolute;
    bottom: 0;
    width: 100%;
    left: 0px;
    bottom: 48.5px;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 2px;
    padding-bottom: 2px;
    p {
      color: ${Colors.backgorund};
      text-align: center;
      font-size: 12px;
      font-weight: 700;
      margin: 0;
      margin-left: 6px;
    }
    img {
      width: 12px;
    }
  }
  .item-background {
    position: relative;
    width: 100%;
    height: 158px;
    max-height: 158px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }
  }
  .item-bottom {
    background: ${Colors.grayScale70};
    padding: 6px 6px 0 6px;
    .bottom-type {
      color: ${Colors.white};
      font-size: 15px;
      font-weight: 400;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .bottom-price {
      color: ${Colors.branding};
      font-size: 14px;
      font-weight: 700;
    }
  }
  .item-price {
    position: absolute;
    bottom: 0px;
    width: 100%;
    left: 0px;
    padding: 8px;
    background: rgba(78, 78, 78, 0.7);
    backdrop-filter: blur(8px);
    border-radius: 0px 0px 4px 4px;
    span {
      font-weight: 700;
      font-size: 18px;
      color: ${Colors.white};
    }
  }
  .item-type {
    line-height: 24px;
    padding-top: 0;
    padding-bottom: 0;
    white-space: nowrap;
    max-width: 75px;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0px 6px;
    background: ${Colors.grayScale10};
    border-radius: 6px;
    font-weight: 700;
    font-size: 15px;
    color: ${Colors.grayScale70};
    position: absolute;
    right: 6px;
  }
  @media (min-width: 1200px) {
    cursor: pointer;
  }
`;

const JoinRaveModalContent = styled.div`
  padding: 25px 22px;
  .content-title {
    color: ${Colors.grayScale70};
    text-align: center;
    font-family: Oswald;
    font-size: 24px;
    font-weight: 700;
    line-height: 32px;
    text-transform: uppercase;
  }
  .content-banner {
    margin-top: 32px;
    padding: 20px 22px;
    &.scroll {
      overflow: auto;
      padding-top: 12px;
      padding-left: 10px;
      @media (min-width: 375px) {
        padding-top: 17px;
        padding-left: 15px;
      }
      .banner-items {
        justify-content: initial;
      }
    }
    .banner-items {
      display: flex;
      justify-content: space-around;
    }
  }
  .content-users {
    margin-top: 32px;
    text-align: center;
    .ant-avatar-group {
      > :nth-child(1) {
        background-color: ${Colors.darkRed};
      }
      > :nth-child(2) {
        background-color: ${Colors.navyBlue};
      }
      > :nth-child(3) {
        background-color: ${Colors.purple};
      }
      > :nth-child(4) {
        background-color: ${Colors.grayishYellow};
      }
      > :nth-child(5) {
        background-color: ${Colors.lightBlue};
      }
      > :nth-child(6) {
        background-color: ${Colors.greener};
      }
    }
    .ant-avatar {
      width: 40px;
      height: 40px;
      line-height: 40px;
      color: ${Colors.white};
      font-size: 16px;
      font-weight: 700;
    }
    .users-count {
      color: ${Colors.grayScale90};
      font-size: 16px;
      font-weight: 700;
      line-height: 23px;
      margin-top: 8px;
    }
  }
  .content-button {
    text-align: center;
    margin-top: 24px;
    .ant-btn {
      width: 60%;
      height: 45px;
      border-radius: 2px;
      background: ${Colors.branding};
      color: ${Colors.grayScale10};
      font-size: 15px;
      font-weight: 700;
      line-height: 21px;
      text-transform: uppercase;
      .anticon {
        font-size: 18px;
        margin-right: 10px;
      }
    }
  }
  .content-checkbox {
    text-align: center;
    margin-top: 16px;
    span {
      color: ${Colors.grayScale70};
      font-size: 13px;
      font-weight: 400;
      line-height: 19px;
    }
    .ant-checkbox-wrapper:not(.ant-checkbox-wrapper-disabled):hover
      .ant-checkbox-checked:not(.ant-checkbox-disabled)
      .ant-checkbox-inner {
      background: ${Colors.branding};
    }
    .ant-checkbox-wrapper:not(.ant-checkbox-wrapper-disabled):hover
      .ant-checkbox-checked:not(.ant-checkbox-disabled):after {
      border-color: ${Colors.branding} !important;
    }
    .ant-checkbox-checked:after {
      border: 1px solid ${Colors.branding};
    }
    .ant-checkbox-checked:not(.ant-checkbox-disabled):hover
      .ant-checkbox-inner {
      background-color: transparent;
      border-color: ${Colors.branding};
    }
    .ant-checkbox:not(.ant-checkbox-disabled):hover .ant-checkbox-inner {
      border-color: ${Colors.branding};
    }
    .ant-checkbox-wrapper:not(.ant-checkbox-wrapper-disabled):hover
      .ant-checkbox-inner {
      border-color: ${Colors.branding};
    }
    .content-checkbox .ant-checkbox-checked .ant-checkbox-inner:after {
      border-color: ${Colors.white};
    }
    .content-checkbox .ant-checkbox-checked:after {
      border-color: ${Colors.white};
    }
    .ant-checkbox-checked {
      color: ${Colors.white};
      .ant-checkbox-inner {
        background: ${Colors.branding};
        border-color: ${Colors.branding};
      }
    }
    .ant-checkbox-inner {
      width: 17px;
      height: 17px;
      background: transparent;
      border: 1px solid ${Colors.grayScale50};
    }
  }
  @media (max-width: 576px) {
    padding: 0;
    .content-title {
      font-size: 20px;
    }
    .content-banner {
      padding: 0;
      margin-top: 20px;
    }
    .content-users {
      .users-count {
        font-size: 14px;
      }
    }
    .content-button {
      .ant-btn {
        width: 100%;
      }
    }
  }
  @media (max-width: 375px) {
    .free-icon {
      left: -15px !important;
      top: -20px !important;
    }
  }
`;

const JoinRaveModalBannerItem = styled.div`
  position: relative;
  width: 164px;
  border-radius: 8px;
  background: ${Colors.linearGradient3};
  padding: 4px;
  &.scroll-item {
    margin-right: 20px;
  }
  .gradient-box {
    padding: 4px;
    background: ${Colors.backgorund};
    border-radius: 5px;
    height: 100%;
  }
  .items-img {
    height: 140px;
    border-radius: 4px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 4px;
      object-fit: cover;
    }
  }
  .item-name {
    margin-top: 10px;
    margin-bottom: 5px;
    color: ${Colors.white};
    text-align: center;
    font-size: 14px;
    font-weight: 700;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  .free-icon {
    position: absolute;
    left: -20px;
    top: -25px;
  }
  @media (max-width: 576px) {
    min-width: 132px;
    max-width: 132px;
    .items-img {
      height: 120px;
    }
  }
`;

export {
  EventDetailContainer,
  TicketTypeItem,
  SecondaryMarketItem,
  JoinRaveModalContent,
  JoinRaveModalBannerItem,
};
