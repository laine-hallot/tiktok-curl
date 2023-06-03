/* 
  The end point we're pulling from isn't documented (from what I could find at least)
  so everything in this type is marked optional incase there's some scenario where
  the same data isn't getting returned.
*/
export interface AwemeData {
  aweme_list?: {
    author?: {
      nickname?: string;
    };
    original_client_text?: {
      markup_text?: string;
    };
    video?: {
      cover?: {
        height?: number;
        uri?: string;
        url_list?: string[];
        width?: number;
      };
      play_addr?: { url_list?: string[] };
      download_addr?: { url_list?: string[] };
    };
  }[];
}

export interface ShortenedAwemeData {
  videoUrl: string;
  authorName?: string;
  thumbnail?: string;
  caption?: string;
}
