import styled from 'styled-components';

import { Colors } from '@/theme';

const CountrySelecterContainer = styled.div`
  .country-name {
    margin-left: 10px;
    color: ${Colors.backgorund};
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .search-select-country {
    height: 44px;
    background: ${Colors.white};
    border: 1px solid ${Colors.grayScale70};
    padding: 0 12px;
    padding-right: 10px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    position: relative;
    border-radius: 2px;
    .anticon {
      font-size: 20px;
      color: ${Colors.grayScale40};
    }
    .content {
      display: flex;
      align-items: unset;
      .country-flag {
        font-size: 20px;
      }
      .country-name {
      }
      .country-flag,
      .country-name {
        display: flex;
        align-items: center;
      }
    }
  }
  .country-items {
    .content {
      display: flex;
      height: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 2px 0 !important;
      &.no-data {
        justify-content: center;
        margin-top: 20px;
      }
      .country-flag {
        font-size: 20px;
        display: flex;
        align-items: center;
      }
      .country-name {
        margin-left: 10px;
        color: ${Colors.backgorund};
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: flex;
        align-items: center;
      }
    }
  }
  .country-items {
    color: ${Colors.white};
    position: absolute;
    bottom: -180px;
    z-index: 1;
    width: 100%;
    left: 0;
    height: 170px;
    background: ${Colors.grayScale50};
    border-radius: 6px;
    overflow: auto;
    padding: 0 12px;
    .search-input-content {
      border-bottom: 1px solid ${Colors.white};
      margin-bottom: 8px;
    }
    ::-webkit-scrollbar {
      display: none;
    }
    .content {
      height: auto;
      padding: 8px 0px;
      cursor: pointer;
      .country-name {
        color: ${Colors.white};
      }
    }
    .ant-input {
      padding: 8px 0 !important;
      background: ${Colors.grayScale50} !important;
      border: none !important;
      &::placeholder {
        color: ${Colors.grayScale40};
      }
    }
    .ant-input:focus {
      box-shadow: unset;
    }
  }
  @media (max-width: 576px) {
    .page-main {
      .search-select-country {
        height: 35px;
      }
    }
  }
`;

export { CountrySelecterContainer };
