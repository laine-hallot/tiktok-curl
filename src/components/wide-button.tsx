import type {FC} from 'react';
import type {GestureResponderEvent} from 'react-native';

import React, {useMemo} from 'react';
import {Text, TouchableNativeFeedback, View, StyleSheet} from 'react-native';

import {colors} from '../styles/colors';

interface WideButtonProps {
  handlePress: ((event: GestureResponderEvent) => void) | undefined;
  disabled?: boolean;
  type: 'primary' | 'secondary';
  text: string;
}

export const WideButton: FC<WideButtonProps> = ({
  handlePress,
  disabled,
  type,
  text,
}) => {
  const activeStyles = useMemo(() => {
    if (type === 'secondary') {
      return disabled
        ? [
            styles.downloadButton,
            styles.downloadButtonWM,
            styles.downloadButtonWMDisabled,
          ]
        : [styles.downloadButton, styles.downloadButtonWM];
    }
    return [
      styles.downloadButton,
      disabled ? styles.downloadButtonDisabled : [],
    ];
  }, [type, disabled, styles]);
  return (
    <TouchableNativeFeedback onPress={handlePress} disabled={disabled}>
      <View style={activeStyles}>
        <Text style={styles.downloadButtonText}>{text}</Text>
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  downloadButton: {
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.buttonPrimary,
    textAlign: 'center',
    alignItems: 'center',
  },
  downloadButtonDisabled: {
    backgroundColor: colors.buttonPrimaryDisabled,
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  downloadButtonTextDisabled: {
    color: colors.lightGray,
  },
  downloadButtonWM: {
    backgroundColor: colors.buttonSecondary,
  },
  downloadButtonWMDisabled: {
    backgroundColor: colors.buttonSecondaryDisabled,
  },
});
