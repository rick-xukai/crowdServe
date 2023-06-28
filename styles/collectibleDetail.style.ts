import styled from 'styled-components';

import { Colors, Images } from '../theme';

const CollectibleDetailContainer = styled.div`
  margin: auto;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  .container-wrap {
    margin: auto;
  }
  ::-webkit-scrollbar {
    display: none;
  }
  .page-main {
    margin-top: 45px;
    padding: 0 20px 20px 20px;
    .collectible-info-image {
      width: 100%;
      height: 335px;
      background: ${Colors.black};
      position: relative;
      margin-bottom: 12px;
      img,
      video {
        max-width: 100%;
        max-height: 100%;
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center;
        &.error-full-image {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover;
        }
      }
      .on-sale-icon {
        position: absolute;
        bottom: 0;
        right: 0;
      }
    }
    .info-name {
      font-family: 'Oswald';
      font-weight: 700;
      font-size: 24px;
      color: ${Colors.white};
      line-height: 32px;
    }
    .info-share-button {
      text-align: right;
      z-index: 1;
      .share-content {
        padding-top: 4px;
        height: 100%;
        @media (min-width: 1200px) {
          padding-top: 2px;
        }
      }
      .share-text {
        font-weight: 700;
        font-size: 16px;
        color: ${Colors.grayScale10};
        margin-left: 8px;
        padding-top: 3px;
      }
      .share-trigger {
        display: flex;
        align-items: center;
        justify-content: end;
        > :first-child {
          width: 20px !important;
          height: 20px !important;
        }
        span {
          cursor: pointer;
        }
      }
      .dropdown-btn {
        background: unset;
        border: none;
        padding: 0;
      }
    }
    .info-organiser {
      font-weight: 400;
      font-size: 15px;
      color: ${Colors.grayScale30};
      margin-top: 12px;
      display: flex;
    }
    .info-view-blockchain {
      margin-top: 12px;
      font-size: 13px;
      font-weight: 400;
      color: ${Colors.chartBg};
      .anticon {
        margin-right: 8px;
      }
      a:hover {
        text-decoration: underline;
        color: ${Colors.chartBg};
      }
    }
    .info-description {
      font-weight: 300;
      font-size: 13px;
      color: ${Colors.grayScale40};
      margin-top: 12px;
    }
    .connected-events {
      > :last-child {
        margin-bottom: 0;
      }
      .connected-events-title {
        font-family: 'Oswald';
        font-weight: 700;
        color: ${Colors.white};
      }
    }
    .right-icon {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: end;
    }
    .chart-content {
      margin-top: 20px;
      .chart-title {
        font-weight: 700;
        font-size: 16px;
        color: ${Colors.white};
      }
      .no-chart {
        text-align: center;
        p {
          margin: 0;
          font-weight: 700;
          font-size: 20px;
          color: ${Colors.grayScale20};
        }
      }
    }
    .chart-title {
      font-family: 'Oswald';
      font-weight: 700;
      color: ${Colors.white};
      margin-bottom: 20px;
    }
    .event-info {
      margin-top: 24px;
    }
    .collectible-info {
      padding-bottom: 24px;
      border-bottom: 0.2px solid ${Colors.grayScale90};
    }
    .event-info-top {
      padding-bottom: 24px;
      border-bottom: 0.2px solid ${Colors.grayScale90};
      .event-info-title {
        font-weight: 700;
        font-size: 16px;
        color: ${Colors.white};
      }
    }
    .connected-events {
      margin-top: 24px;
      padding-bottom: 24px;
      border-bottom: 0.2px solid ${Colors.grayScale90};
      .connected-events-title {
        font-weight: 700;
        font-size: 16px;
        color: ${Colors.white};
        margin-bottom: 20px;
      }
    }
  }
  .page-bottom {
    height: 100px;
    width: 100%;
    position: fixed;
    background: ${Colors.backgorund};
    bottom: 0px;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    filter: drop-shadow(0px -1px 4px rgba(0, 0, 0, 0.25));
    z-index: 10;
    .ant-btn {
      background: ${Colors.branding};
      border-radius: 2px;
      border: none;
      width: 60%;
      height: 45px;
      font-weight: 700;
      font-size: 15px;
      color: ${Colors.grayScale10};
    }
  }
  .eventDetailModal {
    width: 720px !important;
    .ant-modal-body {
      max-height: 650px;
      overflow-y: scroll;
      overflow-x: hidden;
      ::-webkit-scrollbar {
        display: none;
      }
    }
    .ant-modal-content {
      background: rgba(48, 48, 52, 0.95);
      box-shadow: 0px 2px 14px rgba(0, 0, 0, 0.25);
      backdrop-filter: blur(5px);
      border-radius: 12px;
    }
  }
  .connectedEventDetailModal {
    width: 817px !important;
    max-height: 416px;
    height: 416px;
    .ant-modal-body {
      height: 100%;
    }
    .ant-modal-content {
      height: 100%;
      border-radius: 12px;
      padding: 0 !important;
      background: url(${Images.CollectibleDetailBackgroundDesktop.src}) center
        no-repeat;
    }
  }
  .ant-drawer-content-wrapper {
    width: 100%;
    bottom: 0 !important;
    height: 560px !important;
    max-width: 100%;
    .eventDetailDrawer {
      padding: 20px;
      background: rgba(48, 48, 52, 0.95);
      box-shadow: 0px 2px 14px rgba(0, 0, 0, 0.25);
      backdrop-filter: blur(5px);
      border-radius: 16px 16px 0px 0px;
      .ant-drawer-body {
        padding: 0 !important;
        height: 520px;
        overflow-y: scroll;
        overflow-x: hidden;
        ::-webkit-scrollbar {
          display: none;
        }
      }
    }
    .connectedEventDetailDrawer {
      padding: 20px;
      background: rgba(48, 48, 52, 0.95);
      box-shadow: 0px 2px 14px rgba(0, 0, 0, 0.25);
      backdrop-filter: blur(5px);
      border-radius: 16px 16px 0px 0px;
      .ant-drawer-body {
        padding: 0 !important;
        height: 560px;
        overflow-y: scroll;
        overflow-x: hidden;
        ::-webkit-scrollbar {
          display: none;
        }
      }
    }
  }
  .ticket-info-item {
    background: ${Colors.grayScale90};
    border-radius: 4px;
    padding: 6px 10px;
    .title {
      font-weight: 300;
      font-size: 13px;
      color: ${Colors.grayScale40};
      margin-bottom: 4px;
    }
    .value {
      font-weight: 500;
      font-size: 15px;
      color: ${Colors.white};
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .no-price-chart {
    text-align: center;
    p {
      margin-top: 15px;
      margin-bottom: 0;
      color: ${Colors.white};
      font-weight: 700;
      font-size: 20px;
    }
  }
  @media (min-width: 576px) and (max-width: 768px) {
    .eventDetailModal {
      width: 375px !important;
      .ant-modal-body {
        max-height: 553px;
      }
      .ant-modal-content {
        .event-image {
          width: 335px;
          height: 167px;
        }
      }
    }
  }
  @media (min-width: 576px) and (max-width: 1200px) {
    .connectedEventDetailModal {
      width: 375px !important;
      max-height: 663px;
      height: 663px;
      .ant-modal-content {
        height: 100%;
        padding: 20px !important;
        background: rgba(48, 48, 52, 0.95);
        box-shadow: 0px 2px 14px rgba(0, 0, 0, 0.25);
        backdrop-filter: blur(5px);
        border-radius: 12px;
      }
    }
  }
  @media (min-width: 1200px) {
    .container-wrap {
      max-width: 1008px;
    }
    .page-main {
      margin-top: 80px;
      padding: 25px 0 0px 0;
      &.page-bottom-show {
        padding-bottom: 100px;
        .event-info {
          height: calc(100vh - 205px);
        }
      }
      .collectible-info {
        padding-right: 30px;
        padding-bottom: 0;
        height: calc(100vh - 205px);
        overflow: auto;
        border-right: 1.5px solid ${Colors.grayScale90};
        padding-bottom: 24px;
        border-bottom: none;
        ::-webkit-scrollbar {
          display: none;
        }
      }
      .event-info {
        margin-top: 0;
        padding-left: 30px;
        border-left: 1.5px solid ${Colors.grayScale90};
        overflow: auto;
        height: calc(100vh - 135px);
        overflow: auto;
        padding-bottom: 24px;
        ::-webkit-scrollbar {
          display: none;
        }
        .event-info-title {
          font-family: 'Oswald';
          font-weight: 700;
          font-size: 24px;
          color: ${Colors.white};
        }
      }
      .collectible-info-image {
        height: 439px;
      }
      .event-info-top {
        margin-bottom: 40px;
        border-bottom: none;
        padding-bottom: 0;
      }
      .connected-events {
        border-bottom: none;
        padding-bottom: 0;
        .connected-events-title {
          font-size: 24px;
          margin-bottom: 24px;
        }
      }
      .chart-content {
        margin-top: 40px;
        .chart-title {
          font-size: 24px;
          margin-bottom: 24px;
        }
      }
      .right-icon {
        justify-content: center;
      }
    }
    .page-bottom {
      .ant-btn {
        width: 335px;
      }
    }
  }
  @media (min-width: 768px) and (max-width: 1200px) {
    .container-wrap {
      max-width: 688px;
    }
    .page-main {
      margin-top: 60px;
      &.page-bottom-show {
        padding-bottom: 120px;
      }
      .collectible-info-image {
        height: 688px;
      }
      .collectible-info {
        padding-bottom: 0;
        border-bottom: none;
      }
      .event-info {
        margin-top: 40px;
        .event-info-title {
          font-family: 'Oswald';
          font-weight: 700;
          font-size: 24px;
          color: ${Colors.white};
        }
      }
      .connected-events {
        padding-bottom: 0;
        margin-top: 40px;
        border-bottom: none;
        .connected-events-title {
          font-family: 'Oswald';
          font-weight: 700;
          font-size: 24px;
          color: ${Colors.white};
          margin-bottom: 24px;
        }
      }
      .event-info-top {
        border-bottom: none;
        padding-bottom: 0;
      }
      .chart-content {
        margin-top: 40px;
        .chart-title {
          font-size: 24px;
          margin-bottom: 24px;
        }
      }
    }
    .page-bottom {
      .ant-btn {
        width: 335px;
      }
    }
  }
  @media (max-width: 768px) {
    .page-main {
      &.page-bottom-show {
        padding-bottom: 100px;
      }
    }
  }
  @media (max-width: 576px) {
    .no-price-chart {
      text-align: center;
      span {
        width: 60px !important;
        height: 60px !important;
      }
      p {
        margin-top: 0;
        font-size: 16px;
      }
    }
    .page-main {
      .connected-events {
        .event-background {
          height: 70px;
        }
      }
    }
    .page-bottom {
      height: 80px;
      .ant-btn {
        height: 45px;
        font-size: 13px;
        width: calc(100% - 40px);
      }
    }
  }
  .ticket-poster {
    width: 335px;
    height: 483px;
    background: ${Colors.grayScale90};
    padding: 12px;
    position: absolute;
    bottom: 0;
    z-index: -99999999;
    .poster {
      height: 311px;
      border-radius: 8px;
      margin-bottom: 24px;
      position: relative;
      background: ${Colors.black};
      img {
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        display: block;
        max-width: 100%;
        max-height: 100%;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        outline: none;
        border-radius: 8px;
      }
    }
    .poster-name {
      margin-bottom: 8px;
      text-align: center;
      height: 53px;
      display: flex;
      align-items: center;
      justify-content: center;
      p {
        font-weight: 700;
        font-size: 18px;
        color: ${Colors.grayScale10};
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    .poster-organizerName {
      margin-bottom: 8px;
      text-align: center;
      padding-left: 12px;
      padding-right: 12px;
      font-weight: 500;
      font-size: 15px;
      color: ${Colors.grayScale20};
    }
    .poster-logo {
      text-align: center;
      img {
        width: 68px;
        height: 27px;
      }
    }
    .poster-info {
      position: absolute;
      bottom: 10px;
      right: 0;
      left: 0;
      margin: auto;
      width: calc(100% - 24px);
    }
    @media (max-width: 375px) {
      width: calc(100% - 40px);
    }
  }
`;

const EventDetailCard = styled.div`
  border-radius: 4px;
  padding: 10px;
  margin-top: 20px;
  position: relative;
  border: 0.6px solid #404047;
  background: ${Colors.grayScale70};
  border-radius: 8px;
  .event-background {
    width: 100%;
    height: 174px;
    position: relative;
    margin-bottom: 12px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }
  }
  .item-info {
    width: 100%;
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
      margin-bottom: 8px;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-top: 6px;
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
    .info-detail-description {
      font-weight: 400;
      font-size: 15px;
      color: ${Colors.white};
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
  @media (min-width: 768px) {
    margin-top: 24px;
    cursor: pointer;
  }
  @media (max-width: 576px) {
    .item-info {
      .info-title {
        font-weight: 500;
        font-size: 15px;
      }
      .info-detail-description {
        font-weight: 300;
        font-size: 13px;
      }
    }
  }
`;

const ConnectedEventsItem = styled.div`
  padding: 8px;
  background: ${Colors.grayScale70};
  border-radius: 8px;
  border: 0.6px solid ${Colors.grayScale90};
  margin-bottom: 14px;
  .info-title-col {
    padding-bottom: 8px;
    border-bottom: 0.2px solid ${Colors.grayScale90};
    margin-bottom: 8px;
    font-weight: 500;
    font-size: 15px;
    color: ${Colors.white};
    p {
      margin: 0;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .event-background {
    height: 110px;
    border-radius: 4px;
    position: relative;
    background: ${Colors.black};
    img,
    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      border-radius: 4px;
    }
    .status-bar {
      position: absolute;
      top: 4px;
      right: 4px;
    }
  }
  .item-info {
    padding-left: 12px;
    height: 100%;
    display: flex;
    align-items: center;
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
    .info-detail-description {
      font-weight: 400;
      font-size: 15px;
      color: ${Colors.white};
      margin-left: 8px;
      max-width: 85%;
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
  @media (max-width: 576px) {
    .event-background {
      .status-bar {
        position: absolute;
        top: unset;
        right: unset;
        bottom: 0;
        width: 100%;
        height: 22px;
        > :first-child {
          width: 100%;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    .item-info {
      .info-detail-description {
        font-weight: 300;
        font-size: 13px;
      }
    }
  }
  @media (min-width: 1200px) {
    cursor: pointer;
  }
`;

const DetailContainerElement = styled.div`
  .event-image {
    height: 167px;
    position: relative;
    background: ${Colors.black};
    border-radius: 4px;
    img {
      object-fit: contain;
      object-position: center;
      &.error-full-image {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover;
      }
    }
  }
  .ant-divider {
    height: 0.6px;
    background: ${Colors.grayScale90};
    margin: 15px 0;
  }
  .item-info {
    margin-top: 10px;
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
      img {
        width: 16px !important;
      }
      .info-item-icon {
        margin: unset !important;
        margin-top: 3px !important;
        min-width: 16px !important;
        min-height: 16px !important;
      }
    }
    .info-description {
      font-weight: 400;
      font-size: 15px;
      color: ${Colors.white};
      margin-left: 8px;
      max-width: 90%;
    }
    .info-item-status {
      margin-bottom: 10px;
    }
    .event-description {
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
  }
  @media (min-width: 576px) and (max-width: 768px) {
    .event-image {
      height: 167px;
    }
  }
  @media (min-width: 768px) {
    .show-more {
      cursor: pointer;
    }
    .event-image {
      height: 333px;
    }
  }
`;

const ConnectedEventContainerElement = styled.div`
  .detail-image {
    padding: 20px;
    .image-content {
      position: relative;
      width: 370px;
      height: 370px;
      background: ${Colors.black};
      border-radius: 4px;
      img,
      video {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    .dividing-line {
      position: absolute;
      top: 18px;
      right: -2px;
    }
  }
  .detail-info {
    padding: 20px;
    .detail-info-wrap {
      display: flex;
      height: 100%;
      align-items: center;
    }
    .detail-info-content {
      max-height: calc(410px - 40px);
      width: 100%;
      overflow-y: scroll;
      overflow-x: hidden;
      ::-webkit-scrollbar {
        display: none;
      }
      .ant-btn {
        a:hover {
          color: ${Colors.white};
        }
      }
    }
    .info-item-status {
      margin-bottom: 12px;
    }
    .info-name {
      margin-bottom: 12px;
      p {
        font-weight: 700;
        font-size: 24px;
        color: #ffffff;
        margin-bottom: 0;
      }
    }
    .info-item {
      margin-bottom: 5px;
      display: flex;
      align-items: start;
      img {
        width: 16px;
        height: 16px;
        /* margin-top: 3px; */
      }
    }
    .info-description {
      font-weight: 400;
      font-size: 15px;
      color: ${Colors.white};
      margin-left: 8px;
      max-width: 90%;
      line-height: 19px;
    }
    .event-description {
      margin-top: 8px;
      position: relative;
      margin-bottom: 12px;
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
    .ant-btn {
      width: 100%;
      background: ${Colors.branding};
      border-radius: 2px;
      border: none;
      height: 45px;
      font-weight: 700;
      font-size: 15px;
      color: ${Colors.grayScale10};
    }
  }
  @media (max-width: 576px) {
    .detail-image {
      padding: 0;
      .image-content {
        width: 100%;
        padding-bottom: 100%;
        height: 0;
        img {
          position: absolute;
        }
      }
    }
    .detail-info {
      padding: 0;
      .detail-info-wrap {
        display: block;
      }
      .detail-info-content {
        margin-top: 12px;
        max-height: unset;
        overflow: unset;
      }
      .info-name {
        p {
          margin: 0;
        }
      }
    }
  }
  @media (min-width: 576px) and (max-width: 1200px) {
    overflow-y: scroll;
    overflow-x: hidden;
    height: calc(663px - 40px);
    ::-webkit-scrollbar {
      display: none;
    }
    .detail-image {
      padding: 0;
      .image-content {
        width: 335px;
        height: 335px;
      }
    }
    .detail-info {
      padding: 0;
      .info-item-status {
        margin-bottom: 10px;
      }
      .info-name {
        margin-bottom: 10px;
      }
      .detail-info-wrap {
        display: block;
      }
      .event-description {
        padding-bottom: 12px;
      }
      .detail-info-content {
        margin-top: 12px;
        overflow: unset;
        max-height: unset;
      }
    }
  }
`;

export {
  CollectibleDetailContainer,
  EventDetailCard,
  ConnectedEventsItem,
  DetailContainerElement,
  ConnectedEventContainerElement,
};
