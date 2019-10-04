/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { StyleSheet, Text, Image, Dimensions, View } from "react-native";
export default class Onboarding1 extends Component {
  static navigationOptions = {
    header: null,
    drawerLockMode: "locked-closed"
  };
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/onb1.png")}
          resizeMode="contain"
          style={styles.topImage}
        />
        <Text style={styles.textStyle}>Search for Trekpals</Text>
      </View>
    );
  }
}
const dimensions = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center"
  },
  imageStyle: {
    height: 385,
    width: "70.632%",
    alignSelf: "center"
  },
  textStyle: {
    alignSelf: "center",
    color: "#310E0E",
    fontFamily: "mont-bold",
    fontSize: 20,
    marginTop: "7%"
  }
});
