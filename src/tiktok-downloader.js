import TikTokScraper from 'tiktok-scraper';

const headers = {
  'user-agent':
    'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/112.0',
  referer: 'https://www.tiktok.com/',
  cookie: 'tt_webid_v2=68dssds',
};

const download = async () => {
  /* const metaData = await TikTokScraper.getVideoMeta(
    'https://www.tiktok.com/@aifadavina/video/7140151847649791258',
    {
      headers,
      sessionList: ['sid_tt="d5e94e872845a09375d6fccafd6ee474'],
      useTestEndpoints: true,
    }
  );

  console.log(metaData); */

  try {
    const posts = await TikTokScraper.getUserProfileInfo(`flyingwhaleboi`);
    console.log(posts);
  } catch (error) {
    console.log(error);
  }
};

download();

const axios = require('axios');

async function getMetaVideo() {
  const response = await fetch(
    'https://www.tiktok.com/@aifadavina/video/7140151847649791258',
    {
      headers: {
        referer: 'https://www.tiktok.com/',
        cookie:
          'msToken=luQZB4DSr7Ul1Ko0OQcS2yeXWkrt4KgT-wF0JXqfd49Brh9vzSy6ZzSolt0P-998O86pDK7_EO-v7o7bd3uS7BZOhN_N4tbIK29uqtqFs4ZgCpOFTbOJl34qZq_up5i0QMd4yBSEAJbVsTmT; ttwid=1%7CbQFpJ2wPI4Im8bqTpuCfXHcgMBSPtabtbJM0amg0UFw%7C1683832948%7Cc040c6aea790060c90a3e8b67aa403a16c2c3613e7fdb51e8ff2c9fad848a6c0; tt_csrf_token=7KMPteo4-VPTRMHPCNM94JEly8zKNfqUL3Dc; tt_chain_token=8/EKb7S4tpsxi50+lIyVZg==; passport_csrf_token=ff201f3e7daa18d4d45fed94b6033f16; passport_csrf_token_default=ff201f3e7daa18d4d45fed94b6033f16; s_v_web_id=ver…hn75QDUF4VD9MPI1dUjRX-Eczgwf35RU4kjr7z63gtXNGi2NvT8z4cfC8EJCugwzhEDI92LZHf5JVHDMwTkcW4mYUEETcd1RD54_R_20S47tM2hODcEcBYRAq3fd4syDON-hOwyAkqPS33lziKCDMdttgE0DBW67zsB0BAUZj5oJNffbtj9B1WXGXKnNl7eyFsTwUZNULhmN4kMH66N0Vu7ViUTfIeVRweKJzUt8MArmzx4CAi8QX4xa3lSSq3-hotp42gEn3J8ZN7Hp6LYjVaOueftE0OjM4pThvRQoM27O6Umi9_irpNXtr4veIwWHDiexDu5au1zoVqjcVXvJT63BABpxUc_ZGTSB4KYl4odcTkTlTIBInT5Si3ExXHKfTtYT1R5VNMsKO-Y-jnkbZkxRxybB8p8GLoK9g6yRsup3ExXb7mprFrYT-FdG8JZovWN9atlJg7rD3m4e0ZvatheIIAr98zhrhz5RROCd7YAc57587Fq8HtBaxxZ9Ht5', // fill this field from request tiktok, i recommended fill to FULL COOKIE
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4275.186 Safari/537.36',
      },
    }
  );
  const data = response.json();
  const stringData = String(data);
  const splitFirst = stringData.split('type="application/json">')[1];
  const splitSecond = splitFirst.split('</script>')[0];

  console.log(JSON.parse(splitSecond));
}

getMetaVideo();
