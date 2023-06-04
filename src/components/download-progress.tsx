import type { FC } from 'react';

import React from 'react';
import { Text, View } from 'react-native';
import { colors } from '../styles/colors';

interface DownloadProgressProps {
  downloadedBytes?: number;
  totalBytes: number;
}

export const DownloadProgress: FC<DownloadProgressProps> = ({
  downloadedBytes,
  totalBytes,
}) => {
  if (totalBytes === undefined) {
    return null;
  }
  return (
    <View>
      <View style={{ width: '100%' }}>
        <View
          style={{
            height: 8,
            width: '100%',
            backgroundColor: 'grey',
            position: 'relative',
          }}>
          <View
            style={{
              height: 8,
              width: `${Math.min(
                (downloadedBytes ?? 0 / totalBytes) * 100,
                100,
              )}%`,
              backgroundColor: colors.green,
            }}></View>
        </View>
      </View>
      <View style={{}}>
        <Text>
          {((downloadedBytes ?? 0) * 0.000001).toFixed(2)}MB/
          {(totalBytes * 0.000001).toFixed(2)}MB
        </Text>
      </View>
    </View>
  );
};
