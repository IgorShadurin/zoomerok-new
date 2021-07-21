import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';

import {AntDesign,} from '@expo/vector-icons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Video} from "expo-av";

import {Button as Btn,} from './styles';


const Player: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  console.log('route.params', route.params.uri);

  useEffect(() => {
    StatusBar.setHidden(true);
  }, []);

  return (
    <>
      <Video
        source={{uri: route.params.uri}}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="cover"
        shouldPlay={true}
        isLooping
        style={{
          width: '100%',
          height: '100%',
        }}
      />

      <Btn
        style={{position: 'absolute', left: 15, top: 15}}
        onPress={() => {
          StatusBar.setHidden(false);
          navigation.goBack();
        }}
      >
        <AntDesign name="close" size={28} color="#fff"/>
      </Btn>

    </>
  );
};

export default Player;
