import React from 'react';
import styled from 'styled-components';
import { Row, Col, Image } from 'antd';

import { Images, Colors } from '@/theme';

const AuthPageHearderContainer = styled.div`
  padding: 0 40px;
  position: relative;
  z-index: 101;
  background: ${Colors.black};
  .hearder-logo {
    height: 46px;
    width: 117px;
    .ant-image {
      height: 100%;
      width: 100%;
    }
  }
  .skip-button {
    color: ${Colors.white};
    font-family: 'Baradig';
    font-size: 15px;
    font-weight: 700;
    line-height: 21px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: end;
    span {
      cursor: pointer;
    }
  }
  @media (max-width: 768px) {
    padding: 0 20px;
  }
  @media (max-width: 576px) {
    padding: 0 0;
    .hearder-logo {
      width: 80px;
      .ant-image {
        display: flex;
        align-items: center;
      }
    }
  }
`;

const AuthPageHearder = ({
  showSkip = true,
  skipClick = () => {},
}: {
  skipClick?: () => void;
  showSkip?: boolean;
}) => (
  <AuthPageHearderContainer>
    <Row>
      <Col span={12}>
        <div className="hearder-logo">
          <Image src={Images.LogoNameIcon.src} alt="" preview={false} />
        </div>
      </Col>
      <Col span={12}>
        {showSkip && (
          <div className="skip-button">
            <span onClick={skipClick}>Skip</span>
          </div>
        )}
      </Col>
    </Row>
  </AuthPageHearderContainer>
);

export default AuthPageHearder;
