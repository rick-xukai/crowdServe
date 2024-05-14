import Head from 'next/head';
import React from 'react';

import ShowUpdateProfilePopup from '@/components/showUpdateProfilePopup';
import {
  selectShowCompeledProfilePopup,
  setShowCompeledProfileAfterLogin,
} from '@/slice/user.slice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';

const RootLayout = ({ children }: { children: any }) => {
  const dispatch = useAppDispatch();

  const showCompeledProfilePopUp = useAppSelector(
    selectShowCompeledProfilePopup
  );
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="referrer" content="no-referrer" />
        <meta name="description" content="Crowdserve web app" />
        <title>CrowdServe</title>
      </Head>
      {children}
      <ShowUpdateProfilePopup
        showPopup={showCompeledProfilePopUp}
        setShowPopup={(status) =>
          dispatch(setShowCompeledProfileAfterLogin(status))
        }
      />
    </>
  );
};

export default RootLayout;
