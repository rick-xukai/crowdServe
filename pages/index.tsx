import type { NextPage } from 'next';
import getConfig from 'next/config';
import React, { useEffect } from 'react';

const IndexPage: NextPage = () => {
  useEffect(() => {
    const { publicRuntimeConfig } = getConfig();
    console.log(publicRuntimeConfig?.buildTime);
  });
  return (<div />);
};

export default IndexPage;
