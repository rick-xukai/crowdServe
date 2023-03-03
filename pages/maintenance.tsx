import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import { Images, Colors } from '../theme';

export const MaintenancePageContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  .page-main {
    margin: auto;
    .block-icon {
      text-align: center;
    }
    p {
      margin: 0;
      font-weight: 400;
      font-size: 15px;
      color: ${Colors.grayScale40};
      text-align: center;
    }
    .title {
      margin-top: 25px;
      margin-bottom: 10px;
      color: ${Colors.grayScale20};
      font-weight: 700;
      font-size: 20px;
    }
  }
`;

const Maintenance = () => (
  <MaintenancePageContainer>
    <div className="page-main">
      <div className="block-icon">
        <Image src={Images.BlockAppIcon} alt="" />
      </div>
      <p className="title">{`We'll be back soon`}</p>
      <p>We are building something new for you, <br /> please come back later~</p>
    </div>
  </MaintenancePageContainer>
);

export default Maintenance;
