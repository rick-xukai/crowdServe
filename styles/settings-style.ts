import styled from 'styled-components';
import { Colors } from '../theme';

const SettingsContainer = styled.div`
  padding: 20px 20px;
  height: 100%;
  background: ${Colors.backgorund};
  position: relative;
  .iframe-back {
    position: absolute;
    width: 100%;
    left: 0;
    background: ${Colors.backgorund};
    z-index: 1;
    padding-left: 10px;
    padding-right: 10px;
    top: 0;
    height: 40px;
    display: flex;
    align-items: center;
  }
  .page-title {
    font-family: 'Oswald';
    font-weight: 700;
    font-size: 28px;
    color: ${Colors.white};
    margin-top: 26px;
  }
  .goback-icon {
    color: ${Colors.white};
    font-size: 22px;
  }
  .page-main {
    margin-top: 60px;
    .info-name,
    .arrow-right {
      font-weight: 400;
      font-size: 17px;
      color: ${Colors.white};
    }
    .info-name {
      display: flex;
      align-items: center;
      .name {
        margin-left: 10px;
      }
    }
    .arrow-right {
      text-align: right;
      color: ${Colors.grayScale50};
    }
    .ant-divider {
      background: ${Colors.grayScale90};
      margin: 15px 0;
    }
    .menu-item-row {
      margin-bottom: 20px;
    }
  }
  .logout-btn {
    position: absolute;
    width: calc(100% - 40px);
    left: 0;
    right: 0;
    margin: auto;
    bottom: 32px;
    .ant-btn {
      height: 45px;
      background: transparent;
      border: 1px solid ${Colors.grayScale10};
      border-radius: 2px;
      width: 100%;
      padding-top: 12px;
      padding-bottom: 12px;
      color: ${Colors.grayScale10};
      font-weight: 700;
      font-size: 15px;
    }
  }
`;

export { SettingsContainer };
