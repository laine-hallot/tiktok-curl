import {useCallback, useLayoutEffect, useState} from 'react';

import React from 'react';

import {
  ActivityIndicator,
  Button,
  NativeSyntheticEvent,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TextInputFocusEventData,
  TouchableNativeFeedback,
  useColorScheme,
  View,
} from 'react-native';

import Clipboard from '@react-native-clipboard/clipboard';

import {colors} from '../styles/colors';

import {
  getMediaUrlFromPageUrl,
  getPageUrlFromShareUrl,
  isShareUrl,
  saveVideoFromMediaUrl,
} from '../util/tiktok-downloader';

export const DownloadScreen = (): JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: colors.appBackground,
  };

  const [errorString, setErrorString] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidInputUrl, setIsValidInputUrl] = useState(true);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);

  useLayoutEffect(() => {
    Clipboard.getString().then((clipText) => {
      if (isShareUrl(clipText)) {
        setInputUrl(clipText);
        setIsValidInputUrl(true);
      }
    });
  }, []);

  const onChangeText = useCallback(
    (text: string) => {
      setShowSuccessMsg(false);
      setInputUrl(text);
      if (!isValidInputUrl) {
        validateText(text);
      }
    },
    [setInputUrl],
  );

  const validateText = useCallback(
    (text: string) => {
      if (text === '' || isShareUrl(text)) {
        setErrorString('');
        setIsValidInputUrl(true);
      } else {
        setErrorString('Not a valid share url for a video');
        setIsValidInputUrl(false);
      }
    },
    [setErrorString],
  );

  const handleBlur = useCallback(() => {
    validateText(inputUrl);
  }, [inputUrl, validateText]);

  const makeDownloadRequest = useCallback(
    (withWM?: boolean) => {
      setShowSuccessMsg(false);
      setIsLoading(true);
      setErrorString('');
      getPageUrlFromShareUrl(inputUrl)
        .then(async (videoId) => {
          const data = await getMediaUrlFromPageUrl(videoId, withWM);
          await saveVideoFromMediaUrl(data, videoId);
          setShowSuccessMsg(true);
        })
        .catch((error) => {
          if (error.tkCurlError !== undefined) {
            setErrorString(error.tkCurlError);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [inputUrl, setErrorString],
  );

  const handleDownloadPress = useCallback(() => {
    makeDownloadRequest();
  }, [makeDownloadRequest]);

  const handleDownloadWMPress = useCallback(() => {
    makeDownloadRequest(true);
  }, [makeDownloadRequest]);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.appBackground}
      />
      <ScrollView
        style={styles.mainContainer}
        contentContainerStyle={styles.mainContainerContent}>
        {errorString !== '' && (
          <View style={styles.errorContainer}>
            <Text style={styles.error}>
              {'Error: '}
              <Text style={styles.errorMessage} selectable>
                {errorString}
              </Text>
            </Text>
          </View>
        )}
        <View style={styles.form}>
          <Text style={styles.labelText}>{'Download a Video'}</Text>
          <TextInput
            placeholder="https://video.share/url"
            style={styles.urlInput}
            onChangeText={onChangeText}
            onBlur={handleBlur}
            value={inputUrl}
          />
          <TouchableNativeFeedback
            onPress={handleDownloadPress}
            disabled={!isValidInputUrl || isLoading || inputUrl === ''}>
            <View
              style={[
                styles.downloadButton,
                !isValidInputUrl || isLoading || inputUrl === ''
                  ? styles.downloadButtonDisabled
                  : [],
              ]}>
              <Text style={styles.downloadButtonText}>{'Download'}</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            onPress={handleDownloadWMPress}
            disabled={!isValidInputUrl || isLoading || inputUrl === ''}>
            <View
              style={
                !isValidInputUrl || isLoading || inputUrl === ''
                  ? [
                      styles.downloadButton,
                      styles.downloadButtonWM,
                      styles.downloadButtonWMDisabled,
                    ]
                  : [styles.downloadButton, styles.downloadButtonWM]
              }>
              <Text style={styles.downloadButtonText}>
                {'Download With Watermark'}
              </Text>
            </View>
          </TouchableNativeFeedback>
        </View>
        {showSuccessMsg && <Text style={styles.successText}>Success!</Text>}
        {isLoading && <ActivityIndicator size={64} color={colors.red} />}
      </ScrollView>
    </SafeAreaView>
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
  errorContainer: {
    padding: 8,
  },
  error: {
    color: colors.errorText,
    fontWeight: '500',
    fontSize: 16,
  },
  errorMessage: {
    color: colors.regularText,
    fontWeight: '400',
  },
  form: {
    backgroundColor: colors.primaryDivBackground,
    justifyContent: 'center',
    padding: 24,
    gap: 8,
    borderRadius: 8,
    elevation: 8,
    shadowColor: colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 12,
  },
  labelText: {
    color: colors.regularText,
    fontWeight: '500',
  },
  mainContainer: {
    height: '100%',
    backgroundColor: colors.appBackground,
    padding: 12,
  },
  mainContainerContent: {
    justifyContent: 'center',
    height: '100%',
    gap: 24,
  },
  successText: {
    color: colors.successText,
    fontWeight: '500',
    fontSize: 16,
    textAlign: 'center',
  },
  urlInput: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderColor: colors.borderColor,
    borderWidth: 1,
    borderStyle: 'solid',
    color: colors.regularText,
  },
});
