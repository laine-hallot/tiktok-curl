import type { FC } from 'react';

import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/colors';

interface VideoInfoProps {
  authorName?: string;
  thumbnail?: string;
  caption?: string;
  loading?: boolean;
}

export const VideoInfo: FC<VideoInfoProps> = ({
  authorName,
  caption,
  thumbnail,
  loading,
}) => {
  return (
    <View style={styles.videoInfoView}>
      {loading ? (
        <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
      ) : (
        <Ghost style={styles.thumbnail} />
      )}
      <View style={styles.textInfo}>
        <Text style={styles.authorName}>{authorName}</Text>
        <Text>{caption}</Text>
      </View>
    </View>
  );
};

const Ghost = ({
  style: { width: x, height: y },
}: {
  style: { width: number | string; height: number | string };
}) => (
  <View
    style={{ width: x, height: y, backgroundColor: colors.lightGray }}></View>
);

const styles = StyleSheet.create({
  videoInfoView: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  thumbnail: {
    height: 56,
    width: 56,
  },
  textInfo: {
    flex: 1,
  },
  authorName: {
    color: colors.regularText,
    fontWeight: '600',
    fontSize: 16,
  },
});
