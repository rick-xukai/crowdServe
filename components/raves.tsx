import { Col, Row, Grid, message } from "antd";
import copy from "copy-to-clipboard";

import Image from "next/image";
import { useEffect, useState } from "react";
import RavesPopUp from "./ravesPopup";
import {
  Border,
  CorderBorderLeft,
  CorderBorderRight,
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
} from "@/styles/raves.style";
import { Images } from "@/theme";

const { useBreakpoint } = Grid;

const TipBar = () => (
  <TipBarWrapper>
    <TipBarIcon src={Images.SmileIcon.src} alt="" />
    <p>
      30 ravers have claimed the reward! Only <b>20</b> free drinks and{" "}
      <b>12</b> free tickets left!
    </p>
  </TipBarWrapper>
);

const ProgressBar = ({
  current,
  total,
  gifts,
}: {
  current: number;
  total: number;
  gifts: {
    quantity: number;
    img: string;
  }[];
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
              style={{
                left: `${(item.quantity / total) * 100 - (md ? 5 : 10)}%`,
                top: gotGifts ? -12 : "",
              }}
              key={item.quantity}
            >
              <GiftImg
                src={item.img}
                style={{
                  width: gotGifts ? 42 : "",
                }}
              />
              {gotGifts ? null : <p>{item.quantity} Flames</p>}
            </GiftItem>
          );
        })}
      </div>
    </ProgressBarWrapper>
  );
};

const data = {
  current: 15,
  total: 80,
  gifts: [
    {
      quantity: 15,
    },
    {
      quantity: 30,
    },
  ],
};

const ProgressContainer = () => (
  <ProgressWrapper>
    <FlameTotal>
      <div className="container">
        <Border src={Images.BorderImg.src} />
        <StarIcon src={Images.StarIcon.src} />
        <div className="total">
          <FireIcon src={Images.FireGifIcon.src} />
          <p>{data.current}</p>
        </div>
        <StarIcon src={Images.StarIcon.src} />
      </div>
    </FlameTotal>
    <FlameProgress>
      <div className="content">
        <CorderBorderLeft src={Images.CornerBorderImg.src} />
        <CorderBorderRight src={Images.CornerBorderImg.src} />
        <ProgressBar
          current={data.current}
          total={data.total}
          gifts={data.gifts.map((item) => ({
            ...item,
            img:
              item.quantity <= data.current
                ? Images.GiftCheersImg.src
                : Images.GiftDisabledImg.src,
          }))}
        />
      </div>
    </FlameProgress>
  </ProgressWrapper>
);
const raveData = [
  {
    title: "Join the rave",
    current: 2,
    total: 2,
    description: "Collect 2 flames just by joining the rave!",
    id: 1,
    condition: 2,
    isFriend: false,
  },
  {
    title: "Invite a friend",
    current: 6,
    total: 10,
    description:
      "Earn flames when your friends join rave through your referral link.",
    id: 2,
    condition: 2,
    isFriend: true,
  },
  {
    title: "Share your link",
    current: 10,
    total: 20,
    description: "Earn a star each time your friends open your referral link.",
    id: 3,
    condition: 3,
    isFriend: true,
  },
  {
    title: "Buy tickets",
    current: 0,
    total: 25,
    description:
      "Earn 5 flames when a ticket is purchased through your referral link!",
    id: 4,
    condition: 5,
    isFriend: true,
  },
];
const RaveList = () => (
  <Row gutter={[15, 15]}>
    {raveData.map((item) => (
      <Col span={24} key={item.id} lg={12}>
        <RaveItem>
          <div className="head">
            <span className="title">{item.title}</span>
            <span className="badge">
              {item.current} <span>/ {item.total}</span>
            </span>
          </div>
          <p className="description">{item.description}</p>
          <div className="flame">
            + {item.condition} <FireIcon src={Images.FireGifIcon.src} />{" "}
            {item.isFriend ? "/ friend" : ""}
          </div>
        </RaveItem>
      </Col>
    ))}
  </Row>
);

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
  const postContent = "Join me in this rave and win rewards together!";
  const link = "app.tickets.crowdserve.com/events/sopdw39f";
  const image =
    "https://crowdserve-ticket-images-dev.s3-ap-southeast-1.amazonaws.com/events/1693277132950-YxY5.png";
  const [copySuccess, setCopySuccess] = useState(false);
  const [saveImageUrl, setSaveImageUrl] = useState<any>("");
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
    setSaveImageUrl("");
    let request = new XMLHttpRequest();
    request.open("get", image, true);
    request.responseType = "blob";
    request.setRequestHeader("Cache-Control", "no-cache");
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
      className: "default-message default-message-download",
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
      const elA = document.createElement("a");
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
const Raves = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <TipBar />
      <ProgressContainer />
      <SectionTitle>Rave Description</SectionTitle>
      <RaveDescription>
        Embark on your rave journey to redeem your free drink and free ticket!
      </RaveDescription>
      <SectionTitle>Quests</SectionTitle>
      <RaveList />
      <JoinButton type="primary" onClick={() => setOpen(true)}>
        Join the Rave
      </JoinButton>
      <SectionTitle>More Raves Coming Soon</SectionTitle>
      <MoreRaves />
      <RavesPopUp open={open} onClose={() => setOpen(false)}>
        <PopUpContent />
      </RavesPopUp>
    </div>
  );
};
export default Raves;
