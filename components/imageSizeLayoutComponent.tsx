import React from 'react';
import { Row, Col, Image } from 'antd';
import styled from 'styled-components';

import { EventDetailDescriptionImages } from '@/slice/myTickets.slice';
import { DescriptionImagesSize } from '@/constants/General';

const Container = styled(Row)`
  .image-item-content {
    .ant-image {
      width: 100%;
    }
  }
`;

const ImageSizeLayoutComponent = ({
  images,
}: {
  images: EventDetailDescriptionImages[];
}) => (
  <Container gutter={[24, 24]}>
    {images.map((item, index: number) => (
      <Col
        key={`${item.image}-${index}`}
        span={
          DescriptionImagesSize.find((size) => size.text === item.size)?.key
        }
        className="image-item-content"
      >
        <Image src={item.image} alt="" preview={false} />
      </Col>
    ))}
  </Container>
);

export default ImageSizeLayoutComponent;
