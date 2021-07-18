import React, {useEffect, useState} from 'react';
import {StatusBar, Platform} from 'react-native';

import {
  MaterialCommunityIcons,
  AntDesign,
  FontAwesome,
} from '@expo/vector-icons';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import settings from '../settings.json';
import {getApi} from '../lib/api';

import HomeButtom from '../components/HomeButton';
import Discover from '../pages/Discover';
import Home from '../pages/Home';
import Inbox from '../pages/Inbox';
import Me from '../pages/Me';
import Record from '../pages/Record';

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();
const api = getApi();

const AppRoutes: React.FC = () => {
  const [home, setHome] = useState(false);
  const [feedVideos, setFeedVideos] = useState([
    {
      "music": "Some music",
      "tags": "#test #test",
      "uri": "http://sdancer.local/video/0xb99f13a77ae04d27a41bef2265ffd75e83c91147/zoo-friend-2c6fc78bc09b/1626189765528.mp4",
      "username": "test",
    }
  ]);
  const [user, setUser] = useState({});

  useEffect(() => {
    api.setServerUrl(settings.serverUrl);
    api.setStaticUrl(settings.staticUrl);
    // todo load username/password from storage to object and open feed page
    // todo is login ok -  updateVideos();
    // todo check case with VERY MUCH videos in the feed. How to manage memory leaks?
  }, []);

  async function updateVideos() {
    let videos = (await api.getVideos()).data;
    console.log(videos);

    videos = (videos.slice(0, 2)).map((item, i) => ({
      uri: api.getStaticVideoUrl(item.pod, item.name),
      username: item.username,
      text: item.description,
      tags: '',
      music: ''
    }));
    setFeedVideos(videos);
  }

  async function onRegister(username, password, mnemonic = '') {
    setUser(data => ({...data, isRegister: true, message: null}));
    const response = await api.register(username, password, mnemonic);
    if (response.result) {
      // todo store credentials to storage
      api.setCredentials(username, password);
      setUser(data => ({
        ...data,
        isRegister: false,
        username,
        password,
        mnemonic: mnemonic ? mnemonic : response.data.mnemonic,
      }));
      await updateVideos();
    } else {
      api.setCredentials('', '');
      setUser(data => ({...data, isRegister: false, message: 'User exists or incorrect data'}));
    }
  }

  async function onLogin(username, password) {
    setUser(data => ({...data, isLogin: true, message: null}));
    api.setCredentials(username, password);
    if ((await api.login()).result) {
      console.log('login ok');
      // todo store credentials to storage
      setUser(data => ({...data, isLogin: false, username, password}));
      await updateVideos();
    } else {
      console.log('login not ok');

      api.setCredentials('', '');
      setUser(data => ({...data, isLogin: false, message: 'Incorrect login or password'}));
    }
  }

  function onLogout() {
    // todo remove from local storage
    setUser({});
  }

  function onMnemonicRecorded() {
    setUser(data => ({...data, mnemonic: ''}));
  }

  StatusBar.setBarStyle('dark-content');

  if (Platform.OS === 'android') StatusBar.setBackgroundColor('#fff');

  if (home) {
    StatusBar.setHidden(true);
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#fff');
      StatusBar.setBarStyle('light-content');
    }
  } else {
    StatusBar.setHidden(false);
  }

  return (
    <Tab.Navigator
      shifting={false}
      barStyle={{
        backgroundColor: home ? '#000' : '#fff',
      }}
      initialRouteName="Me"
      activeColor={home ? '#fff' : '#000'}
    >
      {(user.username && !user.mnemonic) && <Tab.Screen
        name="Home"
        listeners={{
          focus: () => setHome(true),
          blur: () => setHome(false),
        }}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => (
            <FontAwesome name="home" size={24} color={color}/>
          ),
        }}
      >
        {() => <Home feedVideos={feedVideos}/>}
      </Tab.Screen>}
      {/*<Tab.Screen*/}
      {/*  name="Discover"*/}
      {/*  component={Discover}*/}
      {/*  options={{*/}
      {/*    tabBarLabel: 'Discover',*/}
      {/*    tabBarIcon: ({ color }) => (*/}
      {/*      <AntDesign name="search1" size={24} color={color} />*/}
      {/*    ),*/}
      {/*  }}*/}
      {/*/>*/}
      {(user.username && !user.mnemonic) && <Tab.Screen
        name="Live"
        component={Record}
        listeners={({navigation}) => ({
          tabPress: e => {
            // Prevent default action
            e.preventDefault();

            // Do something with the `navigation` object
            navigation.navigate('Record');
          },
        })}
        options={{
          tabBarLabel: '',
          tabBarIcon: () => <HomeButtom home={home}/>,
        }}
      />}
      {/*<Tab.Screen*/}
      {/*  name="Inbox"*/}
      {/*  component={Inbox}*/}
      {/*  options={{*/}
      {/*    tabBarLabel: 'Inbox',*/}
      {/*    tabBarIcon: ({ color }) => (*/}
      {/*      <MaterialCommunityIcons*/}
      {/*        name="message-text-outline"*/}
      {/*        size={24}*/}
      {/*        color={color}*/}
      {/*      />*/}
      {/*    ),*/}
      {/*  }}*/}
      {/*/>*/}
      <Tab.Screen
        name="Me"
        // component={Me}
        options={{
          tabBarLabel: 'Me',
          tabBarIcon: ({color}) => (
            <AntDesign name="user" size={24} color={color}/>
          ),
        }}
      >
        {() => <Me user={user} onLogin={onLogin} onLogout={onLogout} onRegister={onRegister}
                   onMnemonicRecorded={onMnemonicRecorded}/>}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const RootStackScreen: React.FC = () => {
  return (
    <Stack.Navigator mode="modal">
      <Stack.Screen
        name="Main"
        component={AppRoutes}
        options={{headerShown: false}}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Record"
        // component={Record}
      >
        {() => <Record api={api}/>}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default RootStackScreen;
