import {Platform} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

interface AwemeData {
  aweme_list?: {
    video?: {
      play_addr?: {url_list?: string[]};
      download_addr?: {url_list?: string[]};
    };
  }[];
}

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
  throw {tkCurlError: "Can't retrieve video id"};
};

export const getMediaUrlFromPageUrl = async (
  id: string,
  withWM?: boolean,
): Promise<string> => {
  let data: AwemeData;
  try {
    const response = await fetch(
      `https://api16-normal-c-useast1a.tiktokv.com/aweme/v1/feed/?aweme_id=${id}`,
    );
    data = await response.json();
  } catch (error) {
    throw {tkCurlError: 'Video data request failed'};
  }

  if (
    !withWM &&
    data?.aweme_list?.[0].video?.play_addr?.url_list?.[0] !== undefined
  ) {
    return data.aweme_list[0].video.play_addr.url_list[0];
  } else if (
    withWM &&
    data?.aweme_list?.[0].video?.download_addr?.url_list?.[0] !== undefined
  ) {
    return data.aweme_list[0].video.download_addr.url_list[0];
  } else {
    throw {
      tkCurlError: 'Cant get media url from video data',
    };
  }
};

export const saveVideoFromMediaUrl = async (
  mediaUrl: string,
  fileName: string,
) => {
  const path = getDirectoryPath();
  try {
    const res = await RNFetchBlob.config({
      path: `${path}/${fileName}.mp4`,
      /* addAndroidDownloads: {
        //useDownloadManager: true,
        //notification: true,
        mime: 'video/mp4',
        //description: 'Video downloaded by Tiktok Curl.',
        //mediaScannable: true,
        //title: `${fileName} Download Success`,
      }, */
    }).fetch('GET', mediaUrl);
    // the temp file path
    console.log('The file saved to ', res.path());
  } catch (error) {
    throw {tkCurlError: 'Video information found but failed to save file'};
  }
};

const getDirectoryPath = () => {
  if (Platform.OS === 'ios') {
    return RNFetchBlob.fs.dirs.DocumentDir;
  } else {
    return `${RNFetchBlob.fs.dirs.PictureDir}/Tiktok Curl`;
  }
};
