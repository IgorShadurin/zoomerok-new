import React, {useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {PagerView, LazyPagerView} from 'react-native-pager-view';

import ViewPager from '@react-native-community/viewpager';

// import server from '../../../server.json';
import Feed from './Feed';

import {Container, Header, Text, Tab, Separator} from './styles';
import {PagerViewOnPageSelectedEventData} from "react-native-pager-view/src/types";

const Home: React.FC = ({feedVideos, isHidden}) => {
  const [pagerCreated, setPagerCreated] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  let refs = useRef({});
  const [isIdHidden, setIsIdHidden] = useState({});

  useEffect(() => {
    if (feedVideos && feedVideos.length > 0) {
      const data = {};
      feedVideos.forEach((item, i) => {
        data[i] = true;
      });
      setIsIdHidden(data);
    }
  }, [feedVideos]);

  console.log('isIdHidden', isIdHidden);
  const addRef = (index, ref) => {
    refs = {...refs, [index]: ref};
  };

  let views;
  if (feedVideos && feedVideos.length > 0) {
    views = feedVideos.map((item, i) => (
      <View key={i}>
        <Feed item={item}
              play={i === currentPosition}
              isHidden={isHidden || isIdHidden[i]}
              addRef={(ref) => addRef(i, ref)}/>
      </View>
    ));
  } else if (feedVideos && feedVideos.length === 0) {
    views = <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Text>
        No videos in your feed.
      </Text>
      <Text>
        Let's subscribe to somebody!
      </Text>
    </View>;
  } else {
    views = <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Text>
        Loading...
      </Text>
    </View>;
  }

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
      {(!isHidden || pagerCreated) &&
      <PagerView ref={() => setPagerCreated(true)}
                 onPageSelected={data => {
                   const pos = data.nativeEvent.position;
                   setCurrentPosition(pos);


                   console.log('onPageSelected', data.nativeEvent.position, !!refs[pos])
                   setIsIdHidden(oldItems => {
                     const newItems = {...oldItems};
                     // const allowedKeys = [pos - 2, pos - 1, pos, pos + 1, pos + 2];
                     const allowedKeys = [pos - 1, pos, pos + 1,];
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
                 }
                 }
                 style={{flex: 1,}}
                 initialPage={0}
                 orientation="vertical">

        {views}

      </PagerView>}
    </Container>
  );
};

export default Home;
