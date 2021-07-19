import React from 'react';
import {
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Button,
  View,
  Alert,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Clipboard,
} from 'react-native';
import {MaterialIcons, AntDesign, FontAwesome} from '@expo/vector-icons';

import avatar from '../../assets/avatar.png';

import {
  Container,
  Title,
  Header,
  Avatar,
  Username,
  Content,
  Stats,
  Separator,
  StatsText,
  StatsColumn,
  StatsNumber,
  ProfileColumn,
  ProfileEdit,
  ProfileText,
  Bookmark, AuthError, MnemonicWarning, MnemonicItem, AuthTitle,
} from './styles';

const Me: React.FC = ({user, onLogin, onLogout, onRegister, onMnemonicRecorded, videos, api}) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isRegistrationForm, setIsRegistrationForm] = React.useState(false);

  const window = Dimensions.get('window');

  const styles = StyleSheet.create({
    box: {
      width: window.width / 3 - 13,
      height: window.width / 3 - 13,
      margin: 3,
    },
    input: {
      width: 350,
      height: 40,
      padding: 8,
      margin: 12,
      // borderColor: 'lightgrey',
      borderWidth: 1,
    },
    buttonSecondary: {
      marginTop: 20,
      fontSize: 20,
    },
    container: {
      padding: 20,
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start'
    },
    item: {
      width: '50%'
    }
  });

  const showLogoutAlert = () =>
    Alert.alert(
      "Really logout?",
      "Clear local data from your device",
      [
        {
          text: "Cancel",
          onPress: () => {
            console.log('cancel pressed');
          },
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => {
            onLogout();
            console.log('logout pressed');
          },
          style: "destructive",
        },
      ],
      {
        cancelable: true,
        onDismiss: () => console.log('onDismiss')
      }
    );

  const isAction = user.isRegister || user.isLogin || user.isRegister;
  const isEmptyInputs = username.length < 3 || password.length < 3;
  const mnemonicWords = user.mnemonic ? user.mnemonic.split(' ') : [];

  return (
    <Container>
      <Header>
        {/*<AntDesign*/}
        {/*  style={{ position: 'absolute', left: 10, top: 10 }}*/}
        {/*  name="adduser"*/}
        {/*  size={24}*/}
        {/*  color="black"*/}
        {/*/>*/}
        {/*<Title>Matheus Castro</Title>*/}
        {/*<MaterialIcons name="arrow-drop-down" size={24} color="black" />*/}
        {/*<FontAwesome*/}
        {/*  style={{ position: 'absolute', right: 13, top: 12 }}*/}
        {/*  name="ellipsis-v"*/}
        {/*  size={24}*/}
        {/*  color="black"*/}
        {/*/>*/}
      </Header>
      <SafeAreaView>
        <ScrollView>
          {(user.username && !!user.mnemonic) && <Content>
            <AuthTitle>Mnemonic phrase</AuthTitle>
            <MnemonicWarning>Mnemonic phrase is the only way to recover your account. Please write these words to paper
              or
              other safe place.</MnemonicWarning>

            <View style={styles.container}>
              <View style={styles.item}>
                <MnemonicItem>1 - {mnemonicWords[0]}</MnemonicItem>
              </View>
              <View style={styles.item}>
                <MnemonicItem>7 - {mnemonicWords[6]}</MnemonicItem>
              </View>
              <View style={styles.item}>
                <MnemonicItem>2 - {mnemonicWords[1]}</MnemonicItem>
              </View>
              <View style={styles.item}>
                <MnemonicItem>8 - {mnemonicWords[7]}</MnemonicItem>
              </View>
              <View style={styles.item}>
                <MnemonicItem>3 - {mnemonicWords[2]}</MnemonicItem>
              </View>
              <View style={styles.item}>
                <MnemonicItem>9 - {mnemonicWords[8]}</MnemonicItem>
              </View>

              <View style={styles.item}>
                <MnemonicItem>4 - {mnemonicWords[3]}</MnemonicItem>
              </View>
              <View style={styles.item}>
                <MnemonicItem>10 - {mnemonicWords[9]}</MnemonicItem>
              </View>
              <View style={styles.item}>
                <MnemonicItem>5 - {mnemonicWords[4]}</MnemonicItem>
              </View>
              <View style={styles.item}>
                <MnemonicItem>11 - {mnemonicWords[10]}</MnemonicItem>
              </View>
              <View style={styles.item}>
                <MnemonicItem>6 - {mnemonicWords[5]}</MnemonicItem>
              </View>
              <View style={styles.item}>
                <MnemonicItem>12 - {mnemonicWords[11]}</MnemonicItem>
              </View>
            </View>

            <Button
              title="Recorded!"
              onPress={onMnemonicRecorded}/>
          </Content>}

          {(user.username && !user.mnemonic) && <Content>
            {/*<Avatar source={avatar}/>*/}

            <Username>@{user.username}</Username>

            <Button title="Share profile" onPress={async () => {
              try {
                const reference = (await api.getMyReference()).data;
                console.log(reference);
                Clipboard.setString(reference);
                Alert.alert(
                  "Done",
                  "Reference copied to your clipboard. Share it with other users and they could subscribe to you.",
                  [
                    {
                      text: "OK",
                      onPress: () => {
                        console.log('cancel pressed');
                      },
                      style: "cancel",
                    },

                  ],
                  {
                    cancelable: true,
                    onDismiss: () => console.log('onDismiss')
                  }
                );
              } catch (e) {
                console.log(e);
              }
            }
            }/>

            <TouchableOpacity onPress={showLogoutAlert}
                              style={{
                                position: 'absolute',
                                right: 13,
                                top: 22
                              }}>
              <FontAwesome
                name="sign-out"
                size={24}
                color="black"
              />
            </TouchableOpacity>

            {/*<Button*/}
            {/*  title="Logout"*/}
            {/*  onPress={showLogoutAlert}/>*/}

            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 30}}>
              <View style={{flex: 1, height: 1, backgroundColor: 'lightgrey'}}/>
            </View>

            <View style={{
              marginTop: 40,
              flex: 1,
              flexDirection: "row",
              flexWrap: 'wrap',
              // justifyContent: 'center',

            }}>
              {!videos && <Text>Loading...</Text>}

              {(videos && !videos.length) &&
              <Text style={{textAlign: 'center', fontSize: 15}}>The videos you recorded will be displayed here. It's
                time to record something!</Text>}

              {(videos && videos.length > 0) && videos.map((item, i) =>
                <Image
                  key={i}
                  style={styles.box}
                  source={{
                    uri: item.previewUri,
                  }}
                />
              )}
              {/*<View*/}
              {/*  style={[styles.box, {backgroundColor: "powderblue"}]}*/}
              {/*/>*/}
              {/*<View*/}
              {/*  style={[styles.box, {backgroundColor: "skyblue"}]}*/}
              {/*/>*/}
              {/*<View*/}
              {/*  style={[styles.box, {backgroundColor: "steelblue"}]}*/}
              {/*/>*/}
              {/*<View*/}
              {/*  style={[styles.box, {backgroundColor: "red"}]}*/}
              {/*/>*/}
              {/*<View*/}
              {/*  style={[styles.box, {backgroundColor: "orange"}]}*/}
              {/*/>*/}
              {/*<View*/}
              {/*  style={[styles.box, {backgroundColor: "pink"}]}*/}
              {/*/>*/}
              {/*<View*/}
              {/*  style={[styles.box, {backgroundColor: "blue"}]}*/}
              {/*/>*/}
              {/*<View*/}
              {/*  style={[styles.box, {backgroundColor: "black"}]}*/}
              {/*/>*/}
              {/*<View*/}
              {/*  style={[styles.box, {backgroundColor: "green"}]}*/}
              {/*/>*/}
              {/*<View*/}
              {/*  style={[styles.box, {backgroundColor: "steelblue"}]}*/}
              {/*/>*/}
            </View>

            {/*
            <View style={{
              flex: 1,
              width: 300,
              flexDirection: 'row',
              alignItems: 'flex-start',
              alignContent: 'flex-start',
              flexWrap: 'wrap',
            }}>
              <View style={{
                backgroundColor: 'red',
                flex: 1,
                width: 100,
                height: 100,
              }}/>
              <View style={{
                backgroundColor: 'blue',
                flex: 1,
                width: 100,
                height: 100,
              }}/>
              <View style={{
                backgroundColor: 'yellow',
                flex: 1,
                width: 100,
                height: 100,
              }}/>
              <View style={{
                backgroundColor: 'green',
                flex: 1,
                width: 100,
                height: 100,
              }}/>
              <View style={{
                backgroundColor: 'red',
                flex: 1,
                width: 100,
                height: 100,
              }}/>
              <View style={{
                backgroundColor: 'orange',
                flex: 1,
                width: 100,
                height: 100,
              }}/>
              <View style={{
                backgroundColor: 'black',
                flex: 1,
                width: 100,
                height: 100,
              }}/>
            </View>
            */}

            <Stats>
              {/*<StatsColumn>*/}
              {/*  <StatsNumber>1950</StatsNumber>*/}
              {/*  <StatsText>Following</StatsText>*/}
              {/*</StatsColumn>*/}
              {/*<Separator>|</Separator>*/}
              {/*<StatsColumn>*/}
              {/*  <StatsNumber>650</StatsNumber>*/}
              {/*  <StatsText>Followers</StatsText>*/}
              {/*</StatsColumn>*/}
              {/*<Separator>|</Separator>*/}
              {/*<StatsColumn>*/}
              {/*  <StatsNumber>950</StatsNumber>*/}
              {/*  <StatsText>Likes</StatsText>*/}
              {/*</StatsColumn>*/}
            </Stats>
            {/*<ProfileColumn>*/}
            {/*  <ProfileEdit>*/}
            {/*    <ProfileText>Edit profile</ProfileText>*/}
            {/*  </ProfileEdit>*/}
            {/*  <Bookmark name="bookmark" size={24} color="black" />*/}
            {/*</ProfileColumn>*/}

            {/*<StatsText>Tap to add bio</StatsText>*/}
          </Content>}
          {!user.username && <Content>
            <AuthTitle>{isRegistrationForm ? 'Registration' : 'Authentication'}</AuthTitle>
            <AuthTitle>{user.isLogin || user.isRegister ? 'Processing...' : 'Enter your credentials'}</AuthTitle>
            {user.message && <AuthError>{user.message}</AuthError>}

            <TextInput
              autoCapitalize='none'
              editable={!isAction}
              style={styles.input}
              onChangeText={setUsername}
              value={username}
              placeholder="Username"
            />

            <TextInput
              editable={!isAction}
              secureTextEntry={true}
              style={styles.input}
              onChangeText={setPassword}
              value={password}
              placeholder="Password"
            />

            <View style={{
              marginTop: 20
            }
            }>
              {isRegistrationForm ? <Button
                title="Create account"
                disabled={isAction || isEmptyInputs}
                onPress={() => {
                  console.log('Create account pressed');
                  onRegister(username, password);
                }}
              /> : <Button
                title="Login"
                disabled={isAction || isEmptyInputs}
                onPress={() => {
                  console.log('Login pressed');
                  onLogin(username, password);
                }}
              />}
            </View>


            <View style={{
              marginTop: 40
            }
            }>
              {isRegistrationForm ? <Button
                title="Want to login?"
                onPress={() => {
                  console.log('Login switch pressed');
                  setIsRegistrationForm(false);
                }}
              /> : <Button
                title="Want to register?"
                onPress={() => {
                  console.log('Registration switch pressed');
                  setIsRegistrationForm(true);
                }}
              />}
            </View>

          </Content>
          }

        </ScrollView>
      </SafeAreaView>
    </Container>
  );
};

export default Me;
