import React from 'react';
import styled from 'styled-components';
import { Col, Button } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { Images, Colors } from '../theme';
import { RouterKeys } from '../constants/Keys';
import PageHearderComponent from '../components/pageHearder';
import PageHearderResponsive from '../components/pageHearderResponsive';

const PageNotFoundContainer = styled.div`
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

const PageNotFound = () => {
  const router = useRouter();

  return (
    <PageNotFoundContainer>
      <Col md={24} xs={0}>
        <PageHearderResponsive />
      </Col>
      <Col md={0} xs={24}>
        <PageHearderComponent />
      </Col>
      <div className="container">
        <div className="page-main">
          <Image src={Images.PageNotFoundIcon} alt="" />
          <p className="title">
            Whoops, the page you are looking for was not found.
          </p>
          <div className="page-bottom">
            <Button onClick={() => router.push(RouterKeys.eventList)}>
              BACK TO HOME
            </Button>
          </div>
        </div>
      </div>
    </PageNotFoundContainer>
  );
};

export default PageNotFound;
