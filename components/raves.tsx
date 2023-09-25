import { Col, Row, Grid, message, Tooltip, Button } from 'antd';
import copy from 'copy-to-clipboard';
import _ from 'lodash';
import { LoadingOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import RavesPopUp from './ravesPopup';
import {
  Border,
  CornerBorderLeft,
  CornerBorderRight,
  Ended,
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
  RedeemRewardPopupContainer,
  RedeemSuccessModalContent,
} from '@/styles/raves.style';
import {
  GetRaveResponseProps,
  GetRaveResponseQuestProps,
  GetRaveResponseRewardListProps,
  RaveQuestType,
  selectActionButtonLoading,
  selectJoinRaveResponse,
  selectRedeemRewardLoading,
} from '@/slice/rave.slice';
import { Images } from '@/theme';
import {
  RaveQuestShare,
  RaveQuestBuyTickets,
  RaveQuestInviteFriend,
  AppDomain,
  LinkCopied,
} from '@/constants/General';
import { RouterKeys } from '@/constants/Keys';
import { RaveStatus } from '@/slice/event.slice';
import { useAppSelector } from '@/app/hooks';

const ReactPullToRefresh = dynamic(() => import('react-pull-to-refresh'), {
  ssr: false,
});
const { useBreakpoint } = Grid;

const TipBar = ({
  rewardData,
  redeemedUser,
  isEnd,
}: {
  rewardData: GetRaveResponseRewardListProps[];
  redeemedUser: number;
  isEnd: boolean;
}) => (
  <TipBarWrapper isEnd={isEnd}>
    <TipBarIcon src={Images.SmileIcon.src} alt='' />
    {isEnd ? (
      <p>
        The Rave already ended. 30 users participated in the rave and 20 ravers
        got the rewards.
      </p>
    ) : (
      <p>
        {redeemedUser} ravers have claimed the reward! Only{' '}
        <b>{(rewardData.length && rewardData[0].stock) || 0}</b>{' '}
        {(rewardData.length && rewardData[0].name) || '-'} and{' '}
        <b>{(rewardData.length && rewardData[1].stock) || 0}</b>{' '}
        {(rewardData.length && rewardData[1].name) || '-'} left!
      </p>
    )}
  </TipBarWrapper>
);

const ProgressBar = ({
  current,
  total,
  gifts,
  setRedeemRewardModalOpen,
  setCurrentShowReward,
  isEnd,
}: {
  current: number;
  total: number;
  gifts: GetRaveResponseRewardListProps[];
  setRedeemRewardModalOpen: (status: boolean) => void;
  setCurrentShowReward: (data: GetRaveResponseRewardListProps) => void;
  isEnd: boolean;
}) => {
  const { md } = useBreakpoint();
  const percent =
    current >= total ? 99 : ((!current ? 0.2 : current) / total) * 100;
  const steps = gifts.filter((item) => item.milestone < current);
  let fireIconSize = 22;
  steps.map(() => {
    fireIconSize += 8;
  });

  return (
    <ProgressBarWrapper>
      <div className='progress-content'>
        <div
          className={isEnd ? 'end progress' : 'progress'}
          style={{ width: `${percent}%` }}
        >
          <FireIcon
            style={{
              width: fireIconSize,
              position: 'absolute',
              top: '25%',
              transform: 'translateY(-50%)',
            }}
            src={isEnd ? Images.EndFlameImg.src : Images.FireGifIcon.src}
          />
        </div>
        {!isEnd &&
          gifts.map((item) => {
            const gotGifts = item.milestone <= current;
            return (
              <GiftItem
                onClick={() => {
                  setRedeemRewardModalOpen(true);
                  setCurrentShowReward(item);
                }}
                style={{
                  left: `${(item.milestone / total) * 100 - (md ? 5 : 10)}%`,
                  top: item.redeemed ? -10 : gotGifts ? -15 : '',
                }}
                key={item.milestone}
              >
                <GiftImg
                  src={item.img}
                  style={{
                    width: item.redeemed ? 32 : gotGifts ? 42 : '',
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
  isEnd,
}: {
  giftList: GetRaveResponseRewardListProps[];
  currentFlamePoint: number;
  setRedeemRewardModalOpen: (status: boolean) => void;
  setCurrentShowReward: (data: GetRaveResponseRewardListProps) => void;
  isEnd: boolean;
}) => (
  <ProgressWrapper>
    <FlameTotal>
      <div className='container'>
        <Border src={Images.BorderImg.src} />
        <StarIcon src={Images.StarIcon.src} />
        <div className='total'>
          <FireIcon src={Images.FireGifIcon.src} />
          <p>{currentFlamePoint}</p>
        </div>
        <StarIcon src={Images.StarIcon.src} />
      </div>
    </FlameTotal>
    <FlameProgress>
      <div className='content'>
        <CornerBorderLeft src={Images.CornerBorderImg.src} />
        <CornerBorderRight src={Images.CornerBorderImg.src} />
        <ProgressBar
          current={currentFlamePoint}
          total={_.sumBy(giftList, 'milestone')}
          gifts={giftList.map((item, index) => {
            const getImg = () => {
              if (item.milestone <= currentFlamePoint) {
                if (index === 0)
                  return item.redeemed
                    ? Images.GiftCheersDisabledImg.src
                    : Images.GiftCheersImg.src;
                return item.redeemed
                  ? Images.GiftTicketDisabledImg.src
                  : Images.GiftTicketImg.src;
              }
              return Images.GiftDisabledImg.src;
            };

            return {
              ...item,
              img: getImg(),
            };
          })}
          setRedeemRewardModalOpen={setRedeemRewardModalOpen}
          setCurrentShowReward={setCurrentShowReward}
          isEnd={isEnd}
        />
      </div>
    </FlameProgress>
  </ProgressWrapper>
);

const RaveList = ({
  list,
  isEnd,
}: {
  list: GetRaveResponseQuestProps[];
  isEnd: boolean;
}) => {
  const renderItemTooltip = (type: number) => {
    if (type === RaveQuestType.SHARE) {
      return (
        <Tooltip title={RaveQuestShare} overlayClassName='custom-tooltip'>
          <img src={Images.TooltipIcon.src} alt='' />
        </Tooltip>
      );
    }
    if (type === RaveQuestType.BUYTICKET) {
      return (
        <Tooltip title={RaveQuestBuyTickets} overlayClassName='custom-tooltip'>
          <img src={Images.TooltipIcon.src} alt='' />
        </Tooltip>
      );
    }
    if (type === RaveQuestType.INVITE) {
      return (
        <Tooltip
          title={RaveQuestInviteFriend}
          overlayClassName='custom-tooltip'
        >
          <img src={Images.TooltipIcon.src} alt='' />
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
      {isEnd ? (
        <Ended>
          <div className='content'>
            <img src={Images.ThankyouGifIcon.src} alt='thank-you' />
            <p>This rave has ended. </p>
            <p>Browse our other amazing events!</p>
          </div>
        </Ended>
      ) : null}

      {list.map((item, index) => (
        <Col span={24} key={`${item.name}-${index}`} lg={12}>
          <RaveItem>
            <div className='head'>
              <span className='title'>
                {item.name}
                {renderItemTooltip(item.type)}
              </span>
              <span className='badge'>
                <span>{item.getTimes * item.flamePoint}</span>
                <span>/{item.limitUser * item.flamePoint}</span>
              </span>
            </div>
            <p className='description'>{item.description}</p>
            <div className='flame'>
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

const PopUpContent = ({
  currentEventSlug,
  inviteCode,
  image,
}: {
  currentEventSlug: string;
  inviteCode: string;
  image: string;
}) => {
  const postContent = 'Join me in this rave and win rewards together!';
  const link = `${AppDomain}/${RouterKeys.eventDetail
    .replace(':slug', currentEventSlug)
    .replace('/', '')}?inviteCode=${inviteCode}`;
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
    messageApi.open({
      content: LinkCopied,
      className: 'default-message',
    });
  };

  const saveImage = () => {
    setSaveImageUrl('');
    let request = new XMLHttpRequest();
    request.open('get', image, true);
    request.responseType = 'blob';
    request.setRequestHeader('Cache-Control', 'no-cache');
    messageApi.open({
      content: (
        <div className='message-content'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className='image-ani-hourglass'
            src={Images.HourglassWhite.src}
            alt=''
          />
          <div>
            Downloading
            <span className='dot-ani' />
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
        <h4 className='title'>Share your link!</h4>
        <p className='sub-title'>
          {`The more friends that use your link, the more lit you'll get!!`}
        </p>
        <div className='share-link-area'>
          <div className='link-content'>
            <span className='link'>{link}</span>
            {copySuccess ? (
              <Image
                src={Images.CopySuccessIcon}
                alt='copy'
                width={18}
                height={18}
                layout='fixed'
              />
            ) : null}
          </div>
          <Image
            src={Images.CopyBigIcon}
            alt='copy'
            width={32}
            height={32}
            layout='fixed'
            onClick={handleCopy}
            className='copy-icon'
          />
        </div>
      </ShareLinkContent>
      <YouMayNeed>
        <span>You May Need</span>
      </YouMayNeed>
      <PostImage>
        <div className='title'>Post Image</div>
        <div className='post-image-content'>
          <div>
            <Image
              src={image}
              alt='post-image'
              width={112}
              height={56}
              layout='fixed'
            />
          </div>
          <Image
            src={Images.DownloadIcon}
            alt='download'
            width={19}
            height={19}
            layout='fixed'
            className='download'
            onClick={saveImage}
          />
        </div>
      </PostImage>
      <PostContent>
        <div className='title'>Attractive Post Content</div>
        <div className='post-content-main'>
          <p>
            {postContent}
            <br />
            {link}
          </p>
          <Image
            src={Images.CopyIcon}
            alt='copy'
            width={19}
            height={19}
            layout='fixed'
            className='icon'
            onClick={handleCopyPostContent}
          />
        </div>
      </PostContent>
      {contextHolder}
    </div>
  );
};

const Raves = ({
  eventSlug,
  raveData,
  showHaveJoinedRaveModal,
  redeemRewardSuccess,
  redeemRewardModalOpen,
  setRedeemRewardSuccess,
  setShowHaveJoinedRaveModal,
  joinRaveRequest,
  handleRedeemReward,
  setRedeemRewardModalOpen,
  getRaveData,
}: {
  eventSlug: string;
  raveData: GetRaveResponseProps;
  showHaveJoinedRaveModal: boolean;
  redeemRewardSuccess: boolean;
  redeemRewardModalOpen: boolean;
  setRedeemRewardSuccess: (status: boolean) => void;
  setShowHaveJoinedRaveModal: (status: boolean) => void;
  joinRaveRequest: (id: string) => void;
  handleRedeemReward: (currentReward: GetRaveResponseRewardListProps) => void;
  setRedeemRewardModalOpen: (status: boolean) => void;
  getRaveData?: any;
}) => {
  const actionButtonLoading = useAppSelector(selectActionButtonLoading);
  const joinRaveResponse = useAppSelector(selectJoinRaveResponse);
  const redeemRewardLoading = useAppSelector(selectRedeemRewardLoading);

  const [sharePopupOpen, setSharePopupOpen] = useState<boolean>(false);
  const [currentShowReward, setCurrentShowReward] =
    useState<GetRaveResponseRewardListProps>({
      id: '',
      name: '',
      image: '',
      milestone: 0,
      stock: 0,
      redeemed: false,
    });
  const { user, status } = raveData;
  const isEnd = status === RaveStatus.end;

  useEffect(() => {
    if (redeemRewardSuccess) setRedeemRewardModalOpen(false);
  }, [redeemRewardSuccess]);

  const renderRedeemButton = () => {
    if (currentShowReward.redeemed) {
      return (
        <Button disabled className='fully-redeemed'>
          Congrats! Already redeemed
        </Button>
      );
    }
    if (currentShowReward.stock === 0) {
      return (
        <Button disabled className='fully-redeemed'>
          Fully redeemed
        </Button>
      );
    }
    if (user.flamePoint < currentShowReward.milestone) {
      return (
        <Button disabled className='need-more'>
          {currentShowReward.milestone - user.flamePoint} More Flames to redeem
        </Button>
      );
    }
    return (
      <Button
        disabled={redeemRewardLoading}
        onClick={() => handleRedeemReward(currentShowReward)}
      >
        {redeemRewardLoading && <LoadingOutlined />}
        Redeem
      </Button>
    );
  };

  const onRefresh = async () => {
    if (getRaveData) {
      getRaveData();
    }
  };

  return (
    <ReactPullToRefresh
      onRefresh={onRefresh}
    >
      <TipBar
        rewardData={raveData.reward || []}
        redeemedUser={raveData.redeemedUsers}
        isEnd={isEnd}
      />
      <ProgressContainer
        setCurrentShowReward={setCurrentShowReward}
        setRedeemRewardModalOpen={setRedeemRewardModalOpen}
        giftList={raveData.reward}
        currentFlamePoint={raveData.user.flamePoint}
        isEnd={isEnd}
      />
      <SectionTitle>Rave Description</SectionTitle>
      <RaveDescription>{raveData.description || '-'}</RaveDescription>
      <SectionTitle>Quests</SectionTitle>
      <RaveList
        list={raveData.quest}
        isEnd={raveData.status === RaveStatus.end}
      />
      {raveData.user.joined && !isEnd ? (
        <JoinButton type='primary' onClick={() => setSharePopupOpen(true)}>
          Share the Rave
        </JoinButton>
      ) : null}
      {!raveData.user.joined && !isEnd ? (
        <JoinButton
          disabled={actionButtonLoading}
          type='primary'
          onClick={() => joinRaveRequest(_.last(eventSlug.split('-')) || '')}
        >
          {actionButtonLoading && <LoadingOutlined />}
          Join the Rave
        </JoinButton>
      ) : null}
      <SectionTitle>More Raves Coming Soon</SectionTitle>
      <MoreRaves />
      <RavesPopUp
        open={sharePopupOpen}
        onClose={() => setSharePopupOpen(false)}
      >
        <PopUpContent
          currentEventSlug={eventSlug}
          inviteCode={raveData.user.inviteCode}
          image={raveData.eventImage}
        />
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
              <span>+ </span>
              {joinRaveResponse.flamePoint}
            </span>
            <span>
              <img src={Images.FireGifIcon.src} alt='' />
            </span>
          </Col>
        </HaveJoinedRaveModalContent>
      </RavesPopUp>
      <RedeemRewardPopupContainer>
        <RavesPopUp
          open={redeemRewardModalOpen}
          onClose={() => setRedeemRewardModalOpen(false)}
        >
          <RedeemRewardModalContent>
            <Col className='redeem-title'>Redeem Reward</Col>
            <Col className='redeem-name'>{currentShowReward.name}</Col>
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
                    src={currentShowReward.image || Images.BackgroundLogo.src}
                    alt=''
                    onError={(e: any) => {
                      e.target.onerror = null;
                      e.target.src = Images.BackgroundLogo.src;
                    }}
                  />
                  <img
                    className='left-icon'
                    src={Images.WowGifIcon.src}
                    alt=''
                  />
                </div>
              </div>
            </Col>
            <Col className='redeem-button'>{renderRedeemButton()}</Col>
          </RedeemRewardModalContent>
        </RavesPopUp>
      </RedeemRewardPopupContainer>
      <RavesPopUp
        open={redeemRewardSuccess}
        onClose={() => setRedeemRewardSuccess(false)}
      >
        <RedeemSuccessModalContent>
          <Col className='title-img'>
            <img src={Images.CheersGifIcon.src} alt='' />
          </Col>
          <Col className='title'>
            Congratulations, you have redeemed a free drink!
          </Col>
          <Col className='info'>
            The reward will be sent to your CrowdServe wallet in several
            minutes.
          </Col>
        </RedeemSuccessModalContent>
      </RavesPopUp>
    </ReactPullToRefresh>
  );
};
export default Raves;
