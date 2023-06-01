import {PropsWithChildren, useCallback, useState} from 'react';

import React from 'react';

import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import WebView, {WebViewMessageEvent} from 'react-native-webview';
import {
  getMediaUrlFromPageUrl,
  getPageUrlFromShareUrl,
  saveVideoFromMediaUrl,
} from '../util/tiktok-downloader';

const injectedJsCode = `
const videoUrl = document.getElementById('sharing-main-video-el').src; 
window.ReactNativeWebView.postMessage(videoUrl);
`;

type SectionProps = PropsWithChildren<{
  title: string;
}>;

export const DownloadScreen = (): JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [responseString, setResponseString] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const onChangeText = useCallback(
    (text: string) => {
      setInputUrl(text);
    },
    [setInputUrl],
  );
  const handleDownloadPress = useCallback(() => {
    const videoId = '7223747173236624686';

    getPageUrlFromShareUrl('https://www.tiktok.com/t/ZTRwKCEGn/');

    /* getMediaUrlFromPageUrl(videoId).then((data) => {
      console.log(data);
      if (typeof data === 'string') {
        setResponseString(data);

        saveVideoFromMediaUrl(data, '7223747173236624686');
      }
    }); */
  }, [setResponseString]);

  const onWebviewMessage = (message: WebViewMessageEvent) => {
    console.log(message.nativeEvent.data);
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={{height: '100%'}}>
        {/* <ScrollView style={{maxHeight: 300, height: 'auto'}}>
          <Text>{responseString}</Text>
        </ScrollView> */}
        {/* <WebView
          source={{uri: videoUrl}}
          style={{height: '100%'}}
          incognito
          injectedJavaScript={injectedJsCode}
          onMessage={onWebviewMessage}
        /> */}
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            justifyContent: 'center',
            padding: 8,
            flexGrow: 1,
            gap: 8,
          }}>
          <Text>Add video url</Text>
          <TextInput
            style={{
              paddingVertical: 4,
              paddingHorizontal: 8,
              borderRadius: 4,
              borderColor: '#dadde1',
              borderWidth: 1,
              borderStyle: 'solid',
            }}
            onChangeText={onChangeText}
          />
          <Button title="Download" onPress={handleDownloadPress} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});
