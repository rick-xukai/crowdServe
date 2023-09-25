import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { bodyOverflow } from '@/utils/func';
import { Colors } from '@/theme';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useCookie } from '@/hooks';
import { RAVE_ENDED, RAVE_REWARD_OUT_OF_STOCK } from '@/constants/General';
import { CookieKeys, RouterKeys, SessionStorageKeys } from '@/constants/Keys';
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

const RaveDetailContent = styled.div`
  height: 100%;
  .page-loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    display: flex;
    align-items: center;
    color: ${Colors.branding};
    background: ${Colors.backgorund};
    .anticon-loading {
      margin: auto;
      font-size: 30px;
    }
  }
`;

const RavesDetail = ({
  clickJoinRave,
  setClickJoinRave,
  setJoinRaveSuccess,
  setJoinRaveButtonLoading,
  eventId,
  eventSlug,
  setShowJoinRaveModal,
}: {
  clickJoinRave: boolean;
  setClickJoinRave: (status: boolean) => void;
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
  const inviteCode: any =
    router.query.inviteCode ||
    (typeof window !== 'undefined' &&
      sessionStorage &&
      sessionStorage.getItem(SessionStorageKeys.inviteCodeForRave));

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
  const [redeemRewardModalOpen, setRedeemRewardModalOpen] =
    useState<boolean>(false);

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
        if (setClickJoinRave) {
          setClickJoinRave(false);
        }
        if (setJoinRaveSuccess) {
          setJoinRaveSuccess(true);
        }
        setShowHaveJoinedRaveModal(true);
      }
    } else {
      router.push({
        pathname: RouterKeys.login,
        query: `redirect=${router.asPath}&raves=joinDetail`,
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
    dispatch(getRaveAction(appCallJsSendEventId || eventId));
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
      if (error.code === RAVE_ENDED) {
        message.open({
          content: (
            <div>This rave has ended. Browse our other amazing events!</div>
          ),
          className: 'error-message-event rave-end',
        });
        setRedeemRewardModalOpen(false);
        return;
      }
      if (error.code === RAVE_REWARD_OUT_OF_STOCK) {
        message.open({
          content: (
            <div>
              This reward is fully redeemed. Continue completing quests and
              earning flames to unlock other rewards!
            </div>
          ),
          className: 'error-message-event rave-end',
        });
        setRedeemRewardModalOpen(false);
        return;
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
    if (loading) {
      bodyOverflow('hidden');
    } else {
      bodyOverflow('scroll');
    }
  }, [loading]);

  useEffect(() => {
    (window as any).callJoinRave = callJoinRave;
    if (eventId) {
      dispatch(getRaveAction(eventId));
    }
    return () => {
      dispatch(reset());
    };
  }, []);

  return (
    <RaveDetailContent
      style={{ padding: (appCallJoinRaveParameters && 15) || 0 }}
    >
      <Raves
        eventSlug={appCallJsSendEventSlug || eventSlug}
        raveData={raveData}
        showHaveJoinedRaveModal={showHaveJoinedRaveModal}
        redeemRewardSuccess={redeemRewardSuccess}
        setRedeemRewardSuccess={setRedeemRewardSuccess}
        setShowHaveJoinedRaveModal={setShowHaveJoinedRaveModal}
        joinRaveRequest={joinRaveRequest}
        handleRedeemReward={handleRedeemReward}
        redeemRewardModalOpen={redeemRewardModalOpen}
        setRedeemRewardModalOpen={setRedeemRewardModalOpen}
      />
      {loading && !eventId && (
        <div className="page-loading">
          <LoadingOutlined />
        </div>
      )}
    </RaveDetailContent>
  );
};

export default RavesDetail;
