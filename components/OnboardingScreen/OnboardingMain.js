/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
  StyleSheet,
  Image,
  Dimensions,
  View,
  ScrollView,
  ViewPagerAndroid
} from "react-native";
import Onboarding1 from "./Onboarding1";
import Onboarding2 from "./Onboarding2";
import Onboarding3 from "./Onboarding3";
export default class OnboardingMain extends Component {
  static navigationOptions = {
    header: null,
    drawerLockMode: "locked-closed"
  };
  constructor(props) {
    super(props);
    this.state = {
      first: true,
      second: false,
      third: false,
      no: 0,
      n: 0
    };
  }
  onPageSelected(e) {
    let currentPage = e.nativeEvent.position;
    let n = currentPage.toString();
    console.log(currentPage);
    this.setState({ n });
    this.setState({ no: currentPage });
    if (currentPage == 0) {
      this.setState({ first: true, second: false, third: false });
    } else if (currentPage == 1) {
      this.setState({ first: false, second: true, third: false });
    } else if (currentPage == 2) {
      this.setState({ first: false, second: false, third: true });
    }
  }
  componentDidMount() {}
  render() {
    let bottom = "";
    if (this.state.first) {
      bottom = (
        <View style={styles.circlePlaceholder}>
          <View style={styles.onlineCircle}></View>
          <View style={styles.offlineCircle}></View>
          <View style={styles.offlineCircle}></View>
        </View>
      );
    } else if (this.state.second) {
      bottom = (
        <View style={styles.circlePlaceholder}>
          <View style={styles.offlineCircle}></View>
          <View style={styles.onlineCircle}></View>
          <View style={styles.offlineCircle}></View>
        </View>
      );
    } else {
      bottom = (
        <View style={styles.circlePlaceholder}>
          <View style={styles.offlineCircle}></View>
          <View style={styles.offlineCircle}></View>
          <View style={styles.onlineCircle}></View>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/onboardingTop.png")}
          resizeMode="contain"
          style={styles.topImage}
        />
        <ViewPagerAndroid
          style={{ flex: 1 }}
          initialPage={0}
          onPageSelected={this.onPageSelected.bind(this)}
          ref={viewPager => {
            this.viewPager = viewPager;
          }}
        >
          <View style={{ flex: 1 }} key="1">
            <ScrollView
              keyboardShouldPersistTaps="always"
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              automaticallyAdjustContentInsets={false}
              directionalLockEnabled={true}
              bounces={false}
              scrollsToTop={false}
            >
              <Onboarding1 navigation={this.props.navigation} />
            </ScrollView>
          </View>
          <View style={{ flex: 1 }} key="2">
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="always"
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              automaticallyAdjustContentInsets={false}
              directionalLockEnabled={true}
              bounces={false}
              scrollsToTop={false}
            >
              <Onboarding2 navigation={this.props.navigation} />
            </ScrollView>
          </View>
          <View style={{ flex: 1 }} key="3">
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="always"
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              automaticallyAdjustContentInsets={false}
              directionalLockEnabled={true}
              bounces={false}
              scrollsToTop={false}
            >
              <Onboarding3 navigation={this.props.navigation} />
            </ScrollView>
          </View>
        </ViewPagerAndroid>
        {bottom}
      </View>
    );
  }
}
const dimensions = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ffffff"
  },
  topImage: {
    width: "100%",
    height: 149
  },
  onlineCircle: {
    backgroundColor: "#6ED08C",
    width: 14,
    height: 14,
    borderRadius: 7
  },
  offlineCircle: {
    backgroundColor: "#000000",
    width: 14,
    height: 14,
    borderRadius: 7
  },
  circlePlaceholder: {
    width: "24%",
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "space-between",
    amrginBottom: 35
  }
});
