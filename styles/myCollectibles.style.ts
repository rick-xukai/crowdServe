import styled from 'styled-components';

import { Colors } from '../theme';

const MyCollectiblesContainer = styled.div`
  height: 100%;
  overflow: auto;
  max-width: 1008px;
  margin: auto;
  ::-webkit-scrollbar {
    display: none;
  }
  .no-collectibles {
    display: flex;
    align-items: center;
    position: relative;
    max-width: 1008px;
    margin: auto;
    position: fixed;
    width: 100%;
    background: ${Colors.backgorund};
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    z-index: 1;
    .page-main-no-collectibles {
      text-align: center;
      margin: auto;
      .title {
        margin-top: 20px;
        margin-bottom: 10px;
        font-weight: 700;
        font-size: 20px;
        color: ${Colors.grayScale20};
      }
    }
  }
  .page-main {
    padding: 20px 20px 70px 20px;
    margin-top: 45px;
    .load-more {
      color: ${Colors.white};
      text-align: center;
      margin-top: 10px;
      .anticon {
        margin-right: 10px;
      }
    }
  }
  @media (min-width: 1200px) {
    .page-main {
      padding: 20px 0 70px 0;
      margin-top: 80px;
    }
  }
  @media (min-width: 768px) and (max-width: 1200px) {
    max-width: 688px;
    .page-main {
      padding: 20px 0 70px 0;
      margin-top: 50px;
    }
  }
`;

const CollectiblesItem = styled.div`
  .content {
    padding: 0 !important;
  }
  .collectible-item-image {
    border-radius: 6px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border: 1px solid ${Colors.grayScale90};
    border-bottom: none;
    background: ${Colors.backgorund};
    > :nth-child(2) {
      img {
        border-top-right-radius: 0;
      }
    }
    > :first-child {
      img {
        border-top-left-radius: 6px;
      }
    }
    > :last-child {
      img {
        border-top-right-radius: 6px;
      }
    }
    .image-card {
      position: relative;
      border-right: 0.5px solid ${Colors.grayScale90};
      span {
        width: 100% !important;
        height: 100% !important;
      }
      img {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover;
      }
    }
    .count-mask {
      font-family: 'Oswald';
      font-weight: 700;
      font-size: 28px;
      color: ${Colors.white};
      position: absolute;
      top: 0;
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-top-right-radius: 6px;
      background: linear-gradient(0deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7));
    }
  }
  .sale-icon {
    width: 40px;
    height: 40px;
    position: absolute;
    top: 0;
    left: 0;
  }
  .image-card {
    height: 105px;
    max-height: 105px;
  }
  .collectible-item-info {
    padding: 8px 10px;
    background: ${Colors.grayScale70};
    border-radius: 0px 0px 4px 4px;
    border: 1px solid ${Colors.grayScale90};
    border-top: none;
    .info-name {
      font-weight: 700;
      font-size: 16px;
      color: ${Colors.white};
      margin-bottom: 5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .info-owned {
      font-weight: 400;
      font-size: 13px;
      color: ${Colors.white};
    }
  }
  @media (min-width: 1200px) {
    cursor: pointer;
    .collectible-item-image {
      min-height: 160px;
    }
    .image-card {
      height: 160px;
      max-height: 160px;
    }
    .sale-icon {
      width: 60px;
      height: 60px;
    }
  }
  @media (min-width: 768px) and (max-width: 1200px) {
    .collectible-item-info {
      padding: 12px;
      .info-name {
        font-size: 18px;
        margin-bottom: 10px;
      }
    }
    .collectible-item-image {
      min-height: 166px;
    }
    .image-card {
      height: 166px;
      max-height: 166px;
    }
    .sale-icon {
      width: 60px;
      height: 60px;
    }
  }
`;

export { MyCollectiblesContainer, CollectiblesItem };
