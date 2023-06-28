import styled from 'styled-components';

import { Colors } from '../theme';

const CollectionDetailContainer = styled.div`
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  ::-webkit-scrollbar {
    display: none;
  }
  .page-main {
    margin-top: 45px;
    padding-bottom: 20px;
    .load-more {
      color: ${Colors.white};
      text-align: center;
      margin-top: 10px;
      .anticon {
        margin-right: 10px;
      }
    }
    .banner {
      height: 148px;
      background: ${Colors.black};
      position: relative;
      span {
        height: 100% !important;
        img {
          object-fit: cover;
        }
      }
      &.no-background {
        background: unset;
      }
    }
    .collectible-detail {
      padding-left: 20px;
      padding-right: 20px;
      margin: auto;
      .detail-content {
        margin-top: -45px;
        border-bottom: 1px solid ${Colors.grayScale90};
        padding-bottom: 20px;
        margin-bottom: 20px;
      }
      .logo {
        text-align: center;
        .logo-flex {
          display: flex;
          justify-content: center;
        }
        .logo-content {
          width: 90px;
          height: 90px;
          position: relative;
          margin: 0;
        }
        span {
          img {
            border-radius: 50%;
            object-fit: cover;
          }
        }
      }
      .logo-name {
        width: 90px;
        height: 90px;
        background: linear-gradient(
          179.81deg,
          ${Colors.branding} 1.16%,
          ${Colors.branding100} 99.83%
        );
        border-radius: 50%;
        margin: auto;
        font-weight: 700;
        font-size: 40px;
        color: ${Colors.grayScale10};
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .name {
        font-weight: 700;
        font-size: 18px;
        color: ${Colors.white};
        margin-top: 10px;
        text-align: center;
      }
      .description {
        font-weight: 400;
        font-size: 13px;
        color: ${Colors.white};
        margin-top: 10px;
      }
    }
  }
  @media (min-width: 1200px) {
    .page-main {
      margin-top: 80px;
      padding-bottom: 70px;
      .banner {
        height: 260px;
      }
      .collectible-detail {
        max-width: 1008px;
        padding: 0;
      }
    }
  }
  @media (min-width: 768px) and (max-width: 1200px) {
    .page-main {
      margin-top: 60px;
      .banner {
        height: 260px;
      }
      .collectible-detail {
        max-width: 688px;
        padding: 0;
      }
    }
  }
`;

export { CollectionDetailContainer };
