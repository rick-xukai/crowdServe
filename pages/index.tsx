import type { NextPage } from 'next';
import getConfig from 'next/config';
import React from 'react';

const IndexPage: NextPage = () => {
  const { publicRuntimeConfig } = getConfig();
  console.log(publicRuntimeConfig?.buildTime);
  return (<div />);
};

export default IndexPage;
