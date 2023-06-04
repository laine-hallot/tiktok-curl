import type { AwemeData, ShortenedAwemeData } from './types';

import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import ReactNativeBlobUtil from 'react-native-blob-util';

const shareUrlRegex = /^https:\/\/www\.tiktok\.com\/t\/[0-9A-Za-z]+\/?$/;

const tiktokUrlRegex =
  /^https:\/\/www.tiktok.com\/@[a-zA-Z0-9_\.]+?\/video\/([0-9]+)\?.*$/;

export const isShareUrl = (url: string) => shareUrlRegex.test(url);

export const getVideoIdFromShareUrl = async (shareUrl: string) => {
  const response = await fetch(shareUrl);
  const matches = response.url.match(tiktokUrlRegex);
  if (matches !== null) {
    return matches[1];
  }
  throw { tkCurlError: "Can't retrieve video id" };
};

export const getMediaInfoFromVideoId = async (
  id: string,
): Promise<ShortenedAwemeData> => {
  let data: AwemeData;
  try {
    const response = await fetch(
      `https://api16-normal-c-useast1a.tiktokv.com/aweme/v1/feed/?aweme_id=${id}`,
    );
    data = await response.json();
  } catch (error) {
    throw { tkCurlError: 'Video data request failed' };
  }
  if (
    data?.aweme_list?.[0].video?.play_addr?.url_list?.[0] === undefined &&
    data?.aweme_list?.[0].video?.download_addr?.url_list?.[0] === undefined
  ) {
    throw {
      tkCurlError: 'Cant get media url from video data',
    };
  }
  return {
    authorName: data?.aweme_list?.[0].author?.nickname,
    caption: data?.aweme_list?.[0].original_client_text?.markup_text,
    thumbnail: data?.aweme_list?.[0].video?.cover?.url_list?.[0],
    videoUrl: data?.aweme_list?.[0].video?.play_addr?.url_list?.[0],
    wmVideoUrl: data?.aweme_list?.[0].video?.download_addr?.url_list?.[0],
  };
};

interface DownloadInfo {
  totalFileSizeTracker: (contentLength: number) => void;
  progressBytesTracker: (bytesWritten: number) => void;
}

export const saveVideoFromMediaUrl = async (
  mediaUrl: string,
  fileName: string,
  trackDownload?: DownloadInfo,
) => {
  const path = getDirectoryPath();
  try {
    const filePath = `${path}/${fileName}.mp4`;

    const fetchPromise = ReactNativeBlobUtil.config({
      fileCache: true,
      path: filePath,
      overwrite: true,
      addAndroidDownloads: {
        notification: true,
        useDownloadManager: true,
        title: fileName + '.mp4',
        mime: 'video/mp4',
        description: 'Video download complete',
        path: filePath,
        mediaScannable: true,
      },
    }).fetch('GET', mediaUrl);

    if (trackDownload !== undefined) {
      fetchPromise.progress(
        { count: -1, interval: 10 },
        (sendOrReceivedBytes, totalBytes) => {
          if (totalBytes !== -1) {
            trackDownload.totalFileSizeTracker(totalBytes);
            trackDownload.progressBytesTracker(sendOrReceivedBytes);
          }
        },
      );
    }

    await fetchPromise;
  } catch (error) {
    console.log(error);
    throw { tkCurlError: 'Video information found but failed to save file' };
  }
};

const getDirectoryPath = () => {
  if (Platform.OS === 'ios') {
    return RNFS.DocumentDirectoryPath;
  } else {
    return `${RNFS.PicturesDirectoryPath}/Tiktok Curl`;
  }
};

export const useDownloadInfo = () => {};
