import React, { useEffect, useState } from 'react';
import { message } from 'antd';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useCookie } from '@/hooks';
import { CookieKeys } from '@/constants/Keys';
import {
  reset,
  joinRaveAction,
  selectLoading,
  selectError,
  getRaveAction,
  selectRaveData,
} from '@/slice/rave.slice';
import Raves from '@/components/raves';

interface AppCallJoinRaveParameters {
  userToken: string;
  eventId: string;
  clickJoin: boolean;
}

const RavesDetail = ({
  clickJoinRave,
  setJoinRaveSuccess,
  setJoinRaveButtonLoading,
  eventId,
}: {
  clickJoinRave: boolean;
  setJoinRaveSuccess: (status: boolean) => void;
  setJoinRaveButtonLoading: (status: boolean) => void;
  eventId: string;
}) => {
  const cookies = useCookie([CookieKeys.userLoginToken]);
  const dispatch = useAppDispatch();

  const error = useAppSelector(selectError);
  const loading = useAppSelector(selectLoading);
  const raveData = useAppSelector(selectRaveData);

  const [appCallJoinRaveParameters, setAppCallJoinRaveParameters] =
    useState<string>('');
  const [showHaveJoinedRaveModal, setShowHaveJoinedRaveModal] =
    useState<boolean>(false);

  const joinRaveRequest = async (id: string) => {
    const response = await dispatch(joinRaveAction(id));
    if (response.type !== joinRaveAction.fulfilled.toString()) {
      setJoinRaveSuccess(true);
      setShowHaveJoinedRaveModal(true);
    }
  };

  const callJoinRave = (value: string) => {
    setAppCallJoinRaveParameters(value);
  };

  useEffect(() => {
    setJoinRaveButtonLoading(loading);
  }, [loading]);

  useEffect(() => {
    if (error) {
      message.open({
        content: error.message,
        className: 'error-message-event',
      });
    }
  }, [error]);

  useEffect(() => {
    if (clickJoinRave) {
      joinRaveRequest(eventId);
    }
  }, [clickJoinRave]);

  useEffect(() => {
    try {
      if (appCallJoinRaveParameters) {
        const jsonResponse: AppCallJoinRaveParameters = JSON.parse(
          appCallJoinRaveParameters
        );
        cookies.setCookie(CookieKeys.userLoginToken, jsonResponse.userToken);
        if (jsonResponse.clickJoin) {
          joinRaveRequest(jsonResponse.eventId);
        } else {
          dispatch(getRaveAction(jsonResponse.eventId));
        }
      }
    } catch (_) {}
  }, [appCallJoinRaveParameters]);

  useEffect(() => {
    (window as any).callJoinRave = callJoinRave;
    dispatch(getRaveAction(eventId));
    return () => {
      dispatch(reset());
    };
  }, []);

  return (
    <Raves
      raveData={raveData}
      showHaveJoinedRaveModal={showHaveJoinedRaveModal}
      setShowHaveJoinedRaveModal={setShowHaveJoinedRaveModal}
    />
  );
};

export default RavesDetail;
