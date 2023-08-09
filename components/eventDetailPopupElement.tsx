import React from 'react';
import { Row, Col, Divider } from 'antd';
import Image from 'next/image';

import { Images } from '../theme';
import { formatTimeStrByTimeString } from '../utils/func';
import { FormatTimeKeys, PriceUnit, TicketStatus } from '../constants/General';
import { CollectibleDetailResponseType } from '../slice/collectible.slice';
import { MyEventStatusContainer } from '../styles/myTickets.style';
import { DetailContainerElement } from '../styles/collectibleDetail.style';

const EventDetailPopupElement = ({
  collectibleDetail,
}: {
  collectibleDetail: CollectibleDetailResponseType;
}) => (
  <DetailContainerElement>
    <div className="event-image">
      <Image
        src={collectibleDetail.event.image || Images.BackgroundLogo.src}
        layout="fill"
        alt=""
        onError={(e: any) => {
          e.target.onerror = null;
          e.target.src = Images.BackgroundLogo.src;
        }}
      />
    </div>
    <div className="item-info">
      <Row className="item-info-row">
        <Col span={24} className="info-item-status">
          {TicketStatus.map((status) => {
            if (status.key === collectibleDetail.status && status.text) {
              return (
                <MyEventStatusContainer
                  key={status.key}
                  bgColor={status.bgColor}
                  textColor={status.color}
                >
                  {status.text}
                </MyEventStatusContainer>
              );
            }
            return null;
          })}
        </Col>
        <Col span={24} className="info-title">
          {collectibleDetail.event.name || '-'}
        </Col>
        <Col span={24} className="info-item">
          <Image className="info-item-icon" src={Images.ClockIcon} alt="" />
          <div className="info-description">
            {(collectibleDetail.event.startTime &&
              collectibleDetail.event.endTime &&
              `${formatTimeStrByTimeString(
                collectibleDetail.event.startTime,
                FormatTimeKeys.norm
              )} - ${formatTimeStrByTimeString(
                collectibleDetail.event.endTime,
                FormatTimeKeys.norm
              )}`) ||
              '-'}
          </div>
        </Col>
        <Col span={24} className="info-item">
          <Image src={Images.OrganiserIcon} alt="" className="info-item-icon" />
          <span className="info-description">
            {collectibleDetail.organizerName || '-'}
          </span>
        </Col>
        <Col span={24} className="info-item">
          <Image src={Images.LocationIcon} alt="" className="info-item-icon" />
          <div className="info-description">
            {(collectibleDetail.event.location &&
              `${collectibleDetail.event.location}, ${collectibleDetail.event.address}`) ||
              '-'}
          </div>
        </Col>
        <Col span={24} className="event-description">
          <p className="whole-description">
            {collectibleDetail.event.descriptionShort || '-'}
          </p>
        </Col>
      </Row>
    </div>
    <Divider />
    <Row className="ticket-info" gutter={[8, 8]}>
      <Col span={12} lg={6}>
        <Row className="ticket-info-item">
          <Col span={24} className="title">
            Type
          </Col>
          <Col span={24} className="value">
            {collectibleDetail.name || '-'}
          </Col>
        </Row>
      </Col>
      <Col span={12} lg={6}>
        <Row className="ticket-info-item">
          <Col span={24} className="title">
            Seat Number
          </Col>
          <Col span={24} className="value">
            {collectibleDetail.seat}
          </Col>
        </Row>
      </Col>
      <Col span={12} lg={6}>
        <Row className="ticket-info-item">
          <Col span={24} className="title">
            Price
          </Col>
          <Col span={24} className="value">
            {`${collectibleDetail.price.toFixed(2)} ${PriceUnit}`}
          </Col>
        </Row>
      </Col>
      <Col span={12} lg={6}>
        <Row className="ticket-info-item">
          <Col span={24} className="title">
            Ticket Number
          </Col>
          <Col span={24} className="value">
            {collectibleDetail.ticketNo || '-'}
          </Col>
        </Row>
      </Col>
    </Row>
  </DetailContainerElement>
);

export default EventDetailPopupElement;
