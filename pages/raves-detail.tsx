import React, { useEffect, useState } from 'react';
import { message, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useCookie } from '@/hooks';
import { CookieKeys, RouterKeys } from '@/constants/Keys';
import {
  reset,
  joinRaveAction,
  selectLoading,
  selectError,
  getRaveAction,
  selectRaveData,
  selectActionButtonLoading,
  redeemRaveRewardAction,
  GetRaveResponseRewardListProps,
} from '@/slice/rave.slice';
import Raves from '@/components/raves';

interface AppCallJoinRaveParameters {
  userToken: string;
  eventId: string;
  clickJoin: boolean;
  platform: string;
  version: string;
  eventSlug: string;
}

const RavesDetail = ({
  clickJoinRave,
  setJoinRaveSuccess,
  setJoinRaveButtonLoading,
  eventId,
  eventSlug,
  setShowJoinRaveModal,
}: {
  clickJoinRave: boolean;
  setJoinRaveSuccess: (status: boolean) => void;
  setJoinRaveButtonLoading: (status: boolean) => void;
  eventId: string;
  eventSlug: string;
  setShowJoinRaveModal: (status: boolean) => void;
}) => {
  const cookies = useCookie([
    CookieKeys.userLoginToken,
    CookieKeys.appCallPlatform,
    CookieKeys.appCallVersion,
  ]);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { inviteCode }: any = router.query;

  const error = useAppSelector(selectError);
  const loading = useAppSelector(selectLoading);
  const actionButtonLoading = useAppSelector(selectActionButtonLoading);
  const raveData = useAppSelector(selectRaveData);

  const [appCallJoinRaveParameters, setAppCallJoinRaveParameters] =
    useState<string>('');
  const [showHaveJoinedRaveModal, setShowHaveJoinedRaveModal] =
    useState<boolean>(false);
  const [appCallJsSendEventId, setAppCallJsSendEventId] = useState<string>('');
  const [redeemRewardSuccess, setRedeemRewardSuccess] =
    useState<boolean>(false);
  const [appCallJsSendEventSlug, setAppCallJsSendEventSlug] =
    useState<string>('');

  const joinRaveRequest = async (id?: string) => {
    if (cookies.getCookie(CookieKeys.userLoginToken)) {
      const response = await dispatch(
        joinRaveAction({
          id: id || eventId,
          data: {
            inviteCode: inviteCode || '',
          },
        })
      );
      if (response.type === joinRaveAction.fulfilled.toString()) {
        dispatch(getRaveAction(id || eventId));
        if (setJoinRaveSuccess) {
          setJoinRaveSuccess(true);
        }
        setShowHaveJoinedRaveModal(true);
      }
    } else {
      router.push({
        pathname: RouterKeys.login,
        query: `redirect=${router.asPath}-previous=joinDetail`,
      });
    }
  };

  const handleRedeemReward = async (
    currentReward: GetRaveResponseRewardListProps
  ) => {
    const response = await dispatch(
      redeemRaveRewardAction({
        eventId: appCallJsSendEventId || eventId,
        rewardId: currentReward.id,
      })
    );
    if (response.type === redeemRaveRewardAction.fulfilled.toString()) {
      setRedeemRewardSuccess(true);
    }
  };

  const callJoinRave = (value: string) => {
    setAppCallJoinRaveParameters(value);
  };

  useEffect(() => {
    if (setJoinRaveButtonLoading) {
      setJoinRaveButtonLoading(actionButtonLoading);
    }
  }, [actionButtonLoading]);

  useEffect(() => {
    if (error) {
      if (setShowJoinRaveModal) {
        setShowJoinRaveModal(false);
      }
      message.open({
        content: error.message,
        className: 'error-message-event',
      });
    }
  }, [error]);

  useEffect(() => {
    if (clickJoinRave) {
      joinRaveRequest();
    }
  }, [clickJoinRave]);

  useEffect(() => {
    try {
      if (appCallJoinRaveParameters) {
        const jsonResponse: AppCallJoinRaveParameters = JSON.parse(
          appCallJoinRaveParameters
        );
        setAppCallJsSendEventId(jsonResponse.eventId);
        setAppCallJsSendEventSlug(jsonResponse.eventSlug);
        cookies.setCookie(CookieKeys.userLoginToken, jsonResponse.userToken);
        if (jsonResponse.platform && jsonResponse.version) {
          cookies.setCookie(CookieKeys.appCallPlatform, jsonResponse.platform);
          cookies.setCookie(CookieKeys.appCallVersion, jsonResponse.version);
        }
        dispatch(getRaveAction(jsonResponse.eventId));
        if (jsonResponse.clickJoin) {
          joinRaveRequest(jsonResponse.eventId);
        }
      }
    } catch (_) {}
  }, [appCallJoinRaveParameters]);

  useEffect(() => {
    (window as any).callJoinRave = callJoinRave;
    return () => {
      dispatch(reset());
    };
  }, []);

  return (
    <>
      {(!loading && (
        <div style={{ padding: (appCallJoinRaveParameters && 15) || 0 }}>
          <Raves
            eventSlug={appCallJsSendEventSlug || eventSlug}
            raveData={raveData}
            showHaveJoinedRaveModal={showHaveJoinedRaveModal}
            redeemRewardSuccess={redeemRewardSuccess}
            setRedeemRewardSuccess={setRedeemRewardSuccess}
            setShowHaveJoinedRaveModal={setShowHaveJoinedRaveModal}
            joinRaveRequest={joinRaveRequest}
            handleRedeemReward={handleRedeemReward}
          />
        </div>
      )) || (
        <Spin spinning indicator={<LoadingOutlined spin />} size="large">
          <div />
        </Spin>
      )}
    </>
  );
};

export default RavesDetail;
