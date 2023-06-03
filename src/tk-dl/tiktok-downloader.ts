import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { AwemeData, ShortenedAwemeData } from './types';

const shareUrlRegex = /^https:\/\/www\.tiktok\.com\/t\/[0-9A-Za-z]+\/?$/;

const tiktokUrlRegex =
  /^https:\/\/www.tiktok.com\/@[a-zA-Z0-9_\.]+?\/video\/([0-9]+)\?.*$/;

export const isShareUrl = (url: string) => shareUrlRegex.test(url);

export const getPageUrlFromShareUrl = async (shareUrl: string) => {
  const response = await fetch(shareUrl);
  const matches = response.url.match(tiktokUrlRegex);
  if (matches !== null) {
    return matches[1];
  }
  throw { tkCurlError: "Can't retrieve video id" };
};

export const getMediaUrlFromPageUrl = async (
  id: string,
  withWM?: boolean,
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
  let finalData = {
    authorName: data?.aweme_list?.[0].author?.nickname,
    caption: data?.aweme_list?.[0].original_client_text?.markup_text,
    thumbnail: data?.aweme_list?.[0].video?.cover?.url_list?.[0],
  };
  if (
    !withWM &&
    data?.aweme_list?.[0].video?.play_addr?.url_list?.[0] !== undefined
  ) {
    return {
      ...finalData,
      videoUrl: data.aweme_list[0].video.play_addr.url_list[0],
    };
  } else if (
    withWM &&
    data?.aweme_list?.[0].video?.download_addr?.url_list?.[0] !== undefined
  ) {
    return {
      ...finalData,
      videoUrl: data.aweme_list[0].video.download_addr.url_list[0],
    };
  } else {
    throw {
      tkCurlError: 'Cant get media url from video data',
    };
  }
};

export const saveVideoFromMediaUrl = async (
  mediaUrl: string,
  fileName: string,
  trackDownload?: {
    totalFileSizeTracker: React.Dispatch<
      React.SetStateAction<number | undefined>
    >;
    progressBytesTracker: React.Dispatch<
      React.SetStateAction<number | undefined>
    >;
  },
) => {
  const path = getDirectoryPath();
  try {
    const filePath = `${path}/${fileName}.mp4`;
    const dlResult = await RNFS.downloadFile({
      fromUrl: mediaUrl,
      toFile: filePath,
      begin: ({ contentLength }) =>
        trackDownload?.totalFileSizeTracker(contentLength),
      progress: ({ bytesWritten }) =>
        trackDownload?.progressBytesTracker(bytesWritten),
    });
    console.log(dlResult);
    const scanFileResult = await RNFS.scanFile(filePath);
    console.log(scanFileResult);
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
