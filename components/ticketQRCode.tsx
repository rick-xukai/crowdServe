import React, { useState, useEffect } from 'react';
import { QRCode, Spin, Button, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Image from 'next/image';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  reset,
  getQRCodeDataAction,
  selectLoading,
  selectError,
  selectData,
} from '../slice/getQRCode.slice';
import Messages from '../constants/Messages';
import { DefaultCodeRefreshTime } from '../constants/General';
import { Images } from '../theme';

let timer: NodeJS.Timer | null = null;

const TicketQRCodeComponent = ({
  requestId,
  relatedEvent = null,
  countdownTime = DefaultCodeRefreshTime,
  handleError,
}: {
  requestId: string;
  relatedEvent?: string | null;
  countdownTime?: number;
  handleError: () => void;
}) => {
  const dispatch = useAppDispatch();

  const data = useAppSelector(selectData);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);

  const [countdownNumber, setCountdownNumber] = useState<
    number | ((prevTime: number) => void)
  >(countdownTime);

  const timerMethod = () => {
    setCountdownNumber(countdownTime);
    if (timer) {
      clearInterval(timer);
    }
    timer = setInterval(() => {
      setCountdownNumber((prevTime: number) => {
        if (prevTime > 0) {
          return prevTime - 1;
        }
        return 0;
      });
    }, 1000);
  };

  useEffect(() => {
    if (countdownNumber === 0) {
      setTimeout(() => {
        dispatch(
          getQRCodeDataAction({ ticket: requestId, event: relatedEvent })
        );
      }, 100);
    }
  }, [countdownNumber]);

  useEffect(() => {
    if (error) {
      if (
        error.code === Messages.redeemed.code ||
        error.code === Messages.ticketOnSale.code ||
        error.code === Messages.ticketCancelled.code
      ) {
        message.open({
          content: error.message,
          className: 'error-message-event',
        });
        handleError();
      }
    }
  }, [error]);

  useEffect(() => {
    if (!loading) {
      timerMethod();
    }
  }, [loading]);

  useEffect(() => {
    dispatch(getQRCodeDataAction({ ticket: requestId, event: relatedEvent }));
    return () => {
      dispatch(reset());
      clearInterval(Number(timer));
    };
  }, []);

  return (
    <>
      {(!error && (
        <div style={{ height: '100%' }}>
          {(!loading && (
            <>
              <QRCode
                value={data}
                bordered={false}
                size={270}
                status="expired"
                onRefresh={() => setCountdownNumber(0)}
              />
              <p className="code-refreshes">
                QR Code refreshes in:{' '}
                {`${
                  (countdownNumber < 10 && '00:0') || '00:'
                }${countdownNumber}`}
              </p>
              <p className="code-info">
                This QR code is your admission voucher, do not take screenshot
                or send to others!
              </p>
            </>
          )) || (
            <Spin spinning indicator={<LoadingOutlined spin />} size="large">
              <div />
            </Spin>
          )}
        </div>
      )) || (
        <div className="code-network-error-box">
          <Image src={Images.QrcodeNetworkError} alt="" />
          <p className="error-title">Network request failed</p>
          <p className="error-info">
            QR code failed to get, please refresh the page
          </p>
          <Button
            className="refresh-btn"
            onClick={() =>
              dispatch(
                getQRCodeDataAction({ ticket: requestId, event: relatedEvent })
              )
            }
          >
            REFRESH
          </Button>
          <p className="code-info">
            This QR code is your admission voucher, do not take screenshot or
            send to others!
          </p>
        </div>
      )}
    </>
  );
};

export default TicketQRCodeComponent;
