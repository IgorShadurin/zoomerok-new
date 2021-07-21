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
import Player from '../pages/Player';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();
const api = getApi();

const AppRoutes: React.FC = () => {
  const [home, setHome] = useState(false);
  const [feedVideos, setFeedVideos] = useState(null);
  const [user, setUser] = useState({});
  const [currentUserVideos, setCurrentUserVideos] = useState([]);

  async function updateFeedVideos() {
    setFeedVideos(null);
    let videos = (await api.getVideos()).data;
    // console.log(videos);

    videos = videos.map((item, i) => ({
      uri: api.getStaticUrl(item.pod, item.name),
      username: item.username,
      text: item.description,
      tags: '',
      music: ''
    }));
    setFeedVideos(videos);
  }

  async function updateUserVideos(user = 'me') {
    setCurrentUserVideos(null);
    let videos = (await api.getMyVideos()).data;
    // console.log('getMyVideos', videos);

    videos = videos.map((item, i) => ({
      uri: api.getStaticUrl(item.pod, item.name),
      previewUri: api.getStaticUrl(item.pod, item.previewName),
      username: item.username,
      text: item.description,
      tags: '',
      music: ''
    }));
    setCurrentUserVideos(videos);
  }

  async function saveCredentials(username = '', password = '') {
    try {
      await AsyncStorage.setItem('username', username);
      await AsyncStorage.setItem('password', password);
    } catch (e) {
      console.error(e);
    }
  }

  async function getCredentials() {
    const username = await AsyncStorage.getItem('username');
    const password = await AsyncStorage.getItem('password');
    return {username, password};
  }

  useEffect(() => {
    api.setServerUrl(settings.serverUrl);
    api.setStaticUrl(settings.staticUrl);

    async function authRecover() {
      const {username, password} = await getCredentials();
      if (username && password) {
        api.setCredentials(username, password);
        try {
          setUser(data => ({...data, isLogin: true, message: null}));
          if ((await api.login()).result) {
            setFeedVideos(null);
            setCurrentUserVideos(null);
            setUser(data => ({...data, isLogin: false, username, password}));
            await updateFeedVideos();
            await updateUserVideos();
          }
        } catch (e) {
          // api.setCredentials('', '');
          setUser(data => ({...data, isLogin: false, message: null}));
        }
      }
    }

    authRecover().then();
  }, []);

  async function onRegister(username, password, mnemonic = '') {
    setFeedVideos(null);
    setCurrentUserVideos(null);
    setUser(data => ({...data, isRegister: true, message: null}));
    try {
      const response = await api.register(username, password, mnemonic);
      if (response.result) {
        await saveCredentials(username, password);
        api.setCredentials(username, password);
        setUser(data => ({
          ...data,
          isRegister: false,
          username,
          password,
          mnemonic: mnemonic ? mnemonic : response.data.mnemonic,
        }));
        await updateFeedVideos();
        await updateUserVideos();
      } else {
        api.setCredentials('', '');
        setUser(data => ({...data, isRegister: false, message: 'User exists or incorrect data'}));
      }
    } catch (e) {
      api.setCredentials('', '');
      setUser(data => ({...data, isRegister: false, message: `Can't connect to server`}));
    }
  }

  async function onLogin(username, password) {
    setFeedVideos(null);
    setCurrentUserVideos(null);
    setUser(data => ({...data, isLogin: true, message: null}));
    try {
      api.setCredentials(username, password);
      if ((await api.login()).result) {
        await saveCredentials(username, password);
        setUser(data => ({...data, isLogin: false, username, password}));
        await updateFeedVideos();
        await updateUserVideos();
      } else {
        console.log('login not ok');

        api.setCredentials('', '');
        setUser(data => ({...data, isLogin: false, message: 'Incorrect login or password'}));
      }
    } catch (e) {
      api.setCredentials('', '');
      setUser(data => ({...data, isLogin: false, message: `Can't connect to server`}));
    }
  }

  async function onLogout() {
    setUser({});
    await saveCredentials();
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
          tabPress: async () => {
            await updateFeedVideos();
          },
          focus: async () => {
            setHome(true);
          },
          blur: () => setHome(false)
        }}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => (
            <FontAwesome name="home" size={24} color={color}/>
          ),
        }}
      >
        {() => <Home feedVideos={feedVideos} isHidden={!home}/>}
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
        listeners={() => ({
          tabPress: async () => {
            console.log('tabPress');
            await updateUserVideos();
          },
        })}
        options={{
          tabBarLabel: 'Me',
          tabBarIcon: ({color}) => (
            <AntDesign name="user" size={24} color={color}/>
          ),
        }}
      >
        {() => <Me videos={currentUserVideos} user={user} onLogin={onLogin} onLogout={onLogout} onRegister={onRegister}
                   onMnemonicRecorded={onMnemonicRecorded} api={api}/>}
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
      >
        {() => <Record api={api}/>}
      </Stack.Screen>

      <Stack.Screen
        options={{headerShown: false}}
        name="Player"
      >
        {() => <Player api={api}/>}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default RootStackScreen;
