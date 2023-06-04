import type { FC, PropsWithChildren } from 'react';

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
      <Ghost style={styles.thumbnail} loading={loading}>
        <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
      </Ghost>
      <View style={styles.textInfo}>
        <Ghost
          style={{
            height: 18,
            width: 156,
          }}
          loading={loading}>
          <Text style={styles.authorName}>{authorName}</Text>
        </Ghost>
        <Ghost
          style={{
            height: 18,
            width: 156,
          }}
          loading={loading}>
          <Text ellipsizeMode={'tail'} numberOfLines={2}>
            {caption}
          </Text>
        </Ghost>
      </View>
    </View>
  );
};

const Ghost: FC<
  PropsWithChildren<{
    style: { width: number | string; height: number | string };
    loading?: boolean;
  }>
> = ({ children, loading, style: { width: x, height: y } }) => (
  <>
    {loading ? (
      <View
        style={{
          borderRadius: 4,
          width: x,
          height: y,
          backgroundColor: colors.lightGray,
        }}></View>
    ) : (
      children
    )}
  </>
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
    gap: 2,
  },
  authorName: {
    color: colors.regularText,
    fontWeight: '600',
    fontSize: 16,
  },
});
