import React, { useEffect, useState } from 'react';
import { message, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

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
  selectActionButtonLoading,
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
  setShowJoinRaveModal,
}: {
  clickJoinRave: boolean;
  setJoinRaveSuccess: (status: boolean) => void;
  setJoinRaveButtonLoading: (status: boolean) => void;
  eventId: string;
  setShowJoinRaveModal: (status: boolean) => void;
}) => {
  const cookies = useCookie([CookieKeys.userLoginToken]);
  const dispatch = useAppDispatch();

  const error = useAppSelector(selectError);
  const loading = useAppSelector(selectLoading);
  const actionButtonLoading = useAppSelector(selectActionButtonLoading);
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
    if (setJoinRaveButtonLoading) {
      setJoinRaveButtonLoading(actionButtonLoading);
    }
  }, [actionButtonLoading]);

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
      } else {
        dispatch(getRaveAction(eventId));
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
        <Raves
          raveData={raveData}
          showHaveJoinedRaveModal={showHaveJoinedRaveModal}
          setShowHaveJoinedRaveModal={setShowHaveJoinedRaveModal}
          setShowJoinRaveModal={setShowJoinRaveModal}
        />
      )) || (
        <Spin spinning indicator={<LoadingOutlined spin />} size='large'>
          <div />
        </Spin>
      )}
    </>
  );
};

export default RavesDetail;
