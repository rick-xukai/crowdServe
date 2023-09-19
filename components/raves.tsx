import { Col, Row, Grid, message, Tooltip, Button } from 'antd';
import copy from 'copy-to-clipboard';
import _ from 'lodash';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import RavesPopUp from './ravesPopup';
import {
  Border,
  CorderBorderLeft,
  CorderBorderRight,
  // Ended,
  FireIcon,
  FlameProgress,
  FlameTotal,
  GiftImg,
  GiftItem,
  JoinButton,
  LockImg,
  PlaceHolderImg,
  PlaceHolderItem,
  PostContent,
  PostImage,
  ProgressBarWrapper,
  ProgressWrapper,
  RaveDescription,
  RaveItem,
  SectionTitle,
  ShareLinkContent,
  ShareLinkImg,
  StarIcon,
  TipBarIcon,
  TipBarWrapper,
  YouMayNeed,
  HaveJoinedRaveModalContent,
  RedeemRewardModalContent,
} from '@/styles/raves.style';
import {
  GetRaveResponseProps,
  GetRaveResponseQuestProps,
  GetRaveResponseRewardListProps,
  RaveQuestType,
} from '@/slice/rave.slice';
import { Images } from '@/theme';
import {
  RaveQuestShare,
  RaveQuestBuyTickets,
  RaveQuestInviteFriend,
} from '@/constants/General';

const { useBreakpoint } = Grid;

const TipBar = ({
  rewardData,
  redeemedUser,
}: {
  rewardData: GetRaveResponseRewardListProps[];
  redeemedUser: number;
}) => (
  <TipBarWrapper>
    <TipBarIcon src={Images.SmileIcon.src} alt="" />
    <p>
      {redeemedUser} ravers have claimed the reward! Only{' '}
      <b>{(rewardData.length && rewardData[0].stock) || 0}</b>{' '}
      {(rewardData.length && rewardData[0].name) || '-'} and{' '}
      <b>{(rewardData.length && rewardData[1].stock) || 0}</b>{' '}
      {(rewardData.length && rewardData[1].name) || '-'} left!
    </p>
  </TipBarWrapper>
);

const ProgressBar = ({
  current,
  total,
  gifts,
  setRedeemRewardModalOpen,
  setCurrentShowReward,
}: {
  current: number;
  total: number;
  gifts: GetRaveResponseRewardListProps[];
  setRedeemRewardModalOpen: (status: boolean) => void;
  setCurrentShowReward: (data: GetRaveResponseRewardListProps) => void;
}) => {
  const { md } = useBreakpoint();
  return (
    <ProgressBarWrapper>
      <div className="progress-content">
        <div
          className="progress"
          style={{ width: `${(current / total) * 100}%` }}
        >
          <FireIcon src={Images.FireGifIcon.src} />
        </div>
        {gifts.map((item) => {
          const gotGifts = item.img === Images.GiftCheersImg.src;
          return (
            <GiftItem
              onClick={() => {
                setRedeemRewardModalOpen(true);
                setCurrentShowReward(item);
              }}
              style={{
                left: `${(item.milestone / total) * 100 - (md ? 5 : 10)}%`,
                top: gotGifts ? -12 : '',
              }}
              key={item.milestone}
            >
              <GiftImg
                src={item.img}
                style={{
                  width: gotGifts ? 42 : '',
                }}
              />
              {gotGifts ? null : <p>{item.milestone} Flames</p>}
            </GiftItem>
          );
        })}
      </div>
    </ProgressBarWrapper>
  );
};

const ProgressContainer = ({
  giftList,
  currentFlamePoint,
  setRedeemRewardModalOpen,
  setCurrentShowReward,
}: {
  giftList: GetRaveResponseRewardListProps[];
  currentFlamePoint: number;
  setRedeemRewardModalOpen: (status: boolean) => void;
  setCurrentShowReward: (data: GetRaveResponseRewardListProps) => void;
}) => (
  <ProgressWrapper>
    <FlameTotal>
      <div className="container">
        <Border src={Images.BorderImg.src} />
        <StarIcon src={Images.StarIcon.src} />
        <div className="total">
          <FireIcon src={Images.FireGifIcon.src} />
          <p>{currentFlamePoint}</p>
        </div>
        <StarIcon src={Images.StarIcon.src} />
      </div>
    </FlameTotal>
    <FlameProgress>
      <div className="content">
        <CorderBorderLeft src={Images.CornerBorderImg.src} />
        <CorderBorderRight src={Images.CornerBorderImg.src} />
        <ProgressBar
          current={currentFlamePoint}
          total={_.sumBy(giftList, 'milestone')}
          gifts={giftList.map((item) => ({
            ...item,
            img:
              item.milestone <= currentFlamePoint
                ? Images.GiftCheersImg.src
                : Images.GiftDisabledImg.src,
          }))}
          setRedeemRewardModalOpen={setRedeemRewardModalOpen}
          setCurrentShowReward={setCurrentShowReward}
        />
      </div>
    </FlameProgress>
  </ProgressWrapper>
);

const RaveList = ({ list }: { list: GetRaveResponseQuestProps[] }) => {
  const renderItemTooltip = (type: number) => {
    if (type === RaveQuestType.SHARE) {
      return (
        <Tooltip title={RaveQuestShare} overlayClassName="custom-tooltip">
          <img src={Images.TooltipIcon.src} alt="" />
        </Tooltip>
      );
    }
    if (type === RaveQuestType.BUYTICKET) {
      return (
        <Tooltip title={RaveQuestBuyTickets} overlayClassName="custom-tooltip">
          <img src={Images.TooltipIcon.src} alt="" />
        </Tooltip>
      );
    }
    if (type === RaveQuestType.INVITE) {
      return (
        <Tooltip
          title={RaveQuestInviteFriend}
          overlayClassName="custom-tooltip"
        >
          <img src={Images.TooltipIcon.src} alt="" />
        </Tooltip>
      );
    }
    return null;
  };

  const renderFriendText = (type: number) => {
    if (
      type === RaveQuestType.SHARE ||
      type === RaveQuestType.BUYTICKET ||
      type === RaveQuestType.INVITE
    ) {
      return '/ friend';
    }
    return '';
  };

  return (
    <Row gutter={[15, 15]} style={{ position: 'relative' }}>
      {/* <Ended>
      <div className='content'>
        <img src={Images.ThankyouGifIcon.src} alt='thank-you' />
        <p>This rave has ended. </p>
        <p>Browse our other amazing events!</p>
      </div>
    </Ended> */}
      {list.map((item, index) => (
        <Col span={24} key={`${item.name}-${index}`} lg={12}>
          <RaveItem>
            <div className="head">
              <span className="title">
                {item.name}
                {renderItemTooltip(item.type)}
              </span>
              <span className="badge">
                <span>{item.getTimes}</span>
                <span>/ {item.limitUser}</span>
              </span>
            </div>
            <p className="description">{item.description}</p>
            <div className="flame">
              + {item.flamePoint} <FireIcon src={Images.FireGifIcon.src} />{' '}
              {renderFriendText(item.type)}
            </div>
          </RaveItem>
        </Col>
      ))}
    </Row>
  );
};

const MoreRaves = () => {
  const { lg } = useBreakpoint();
  return (
    <Row gutter={[16, 16]}>
      <Col span={24} lg={12}>
        <PlaceHolderItem>
          <PlaceHolderImg
            src={
              lg
                ? Images.RavePlaceholder1Img.src
                : Images.RavePlaceholder1ImgMobile.src
            }
          />
          <LockImg src={Images.LockIcon.src} />
        </PlaceHolderItem>
      </Col>
      <Col span={24} lg={12}>
        <PlaceHolderItem>
          <PlaceHolderImg
            src={
              lg
                ? Images.RavePlaceholder2Img.src
                : Images.RavePlaceholder2ImgMobile.src
            }
          />
          <LockImg src={Images.LockIcon.src} />
        </PlaceHolderItem>
      </Col>
    </Row>
  );
};

const PopUpContent = () => {
  const postContent = 'Join me in this rave and win rewards together!';
  const link = 'app.tickets.crowdserve.com/events/sopdw39f';
  const image =
    'https://crowdserve-ticket-images-dev.s3-ap-southeast-1.amazonaws.com/events/1693277132950-YxY5.png';
  const [copySuccess, setCopySuccess] = useState(false);
  const [saveImageUrl, setSaveImageUrl] = useState<any>('');
  const [messageApi, contextHolder] = message.useMessage();

  let timer: any = null;
  const handleCopy = () => {
    clearTimeout(timer);
    copy(link);
    setCopySuccess(true);
    timer = setTimeout(() => {
      setCopySuccess(false);
    }, 3000);
  };
  const handleCopyPostContent = () => {
    copy(`${postContent} \n ${link}`);
  };

  const saveImage = () => {
    setSaveImageUrl('');
    let request = new XMLHttpRequest();
    request.open('get', image, true);
    request.responseType = 'blob';
    request.setRequestHeader('Cache-Control', 'no-cache');
    messageApi.open({
      content: (
        <div className="message-content">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="image-ani-hourglass"
            src={Images.HourglassWhite.src}
            alt=""
          />
          <div>
            Downloading
            <span className="dot-ani" />
          </div>
        </div>
      ),
      className: 'default-message default-message-download',
      duration: 0,
    });
    request.onload = function () {
      if (this.status === 200) {
        let blob = this.response;
        let oFileReader = new FileReader();
        oFileReader.onloadend = function (e: any) {
          const base64 = e.target.result;
          setSaveImageUrl(base64);
        };
        oFileReader.readAsDataURL(blob);
        messageApi.destroy();
      }
    };
    request.send();
  };

  useEffect(() => {
    if (saveImageUrl) {
      const elA = document.createElement('a');
      elA.download = `post-${Date.now()}.png`;
      elA.href = saveImageUrl;
      elA.click();
      elA.remove();
      messageApi.destroy();
    }
  }, [saveImageUrl]);

  useEffect(
    () => () => {
      clearTimeout(timer);
    },
    []
  );

  return (
    <div>
      <ShareLinkImg src={Images.ShareLinkIcon.src} />
      <ShareLinkContent>
        <h4 className="title">Share your link!</h4>
        <p className="sub-title">
          {`The more friends that use your link, the more lit you'll get!!`}
        </p>
        <div className="share-link-area">
          <div className="link-content">
            <span className="link">{link}</span>
            {copySuccess ? (
              <Image
                src={Images.CopySuccessIcon}
                alt="copy"
                width={18}
                height={18}
                layout="fixed"
              />
            ) : null}
          </div>
          <Image
            src={Images.CopyBigIcon}
            alt="copy"
            width={32}
            height={32}
            layout="fixed"
            onClick={handleCopy}
            className="copy-icon"
          />
        </div>
      </ShareLinkContent>
      <YouMayNeed>
        <span>You May Need</span>
      </YouMayNeed>
      <PostImage>
        <div className="title">Post Image</div>
        <div className="post-image-content">
          <div>
            <Image
              src={image}
              alt="post-image"
              width={112}
              height={56}
              layout="fixed"
            />
          </div>
          <Image
            src={Images.DownloadIcon}
            alt="download"
            width={19}
            height={19}
            layout="fixed"
            className="download"
            onClick={saveImage}
          />
        </div>
      </PostImage>
      <PostContent>
        <div className="title">Attractive Post Content</div>
        <div className="post-content-main">
          <p>
            {postContent}
            <br />
            {link}
          </p>
          <Image
            src={Images.CopyIcon}
            alt="copy"
            width={19}
            height={19}
            layout="fixed"
            className="icon"
            onClick={handleCopyPostContent}
          />
        </div>
      </PostContent>
      {contextHolder}
    </div>
  );
};
const Raves = ({
  raveData,
  showHaveJoinedRaveModal,
  setShowHaveJoinedRaveModal,
  setShowJoinRaveModal,
}: {
  raveData: GetRaveResponseProps;
  showHaveJoinedRaveModal: boolean;
  setShowHaveJoinedRaveModal: (status: boolean) => void;
  setShowJoinRaveModal: (status: boolean) => void;
}) => {
  const [sharePopupOpen, setSharePopupOpen] = useState(false);
  const [redeemRewardModalOpen, setRedeemRewardModalOpen] =
    useState<boolean>(false);
  const [currentShowReward, setCurrentShowReward] =
    useState<GetRaveResponseRewardListProps>({
      name: '',
      image: '',
      milestone: 0,
      stock: 0,
      redeemed: false,
    });

  return (
    <div>
      <TipBar
        rewardData={raveData.reward || []}
        redeemedUser={raveData.redeemedUsers}
      />
      <ProgressContainer
        setCurrentShowReward={setCurrentShowReward}
        setRedeemRewardModalOpen={setRedeemRewardModalOpen}
        giftList={raveData.reward}
        currentFlamePoint={raveData.user.flamePoint}
      />
      <SectionTitle>Rave Description</SectionTitle>
      <RaveDescription>{raveData.description || '-'}</RaveDescription>
      <SectionTitle>Quests</SectionTitle>
      <RaveList list={raveData.quest} />
      <JoinButton type='primary' onClick={() => setShowJoinRaveModal(true)}>
        Join the Rave
      </JoinButton>
      <SectionTitle>More Raves Coming Soon</SectionTitle>
      <MoreRaves />
      <RavesPopUp
        open={sharePopupOpen}
        onClose={() => setSharePopupOpen(false)}
      >
        <PopUpContent />
      </RavesPopUp>
      <RavesPopUp
        open={showHaveJoinedRaveModal}
        onClose={() => setShowHaveJoinedRaveModal(false)}
      >
        <HaveJoinedRaveModalContent>
          <Col className='content-mascotsIcon'>
            <img src={Images.MascotsIcon.src} alt='' />
          </Col>
          <Col className='content-title'>You have joined the rave!</Col>
          <Col className='content-count'>
            <span>
              <span>+ </span>2
            </span>
            <span>
              <img src={Images.FireGifIcon.src} alt='' />
            </span>
          </Col>
        </HaveJoinedRaveModalContent>
      </RavesPopUp>
      <RavesPopUp
        open={redeemRewardModalOpen}
        onClose={() => setRedeemRewardModalOpen(false)}
      >
        <RedeemRewardModalContent>
          <Col className='redeem-title'>Redeem Reward</Col>
          <Col className='redeem-img-box'>
            <div className='redeem-info'>
              <img
                className='background'
                src={Images.FireworksGifIcon.src}
                alt=''
              />
              <div className='info'>
                <img
                  className='info-img'
                  src={currentShowReward.image}
                  alt=''
                />
                <div className='info-name'>{currentShowReward.name}</div>
                <img className='left-icon' src={Images.WowGifIcon.src} alt='' />
              </div>
            </div>
          </Col>
          <Col className='redeem-button'>
            <Button>Redeem</Button>
          </Col>
        </RedeemRewardModalContent>
      </RavesPopUp>
    </div>
  );
};
export default Raves;
