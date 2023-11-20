import styled from 'styled-components';

import { Colors } from '@/theme';

const CountrySelecterContainer = styled.div`
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
  }
  .content {
    height: 100%;
    /* display: flex; */
    align-items: center;
    overflow: hidden;
    text-overflow: ellipsis;
    &.profile-page {
      .country-flag {
        line-height: unset;
      }
    }
    &.no-data {
      justify-content: center;
      margin-top: 20px;
    }
    .country-flag {
      width: 20px;
      height: 20px;
      font-size: 20px;
      line-height: 44px;
    }
    .country-name {
      margin-left: 10px;
      color: ${Colors.backgorund};
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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
