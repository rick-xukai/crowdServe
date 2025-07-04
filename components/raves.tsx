import { Col, Row, Grid, message, Tooltip, Button } from 'antd';
import copy from 'copy-to-clipboard';
import _ from 'lodash';
import { LoadingOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { useEffect, useState } from 'react';
// import dynamic from 'next/dynamic';

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
  ImageSaveFailed,
  FirebaseTrackEventName,
} from '@/constants/General';
import { firebaseTrackMethod } from '@/utils/func';
import { RouterKeys, CookieKeys } from '@/constants/Keys';
import { RaveStatus } from '@/slice/event.slice';
import { useAppSelector } from '@/app/hooks';
import { useCookie } from '@/hooks';

// const ReactPullToRefresh = dynamic(
//   () => import('react-simple-pull-to-refresh'),
//   {
//     ssr: false,
//   }
// );
const { useBreakpoint } = Grid;
declare global {
  interface Window {
    DownloadImage: any;
  }
}

const TipBar = ({
  rewardData,
  redeemedUser,
  isEnd,
  joinedUser,
}: {
  rewardData: GetRaveResponseRewardListProps[];
  redeemedUser: number;
  isEnd: boolean;
  joinedUser: number;
}) => (
  <TipBarWrapper isEnd={isEnd}>
    <TipBarIcon src={Images.SmileIcon.src} alt="" />
    {isEnd ? (
      <p>
        The Rave already ended. {joinedUser}{' '}
        {(joinedUser > 1 && 'users') || 'user'} participated in the rave and{' '}
        {redeemedUser} {(redeemedUser > 1 && 'ravers') || 'raver'} got the
        rewards.
      </p>
    ) : (
      <p>
        {redeemedUser} {(redeemedUser > 1 && 'ravers have') || 'raver has'}{' '}
        claimed the reward! Only {}
        {rewardData.length &&
          rewardData.map((item, index) => (
            <span key={item.id}>
              <b>{item.stock}</b>{' '}
              {(index === rewardData.length - 2 && <>{item.name} and </>) || (
                <>
                  {(index === rewardData.length - 1 && (
                    <>{item.name} left!</>
                  )) || <>{item.name}, </>}
                </>
              )}
            </span>
          ))}
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
  lastGift,
}: {
  current: number;
  total: number;
  gifts: GetRaveResponseRewardListProps[];
  setRedeemRewardModalOpen: (status: boolean) => void;
  setCurrentShowReward: (data: GetRaveResponseRewardListProps) => void;
  isEnd: boolean;
  lastGift: GetRaveResponseRewardListProps;
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
      <div className="progress-content">
        <div
          className={isEnd ? 'end progress' : 'progress'}
          style={{ width: `${percent}%` }}
        >
          {(current < total || isEnd) && (
            <FireIcon
              style={{
                width: fireIconSize,
                position: 'absolute',
                top: '25%',
                transform: 'translateY(-50%)',
              }}
              src={isEnd ? Images.EndFlameImg.src : Images.FireGifIcon.src}
            />
          )}
        </div>
        {!isEnd &&
          gifts.map((item) => {
            const gotGifts = item.milestone <= current;
            return (
              <GiftItem
                className={
                  (lastGift.id === item.id &&
                    `${(gotGifts && 'got-gift') || 'last-gift'}`) ||
                  ''
                }
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
                <div className="gift-img-content">
                  <GiftImg
                    src={item.img}
                    style={{
                      top: (item.redeemed && -10) || (gotGifts && -14) || -6,
                      width: item.redeemed ? 32 : gotGifts ? 42 : '',
                      filter: (item.redeemed && 'grayscale(100%)') || '',
                      boxShadow:
                        (gotGifts && '0px 2px 6px 0px rgba(0, 0, 0, 0.50)') ||
                        '',
                    }}
                  />
                </div>
                {gotGifts ? null : (
                  <p className="item-flames">{item.milestone} Flames</p>
                )}
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
      <CornerBorderLeft src={Images.CornerBorderImg.src} />
      <CornerBorderRight src={Images.CornerBorderImg.src} />
      <div className="content">
        <ProgressBar
          current={currentFlamePoint}
          total={(_.last(giftList) && _.last(giftList)?.milestone) || 0}
          gifts={giftList.map((item) => {
            const getImg = () => {
              if (item.milestone <= currentFlamePoint) {
                return item.icon;
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
          lastGift={_.last(giftList) as GetRaveResponseRewardListProps}
        />
      </div>
      <div className="flame-items">
        {giftList.map((item) => (
          <div key={item.id} className="item">
            <span className="item-flame">
              {item.milestone}
              <FireIcon src={Images.FireGifIcon.src} />
            </span>
            <span className="item-name">{item.name}</span>
          </div>
        ))}
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
      {/* {isEnd ? (
        <Ended>
          <div className="content">
            <img src={Images.ThankyouGifIcon.src} alt="thank-you" />
            <p>This rave has ended. </p>
            <p>Browse our other amazing events!</p>
          </div>
        </Ended>
      ) : null} */}

      {list.map((item, index) => (
        <Col span={24} key={`${item.name}-${index}`} lg={12}>
          <RaveItem>
            <div className="head">
              <span className="title">
                {item.name}
                {renderItemTooltip(item.type)}
              </span>
              <span className="badge">
                <span>{item.getTimes * item.flamePoint}</span>
                {(item.limitUser === 0 && <span>/Unlimited</span>) || (
                  <span>/{item.limitUser * item.flamePoint}</span>
                )}
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

const PopUpContent = ({
  currentEventSlug,
  inviteCode,
  image,
  setOpenViewPost,
  setSharePopupOpen,
}: {
  currentEventSlug: string;
  inviteCode: string;
  image: string;
  setOpenViewPost: (status: boolean) => void;
  setSharePopupOpen: (status: boolean) => void;
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
    if (window && window.DownloadImage) {
      window.DownloadImage.postMessage(`${image}+${_.last(image.split('.'))}`);
    } else {
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
          setSaveImageUrl(window.URL.createObjectURL(blob));
          messageApi.destroy();
        } else {
          messageApi.destroy();
          messageApi.open({
            content: ImageSaveFailed,
            className: 'error-message-event',
          });
        }
      };
      request.send();
    }
  };

  useEffect(() => {
    const surfix = image.slice(image.lastIndexOf('.'));
    if (saveImageUrl) {
      const elA = document.createElement('a');
      elA.download = `post-${Date.now()}.${surfix}`;
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
          <div
            onClick={() => {
              setSharePopupOpen(false);
              setOpenViewPost(true);
            }}
          >
            <Image
              src={image}
              alt="post-image"
              width={112}
              height={56}
              layout="fixed"
              objectFit="cover"
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
}: // getRaveData,
{
  eventSlug: string;
  raveData: GetRaveResponseProps;
  showHaveJoinedRaveModal: boolean;
  redeemRewardSuccess: boolean;
  redeemRewardModalOpen: boolean;
  setRedeemRewardSuccess: (status: boolean) => void;
  setShowHaveJoinedRaveModal: (status: boolean) => void;
  joinRaveRequest: (id: string, type?: string) => void;
  handleRedeemReward: (currentReward: GetRaveResponseRewardListProps) => void;
  setRedeemRewardModalOpen: (status: boolean) => void;
  // getRaveData?: any;
}) => {
  const cookies = useCookie([CookieKeys.userLoginId]);

  const actionButtonLoading = useAppSelector(selectActionButtonLoading);
  const joinRaveResponse = useAppSelector(selectJoinRaveResponse);
  const redeemRewardLoading = useAppSelector(selectRedeemRewardLoading);

  const [sharePopupOpen, setSharePopupOpen] = useState<boolean>(false);
  const [openViewPost, setOpenViewPost] = useState<boolean>(false);
  const [currentShowReward, setCurrentShowReward] =
    useState<GetRaveResponseRewardListProps>({
      id: '',
      name: '',
      image: '',
      milestone: 0,
      stock: 0,
      redeemed: false,
      icon: '',
    });
  const { user, status } = raveData;
  const isEnd = status === RaveStatus.end;

  useEffect(() => {
    if (redeemRewardSuccess) setRedeemRewardModalOpen(false);
  }, [redeemRewardSuccess]);

  const renderRedeemButton = () => {
    if (currentShowReward.redeemed) {
      return (
        <Button disabled className="fully-redeemed">
          Congrats! Already redeemed
        </Button>
      );
    }
    if (currentShowReward.stock === 0) {
      return (
        <Button disabled className="fully-redeemed">
          Fully redeemed
        </Button>
      );
    }
    if (user.flamePoint < currentShowReward.milestone) {
      return (
        <Button disabled className="need-more">
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

  // const onRefresh = async () => {
  //   if (getRaveData) {
  //     getRaveData();
  //   }
  // };

  useEffect(() => {
    if (sharePopupOpen) {
      const userId = cookies.getCookie(CookieKeys.userLoginId);
      firebaseTrackMethod(FirebaseTrackEventName.shareRaveButtonClick, {
        webEventId: _.last(eventSlug.split('-')) || '',
        webUserId: userId || '',
      });
    }
  }, [sharePopupOpen]);

  return (
    <div>
      <TipBar
        rewardData={raveData.reward || []}
        redeemedUser={raveData.redeemedUsers}
        isEnd={isEnd}
        joinedUser={raveData.joinedUsers}
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
        <JoinButton type="primary" onClick={() => setSharePopupOpen(true)}>
          Share the Rave
        </JoinButton>
      ) : null}
      {!raveData.user.joined && !isEnd ? (
        <JoinButton
          disabled={actionButtonLoading}
          type="primary"
          onClick={() =>
            joinRaveRequest(_.last(eventSlug.split('-')) || '', 'joinDetail')
          }
        >
          {actionButtonLoading && <LoadingOutlined />}
          Join the Rave
        </JoinButton>
      ) : null}
      <SectionTitle>More Raves Coming Soon</SectionTitle>
      <MoreRaves />
      <RavesPopUp
        open={openViewPost}
        onClose={() => {
          setOpenViewPost(false);
          setSharePopupOpen(true);
        }}
      >
        <img className="view-post-img" src={raveData.shareImage} alt="" />
      </RavesPopUp>
      <RavesPopUp
        open={sharePopupOpen}
        onClose={() => setSharePopupOpen(false)}
      >
        <PopUpContent
          currentEventSlug={eventSlug}
          inviteCode={raveData.user.inviteCode}
          image={raveData.shareImage}
          setOpenViewPost={setOpenViewPost}
          setSharePopupOpen={setSharePopupOpen}
        />
      </RavesPopUp>
      <RavesPopUp
        open={showHaveJoinedRaveModal}
        onClose={() => setShowHaveJoinedRaveModal(false)}
      >
        <HaveJoinedRaveModalContent>
          <Col className="content-mascotsIcon">
            <img src={Images.MascotsIcon.src} alt="" />
          </Col>
          <Col className="content-title">You have joined the rave!</Col>
          <Col className="content-count">
            <span>
              <span>+ </span>
              {joinRaveResponse.flamePoint}
            </span>
            <span>
              <img src={Images.FireGifIcon.src} alt="" />
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
            <Col className="redeem-title">Redeem Reward</Col>
            <Col className="redeem-name">{currentShowReward.name}</Col>
            <Col className="redeem-img-box">
              <div className="redeem-info">
                <img
                  className="background"
                  src={Images.FireworksGifIcon.src}
                  alt=""
                />
                <div className="info">
                  <img
                    className="info-img"
                    src={currentShowReward.image || Images.BackgroundLogo.src}
                    alt=""
                    onError={(e: any) => {
                      e.target.onerror = null;
                      e.target.src = Images.BackgroundLogo.src;
                    }}
                  />
                  <img
                    className="left-icon"
                    src={Images.WowGifIcon.src}
                    alt=""
                  />
                </div>
              </div>
            </Col>
            <Col className="redeem-button">{renderRedeemButton()}</Col>
          </RedeemRewardModalContent>
        </RavesPopUp>
      </RedeemRewardPopupContainer>
      <RavesPopUp
        open={redeemRewardSuccess}
        onClose={() => setRedeemRewardSuccess(false)}
      >
        <RedeemSuccessModalContent>
          <Col className="title-img">
            <img src={Images.RedeemRewardSuccess.src} alt="" />
          </Col>
          <Col className="title">
            {`Congratulations, you have redeemed ${currentShowReward.name}`}
          </Col>
          <Col className="info">
            The reward will be sent to your CrowdServe wallet in several
            minutes.
          </Col>
        </RedeemSuccessModalContent>
      </RavesPopUp>
    </div>
    // <ReactPullToRefresh onRefresh={onRefresh}>
    //   <>
    //     <TipBar
    //       rewardData={raveData.reward || []}
    //       redeemedUser={raveData.redeemedUsers}
    //       isEnd={isEnd}
    //       joinedUser={raveData.joinedUsers}
    //     />
    //     <ProgressContainer
    //       setCurrentShowReward={setCurrentShowReward}
    //       setRedeemRewardModalOpen={setRedeemRewardModalOpen}
    //       giftList={raveData.reward}
    //       currentFlamePoint={raveData.user.flamePoint}
    //       isEnd={isEnd}
    //     />
    //     <SectionTitle>Rave Description</SectionTitle>
    //     <RaveDescription>{raveData.description || '-'}</RaveDescription>
    //     <SectionTitle>Quests</SectionTitle>
    //     <RaveList
    //       list={raveData.quest}
    //       isEnd={raveData.status === RaveStatus.end}
    //     />
    //     {raveData.user.joined && !isEnd ? (
    //       <JoinButton type="primary" onClick={() => setSharePopupOpen(true)}>
    //         Share the Rave
    //       </JoinButton>
    //     ) : null}
    //     {!raveData.user.joined && !isEnd ? (
    //       <JoinButton
    //         disabled={actionButtonLoading}
    //         type="primary"
    //         onClick={() =>
    //           joinRaveRequest(_.last(eventSlug.split('-')) || '', 'joinDetail')
    //         }
    //       >
    //         {actionButtonLoading && <LoadingOutlined />}
    //         Join the Rave
    //       </JoinButton>
    //     ) : null}
    //     <SectionTitle>More Raves Coming Soon</SectionTitle>
    //     <MoreRaves />
    //     <RavesPopUp
    //       open={openViewPost}
    //       onClose={() => {
    //         setOpenViewPost(false);
    //         setSharePopupOpen(true);
    //       }}
    //     >
    //       <img className="view-post-img" src={raveData.shareImage} alt="" />
    //     </RavesPopUp>
    //     <RavesPopUp
    //       open={sharePopupOpen}
    //       onClose={() => setSharePopupOpen(false)}
    //     >
    //       <PopUpContent
    //         currentEventSlug={eventSlug}
    //         inviteCode={raveData.user.inviteCode}
    //         image={raveData.shareImage}
    //         setOpenViewPost={setOpenViewPost}
    //         setSharePopupOpen={setSharePopupOpen}
    //       />
    //     </RavesPopUp>
    //     <RavesPopUp
    //       open={showHaveJoinedRaveModal}
    //       onClose={() => setShowHaveJoinedRaveModal(false)}
    //     >
    //       <HaveJoinedRaveModalContent>
    //         <Col className="content-mascotsIcon">
    //           <img src={Images.MascotsIcon.src} alt="" />
    //         </Col>
    //         <Col className="content-title">You have joined the rave!</Col>
    //         <Col className="content-count">
    //           <span>
    //             <span>+ </span>
    //             {joinRaveResponse.flamePoint}
    //           </span>
    //           <span>
    //             <img src={Images.FireGifIcon.src} alt="" />
    //           </span>
    //         </Col>
    //       </HaveJoinedRaveModalContent>
    //     </RavesPopUp>
    //     <RedeemRewardPopupContainer>
    //       <RavesPopUp
    //         open={redeemRewardModalOpen}
    //         onClose={() => setRedeemRewardModalOpen(false)}
    //       >
    //         <RedeemRewardModalContent>
    //           <Col className="redeem-title">Redeem Reward</Col>
    //           <Col className="redeem-name">{currentShowReward.name}</Col>
    //           <Col className="redeem-img-box">
    //             <div className="redeem-info">
    //               <img
    //                 className="background"
    //                 src={Images.FireworksGifIcon.src}
    //                 alt=""
    //               />
    //               <div className="info">
    //                 <img
    //                   className="info-img"
    //                   src={currentShowReward.image || Images.BackgroundLogo.src}
    //                   alt=""
    //                   onError={(e: any) => {
    //                     e.target.onerror = null;
    //                     e.target.src = Images.BackgroundLogo.src;
    //                   }}
    //                 />
    //                 <img
    //                   className="left-icon"
    //                   src={Images.WowGifIcon.src}
    //                   alt=""
    //                 />
    //               </div>
    //             </div>
    //           </Col>
    //           <Col className="redeem-button">{renderRedeemButton()}</Col>
    //         </RedeemRewardModalContent>
    //       </RavesPopUp>
    //     </RedeemRewardPopupContainer>
    //     <RavesPopUp
    //       open={redeemRewardSuccess}
    //       onClose={() => setRedeemRewardSuccess(false)}
    //     >
    //       <RedeemSuccessModalContent>
    //         <Col className="title-img">
    //           <img src={Images.CheersGifIcon.src} alt="" />
    //         </Col>
    //         <Col className="title">
    //           Congratulations, you have redeemed a free drink!
    //         </Col>
    //         <Col className="info">
    //           The reward will be sent to your CrowdServe wallet in several
    //           minutes.
    //         </Col>
    //       </RedeemSuccessModalContent>
    //     </RavesPopUp>
    //   </>
    // </ReactPullToRefresh>
  );
};
export default Raves;
