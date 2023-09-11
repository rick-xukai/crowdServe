import { Col, Row, Grid } from "antd";
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
  ProgressBarWrapper,
  ProgressWrapper,
  RaveDescription,
  RaveItem,
  SectionTitle,
  StarIcon,
  TipBarIcon,
  TipBarWrapper,
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
              <p>{item.quantity} Flames</p>
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
          <p>2</p>
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
    id: 1,
    condition: 3,
    isFriend: true,
  },
  {
    title: "Buy tickets",
    current: 0,
    total: 25,
    description:
      "Earn 5 flames when a ticket is purchased through your referral link!",
    id: 1,
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
          <PlaceHolderImg src={lg ? Images.RavePlaceholder1Img.src : Images.RavePlaceholder1ImgMobile.src} />
          <LockImg src={Images.LockIcon.src} />
        </PlaceHolderItem>
      </Col>
      <Col span={24} lg={12}>
        <PlaceHolderItem>
          <PlaceHolderImg src={lg ? Images.RavePlaceholder2Img.src : Images.RavePlaceholder2ImgMobile.src} />
          <LockImg src={Images.LockIcon.src} />
        </PlaceHolderItem>
      </Col>
    </Row>
  );
};
const Raves = () => (
  <div>
    <TipBar />
    <ProgressContainer />
    <SectionTitle>Rave Description</SectionTitle>
    <RaveDescription>
      Embark on your rave journey to redeem your free drink and free ticket!
    </RaveDescription>
    <SectionTitle>Quests</SectionTitle>
    <RaveList />
    <JoinButton type="primary">Join the Rave</JoinButton>
    <SectionTitle>More Raves Coming Soon</SectionTitle>
    <MoreRaves />
  </div>
);
export default Raves;
