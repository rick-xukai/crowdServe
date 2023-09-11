import styled from "styled-components";
import { Button } from "antd";
import { Colors } from "@/theme";

export const TipBarWrapper = styled.div`
  padding: 8px;
  background: ${Colors.grayScale10};
  display: flex;
  align-items: center;
  gap: 10px;
  p {
    margin: 0;
    color: ${Colors.grayScale70};
    font-size: 15px;
    font-weight: 400;
    line-height: 21px;
  }
`;

export const TipBarIcon = styled.img`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
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

  .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding: 10px 15px;
    position: relative;
  }
  .total {
    display: flex;
    justify-content: center;
    gap: 7px;
    min-width: 40px;

    align-items: center;

    p {
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
`;

export const FireIcon = styled.img`
  width: 20px;
  flex-shrink: 0;
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
  }
`;

export const Border = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
`;

export const CorderBorderLeft = styled.img`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 24px;
`;

export const CorderBorderRight = styled.img`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 24px;
  transform: rotate(-90deg);
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
        right: -5px;
        top: -8px;
      }
    }
  }
`;

export const GiftItem = styled.div`
  position: absolute;
  top: -6px;
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

  .head {
    display: flex;
    justify-content: space-between;
    font-size: 18px;
    font-weight: 700;
    line-height: 25px;
    .badge {
      font-size: 18px;
      font-weight: 700;
      line-height: 25px;
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
    @media (min-width: 768px) {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .flame {
    display: inline-flex;
    padding: 4px 10px;
    align-items: center;
    gap: 2px;
    border-radius: 39px;
    background: ${Colors.grayScale70};
    img{
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
`;

export const LockImg = styled.img`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
`;