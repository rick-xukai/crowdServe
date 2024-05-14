import React from 'react';
import styled from 'styled-components';
import { Row, Col, Modal, Button } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { Colors, Images } from '@/theme';
import { useAppDispatch } from '@/app/hooks';
import { RouterKeys } from '@/constants/Keys';
import { setDefaultShowEditProfilePopup } from '@/slice/profile.slice';

const ShowUpdateProfilePopupContainer = styled.div`
  .ant-modal-content {
    border-radius: 12px;
    background: rgba(48, 48, 52, 0.95);
    box-shadow: 0px 2px 14px 0px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(5px);
    padding: 20px 40px !important;
    .icon-content {
      text-align: center;
    }
    .title-content {
      color: ${Colors.grayScale20};
      text-align: center;
      font-size: 20px;
      font-weight: 700;
      line-height: 28px;
    }
    .first-name {
      color: ${Colors.white};
      font-size: 17px;
      font-weight: 500;
      line-height: 24px;
      margin-top: 24px;
    }
    .description {
      color: ${Colors.grayScale30};
      font-size: 15px;
      font-weight: 400;
      line-height: 21px;
      margin-top: 20px;
      text-align: center;
    }
    .action-tips {
      margin-top: 12px;
      color: ${Colors.grayScale30};
      font-size: 15px;
      font-weight: 400;
      text-align: center;
    }
    .action-button {
      margin-top: 32px;
      .ant-btn {
        height: 45px;
        border: none;
        width: 100%;
        border-radius: 2px;
        background: ${Colors.branding};
        color: ${Colors.grayScale10};
        font-size: 15px;
        font-weight: 700;
        line-height: 21px;
        text-transform: uppercase;
      }
      &.remind-later {
        margin-top: 15px;
        .ant-btn {
          background: transparent;
          text-transform: uppercase;
          border: 1px solid ${Colors.grayScale30};
        }
      }
    }
  }
  @media (max-width: 576px) {
    .ant-modal {
      max-width: calc(100vw - 40px);
    }
    .ant-modal-content {
      padding: 20px !important;
    }
  }
`;

const ShowUpdateProfilePopup = ({
  isProfilePage,
  showPopup,
  setShowPopup,
  setShowEditer = () => {},
}: {
  showPopup: boolean;
  setShowPopup: (status: boolean) => void;
  isProfilePage?: boolean;
  setShowEditer?: (status: boolean) => void;
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  return (
    <ShowUpdateProfilePopupContainer>
      <Modal
        open={showPopup}
        footer={null}
        centered
        closable={false}
        getContainer={false}
        className="profile-popup-content"
      >
        <Row>
          <Col span={24} className="title-content">
            Complete Your Profile
          </Col>
          <Col span={24} className="description">
            The event organizer requires more of your personal details to ensure
            a smooth experience. Please complete them now. Failure to do so may
            affect your ability to enter events or purchase tickets.
          </Col>
          <Col span={24} className="action-button">
            <Button
              onClick={() => {
                setShowPopup(false);
                if (!isProfilePage) {
                  dispatch(setDefaultShowEditProfilePopup(true));
                  router.push(RouterKeys.profile);
                } else {
                  setShowEditer(true);
                }
              }}
            >
              Complete now
            </Button>
          </Col>
          <Col span={24} className="action-button remind-later">
            <Button
              onClick={() => {
                setShowPopup(false);
              }}
            >
              remind me later
            </Button>
          </Col>
        </Row>
        <div className="close-modal">
          <Image
            src={Images.CloseIcon}
            alt=""
            onClick={() => setShowPopup(false)}
          />
        </div>
      </Modal>
    </ShowUpdateProfilePopupContainer>
  );
};

export default ShowUpdateProfilePopup;
