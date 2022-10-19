import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { QrReader } from 'react-qr-reader';
import Image from 'next/image';
import { ScanQrCodePageContainers } from '../styles/scanQrCode.style';
import { Images } from '../theme';

interface ScanQrCodeDetail {
  participant: string;
  type: string;
  ticketNumber: string;
  email: string;
  seatNumber: string;
}

interface VerifyMessage {
  message: string;
  image: string;
  success: boolean;
}

const ScanQrCodeResult = ({
  result,
  setResult
}: {
  result: string;
  setResult: (value: string) => void
}) => {
  const [detail, setDatail] = useState<ScanQrCodeDetail | null>(null);
  const [verify, setVerify] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState<VerifyMessage>({
    message: '',
    image: '',
    success: false,
  });

  const handleGetScanQrCodeDetail = (value: string) => {
    if (value) {
      setTimeout(() => {
        setDatail({
          participant: 'Rick',
          type: 'VIP',
          ticketNumber: 'K0J2947294759275',
          email: 'rick.xu@imaginato.com',
          seatNumber: '04',
        });
      }, 2000);
    }
  };

  useEffect(() => {
    handleGetScanQrCodeDetail(result);
  }, [result]);

  const handleVerify = (value: string) => {
    switch (value) {
      case 'case1':
        setVerifyMessage({
          message: 'Ticket is verified successfully!',
          image: Images.Success,
          success: true,
        });
      break;
      case 'case2':
        setVerifyMessage({
          message: 'Invalid QR code, please refresh the code and try again.',
          image: Images.Dissatisfaction,
          success: false,
        });
      break;
      case 'case3':
        setVerifyMessage({
          message: 'Network error, please try again.',
          image: Images.NetworkError,
          success: false,
        });
      break;
      case 'case4':
        setVerifyMessage({
          message: 'This ticket has been verified at 2022/09/12 13:32:35.',
          image: Images.Safety,
          success: false,
        });
      break;
      default:
        setVerifyMessage({
          message: 'Invalid QR code, please refresh the code and try again.',
          image: Images.Dissatisfaction,
          success: false,
        });
      break;
    }
    setVerify(true);
  };

  return (
    <div className="scan-result">
      {detail && (
        <>
          {!verify && (
            <div style={{ padding: 20 }}>
              <div className="scan-back" onClick={() => setResult('')}>
                <Image src={Images.BackArrow} alt="" />
                <span style={{ marginLeft: 8 }}>BACK</span>
              </div>
              <div className="result-logo">
                <Image src={Images.Logo} alt="" />
              </div>
              <div className="border-box">
                <div className="result-container">
                  <div className="result-items">
                    <p className="items-title">
                      Participant
                    </p>
                    <p className="items-value">
                      {detail.participant}
                    </p>
                  </div>
                  <div className="result-items">
                    <p className="items-title">
                      Email
                    </p>
                    <p className="items-value">
                      {detail.email}
                    </p>
                  </div>
                  <div className="result-items display-flex">
                    <div style={{ width: '50%' }}>
                      <p className="items-title">
                        Type
                      </p>
                      <p className="items-value">
                        {detail.type}
                      </p>
                    </div>
                    <div style={{ width: '50%' }}>
                      <p className="items-title">
                        Seat Number
                      </p>
                      <p className="items-value">
                        {detail.seatNumber}
                      </p>
                    </div>
                  </div>
                  <div className="result-items">
                    <p className="items-title">
                      Ticket Nmuber
                    </p>
                    <p className="items-value">
                      {detail.ticketNumber}
                    </p>
                  </div>
                </div>
                <div
                  className="action-button"
                  onClick={() => handleVerify(result)}
                >
                  <Image src={Images.ButtonVerify} alt="" />
                  <p className="button-text">
                    VERIFY
                  </p>
                </div>
              </div>
            </div>
          ) || (
            <div className="verify-container">
              <div className="items">
                <div style={{ textAlign: 'center' }}>
                  <Image src={verifyMessage.image} alt="" />
                </div>
                <div>
                  <p className="verify-message">
                    {verifyMessage.message}
                  </p>
                </div>
                <div>
                  <button onClick={() => setResult('')}>
                    {verifyMessage.success && 'DONE' || 'Scan QR Code'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) || (
        <div>Loading...</div>
      )}
    </div>
  );
};

const ScanQrCodePage: NextPage = () => {
  const [result, setResult] = useState('');
  const [showQrReader, setShowQrReader] = useState(false);

  return (
    <ScanQrCodePageContainers>
      {showQrReader && (
        <>
          {!result && (
            <div>
              <div className="scan-back" onClick={() => setShowQrReader(false)}>
                <Image src={Images.BackArrow} alt="" />
                <span style={{ marginLeft: 8 }}>BACK</span>
              </div>
              <p className="scan-container">
                <Image src={Images.ScanContainer} alt="" />
              </p>
              <QrReader
                className="qr-reader"
                scanDelay={100}
                containerStyle={{ height: '100%', width: '100%' }}
                onResult={(_result: any) => setResult(_result?.text)}
                constraints={{ facingMode: 'environment' }}
              />
            </div>
          ) || (
            <ScanQrCodeResult
              result={result}
              setResult={setResult}
            />
          )}
        </>
      ) || (
        <div className="scan-start">
          <div className="scan-start-mask" />
          <p>
            <Image src={Images.Logo} alt="" />
          </p>
          <button onClick={() => setShowQrReader(true)}>
            SCAN QR CODE
          </button>
        </div>
      )}
    </ScanQrCodePageContainers>
  );
};

export default ScanQrCodePage;
