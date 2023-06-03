import type {FC} from 'react';

import React from 'react';
import {Text} from 'react-native';

interface DownloadProgressProps {
  downloadedBytes?: number;
  totalBytes?: number;
}

export const DownloadProgress: FC<DownloadProgressProps> = ({
  downloadedBytes,
  totalBytes,
}) => {
  if (totalBytes === undefined) {
    return null;
  }
  return (
    <Text>
      {((downloadedBytes ?? 0) * 0.000001).toFixed(2)}MB/
      {(totalBytes * 0.000001).toFixed(2)}MB
    </Text>
  );
};
