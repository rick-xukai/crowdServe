import styled from 'styled-components';

import { Colors } from '../theme';

const MyWalletContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 20px;
  position: relative;
  .page-main {
    text-align: center;
    .title {
      margin-top: 20px;
      margin-bottom: 10px;
      font-weight: 700;
      font-size: 20px;
      color: ${Colors.grayScale20};
    }
    .info {
      margin: 0;
      font-weight: 400;
      font-size: 15px;
      color: ${Colors.grayScale40};
    }
  }
  .page-bottom {
    position: absolute;
    bottom: 28px;
    width: calc(100% - 40px);
    .ant-btn {
      height: 45px;
      padding: 12px 10px;
      background: ${Colors.branding};
      border-radius: 2px;
      color: ${Colors.grayScale10};
      font-weight: 700;
      font-size: 15px;
      border: none;
      width: 100%;
    }
  }
`;

export { MyWalletContainer };
