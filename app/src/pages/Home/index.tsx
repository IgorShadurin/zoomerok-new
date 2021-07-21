import React, {useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {PagerView, LazyPagerView} from 'react-native-pager-view';

import ViewPager from '@react-native-community/viewpager';

// import server from '../../../server.json';
import Feed from './Feed';

import {Container, Header, Text, Tab, Separator} from './styles';
import {PagerViewOnPageSelectedEventData} from "react-native-pager-view/src/types";

const Home: React.FC = ({feedVideos, isHidden}) => {
  const [tab, setTab] = useState(1);
  const [active, setActive] = useState(0);
  // const [videoCache, setVideoCache] = useState({});
  // const [videoRefs, setVideoRefs] = useState({});
  const [pagerCreated, setPagerCreated] = useState(false);
  // const [currentPosition, setCurrentPosition] = useState(0);
  let refs = useRef({});
  const [isIdHidden, setIsIdHidden] = useState({});

  useEffect(() => {
    const data = {};
    feedVideos.forEach((item, i) => {
      data[i] = true;
    });
    setIsIdHidden(data);
  }, [feedVideos]);

  console.log('isIdHidden', isIdHidden);
  // console.log('videoRefs', videoRefs);
  const addRef = (index, ref) => {
    // console.log('new ref', index);
    // setVideoRefs(data => ({...data, [index]: ref}));
    refs = {...refs, [index]: ref};
  };

  // console.log('HOME feedVideos', feedVideos);
  // console.log('HOME isHidden', isHidden);
  // feedVideos.forEach((item) => {
  //   if (videoCache[item.uri]) {
  //     return;
  //   }
  //
  //   console.log('CACHE NEW',item.uri);
  //   setVideoCache(data => ({
  //     ...data, [item.uri]: <View key={item.uri}>
  //       <Feed item={item} play={false}/>
  //     </View>
  //   }));
  // });

  // const views = feedVideos.map((item, i) => (
  //   <View key={i}>
  //     <Feed item={item} play={true} isHidden={isHidden} addRef={addRef}/>
  //   </View>
  //   // videoCache[item.uri]
  //
  // ));

  return (
    <Container>
      <Header>
        {/*<Tab onPress={() => setTab(1)}>*/}
        {/*  <Text active={tab === 1}>Following</Text>*/}
        {/*</Tab>*/}
        {/*<Separator>|</Separator>*/}
        {/*<Tab onPress={() => setTab(2)}>*/}
        {/*  <Text active={tab === 2}>For You</Text>*/}
        {/*</Tab>*/}
      </Header>
      {/*<ViewPager*/}
      {/*  onPageSelected={e => {*/}
      {/*    setActive(e.nativeEvent.position);*/}
      {/*  }}*/}
      {/*  orientation="vertical"*/}
      {/*  style={{flex: 1}}*/}
      {/*  initialPage={0}*/}
      {/*>*/}
      {/*  {feedVideos.map((item, i) => (*/}
      {/*    <View key={i}>*/}
      {/*      <Text>27777 {i}</Text>*/}
      {/*      /!*<Feed item={item} play={true}/>*!/*/}
      {/*    </View>*/}
      {/*  ))}*/}
      {/*  */}
      {/*  /!*{feedVideos.map((item, i) => (*!/*/}
      {/*  /!*  <View key={i}>*!/*/}
      {/*  /!*    <Text>12312312312</Text>*!/*/}
      {/*  /!*    /!*<Feed item={item} play={true}/>*!/*!/*/}
      {/*  /!*  </View>*!/*/}
      {/*  /!*))}*!/*/}
      {/*</ViewPager>*/}

      {/*{!isHidden && <PagerView style={{flex: 1,}} initialPage={0} orientation="vertical">*/}
      {/*  {feedVideos.map((item, i) => (*/}
      {/*    <View key={i}>*/}
      {/*      /!*<Text>9927777 {i}</Text>*!/*/}
      {/*      <Feed item={item} play={true}/>*/}
      {/*    </View>*/}
      {/*  ))}*/}
      {/*  /!*{views}*!/*/}
      {/*</PagerView>}*/}
      {(!isHidden || pagerCreated) &&
      <PagerView ref={() => setPagerCreated(true)}
                 onPageSelected={data => {
                   // todo play current video and pause others
                   const pos = data.nativeEvent.position;

                   console.log('onPageSelected', data.nativeEvent.position, !!refs[pos])
                   setIsIdHidden(oldItems => {
                     const newItems = {...oldItems};
                     // const allowedKeys = [pos - 2, pos - 1, pos, pos + 1, pos + 2];
                     const allowedKeys = [ pos - 1, pos, pos + 1, ];
                     Object.keys(newItems).forEach(key => {
                       newItems[key] = !allowedKeys.includes(Number(key));
                     });

                     return newItems;
                   });
                   refs[pos - 2]?.stopAsync();
                   refs[pos - 1]?.stopAsync();
                   refs[pos]?.playAsync();
                   refs[pos + 1]?.stopAsync();
                   refs[pos + 2]?.stopAsync();
                   //     setCurrentPosition(data.nativeEvent.position);
                 }
                 }
                 style={{flex: 1,}}
                 initialPage={0}
                 orientation="vertical">
        {feedVideos.map((item, i) => (
          <View key={i}>
            <Feed item={item}
                  play={false}
                  isHidden={isHidden || isIdHidden[i]}
                  addRef={(ref) => addRef(i, ref)}/>
          </View>
          // videoCache[item.uri]
        ))}
        {/*{views}*/}
      </PagerView>}

    </Container>
  );
};

export default Home;
