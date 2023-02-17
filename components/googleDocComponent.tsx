import React from 'react';
import styled from 'styled-components';
import { ArrowLeftOutlined } from '@ant-design/icons';

import { Colors } from '../theme';

const GoogleDocComponentContainer = styled.div`
  .top-bar {
    position: absolute;
    width: 100%;
    background: ${Colors.backgorund};
    top: 0;
    z-index: 1;
    left: 0;
    height: 45px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    padding-right: 10px;
    .anticon-arrow-left {
      font-size: 20px;
      color: ${Colors.white};
    }
  }
`;

const GoogleDocComponent = ({
  docLink,
  checkGoogleDoc,
}: {
  docLink: string;
  checkGoogleDoc: (status: boolean) => void;
}) => (
  <GoogleDocComponentContainer>
    <div className="top-bar" onClick={() => checkGoogleDoc(false)}>
      <ArrowLeftOutlined />
    </div>
    <iframe
      title="Google Document"
      width="100%"
      src={docLink}
    />
  </GoogleDocComponentContainer>
);

export default GoogleDocComponent;
