import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
// components
import LinearGradient from '../../components/gradients/LinearGradient';
import TouchableIcon from '../../components/touchable/TouchIcon';

import { Colors, Layout, Fonts } from '../../theme';
import { NavigationType } from '../../types';

interface Props {
  navigation: NavigationType;
}

interface State {
  album: any;
  downloaded: boolean;
  scrollY: any;
  song: any;
  title: any;
}

class Album extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      album: null,
      downloaded: false,
      scrollY: new Animated.Value(0),
      song: null,
      title: null
    };
  }

  render() {
    const { navigation } = this.props;
    const { scrollY } = this.state;

    const opacityHeading = scrollY.interpolate({
      inputRange: [230, 280],
      outputRange: [0, 1],
      extrapolate: 'clamp'
    });

    const opacityShuffle = scrollY.interpolate({
      inputRange: [40, 80],
      outputRange: [0, 1],
      extrapolate: 'clamp'
    });
    return (
      <View style={localstyles.containerHeader}>
        <Animated.View style={[localstyles.headerLinear, { opacity: opacityHeading }]}>
          <LinearGradient fill={Colors.blue} height={89} />
        </Animated.View>
        <View style={localstyles.header}>
          <TouchableIcon
            icon={<Feather color={Colors.white} name="chevron-left" />}
            onPress={() => navigation.goBack(null)}
          />
          <Animated.View style={{ opacity: opacityShuffle }}>
            <Text style={localstyles.headerTitle}>Hello, Testing</Text>
          </Animated.View>
          <TouchableIcon icon={<Feather color={Colors.white} name="more-horizontal" />} onPress={() => null} />
        </View>
      </View>
    );
  }
}

const localstyles = StyleSheet.create({
  albumInfo: {
    color: Colors.greyInactive,
    fontFamily: Fonts.monospace,
    fontSize: 12,
    marginBottom: 48
  },
  btn: {
    backgroundColor: Colors.brandPrimary,
    borderRadius: 25,
    height: 50,
    width: 220
  },
  btnText: {
    color: Colors.white,
    fontFamily: Fonts.helvitica,
    fontSize: 16,
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  containerFixed: {
    alignItems: 'center',
    paddingTop: Layout.iPhoneX ? 94 : 50,
    position: 'absolute',
    width: '100%'
  },
  containerHeader: {
    height: 100,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 100
  },
  containerImage: {
    shadowColor: Colors.black,
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6
  },
  containerLinear: {
    position: 'absolute',
    top: 0,
    width: '100%'
  },
  containerScroll: {
    paddingTop: 89
  },
  containerShuffle: {
    alignItems: 'center',
    height: 50,
    shadowColor: Colors.blackBg,
    shadowOffset: { height: -10, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20
  },
  containerSongs: {
    alignItems: 'center',
    backgroundColor: Colors.background,
    minHeight: 540
  },
  containerSticky: {
    marginTop: Layout.iPhoneX ? 238 : 194
  },
  containerStickyLinear: {
    position: 'absolute',
    top: 0,
    width: '100%'
  },
  downloadText: {
    color: Colors.white,
    fontFamily: Fonts.donButique,
    fontSize: 18
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: Layout.iPhoneX ? 48 : 24,
    position: 'absolute',
    top: 0,
    width: '100%'
  },
  headerLinear: {
    height: 200,
    width: '100%'
  },
  headerTitle: {
    color: Colors.white,
    fontFamily: Fonts.bold,
    fontSize: 16,
    marginTop: 2,
    paddingHorizontal: 8,
    textAlign: 'center',
    width: Layout.window.width - 100
  },
  image: {
    height: 148,
    marginBottom: 16,
    width: 148
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    width: '100%'
  },
  title: {
    color: Colors.white,
    fontFamily: Fonts.bold,
    fontSize: 20,
    marginBottom: 8,
    paddingHorizontal: 24,
    textAlign: 'center'
  }
});

export default Album;
