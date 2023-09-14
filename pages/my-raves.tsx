import React, { useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Col, Carousel, Row, Grid } from "antd";

import { useRouter } from "next/router";
import AuthHoc from "../components/hoc/AuthHoc";

import {
  BlankBlock,
  CarouselItem,
  CarouselItemImg,
  FireIcon,
  PageContainer,
  PageTitle,
  RaveItem,
} from "@/styles/myRaves.style";
import PageHearderResponsive from "@/components/pageHearderResponsive";
import PageHearderComponent from "@/components/pageHearder";
import PageBottomComponent from "@/components/pageBottomComponent";
import { Images } from "@/theme";
import { useAppDispatch } from "@/app/hooks";
import { setTabActiveKey } from "@/slice/event.slice";
import { Rave } from "@/constants/General";

const imgList = [
  "https://crowdserve-ticket-images-dev.s3-ap-southeast-1.amazonaws.com/events/1687145233259-r06z.jpeg",
  "https://crowdserve-ticket-images-dev.s3-ap-southeast-1.amazonaws.com/events/1693277132950-YxY5.png",
  "https://crowdserve-ticket-images-dev.s3-ap-southeast-1.amazonaws.com/events/1687167250641-TNUA.jpeg",
  "https://crowdserve-ticket-images-dev.s3-ap-southeast-1.amazonaws.com/events/1690860909864-gWxk.jpg",
];

const data: {
  title: string;
  status: "ongoing" | "end";
  desc: string;
  num: number;
  id: number;
}[] = [
  {
    title: "Rave1",
    status: "ongoing",
    desc: `Earn 50 flames and enjoy a complimentary drink at Time to
                      enjoy - 2023 event, courtesy of CrowdServe! (Who wouldn't
                      love a free drink?!)`,
    num: 2,
    id: 1,
  },
  {
    title: "Rave2",
    status: "end",
    desc: `Earn 50 flames and enjoy a complimentary drink at Time to
                      enjoy - 2023 event, courtesy of CrowdServe! (Who wouldn't
                      love a free drink?!)`,
    num: 1,
    id: 2,
  },
];

const { useBreakpoint } = Grid;
const MyCollectibles = () => {
  const [menuState, setMenuState] = useState<boolean>(false);
  const loading = false;
  const { lg } = useBreakpoint();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const goToRaveDetail = () => {
    dispatch(setTabActiveKey(Rave));
    router.push("/events/test-shopify-shipping-cllyn2nel0012qf2l9d2hrw9b");
  };
  return (
    <>
      {(loading && (
        <div className="page-loading">
          <LoadingOutlined />
        </div>
      )) || (
        <PageContainer>
          <div className="container-wrap">
            <Col md={24} xs={0}>
              <PageHearderResponsive />
            </Col>
            <Col md={0} xs={24}>
              <PageHearderComponent
                // saveScrollValue={saveScrollValue}
                setMenuState={setMenuState}
              />
            </Col>
            <Col className="page-main">
              <PageTitle>Upcoming Raves</PageTitle>
              <Carousel autoplay>
                {imgList.map((item) => (
                  <CarouselItem key={item}>
                    <CarouselItemImg src={item} alt="" />
                  </CarouselItem>
                ))}
              </Carousel>
              <BlankBlock size={lg ? 32 : 20} />
              <PageTitle>My Raves</PageTitle>
              <Row gutter={[16, 16]}>
                {data.map((item) => (
                  <Col span={24} md={12} key={item.id}>
                    <RaveItem status={item.status} onClick={goToRaveDetail}>
                      <div className="head">
                        <span className="title">{item.title}</span>
                        <span className="badge">{item.status}</span>
                      </div>
                      <p className="description">{item.desc}</p>
                      <div className="flame">
                        <FireIcon src={Images.FireGifIcon.src} />
                        {item.num}
                      </div>
                    </RaveItem>
                  </Col>
                ))}
              </Row>
            </Col>
            {!menuState && <PageBottomComponent />}
          </div>
        </PageContainer>
      )}
    </>
  );
};

export default AuthHoc(MyCollectibles);
