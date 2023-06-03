import type { FC, PropsWithChildren } from 'react';
import type { ViewStyle } from 'react-native';

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../styles/colors';

export const ContainerCard: FC<
  PropsWithChildren<{ extraStyles?: ViewStyle }>
> = ({ extraStyles, children }) => {
  return (
    <View style={{ ...styles.videoInfoView, ...extraStyles }}>{children}</View>
  );
};

const styles = StyleSheet.create({
  videoInfoView: {
    gap: 8,
    backgroundColor: colors.primaryDivBackground,
    padding: 24,
    borderRadius: 8,
    elevation: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
  },
});
