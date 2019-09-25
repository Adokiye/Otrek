/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  Image,
  Dimensions,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  TouchableWithoutFeedback
} from "react-native";
export default class VerificationScreen extends Component {
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
        <ScrollView>
          <Image
            source={require("../assets/images/message.png")}
            resizeMode="contain"
            style={styles.messageIcon}
          />
          <Text style={styles.verificationCode}>Verification Code</Text>
          <Text style={styles.ifVerification}>
            Verification code sent to{"\n"}Phone no 080xxxxxxx
          </Text>
          <Text style={styles.enterOtp}>ENTER OTP</Text>
          <View style={styles.boxforDash}>
            <View style={styles.dash}></View>
            <View style={styles.dash}></View>
            <View style={styles.dash}></View>
            <View style={styles.dash}></View>
          </View>
          <View style={styles.nextButton}>
            <Text style={styles.nextText}>Next</Text>
          </View>
        </ScrollView>
        <Image
          source={require("../assets/images/verificationBottom.png")}
          resizeMode="contain"
          style={styles.bottomImage}
        />
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
  bottomImage: {
    width: "100%",
    height: 105
  },
  messageIcon: {
    width: 173,
    height: 150,
    alignSelf: "center",
    marginTop: 67.5 + StatusBar.currentHeight
  },
  verificationCode: {
    marginTop: 21,
    alignSelf: "center",
    fontFamilily: "mont-bold",
    fontSize: 20,
    color: "#170101"
  },
  ifVerification: {
    alignSelf: "center",
    textAlign: "center",
    color: "#170101",
    fontSize: 13,
    fontFamily: "mont-medium",
    marginTop: 21
  },
  enterOtp: {
    alignSelf: "center",
    marginTop: 21,
    fontFamilily: "mont-bold",
    fontSize: 14,
    color: "#170101"
  },
  boxforDash: {
    width: "68%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 3,
    marginTop: 41,
    alignSelf: "center"
  },
  dash: {
    width: "22%",
    height: 2,
    backgroundColor: "#707070"
  },
  nextButton: {
    width: 61,
    height: 20,
    backgroundColor: "#56C391",
    alignSelf: "center",
    marginTop: 37,
    alignItems: "center",
    justifyContent: "center"
  },
  nextText: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "mont-bold"
  }
});
