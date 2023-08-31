import React from 'react';
import { Row, Col, Button } from 'antd';
import Image from 'next/image';

import { Images } from '../theme';
import {
  FormatTimeKeys,
  PrivilegeType,
  TicketStatus,
} from '../constants/General';
import { formatTimeStrByTimeString, formatLocation } from '../utils/func';
import { ConnectedEventsResponseType } from '../slice/collectible.slice';
import { MyEventStatusContainer } from '../styles/myTickets.style';
import { ConnectedEventContainerElement } from '../styles/collectibleDetail.style';

const ConnectedEventPopupElement = ({
  connectedEventItemDetail,
}: {
  connectedEventItemDetail: ConnectedEventsResponseType;
}) => (
  <ConnectedEventContainerElement>
    <Row className="container-row">
      <Col span={24} xl={12} className="detail-image">
        <div className="image-content">
          {(connectedEventItemDetail.ticketType.imageType &&
            connectedEventItemDetail.ticketType.imageType
              .toLowerCase()
              .includes('video') && (
              <video
                src={connectedEventItemDetail.ticketType.image}
                playsInline
                muted
                autoPlay
                loop
              />
            )) || (
            <img
              src={connectedEventItemDetail.ticketType.image}
              alt=""
              onError={(e: any) => {
                e.target.onerror = null;
                e.target.src = Images.BackgroundLogo.src;
                e.target.className = 'error-full-image';
              }}
            />
          )}
        </div>
        <Col md={24} span={0} className="dividing-line">
          <Image src={Images.LineCollectibleDetailDesktop} alt="" />
        </Col>
      </Col>
      <Col span={24} xl={12} className="detail-info">
        <div className="detail-info-wrap">
          <div className="detail-info-content">
            {connectedEventItemDetail.privilegeType !==
              PrivilegeType.discount.status && (
              <div className="info-item-status">
                {TicketStatus.map((status) => {
                  if (
                    status.key === connectedEventItemDetail.status &&
                    status.text
                  ) {
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
              </div>
            )}
            <div className="info-name">
              <p>{connectedEventItemDetail.event.name || '-'}</p>
            </div>
            <div className="event-description" style={{ marginTop: 0 }}>
              <p className="whole-description">
                {connectedEventItemDetail.event.descriptionShort}
              </p>
            </div>
            {connectedEventItemDetail.privilegeType ===
              PrivilegeType.discount.status && (
              <div className="info-item">
                <img
                  src={Images.TicketsIcon.src}
                  alt=""
                  className="info-item-icon"
                />
                <div className="info-description">
                  {connectedEventItemDetail.ticketType.name || '-'}
                </div>
              </div>
            )}
            <div className="info-item">
              <img
                className="info-item-icon"
                src={Images.ClockIcon.src}
                alt=""
              />
              <div className="info-description">
                {(connectedEventItemDetail.event.startTime &&
                  connectedEventItemDetail.event.endTime &&
                  `${formatTimeStrByTimeString(
                    connectedEventItemDetail.event.startTime,
                    FormatTimeKeys.norm
                  )} - ${formatTimeStrByTimeString(
                    connectedEventItemDetail.event.endTime,
                    FormatTimeKeys.norm
                  )}`) ||
                  '-'}
              </div>
            </div>
            <div className="info-item">
              <img
                src={Images.OrganiserIcon.src}
                alt=""
                className="info-item-icon"
              />
              <div className="info-description">
                {connectedEventItemDetail.organizerName || '-'}
              </div>
            </div>
            <div className="info-item">
              <img
                src={Images.LocationIcon.src}
                alt=""
                className="info-item-icon"
              />
              <div className="info-description">
                {formatLocation(
                  connectedEventItemDetail.event.location,
                  connectedEventItemDetail.event.address
                )}
              </div>
            </div>
            {(connectedEventItemDetail.privilegeType ===
              PrivilegeType.discount.status && (
              <a href={connectedEventItemDetail.externalLink} target="_blank">
                <Button>GET TICKETS</Button>
              </a>
            )) || (
              <Row className="ticket-info" gutter={[8, 8]}>
                <Col span={12}>
                  <Row className="ticket-info-item">
                    <Col span={24} className="title">
                      Type
                    </Col>
                    <Col span={24} className="value">
                      {connectedEventItemDetail.ticketType.name || '-'}
                    </Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <Row className="ticket-info-item">
                    <Col span={24} className="title">
                      Seat Number
                    </Col>
                    <Col span={24} className="value">
                      {connectedEventItemDetail.ticketType.seat || '-'}
                    </Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <Row className="ticket-info-item">
                    <Col span={24} className="title">
                      Price
                    </Col>
                    <Col span={24} className="value">
                      {connectedEventItemDetail.ticketType.price || '-'}
                    </Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <Row className="ticket-info-item">
                    <Col span={24} className="title">
                      Ticket Number
                    </Col>
                    <Col span={24} className="value">
                      {connectedEventItemDetail.ticketType.ticketNo || '-'}
                    </Col>
                  </Row>
                </Col>
              </Row>
            )}
          </div>
        </div>
      </Col>
    </Row>
  </ConnectedEventContainerElement>
);

export default ConnectedEventPopupElement;
