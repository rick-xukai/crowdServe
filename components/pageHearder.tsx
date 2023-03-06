import React from 'react';
import styled from 'styled-components';
import { Row, Col } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Router from 'next/router';

import { RouterKeys } from '../constants/Keys';
import { Images, Colors } from '../theme';

const PageHearderContainer = styled(Row)`
  position: fixed;
  width: calc(100% - 40px);
  z-index: 2;
  background: ${Colors.backgorund};
  top: 0;
  height: 60px;
  align-items: center;
  padding-top: 5px;
  .hearder-action {
    text-align: right;
    padding-top: 5px;
  }
  .hearder-logo {
    width: 62px;
    height: 30px;
  }
  .hearder-back {
    color: ${Colors.white};
    font-size: 22px;
  }
`;

const PageHearderComponent = ({ isBack }: { isBack: boolean }) => (
  <PageHearderContainer>
    {(!isBack && (
      <>
        <Col span={12} className="left-container">
          <div className="hearder-logo">
            <Image src={Images.Logo} alt="" />
          </div>
        </Col>
        <Col span={12} className="right-container">
          <div
            className="hearder-action"
            onClick={() => Router.push(RouterKeys.settings)}
          >
            <Image src={Images.MenuIcon} alt="" />
          </div>
        </Col>
      </>
    )) || (
      <Col>
        <div className="hearder-back">
          <ArrowLeftOutlined />
        </div>
      </Col>
    )}
  </PageHearderContainer>
);

export default PageHearderComponent;
