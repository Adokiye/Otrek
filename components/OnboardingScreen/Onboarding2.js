/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { StyleSheet, Text, Image, Dimensions, View } from "react-native";
export default class Onboarding2 extends Component {
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
          source={require("../assets/images/onb2.png")}
          resizeMode="contain"
          style={styles.topImage}
        />
        <Text style={styles.textStyle}>Select a Trekpal</Text>
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
    height: 353.98,
    width: "80.83%",
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
