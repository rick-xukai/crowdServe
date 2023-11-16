import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Row, Col, Modal, Button } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { Colors, Images } from '@/theme';
import { useAppDispatch } from '@/app/hooks';
import { RouterKeys, CookieKeys } from '@/constants/Keys';
import { useCookie } from '@/hooks';
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
      margin-top: 20px;
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
    }
    .action-button {
      margin-top: 40px;
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
  const cookie = useCookie([CookieKeys.userProfileInfo]);
  const dispatch = useAppDispatch();

  const [userFirstName, setUserFirstName] = useState<string>('');

  useEffect(() => {
    if (cookie.getCookie(CookieKeys.userProfileInfo)) {
      const { firstName } = cookie.getCookie(CookieKeys.userProfileInfo);
      setUserFirstName(firstName);
    }
  }, []);

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
          <Col span={24} className="icon-content">
            <img src={Images.EditProfileIcon.src} alt="" />
          </Col>
          <Col span={24} className="title-content">
            Update Your User Profile
          </Col>
          <Col span={24} className="first-name">
            {`Dear ${userFirstName},`}
          </Col>
          <Col span={24} className="description">
            CrowdServe aims to provide a seamless experience for all event
            attendees and organisers. In order to so, it is important for us to
            have your updated contacted details.
          </Col>
          <Col span={24} className="description">
            We kindly request your assistance to take one minute of your time to
            update the missing or outdated information to ensure we can provide
            you with better services.
          </Col>
          <Col span={24} className="description">
            Thank you for your help in improving your experience on our app!
          </Col>
          <Col span={24} className="action-button">
            <Button
              onClick={() => {
                if (!isProfilePage) {
                  dispatch(setDefaultShowEditProfilePopup(true));
                  router.push(RouterKeys.profile);
                } else {
                  setShowPopup(false);
                  setShowEditer(true);
                }
              }}
            >
              GO
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
