import React from 'react';
import { Form, Input, Select } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import { CountryCodePhoneNumberContainer } from '@/styles/countryCodePhoneNumber.style';
import countryDataList from '@/utils/countrycode.data.json';

const CountryCodePhoneNumber = ({
  isMobile,
  formItemClassName,
  selectPhoneCode,
  selectDefaultValue,
  inputOnChange,
  setDrawerOpen,
  selectCountryCodeChange,
}: {
  isMobile: boolean;
  formItemClassName: string;
  selectPhoneCode: string;
  selectDefaultValue: string | null;
  inputOnChange: (value: string) => void;
  setDrawerOpen: (status: boolean) => void;
  selectCountryCodeChange: (event: string) => void;
}) => (
  <CountryCodePhoneNumberContainer>
    {(isMobile && (
      <Form.Item
        name="phoneNumber"
        className={formItemClassName}
        rules={[{ required: true, message: 'Phone number is required' }]}
        getValueFromEvent={(e) => {
          const { value } = e.target;
          return value.replace(/[^0-9]/g, '');
        }}
      >
        <Input
          className="addon-before-input"
          placeholder="Phone number"
          onChange={(e) => inputOnChange(e.target.value)}
          addonBefore={
            <div
              className={
                (!selectPhoneCode && 'phone-code-tigger placeholder') ||
                'phone-code-tigger'
              }
              onClick={() => setDrawerOpen(true)}
            >
              <span className="placeholder">
                {selectPhoneCode || 'Country'}
              </span>
              <span>
                <DownOutlined />
              </span>
            </div>
          }
        />
      </Form.Item>
    )) || (
      <Form.Item
        name="phoneNumber"
        className={formItemClassName}
        rules={[{ required: true, message: 'Phone number is required' }]}
        getValueFromEvent={(e) => {
          const { value } = e.target;
          return value.replace(/[^0-9]/g, '');
        }}
      >
        <Input
          placeholder="Phone number"
          onChange={(e) => inputOnChange(e.target.value)}
          addonBefore={
            <Select
              defaultValue={selectDefaultValue}
              showSearch
              placeholder="Country"
              popupClassName="gender-select-dropdown select-country"
              options={countryDataList.map((item) => ({
                value: `${item.code}-${item.country}`,
                label: (
                  <div className="country-code-label">
                    <span>{item.code}</span>
                    <span>{item.country}</span>
                  </div>
                ),
              }))}
              suffixIcon={<DownOutlined style={{ pointerEvents: 'none' }} />}
              onChange={selectCountryCodeChange}
            />
          }
        />
      </Form.Item>
    )}
  </CountryCodePhoneNumberContainer>
);

export default CountryCodePhoneNumber;
