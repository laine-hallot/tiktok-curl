import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';

import Clipboard from '@react-native-clipboard/clipboard';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';

import { colors } from '../styles/colors';

import { DownloadProgress } from '../components/download-progress';
import { WideButton } from '../components/wide-button';
import { VideoInfo } from '../components/video-info';

import type { ShortenedAwemeData } from '../tk-dl/types';
import {
  getMediaInfoFromVideoId,
  getVideoIdFromShareUrl,
  isShareUrl,
  saveVideoFromMediaUrl,
} from '../tk-dl/tiktok-downloader';
import { ContainerCard } from '../components/container-card';

export const DownloadScreen = (): JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: colors.appBackground,
  };

  /* 
    All of these useState are a bit messy and probably overkill.
    I could probably get rid of or combine a couple of these.
  */
  const [errorString, setErrorString] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidInputUrl, setIsValidInputUrl] = useState(true);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);

  const [isDownloading, setIsDownloading] = useState(false);
  const [totalFileSize, setTotalFileSize] = useState<number>();
  const [downloadProgress, setDownloadProgress] = useState<number>();

  const [videoInfo, setVideoInfo] = useState<
    ShortenedAwemeData & { videoId: string }
  >();

  useLayoutEffect(() => {
    Clipboard.getString().then((clipText) => {
      if (isShareUrl(clipText)) {
        setInputUrl(clipText);
        setIsValidInputUrl(true);
      }
    });
  }, []);

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

  const onChangeText = useCallback(
    (text: string) => {
      setVideoInfo(undefined);
      setShowSuccessMsg(false);
      setInputUrl(text);
      if (!isValidInputUrl) {
        validateText(text);
      }
    },
    [isValidInputUrl, validateText],
  );

  const handleBlur = useCallback(() => {
    validateText(inputUrl);
  }, [inputUrl, validateText]);

  const getVideoMetaData = useCallback(() => {
    setVideoInfo(undefined);
    setIsLoading(true);
    getVideoIdFromShareUrl(inputUrl)
      .then(async (videoId) => {
        const { videoUrl, ...videoInfoData } = await getMediaInfoFromVideoId(
          videoId,
        );
        setVideoInfo({ videoId, videoUrl, ...videoInfoData });
      })
      .catch((error) => {
        if (error.tkCurlError !== undefined) {
          setErrorString(error.tkCurlError);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [inputUrl]);

  const makeDownloadRequest = useCallback(
    (withWM?: boolean) => {
      if (videoInfo) {
        setIsDownloading(true);
        setShowSuccessMsg(false);
        setErrorString('');
        saveVideoFromMediaUrl(
          /* 
          we can tell typescript to ignore the undefined case since this 
          function would only get called if we have a url.
          */
          videoInfo[withWM ? 'wmVideoUrl' : 'videoUrl']!,
          videoInfo.videoId,
          {
            totalFileSizeTracker: (contentLength) => {
              setTotalFileSize(contentLength);
            },
            progressBytesTracker: (bytesWritten) => {
              setDownloadProgress(bytesWritten);
            },
          },
        )
          .then(() => {
            setShowSuccessMsg(true);
          })
          .catch((error) => {
            if (error.tkCurlError !== undefined) {
              setErrorString(error.tkCurlError);
            }
          })
          .finally(() => {
            setIsDownloading(false);
            setTotalFileSize(undefined);
            setDownloadProgress(undefined);
          });
      }
    },
    [videoInfo],
  );

  useMemo(() => {
    if (inputUrl !== '' && isValidInputUrl) {
      getVideoMetaData();
    }
  }, [getVideoMetaData, inputUrl, isValidInputUrl]);

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
        <ContainerCard extraStyles={styles.form}>
          <Text style={styles.labelText}>{'Download a Video'}</Text>
          <TextInput
            placeholder="https://video.share/url"
            style={styles.urlInput}
            onChangeText={onChangeText}
            onBlur={handleBlur}
            value={inputUrl}
          />
          {isValidInputUrl && inputUrl !== '' ? (
            <VideoInfo
              authorName={videoInfo?.authorName}
              caption={videoInfo?.caption}
              thumbnail={videoInfo?.thumbnail}
              loading={isLoading}
            />
          ) : null}
          {isDownloading && totalFileSize !== undefined ? (
            <DownloadProgress
              totalBytes={totalFileSize}
              downloadedBytes={downloadProgress}
            />
          ) : null}
          {videoInfo?.videoUrl !== undefined &&
          videoInfo?.wmVideoUrl !== undefined ? (
            <>
              <WideButton
                handlePress={handleDownloadPress}
                disabled={!isValidInputUrl || isLoading || inputUrl === ''}
                text="Download"
                type="primary"
              />
              <WideButton
                handlePress={handleDownloadWMPress}
                disabled={!isValidInputUrl || isLoading || inputUrl === ''}
                text="Download With Watermark"
                type="secondary"
              />
            </>
          ) : null}
        </ContainerCard>
        {showSuccessMsg && <Text style={styles.successText}>Success!</Text>}
        {isLoading && <ActivityIndicator size={64} color={colors.red} />}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    justifyContent: 'center',
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
