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
import {constructDom} from '../util/fake-dom';

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

  const onChangeText = useCallback(
    (text: string) => {
      setInputUrl(text);
    },
    [setInputUrl],
  );

  const handleDownloadPress = useCallback(() => {
    fetch('https://www.tiktok.com/t/ZTRwKCEGn/')
      .then((response) => response.text())
      .then((data) => setResponseString(data));
    constructDom();
  }, [setResponseString]);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView style={{maxHeight: 600, height: 'auto'}}>
        <Text>{responseString}</Text>
      </ScrollView>
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
