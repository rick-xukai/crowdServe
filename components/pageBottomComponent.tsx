import React from 'react';
import styled from 'styled-components';
import { Row, Col } from 'antd';

import { TermsConditionsLink, PrivacyPolicyLink } from '../constants/General';
import { Colors } from '../theme';

const PageBottomComponentContainer = styled(Row)`
  position: fixed;
  width: 100%;
  left: 0;
  height: 50px;
  background: ${Colors.backgorund};
  z-index: 1000;
  bottom: 0;
  border-top: 1px solid ${Colors.grayScale90};
  user-select: none;
  .action-link {
    max-width: 1008px;
    margin: auto;
    &.action-link-mobile {
      max-width: 335px;
    }
    @media (min-width: 768px) and (max-width: 1200px) {
      max-width: 688px;
    }
    .action-link-item {
      font-weight: 400;
      font-size: 13px;
      color: ${Colors.white};
      margin-right: 24px;
      cursor: pointer;
      a:hover {
        color: ${Colors.white};
      }
      :hover {
        text-decoration-line: underline;
      }
    }
  }
`;

const PageBottomComponent = () => (
  <PageBottomComponentContainer>
    <Col xs={0} md={24} className="action-link">
      <span className="action-link-item">
        <a href={PrivacyPolicyLink} target="_blank">
          PRIVACY POLICY
        </a>
      </span>
      <span className="action-link-item">
        <a href={TermsConditionsLink} target="_blank">
          TERMS & CONDITIONS
        </a>
      </span>
    </Col>
    <Col xs={24} md={0} className="action-link action-link-mobile">
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div>
          <span className="action-link-item">
            <a href={PrivacyPolicyLink} target="_blank">
              PRIVACY POLICY
            </a>
          </span>
          <span
            className="action-link-item"
            style={{ textAlign: 'right', marginRight: 0 }}
          >
            <a href={TermsConditionsLink} target="_blank">
              TERMS & CONDITIONS
            </a>
          </span>
        </div>
      </div>
    </Col>
  </PageBottomComponentContainer>
);

export default PageBottomComponent;
