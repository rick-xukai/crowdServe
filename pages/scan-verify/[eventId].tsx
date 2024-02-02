import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { QrReader } from 'react-qr-reader';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { LoadingOutlined } from '@ant-design/icons';
import { message } from 'antd';

import { RouterKeys, CookieKeys } from '../../constants/Keys';
import { PriceUnit, GlownetDeepLink } from '../../constants/General';
import { ScanQrCodePageContainers } from '../../styles/scanQrCode.style';
import { Images } from '../../theme';
import { verificationApi, base64Decrypt } from '../../utils/func';
import Messages from '../../constants/Messages';
import ScannerService from '@/services/API/Scanner/Scanner.service';
import { useAppDispatch } from '@/app/hooks';
import { reset, resetScannerLoginResponse } from '@/slice/user.slice';
import { useCookie } from '@/hooks';

interface ScannerCodeDetail {
  user: {
    id: number;
    name: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  ticket: {
    id: number;
    status: number;
    type: string;
    price: number;
    seat: number;
    no: string;
    redeemedAt: string;
    cancelledAt: string;
    total: number;
    redeemed: number;
    eventName: string;
  };
  redeemCode: string;
}

interface RedeemResponse {
  user: {
    id: number;
    name: string;
    email: string;
  };
  ticket: {
    id: number;
    status: number;
    type: string;
    price: number;
    seat: number;
    no: string;
    redeemedAt: string;
    cancelledAt: string;
    total: number;
    redeemed: number;
    eventName: string;
    glownetTicketId?: number;
  };
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
}: {
  result: string;
  currentEventId: string[];
  setResult: (value: string) => void;
}) => {
  const cookie = useCookie([CookieKeys.scannerLoginToken]);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [scannerCodeDetail, setScannerCodeDetail] = useState<
    ScannerCodeDetail[] | null
  >(null);
  const [redeemResponse, setRedeemResponse] = useState<RedeemResponse | null>(
    null
  );
  const [verify, setVerify] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentVerifyItem, setCurrentVerifyItem] = useState<string>('');
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
      case Messages.userTokenDeprecated.code:
        message.open({
          content: Messages.userTokenDeprecated.text,
          className: 'error-message-event',
        });
        dispatch(reset());
        dispatch(resetScannerLoginResponse());
        cookie.removeCookie(CookieKeys.scannerLoginToken, {
          path: '/',
          domain: window.location.hostname,
        });
        router.push(RouterKeys.scanLogin);
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
        const response = await ScannerService.verifyScanCode({
          code: value,
          eventIds: currentEventId,
        });
        if (verificationApi(response)) {
          setScannerCodeDetail(response.data);
        } else {
          let ticketRedeemedAt = '';
          if (response.data && response.data[0] && response.data[0].ticket) {
            ticketRedeemedAt = response.data[0].ticket.redeemedAt;
          }
          checkStatusType(response.code, ticketRedeemedAt);
          setVerify(true);
          setScannerCodeDetail([]);
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
        setScannerCodeDetail([]);
      }
    } else {
      checkStatusType(Messages.invalidUnlawful.code);
      setVerify(true);
    }
  };

  const handleVerify = async (code: string) => {
    if (loading) {
      return;
    }
    setCurrentVerifyItem(code);
    setLoading(true);
    try {
      const response = await ScannerService.redeemScanCode(code);
      if (verificationApi(response)) {
        setRedeemResponse(response.data);
      } else {
        setRedeemResponse({} as RedeemResponse);
      }
      if (response) {
        const { ticket } = response.data || {};
        checkStatusType(response.code, (ticket && ticket.redeemedAt) || '');
      }
      setLoading(false);
    } catch (error: any) {
      checkStatusType(Messages.networkError.code);
      setLoading(false);
      setRedeemResponse({} as RedeemResponse);
    }
    setVerify(true);
  };

  useEffect(() => {
    handleGetScanQrCodeDetail(result);
  }, [result]);

  const handleOpenGlownetApp = (ticketReference: any) => {
    if (ticketReference) {
      const deepLink =
        'intent://launcher/#Intent;' +
        'scheme=glownetapp;' +
        'package=com.glownet.next.attended;' +
        'action=com.glownet.next.checkin.ACTION_SEARCH_ADMISSION;' +
        'component=com.glownet.next.presentation.android.ui.stations.checkin.BarcodeReceiverActivity;' +
        'S.ticket_reference=' +
        ticketReference +
        ';end';
      window.location.href = deepLink;
    }
    // const CallApp = require('callapp-lib');
    // const packageName = 'com.glownet.next.attended';
    // const options = {
    //   scheme: {
    //     protocol: 'glownetapp',
    //     host: 'launcher',
    //   },
    //   intent: {
    //     package: packageName,
    //     scheme: 'glownetapp',
    //   },
    // };
    // const callLib = new CallApp(options);
    // callLib.open({
    //   path: `action=com.glownet.next.checkin.ACTION_SEARCH_ADMISSION;component=com.glownet.next.presentation.android.ui.stations.checkin.BarcodeReceiverActivity;S.ticket_reference=${ticketReference}`,
    // });
  };

  return (
    <div className="scan-result">
      {scannerCodeDetail && (
        <>
          <div className="scan-back" onClick={() => setResult('')}>
            <Image src={Images.BackArrow} alt="" />
            <span style={{ marginLeft: 8 }}>BACK</span>
          </div>
          {(!verify && (
            <div className="result-detail">
              <div
                style={{
                  width: '100%',
                  marginTop: (scannerCodeDetail.length > 1 && 50) || 0,
                }}
                className="detail-content"
              >
                <div className="result-logo">
                  <Image src={Images.Logo} alt="" />
                </div>
                {scannerCodeDetail.map((item) => (
                  <div className="border-box" key={item.redeemCode}>
                    <div className="result-container">
                      <div className="result-items">
                        <p className="items-title">Event</p>
                        <p className="items-value">{item.ticket.eventName}</p>
                      </div>
                      <div className="result-items">
                        <p className="items-title">Participant</p>
                        <p className="items-value">{`${item.user.firstName} ${item.user.lastName}`}</p>
                      </div>
                      <div className="result-items">
                        <p className="items-title">Email</p>
                        <p className="items-value">{item.user.email}</p>
                      </div>
                      <div className="result-items">
                        <div>
                          <p className="items-title">Ticket Type</p>
                          <p className="items-value">
                            {item.ticket.type || '-'}
                          </p>
                        </div>
                      </div>
                      <div className="result-items display-flex">
                        <div style={{ width: '50%' }}>
                          <p className="items-title">Ticket Price</p>
                          <p className="items-value">
                            {(item.ticket.price &&
                              `${(item.ticket.price as number).toFixed(
                                2
                              )} ${PriceUnit}`) ||
                              '-'}
                          </p>
                        </div>
                        <div style={{ width: '50%' }}>
                          <p className="items-title">Seat Number</p>
                          <p className="items-value">
                            {item.ticket.seat || '-'}
                          </p>
                        </div>
                      </div>
                      <div className="result-items">
                        <p className="items-title">Ticket Number</p>
                        <p className="items-value">{item.ticket.no || '-'}</p>
                      </div>
                    </div>
                    <div
                      className="action-button"
                      onClick={() => handleVerify(item.redeemCode)}
                    >
                      <Image src={Images.ButtonVerify} alt="" />
                      <p className="button-text">
                        {(loading && item.redeemCode === currentVerifyItem && (
                          <p className="laoding-cover" />
                        )) ||
                          'VERIFY'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )) || (
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
                {redeemResponse && redeemResponse.ticket && (
                  <div className="total-info">
                    <p className="total-info-type">
                      <img src={Images.SuccessCongratulations.src} alt="" />
                      <span className="text">
                        {redeemResponse.ticket.eventName || '-'}
                      </span>
                    </p>
                    <p className="total-info-type">
                      <img src={Images.ConfirmationNumber.src} alt="" />
                      <span className="text">
                        {redeemResponse.ticket.type || '-'}
                      </span>
                    </p>
                    <p className="total-info-redeemed">
                      <Image src={Images.OrganiserIcon} alt="" />
                      <span style={{ color: '#FFFFFF', marginLeft: 5 }}>
                        {(redeemResponse.ticket.redeemed &&
                          redeemResponse.ticket.redeemed.toLocaleString()) ||
                          '-'}
                      </span>{' '}
                      /{' '}
                      <span>
                        {(redeemResponse.ticket.total &&
                          redeemResponse.ticket.total.toLocaleString()) ||
                          '-'}
                      </span>
                    </p>
                  </div>
                )}
                {redeemResponse &&
                  redeemResponse.ticket &&
                  redeemResponse.ticket.glownetTicketId && (
                    <div
                      className="button-action"
                      style={{ textAlign: 'center', marginBottom: 20 }}
                    >
                      <button
                        onClick={() =>
                          handleOpenGlownetApp(
                            redeemResponse.ticket.glownetTicketId?.toString()
                          )
                        }
                      >
                        LAUNCH APP
                        {/* <a
                          style={{
                            width: '100%',
                            display: 'block',
                            height: '100%',
                            lineHeight: '48px',
                          }}
                          href={GlownetDeepLink.replace(
                            '{:ticketReference}',
                            redeemResponse.ticket.glownetTicketId.toString()
                          )}
                        >
                          LAUNCH APP
                        </a> */}
                      </button>
                    </div>
                  )}
                <div className="button-action" style={{ textAlign: 'center' }}>
                  <button onClick={() => setResult('')}>
                    {(verifyMessage.success && 'CONTINUE TO SCAN') ||
                      'SCAN QR CODE'}
                  </button>
                  {verifyMessage.success && (
                    <button
                      className="back-home"
                      onClick={() => router.push(RouterKeys.eventsScan)}
                    >
                      BACK TO EVENT LIST
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
  const [id, setEventId] = useState<string[]>([]);
  const [eventCorrect, setEventCorrect] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const { eventId } = router.query;
    if (eventId) {
      setLoading(false);
      try {
        const ids = base64Decrypt(eventId as string);
        setEventId(ids);
        setEventCorrect(true);
      } catch (error) {
        setEventCorrect(false);
      }
    }
  }, [router.isReady]);

  return (
    <ScanQrCodePageContainers>
      <Head>
        <title>Scan QR Code</title>
      </Head>
      {(eventCorrect && (
        <>
          {(!result && (
            <div>
              <div
                className="scan-back"
                onClick={() => router.push(RouterKeys.eventsScan)}
              >
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
          )) || (
            <ScanQrCodeResult
              result={result}
              currentEventId={id}
              setResult={setResult}
            />
          )}
        </>
      )) || (
        <div className="verify-container">
          <div className="items" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              {(loading && (
                <div className="loading-box">
                  <LoadingOutlined />
                </div>
              )) || <Image src={Images.Dissatisfaction} alt="" />}
            </div>
            {!loading && (
              <div>
                <p className="verify-message">Invalid URL</p>
              </div>
            )}
          </div>
        </div>
      )}
    </ScanQrCodePageContainers>
  );
};

// export async function getServerSideProps(ctx: any) {
//   const { req, res, query } = ctx;
//   try {
//     const response = await TicketService.checkEvent(query.eventId);
//     const handleAuth = () => {
//       const token = req.cookies[CookieKeys.scannerLoginToken];
//       if (!token) {
//         res.writeHead(302, {
//           Location: `${RouterKeys.scanLogin}?eventId=${query.eventId || ''}`,
//         });
//         res.end();
//         return {
//           props: {},
//         };
//       }
//     };
//     if (response.code !== Messages.notFound.code) {
//       await handleAuth();
//     }
//     return {
//       props: {},
//     };
//   } catch (error) {
//     return {
//       props: {},
//     };
//   }
// }

export default ScanQrCodePage;
