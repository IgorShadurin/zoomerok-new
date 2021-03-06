import React, {useState, useEffect} from 'react';
import {Text, View, StatusBar, TextInput, SafeAreaView, Button} from 'react-native';

import {
  FontAwesome,
  MaterialCommunityIcons,
  AntDesign,
} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {Camera} from 'expo-camera';

import {
  Container,
  RecordButton,
  Header,
  Row,
  Button as Btn,
  Description,
} from './styles';

const Record: React.FC = ({api}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [cameraRef, setCameraRef] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [description, setDescription] = useState('');
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [timeoutPointer, setTimeoutPointer] = useState(null);

  const navigation = useNavigation();
  useEffect(() => {
    async function permission(): Promise<void> {
      const {status} = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      StatusBar.setHidden(true);
    }

    permission();
  }, []);

  if (hasPermission === null) {
    return <View/>;
  }

  if (!hasPermission) {
    return <Text>No access to camera</Text>;
  }

  const isUploadDisabled = description.length > 100 || uploading;

  return (
    <>
      {recorded &&
      <Container style={{
        padding: 20
      }
      }>
        <SafeAreaView>

          <View style={{margin: 10, marginTop: 30}}>
            <Text style={{
              textAlign: 'center',
              fontSize: 26,
              paddingBottom: 20
            }}>Enter video description</Text>
            <TextInput
              textAlign='center'
              maxLength={100}
              editable={true}
              style={{fontSize: 16, borderWidth: 1, padding: 8,}}
              onChangeText={setDescription}
              value={description}
              placeholder="Video description"
            />

            <View style={{flexDirection: "row", marginTop: 30}}>
              <View style={{flex: 1}}>
                <Button
                  title={uploading ? 'Uploading...' : 'Upload'}
                  disabled={isUploadDisabled}
                  onPress={async () => {
                    if (video) {
                      try {
                        setUploading(true);
                        const data = await api.uploadVideo(video.uri, description);
                        setUploading(false);
                        console.log('uploaded', data);
                        navigation.navigate("Me", {update: true, rand: Math.random()});
                      } catch (e) {
                        console.log(e);
                        setUploading(false);
                      }
                    }
                  }}/>
              </View>
              <View style={{flex: 1}}>
                <Button
                  title="Cancel"
                  onPress={() => {
                    setRecorded(false);
                  }}/>
              </View>
            </View>
          </View>

        </SafeAreaView>
      </Container>}

      {!recorded && <Camera style={{flex: 1}} type={type} ref={ref => {
        setCameraRef(ref);
      }}>
        <Container>
          <Header>
            <Btn
              onPress={() => {
                StatusBar.setHidden(false);
                navigation.goBack();
              }}
            >
              <AntDesign name="close" size={28} color="#fff"/>
            </Btn>
            {/*<Btn>*/}
            {/*  <Row>*/}
            {/*    <FontAwesome name="music" size={18} color="#fff" />*/}
            {/*    <Description>Sons</Description>*/}
            {/*  </Row>*/}
            {/*</Button>*/}
            <Btn
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back,
                );
              }}
            >
              <MaterialCommunityIcons
                name="rotate-right"
                size={28}
                color="#fff"
              />
            </Btn>
          </Header>
          <RecordButton
            style={{
              backgroundColor: recording ? '#313447' : '#fe2b54'
            }}
            onPress={async () => {
              console.log('Record click. Is recording', recording);
              if (!recording) {
                setRecording(true);
                setTimeoutPointer(setTimeout(() => {
                  cameraRef?.stopRecording();
                }, 10000));
                let video = await cameraRef.recordAsync();
                setRecorded(true);
                setVideo(video);
                console.log('video', video);
              } else {
                if (timeoutPointer) {
                  clearTimeout(timeoutPointer);
                }

                setRecording(false);
                cameraRef.stopRecording();
              }
            }}/>
        </Container>
      </Camera>
      }
    </>
  );
};

export default Record;
