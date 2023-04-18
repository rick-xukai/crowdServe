import styled from 'styled-components';

import { Colors } from '../theme';

const MyWalletContainer = styled.div`
  height: 100%;
  padding: 20px;
  position: relative;
  max-width: 1240px;
  margin: auto;
  .container {
    display: flex;
    align-items: center;
    height: 100%;
  }
  .page-main {
    text-align: center;
    margin: auto;
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
    margin: auto;
    margin-top: 50px;
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
  @media (min-width: 1200px) {
    max-width: 1008px;
    padding: 0;
  }
  @media (min-width: 768px) and (max-width: 1200px) {
    max-width: 688px;
    padding: 0;
  }
`;

export { MyWalletContainer };
