/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { StyleSheet, Text, Image, View, TouchableOpacity } from "react-native";
export default class Onboarding3 extends Component {
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
          source={require("../assets/images/onb3Both.png")}
          resizeMode="contain"
          style={styles.topImage}
        />
        <Text style={styles.textStyle}>Be on the move</Text>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("RegisterScreen")}
        >
          <Text>Get Started</Text>
        </TouchableOpacity>
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
    height: 310.5,
    width: "80.67%",
    alignSelf: "center"
  },
  textStyle: {
    alignSelf: "center",
    color: "#310E0E",
    fontFamily: "mont-bold",
    fontSize: 20,
    marginTop: "7%"
  },
  getStartedTextStyle: {
    alignSelf: "center",
    color: "#310E0E",
    fontFamily: "mont-reg",
    fontSize: 20,
    marginTop: 10
  }
});
