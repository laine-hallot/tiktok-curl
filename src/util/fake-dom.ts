import {JSDOM} from 'jsdom';

export const constructDom = () => {
  const dom = new JSDOM(``, {
    url: 'https://www.tiktok.com/t/ZTRwKCEGn/',
    referrer: 'https://www.tiktok.com/t/ZTRwKCEGn/',
    contentType: 'text/html',
    includeNodeLocations: true,
    storageQuota: 10000000,
  });
  console.log(dom.window.document.body);
};
