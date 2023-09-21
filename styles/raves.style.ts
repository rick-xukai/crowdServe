import styled from 'styled-components';
import { Button, Modal } from 'antd';
import { Colors } from '@/theme';

export const TipBarWrapper = styled.div<{ isEnd: boolean }>`
  padding: 8px;
  background: ${(props) =>
    props.isEnd ? Colors.grayScale90 : Colors.grayScale10};
  display: flex;
  align-items: center;
  gap: 10px;
  p {
    margin: 0;
    color: ${(props) => (props.isEnd ? Colors.white : Colors.grayScale70)};
    font-size: 15px;
    font-weight: 400;
    line-height: 21px;
  }
`;

export const TipBarIcon = styled.img`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  user-select: none;
  user-drag: none;
`;

export const ProgressWrapper = styled.div`
  padding: 20px;
  margin-top: 20px;
  background: ${Colors.linearGradient1};
  @media (min-width: 768px) {
    margin-top: 32px;
  }

`;

export const FlameTotal = styled.div`
  background-color: ${Colors.black};
  height: 60px;
  padding: 6px;
  display: flex;
  align-items: center;
  user-drag: none;
  user-select: none;
  .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding: 10px 15px;
    position: relative;
    user-select: none;
    user-drag: none;
  }
  .total {
    display: flex;
    justify-content: center;
    gap: 7px;
    min-width: 40px;
    align-items: center;
    user-select: none;
    user-drag: none;
    p {
      color: ${Colors.white};
      margin: 0;
      font-family: Oswald;
      font-size: 28px;
      font-weight: 700;
      text-transform: uppercase;
    }
  }
`;

export const StarIcon = styled.img`
  width: 25px;
  height: 25px;
  flex-shrink: 0;
  user-select: none;
  user-drag: none;
`;

export const FireIcon = styled.img`
  width: 20px;
  flex-shrink: 0;
  user-select: none;
  user-drag: none;
`;

export const FlameProgress = styled.div`
  background: ${Colors.black};
  height: 90px;
  margin-top: 14px;
  padding: 6px;
  .content {
    width: 100%;
    height: 100%;
    position: relative;
    user-select: none;
    user-drag: none;
  }
`;

export const Border = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  user-select: none;
  user-drag: none;
`;

export const CornerBorderLeft = styled.img`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 24px;
  user-select: none;
  user-drag: none;
`;

export const CornerBorderRight = styled.img`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 24px;
  transform: rotate(-90deg);
  user-select: none;
  user-drag: none;
`;

export const ProgressBarWrapper = styled.div`
  max-width: 520px;
  height: 50px;
  margin: auto;
  position: relative;
  top: 25px;
  .progress-content {
    height: 13px;
    border-radius: 37px;
    background: ${Colors.gray};
    box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 0.25) inset,
      0px -1px 0px 0px #fff inset;
    position: relative;
    .progress {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      border-radius: 37px;
      box-shadow: 1px -1px 0px 0px rgba(0, 0, 0, 0.2) inset;
      background: ${Colors.linearGradient2};
      img {
        position: absolute;
        right: -10px;
        top: -8px;
      }
    }
    .end {
      background: ${Colors.linearGradient4};
    }
  }
`;

export const GiftItem = styled.div`
  position: absolute;
  top: -6px;
  @media (min-width: 1024px) {
    cursor: pointer;
  }
  p {
    margin: 0;
    color: ${Colors.white};
    font-family: Oswald;
    font-size: 12px;
    font-weight: 700;
    line-height: 18px;
    text-transform: uppercase;
    white-space: nowrap;
  }
`;

export const GiftImg = styled.img`
  width: 28px;
  display: block;
  margin: auto;
`;

export const SectionTitle = styled.h4`
  font-size: 18px;
  font-weight: 700;
  line-height: 25px;
  margin-bottom: 15px;
  margin-top: 35px;
  color: ${Colors.white};
`;

export const RaveDescription = styled.p`
  color: ${Colors.grayScale40};
  font-size: 17px;
  font-weight: 400;
  line-height: 24px;
  margin: 0;
`;

export const RaveItem = styled.div`
  width: 100%;
  padding: 16px;
  background: ${Colors.black};
  border-radius: 6px;
  .title {
    color: ${Colors.white};
    font-size: 18px;
    font-weight: 700;
    line-height: 25px;
  }
  @media (min-width: 768px) {
    min-height: 157px;
  }
  .head {
    display: flex;
    justify-content: space-between;
    font-size: 18px;
    font-weight: 700;
    line-height: 25px;
    img {
      width: 15px;
      margin-left: 7px;
      position: relative;
      top: 2px;
      cursor: pointer;
    }
    .badge {
      font-size: 18px;
      font-weight: 700;
      line-height: 25px;
      > :first-child {
        color: ${Colors.white};
        font-size: 18px;
        font-weight: 700;
        line-height: 25px;
      }
      span {
        color: ${Colors.grayScale40};
      }
    }
  }
  .description {
    color: ${Colors.grayScale40};
    font-size: 15px;
    font-weight: 400;
    line-height: 21px;
  }
  .flame {
    color: ${Colors.white};
    font-size: 15px;
    font-weight: 500;
    line-height: 21px;
    @media (min-width: 768px) {
      position: absolute;
      bottom: 16px;
    }
    display: inline-flex;
    padding: 4px 10px;
    align-items: center;
    gap: 2px;
    border-radius: 39px;
    background: ${Colors.grayScale70};
    img {
      position: relative;
      top: -3px;
      width: 14px;
      margin-right: 4px;
    }
  }
`;

export const JoinButton = styled(Button)`
  margin: auto;
  margin-top: 40px;
  display: block;
  border-radius: 2px;
  background: var(--branding-primary-red, #fc0006);
  width: 250px;
  height: 45px;
  font-size: 15px;
  font-style: normal;
  font-weight: 700;
  line-height: 21px;
  text-transform: uppercase;
  :hover {
    opacity: 0.8;
  }
`;

export const PlaceHolderItem = styled.div`
  position: relative;
`;

export const PlaceHolderImg = styled.img`
  width: 100%;
  height: 100%;
  user-drag: none;
`;

export const LockImg = styled.img`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  user-drag: none;
`;

export const PopUpContainer = styled(Modal)`
  &.ant-modal {
    max-width: calc(100vw - 48px);
  }
  .ant-modal-content {
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0px 2px 14px 0px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(5px);
    max-height: calc(100% - 108px);
    .container {
      width: 100%;
      overflow: hidden;
    }
  }
`;

export const PopUpClose = styled.img`
  position: absolute;
  bottom: -44px;
  left: 50%;
  width: 24px;
  transform: translateX(-50%);
  cursor: pointer;
`;

export const ShareLinkImg = styled.img`
  width: 100px;
  margin: auto;
  margin-bottom: 10px;
  display: block;
`;

export const ShareLinkContent = styled.div`
  .title {
    color: ${Colors.grayScale70};
    margin: 0;
    text-align: center;
    font-size: 20px;
    font-weight: 700;
    line-height: 28px;
  }
  .sub-title {
    color: ${Colors.grayScale50};
    text-align: center;
    font-size: 17px;
    font-weight: 400;
    line-height: 24px;
    margin-top: 4px;
    margin-bottom: 20px;
  }
  .share-link-area {
    display: flex;
    justify-content: center;
    gap: 8px;
    align-items: center;
    .link-content {
      background: ${Colors.grayScale30};
      border: 1px solid ${Colors.grayScale30};
      color: ${Colors.grayScale50};
      padding: 8px 10px;
      display: flex;
      justify-content: space-between;
      gap: 10px;
      word-break: break-all;
      border-radius: 5px;
      width: calc(100% - 40px);
      align-items: center;
      font-size: 13px;

      .link {
        width: calc(100% - 28px);
      }
    }
    .copy-icon {
      cursor: pointer;
    }
  }
`;

export const YouMayNeed = styled.div`
  height: 19px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${Colors.grayScale50};
  text-align: center;
  font-size: 13px;
  font-weight: 400;
  line-height: 19px;
  margin: 20px 0;
  gap: 20px;
  span {
    flex-shrink: 0;
  }
  ::after,
  ::before {
    content: ' ';
    width: 100%;
    height: 1px;
    background: ${Colors.grayScale40};
  }
`;

export const PostImage = styled.div`
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.3);
  margin-bottom: 12px;
  .download {
    cursor: pointer;
  }
  .title {
    font-size: 15px;
    font-weight: 500;
    line-height: 21px;
    color: ${Colors.black};
    margin-bottom: 12px;
  }
  .post-image-content {
    display: flex;
    justify-content: space-between;
    align-items: end;
  }
`;

export const PostContent = styled.div`
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.3);
  .title {
    font-size: 15px;
    font-weight: 500;
    line-height: 21px;
    color: ${Colors.black};
    margin-bottom: 12px;
  }
  .post-content-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    p {
      margin: 0;
      color: ${Colors.grayScale50};
      font-size: 13px;
      font-weight: 400;
      line-height: 19px;
      width: calc(100% - 31px);
      word-break: break-all;
    }
    .icon {
      flex-shrink: 0;
      cursor: pointer;
    }
  }
`;

export const Ended = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0.36) 100%
  );
  backdrop-filter: blur(4px);
  z-index: 2;
  border-radius: 4px;
  user-select: none;
  .content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 100px;
      display: block;
      margin: auto;
      margin-bottom: 16px;
      user-select: none;
      user-drag: none;
    }
    p {
      margin: 0;
      text-align: center;
      font-size: 18px;
      font-weight: 700;
      line-height: 25px;
    }
  }
`;

export const HaveJoinedRaveModalContent = styled.div`
  padding: 40px;
  .content-mascotsIcon {
    text-align: center;
  }
  .content-title {
    margin-top: 16px;
    color: ${Colors.grayScale70};
    text-align: center;
    font-family: Oswald;
    font-size: 24px;
    font-weight: 700;
    line-height: 32px;
    text-transform: uppercase;
  }
  .content-count {
    margin-top: 16px;
    text-align: center;
    > :first-child {
      span {
        margin-right: 5px;
        font-size: 17px;
        font-weight: 400;
      }
    }
    span {
      color: ${Colors.grayScale70};
      text-align: right;
      font-size: 18px;
      font-weight: 700;
      line-height: 25px;
      img {
        width: 20px;
        height: 20px;
        margin-left: 8px;
        margin-bottom: -1px;
      }
    }
  }
`;

export const RedeemRewardModalContent = styled.div`
  padding: 25px 22px;
  .redeem-title {
    color: ${Colors.grayScale70};
    text-align: center;
    font-family: Oswald;
    font-size: 24px;
    font-weight: 700;
    line-height: 32px;
    text-transform: uppercase;
  }
  .redeem-name {
    color: ${Colors.backgorund};
    text-align: center;
    font-size: 16px;
    font-weight: 700;
    line-height: 23px;
    margin-top: 20px;
  }
  .redeem-info {
    position: relative;
    height: 290px;
    display: flex;
    .background {
      width: 270px;
      position: absolute;
      top: 0;
      left: -20px;
      right: 0;
      margin: auto;
      z-index: -1;
    }
    .info {
      margin: auto;
      border-radius: 8px;
      border: 4px solid ${Colors.branding};
      background: ${Colors.backgorund};
      padding: 6px;
      padding-bottom: 0;
      position: relative;
      .info-img {
        width: 140px;
        height: 140px;
        object-fit: cover;
        border-radius: 8px;
      }
      .info-name {
        color: ${Colors.white};
        text-align: center;
        font-size: 14px;
        font-weight: 700;
        line-height: 20px;
        margin-top: 10px;
      }
      .left-icon {
        width: 80px;
        position: absolute;
        top: -26px;
        left: -26px;
      }
    }
  }
  .redeem-button {
    text-align: center;
    .ant-btn {
      width: 80%;
      height: 45px;
      border-radius: 2px;
      background: ${Colors.branding};
      color: ${Colors.grayScale10};
      font-size: 15px;
      font-weight: 700;
      line-height: 21px;
      text-transform: uppercase;
      .anticon {
        font-size: 18px;
        margin-right: 10px;
      }
      &.fully-redeemed {
        background: ${Colors.grayScale30};
        color: ${Colors.grayScale40};
      }
      &.need-more {
        background: ${Colors.brandingGray};
        color: ${Colors.grayScale30};
      }
    }
  }
  @media (max-width: 576px) {
    padding: 15px 12px;
  }
  @media (max-width: 375px) {
    .redeem-button {
      .ant-btn {
        width: 100%;
      }
    }
  }
`;

export const RedeemRewardPopupContainer = styled.div`
  @media (min-width: 576px) {
    .ant-modal {
      max-width: 445px;
    }
  }
`;

export const RedeemSuccessModalContent = styled.div`
  padding: 25px 22px;
  .title-img {
    text-align: center;
    img {
      width: 100px;
      height: 100px;
    }
  }
  .title {
    margin-top: 16px;
    color: ${Colors.grayScale70};
    text-align: center;
    font-family: Oswald;
    font-size: 24px;
    font-weight: 700;
    line-height: 32px;
    text-transform: uppercase;
  }
  .info {
    color: ${Colors.grayScale50};
    text-align: center;
    font-size: 17px;
    font-weight: 400;
    line-height: 24px;
    margin-top: 12px;
  }
`;
