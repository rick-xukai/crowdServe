import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { QrReader } from 'react-qr-reader';
import Image from 'next/image';
import Router, { useRouter } from 'next/router';
import { LoadingOutlined } from '@ant-design/icons';

import { RouterKeys, CookieKeys, LocalStorageKeys } from '../../constants/Keys';
import TicketService from '../../services/API/Ticket/Ticket.service';
import { ScanQrCodePageContainers } from '../../styles/scanQrCode.style';
import { Images } from '../../theme';
import { verificationApi } from '../../utils/func';
import Messages from '../../constants/Messages';
import { useCookie } from '../../hooks';

interface ScanQrCodeDetail {
  ticket: {
    id: number;
    no: string;
    seat: number;
    status: number;
    type: number;
  };
  user: {
    email: string;
    id: number;
    name: string;
  }
}

interface VerifyMessage {
  message: string;
  image: string;
  success: boolean;
}

const ScanQrCodeResult = ({
  result,
  currentEventId,
  setResult,
  setShowQrReader,
}: {
  result: string;
  currentEventId: string;
  setResult: (value: string) => void;
  setShowQrReader: (value: boolean) => void;
}) => {
  const [detail, setDetail] = useState<ScanQrCodeDetail | null>(null);
  const [verify, setVerify] = useState(false);
  const [redeemCode, setRedeemCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState<VerifyMessage>({
    message: '',
    image: '',
    success: false,
  });

  const checkStatusType = (statusCode: number, data?: string) => {
    switch (statusCode) {
      case Messages.success.code:
        setVerifyMessage({
          message: Messages.success.text,
          image: Images.Success,
          success: true,
        });
        break;
      case Messages.invalidUnlawful.code:
        setVerifyMessage({
          message: Messages.invalidUnlawful.text,
          image: Images.Dissatisfaction,
          success: false,
        });
        break;
      case Messages.invalidExpired.code:
        setVerifyMessage({
          message: Messages.invalidExpired.text,
          image: Images.Dissatisfaction,
          success: false,
        });
        break;
      case Messages.redeemed.code:
        setVerifyMessage({
          message: Messages.redeemed.text.replace(
            '{redeemed_time}',
            (data && data.replace(/\-/g, '/')) || ''
          ),
          image: Images.Safety,
          success: false,
        });
        break;
      case Messages.networkError.code:
        setVerifyMessage({
          message: Messages.networkError.text,
          image: Images.NetworkError,
          success: false,
        });
        break;
      case Messages.eventMismatch.code:
        setVerifyMessage({
          message: Messages.eventMismatch.text,
          image: Images.Dissatisfaction,
          success: false,
        });
        break;
      default:
        setVerifyMessage({
          message: Messages.invalidUnlawful.text,
          image: Images.Dissatisfaction,
          success: false,
        });
        break;
    }
  };

  const handleGetScanQrCodeDetail = async (value: string) => {
    if (value) {
      try {
        const response = await TicketService.doVerifyTicket({ code: value, eventId: currentEventId });
        if (verificationApi(response)) {
          setDetail(response.data);
          setRedeemCode(response.data.redeemCode);
        } else {
          const { ticket } = response.data || {};
          checkStatusType(response.code, (ticket && ticket.redeemedAt) || '');
          setVerify(true);
          setDetail({} as ScanQrCodeDetail);
        }
      } catch (error: any) {
        if (error.response) {
          const { data } = error.response;
          if (data.statusCode === 500) {
            checkStatusType(Messages.invalidUnlawful.code);
          } else {
            checkStatusType(Messages.networkError.code);
          }
        } else {
          checkStatusType(Messages.networkError.code);
        }
        setVerify(true);
        setDetail({} as ScanQrCodeDetail);
      }
    } else {
      checkStatusType(Messages.invalidUnlawful.code);
      setVerify(true);
    }
  };

  const handleVerify = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const response = await TicketService.doRedeemTicket({ code: redeemCode });
      if (response) {
        const { ticket } = response.data || {};
        checkStatusType(response.code, (ticket && ticket.redeemedAt) || '');
      }
      setLoading(false);
    } catch (error: any) {
      checkStatusType(Messages.networkError.code);
      setLoading(false);
    }
    setVerify(true);
  };

  useEffect(() => {
    handleGetScanQrCodeDetail(result);
  }, [result]);

  return (
    <div className="scan-result">
      {detail && (
        <>
          <div className="scan-back" onClick={() => setResult('')}>
            <Image src={Images.BackArrow} alt="" />
            <span style={{ marginLeft: 8 }}>BACK</span>
          </div>
          {!verify && (
            <div className="result-detail">
              <div style={{ width: '100%', marginTop: -50 }}>
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
                        {detail.user.name}
                      </p>
                    </div>
                    <div className="result-items">
                      <p className="items-title">
                        Email
                      </p>
                      <p className="items-value">
                        {detail.user.email}
                      </p>
                    </div>
                    <div className="result-items display-flex">
                      <div style={{ width: '50%' }}>
                        <p className="items-title">
                          Ticket Type
                        </p>
                        <p className="items-value">
                          {detail.ticket.type}
                        </p>
                      </div>
                      <div style={{ width: '50%' }}>
                        <p className="items-title">
                          Seat Number
                        </p>
                        <p className="items-value">
                          {detail.ticket.seat}
                        </p>
                      </div>
                    </div>
                    <div className="result-items">
                      <p className="items-title">
                        Ticket Number
                      </p>
                      <p className="items-value">
                        {detail.ticket.no}
                      </p>
                    </div>
                  </div>
                  <div
                    className="action-button"
                    onClick={handleVerify}
                  >
                    <Image src={Images.ButtonVerify} alt="" />
                    <p className="button-text">
                      {loading && (
                        <p className="laoding-cover" />
                      ) || 'VERIFY'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) || (
            <div className="verify-container">
              <div className="items" style={{ width: '100%' }}>
                <div style={{ textAlign: 'center' }}>
                  <Image src={verifyMessage.image} alt="" />
                </div>
                <div>
                  <p
                    className="verify-message"
                    dangerouslySetInnerHTML={{ __html: verifyMessage.message }}
                  />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <button onClick={() => setResult('')}>
                    {verifyMessage.success && 'CONTINUE TO SCAN' || 'SCAN QR CODE'}
                  </button>
                  {verifyMessage.success && (
                    <button className="back-home" onClick={() => setShowQrReader(false)}>
                      BACK TO HOME
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const ScanQrCodePage: NextPage = () => {
  const router = useRouter();

  const [result, setResult] = useState('');
  const [showQrReader, setShowQrReader] = useState(false);
  const [id, setEventId] = useState<string>('');
  const [eventCorrect, setEventCorrect] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const cookies = useCookie([CookieKeys.authUser]);

  const checkEvent = async (id: string) => {
    const response = await TicketService.checkEvent(id);
    setLoading(false);
    if (response.code !== Messages.notFound.code) {
      setEventCorrect(true);
    }
  };

  useEffect(() => {
    const { eventId } = router.query;
    if (eventId) {
      setEventId(eventId.toString());
      localStorage.setItem(LocalStorageKeys.eventIdForScan, eventId.toString());
      checkEvent(eventId.toString());
    }
  }, [router.isReady]);

  useEffect(() => {
    const userInfo = cookies.getCookie(CookieKeys.authUser);
    if (!userInfo) {
      Router.push(RouterKeys.scanLogin);
    }
  }, []);

  return (
    <ScanQrCodePageContainers>
      <Head>
        <title>Scan QR Code</title>
      </Head>
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
              currentEventId={id}
              setResult={setResult}
              setShowQrReader={setShowQrReader}
            />
          )}
        </>
      ) || (
        <>
          {eventCorrect && !loading && (
            <div className="scan-start">
              <div className="scan-start-mask" />
              <div className="scan-start-container">
                <p>
                  <Image src={Images.Logo} alt="" />
                </p>
                <button onClick={() => setShowQrReader(true)}>
                  SCAN QR CODE
                </button>
              </div>
            </div>
         ) || (
            <div className="verify-container">
              <div className="items" style={{ width: '100%' }}>
                <div style={{ textAlign: 'center' }}>
                  {loading && (
                    <div className="loading-box">
                      <LoadingOutlined />
                    </div>
                  ) || (
                    <Image src={Images.Dissatisfaction} alt="" />
                  )}
                </div>
                {!loading && (
                  <div>
                    <p className="verify-message">
                      Can't find this event
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </ScanQrCodePageContainers>
  );
};

export async function getServerSideProps(ctx: any) {
  const { req, res } = ctx;
  const handleAuth = () => {
    const token = req.cookies[CookieKeys.authUser];
    if (!token) {
      res.writeHead(302, { Location: RouterKeys.scanLogin });
      res.end();
      return {
        props: {}
      };
    }
  };
  await handleAuth();
  return {
    props: {}
  };
};

export default ScanQrCodePage;
