/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { Animated, Easing, Dimensions, SafeAreaView, View } from 'react-native';

const screen = Dimensions.get('screen');

export default class AlertModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: new Animated.Value(0),
      opacity: new Animated.Value(0),
    };
  }

  componentDidMount() {
    this.showToast();
  }

  showToast() {
    if (this.props.message) {
      Animated.sequence([
        Animated.timing(this.state.width, {
          toValue: 1,
          duration: 300,
          easing: Easing.ease,
        }),
        Animated.timing(this.state.opacity, {
          toValue: 1,
          duration: 300,
          delay: 200,
          easing: Easing.ease,
        }),
      ]).start();

      let closeAlert = Animated.sequence([
        Animated.timing(this.state.opacity, {
          toValue: 0,
          duration: 300,
          easing: Easing.ease,
        }),
        Animated.timing(this.state.width, {
          toValue: 0,
          duration: 300,
          delay: 200,
          easing: Easing.ease,
        }),
      ]);

      setTimeout(() => {
        closeAlert.start();
      }, 5000);
    }
  }

  render() {
    const { status, message } = this.props;
    message && console.log("gg"+message); 
    this.showToast();

    const statusColors = {
      danger: '#FA4A84',
      success: '#1bc47d',
    };

    const width = this.state.width.interpolate({
      inputRange: [0, 1],
      outputRange: [0, screen.width],
    });

    const padding = this.state.width.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 24],
    });

    const opacity = this.state.opacity.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    return (
      <SafeAreaView
        style={{
          zIndex: 1000,
          backgroundColor: statusColors[status],
          position: 'absolute',
          top: 20,
          left: 0,
        }}>
        <View>
          <Animated.View style={{ zIndex: 1000 }}>
            <Animated.View
              style={{
                paddingHorizontal: padding,
                paddingTop: 16,
                width: width,
                height: 60,
              }}>
              {message ? (
                
                <Animated.Text
                  style={{
                    fontSize: 14,
                    lineHeight: 14,
                    fontFamily: 'mont-semi',
                    color: 'white',
                    opacity: opacity,
                  }}>
                  {message}
                </Animated.Text>
              ) : null}
            </Animated.View>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }
}
