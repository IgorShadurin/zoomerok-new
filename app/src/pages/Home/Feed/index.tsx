import React, {useState} from 'react';
import {Image, Animated, Easing, TouchableWithoutFeedback} from 'react-native';

import {FontAwesome, AntDesign} from '@expo/vector-icons';
import {Video} from 'expo-av';
import {LinearGradient} from 'expo-linear-gradient';
import Lottie from 'lottie-react-native';

import musicFly from '../../../assets/lottie-animations/music-fly.json';

import {
  Container,
  Details,
  Actions,
  User,
  Tags,
  Music,
  MusicBox,
  BoxAction,
  TextAction, Description,
} from './styles';
import {useNavigation} from "@react-navigation/native";

interface Item {
  id: number;
  username: string;
  text: string;
  tags: string;
  music: string;
  likes: number;
  comments: number;
  uri: string;
}

interface Props {
  play: boolean;
  item: Item;
}

const Feed: React.FC<Props> = ({play, item, isHidden, addRef}) => {
  const [isPlay, setIsPlay] = useState(play);
  const spinValue = new Animated.Value(0);
  const navigation = useNavigation();

  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 10000,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
  ).start();

  const rotateProp = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const onVideoClick = () => {
    console.log('video click');
    setIsPlay(!isPlay);
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={onVideoClick}>
        <LinearGradient
          colors={['rgba(0,0,0,.3)', 'transparent']}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: '70%',
          }}
        />
      </TouchableWithoutFeedback>

      <Container>
        {!isHidden && <Video
          ref={addRef}
          source={{uri: item.uri}}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="cover"
          shouldPlay={isPlay}
          isLooping
          style={{
            width: '100%',
            height: '100%',
          }}
        />}
      </Container>

      <Details>
        <TouchableWithoutFeedback onPress={async () => {
          console.log('username clicked', item);
          navigation.navigate('Me', {username: item.username, pod: item.pod, update: false, rand: Math.random()})
        }
        }>
          <User>@{item.username}</User>
        </TouchableWithoutFeedback>

        <Description>{item.text}</Description>
        {/*<Tags>{item.tags}</Tags>*/}
        {/*<MusicBox>*/}
        {/*  <FontAwesome name="music" size={15} color="#f5f5f5"/>*/}
        {/*  <Music>{item.music}</Music>*/}
        {/*</MusicBox>*/}
      </Details>
      <Actions>
        {/*<BoxAction>*/}
        {/*  <AntDesign*/}
        {/*    style={{alignSelf: 'center'}}*/}
        {/*    name="heart"*/}
        {/*    size={35}*/}
        {/*    color="#fff"*/}
        {/*  />*/}
        {/*  <TextAction>{item.likes}</TextAction>*/}
        {/*</BoxAction>*/}
        {/*<BoxAction>*/}
        {/*  <FontAwesome*/}
        {/*    style={{alignSelf: 'center'}}*/}
        {/*    name="commenting"*/}
        {/*    size={35}*/}
        {/*    color="#fff"*/}
        {/*  />*/}
        {/*  <TextAction>{item.comments}</TextAction>*/}
        {/*</BoxAction>*/}
        {/*<BoxAction>*/}
        {/*  <FontAwesome*/}
        {/*    style={{alignSelf: 'center'}}*/}
        {/*    name="whatsapp"*/}
        {/*    size={35}*/}
        {/*    color="#06d755"*/}
        {/*  />*/}
        {/*  <TextAction>Share</TextAction>*/}
        {/*</BoxAction>*/}
        {/*<BoxAction>*/}
        {/*  <Animated.View*/}
        {/*    style={{*/}
        {/*      borderRadius: 50,*/}
        {/*      borderWidth: 12,*/}
        {/*      borderColor: '#292929',*/}
        {/*      transform: [*/}
        {/*        {*/}
        {/*          rotate: isPlay ? rotateProp : 0,*/}
        {/*        },*/}
        {/*      ],*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    <Image*/}
        {/*      style={{*/}
        {/*        width: 35,*/}
        {/*        height: 35,*/}
        {/*        borderRadius: 25,*/}
        {/*      }}*/}
        {/*      source={{*/}
        {/*        uri: 'https://avatars3.githubusercontent.com/u/45601574',*/}
        {/*      }}*/}
        {/*    />*/}
        {/*  </Animated.View>*/}

        {/*  <Lottie*/}
        {/*    source={musicFly}*/}
        {/*    progress={isPlay ? spinValue : 0}*/}
        {/*    style={{width: 150, position: 'absolute', bottom: 0, right: 0}}*/}
        {/*  />*/}
        {/*</BoxAction>*/}
      </Actions>

      <TouchableWithoutFeedback onPress={onVideoClick}>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,.4)']}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '50%',
          }}
        />
      </TouchableWithoutFeedback>
    </>
  );
};

export default Feed;
