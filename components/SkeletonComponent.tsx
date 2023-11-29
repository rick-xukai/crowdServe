import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { Colors } from '@/theme';

const SkeletonComponent = ({
  baseColor,
  highlightColor,
}: {
  baseColor?: string;
  highlightColor?: string;
}) => (
  <SkeletonTheme
    baseColor={baseColor || Colors.backgorund}
    highlightColor={highlightColor || Colors.highlightColor}
  >
    <Skeleton />
  </SkeletonTheme>
);

export default SkeletonComponent;
