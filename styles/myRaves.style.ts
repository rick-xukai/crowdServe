import styled from 'styled-components';

import { Colors } from '@/theme';

export const PageContainer = styled.div`
  height: 100%;
  overflow: auto;
  .container-wrap {
    max-width: 1008px;
    margin: auto;
  }
  ::-webkit-scrollbar {
    display: none;
  }
  .page-main {
    padding: 20px 20px 70px 20px;
    margin-top: 45px;
    .load-more {
      color: ${Colors.white};
      text-align: center;
      margin-top: 10px;
      .anticon {
        margin-right: 10px;
      }
    }
  }
  @media (min-width: 1200px) {
    .page-main {
      padding: 20px 0 70px 0;
      margin-top: 60px;
    }
  }
  @media (min-width: 768px) and (max-width: 1200px) {
    .container-wrap {
      max-width: 688px;
    }
    .page-main {
      padding: 20px 0 70px 0;
      margin-top: 80px;
    }
  }
`;

export const PageTitle = styled.h4`
  font-weight: 700;
  font-size: 28px;
  color: ${Colors.white};
  font-family: 'Oswald';
  text-transform: uppercase;
  margin-top: 0;
  margin-bottom: 16px;
`;

export const CarouselItem = styled.div`
  width: 100%;
  @media (min-width: 1200px) {
    height: 290px;
  }
  height: 167px;
  background: ${Colors.white};
  border-radius: 4px;
  overflow: hidden;
`;

export const BlankBlock = styled.div<{ size: number }>`
  height: ${(props) => props.size}px;
`;

export const RaveItem = styled.div<{ status: 'ongoing' | 'end' }>`
  background: ${Colors.grayScale70};
  padding: 20px;
  border-radius: 4px;
  cursor: pointer;
  @media (min-width: 768px) {
    height: 156px;
  }
  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    gap: 10px;
    .title {
      color: ${Colors.white};
      font-weight: 700;
      line-height: 28px;
      font-size: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .badge {
      font-size: 12px;
      font-weight: 700;
      line-height: 18px;
      padding: 2px 6px;
      border-radius: 4px;
      color: ${(props) =>
        props.status === 'ongoing' ? Colors.white : Colors.grayScale50};
      background: ${(props) =>
        props.status === 'ongoing' ? Colors.branding : Colors.grayScale40};
      text-transform: uppercase;
    }
  }
  .description {
    color: ${Colors.white};
    font-size: 13px;
    font-weight: 300;
    line-height: 19px;
    margin-bottom: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    @media (min-width: 768px) {
      -webkit-line-clamp: 2;
    }
  }
  .flame {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    background: ${Colors.grayScale90};
    padding: 4px 10px;
    gap: 4px;
    border-radius: 34px;
    color: ${Colors.white};
    @media (min-width: 768px) {
      position: absolute;
      bottom: 20px;
    }
  }
`;

export const CarouselItemImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const FireIcon = styled.img`
  width: 14px;
  position: relative;
  top: -2px;
  left: -2px;
`;

export const Empty = styled.div`
  margin: auto;
  img {
    width: 120px;
    display: block;
    margin: auto;
    margin-top: 10px;
  }
  p {
    font-size: 15px;
    font-weight: 400;
    line-height: 21px;
    margin-top: 15px;
    text-align: center;
    color: ${Colors.white};
    a {
      color: ${Colors.branding};
      :hover {
        text-decoration: underline;
      }
    }
  }
`;
