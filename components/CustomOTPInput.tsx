import { OTPInput, SlotProps } from 'input-otp';
import React from 'react';
import styled from 'styled-components';

import { Colors } from '@/theme';

const SlotCmp = styled('div')<{ isActive: boolean }>`
  border: ${(props) =>
    props.isActive ? `1px solid ${Colors.grayScale10}` : 'none'};
  width: 42px;
  height: 42px;
  background-color: ${Colors.grayScale90};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 6px;
  border-radius: 2px;
`;

const CustomOTPInputContainerCmp = styled.div`
  .otp-container {
    color: ${Colors.white};
    font-weight: 700;
    font-size: 20px;
    .slot-container {
      display: flex;
      align-items: center;
      .slot-container-items {
        display: flex;
        align-items: center;
        > :first-child {
          margin-left: 0;
        }
      }
    }
  }
`;

const Slot = ({ char, isActive }: SlotProps) => (
  <SlotCmp isActive={isActive}>{char !== null && <div>{char}</div>}</SlotCmp>
);

interface CustomOTPInputProps {
  value?: string;
  onChange?: (value: string) => void;
}

const CustomOTPInput = ({ value, onChange }: CustomOTPInputProps) => (
  <CustomOTPInputContainerCmp>
    <OTPInput
      maxLength={6}
      value={value}
      containerClassName="otp-container"
      render={({ slots }) => (
        <div className="slot-container">
          {/* <span className="prex-text">WOT - </span> */}
          <div className="slot-container-items">
            {slots.map((slot, index) => (
              <Slot {...slot} key={index}></Slot>
            ))}
          </div>
        </div>
      )}
      onChange={onChange}
    />
  </CustomOTPInputContainerCmp>
);

export default CustomOTPInput;
