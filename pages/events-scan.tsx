import React, { useState, useEffect } from 'react';
import type { MenuProps } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { Row, Col, Dropdown, Checkbox, Button } from 'antd';

import { Images } from '@/theme';
import { EventsScanContainer, EventItem } from '@/styles/eventsScan.style';

const CheckboxGroup = Checkbox.Group;

const EventsScan = () => {
  const [listOptions, setListOptions] = useState<any[]>([]);
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);

  const items: MenuProps['items'] = [
    {
      label: 'Logout',
      key: 'logout',
    },
  ];

  const sourceData = [
    {
      id: 1,
      name: 'Luxury Lifestyle Concierge Service with Quintessentially',
      date: 'Oct 01. 2023. 00:00 - Nov 30, 2023, 00:00',
    },
    {
      id: 2,
      name: 'Singapore Pub Crawl',
      date: 'Oct 01. 2023. 00:00 - Nov 30, 2023, 00:00',
    },
    {
      id: 3,
      name: 'Luxury Lifestyle Concierge Service with Quintessentially',
      date: 'Oct 01. 2023. 00:00 - Nov 30, 2023, 00:00',
    },
    {
      id: 4,
      name: 'Singapore Pub Crawl',
      date: 'Oct 01. 2023. 00:00 - Nov 30, 2023, 00:00',
    },
    {
      id: 5,
      name: 'Luxury Lifestyle Concierge Service with Quintessentially',
      date: 'Oct 01. 2023. 00:00 - Nov 30, 2023, 00:00',
    },
    {
      id: 6,
      name: 'Singapore Pub Crawl',
      date: 'Oct 01. 2023. 00:00 - Nov 30, 2023, 00:00',
    },
    {
      id: 7,
      name: 'Luxury Lifestyle Concierge Service with Quintessentially',
      date: 'Oct 01. 2023. 00:00 - Nov 30, 2023, 00:00',
    },
    {
      id: 8,
      name: 'Singapore Pub Crawl',
      date: 'Oct 01. 2023. 00:00 - Nov 30, 2023, 00:00',
    },
  ];

  const handleChange = (list: CheckboxValueType[]) => {
    setCheckedList(list);
  };

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckedList(
      (e.target.checked && listOptions.map((item) => item.value)) || []
    );
  };

  useEffect(() => {
    setListOptions(
      sourceData.map((item) => {
        return {
          label: (
            <Col>
              <div className="event-name">{item.name}</div>
              <div className="event-date">{item.date}</div>
            </Col>
          ),
          value: item.id,
        };
      })
    );
  }, []);

  return (
    <EventsScanContainer>
      <div className="page-header">
        <Row>
          <Col span={12} className="logo-img">
            <img src={Images.LogoNameIcon.src} alt="" />
          </Col>
          <Col span={12} className="header-dropdown">
            <div className="content">
              <Dropdown menu={{ items }}>
                <div>
                  Organizer name
                  <img src={Images.ArrowDown.src} alt="" />
                </div>
              </Dropdown>
            </div>
          </Col>
        </Row>
      </div>
      <div className="page-main">
        {(sourceData.length && (
          <>
            <Row>
              <Col className="title">UPCOMING EVENTS</Col>
            </Row>
            <div className="event-list">
              <EventItem>
                <CheckboxGroup
                  value={checkedList}
                  options={listOptions}
                  onChange={handleChange}
                />
              </EventItem>
            </div>
          </>
        )) || (
          <div className="no-data">
            <img src={Images.NoTicketsIcon.src} alt="" />
            <p>No Upcoming Events</p>
          </div>
        )}
      </div>
      {sourceData.length && (
        <div className="page-bottom">
          <Row className="content">
            <Col span={6}>
              <Checkbox
                onChange={onCheckAllChange}
                checked={listOptions.length === checkedList.length}
              >
                <span className="all">ALL</span>
              </Checkbox>
            </Col>
            <Col span={18}>
              <Button>Rock N' Roll</Button>
            </Col>
          </Row>
        </div>
      ) || null}
    </EventsScanContainer>
  );
};

export default EventsScan;
