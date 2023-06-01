import {Platform} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

interface AwemeData {
  aweme_list?: {
    video?: {
      play_addr?: {url_list?: string[]};
    };
  }[];
}

interface TkCurlError {
  tkCurlError: string;
}

const tiktokUrlRegex =
  /https:\/\/www.tiktok.com\/@[a-zA-Z]+?\/video\/([0-9]+)\?.*/;

export const getPageUrlFromShareUrl = async (shareUrl: string) => {
  let data;
  try {
    const response = await fetch(shareUrl);
    if (response.url) {
      response.url.match(tiktokUrlRegex);
    }
  } catch (error) {
    console.log(error);
  }
};

export const getMediaUrlFromPageUrl = async (
  id: string,
): Promise<string | TkCurlError> => {
  let data: AwemeData;
  try {
    const response = await fetch(
      `https://api16-normal-c-useast1a.tiktokv.com/aweme/v1/feed/?aweme_id=${id}`,
    );
    data = await response.json();
  } catch (error) {
    console.log(error);
    return {tkCurlError: 'Video data request failed'};
  }
  if (data?.aweme_list?.[0].video?.play_addr?.url_list?.[0] === undefined) {
    return {
      tkCurlError: 'Cant get media url from video data',
    };
  }
  const mediaUrl = data.aweme_list[0].video.play_addr.url_list[0];
  console.log(mediaUrl);
  return mediaUrl;
};

export const saveVideoFromMediaUrl = (mediaUrl: string, fileName: string) => {
  const path = getDirectoryPath();
  console.log(`${path}/${fileName}.mp4`);
  RNFetchBlob.config({
    path: `${path}/${fileName}.mp4`,
    /* addAndroidDownloads: {
      //useDownloadManager: true,
      //notification: true,
      mime: 'video/mp4',
      //description: 'Video downloaded by Tiktok Curl.',
      //mediaScannable: true,
      //title: `${fileName} Download Success`,
    }, */
  })
    .fetch('GET', mediaUrl)
    .then((res) => {
      // the temp file path
      console.log('The file saved to ', res.path());
    })
    .catch((error) => {
      console.log(error);
    });
};

const getDirectoryPath = () => {
  if (Platform.OS === 'ios') {
    return RNFetchBlob.fs.dirs.DocumentDir;
  } else {
    return `${RNFetchBlob.fs.dirs.PictureDir}/Tiktok Curl`;
  }
};
