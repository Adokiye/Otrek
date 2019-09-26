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
export default class WelcomeScreen extends Component {
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
        <Text style={styles.welcomeText}>Welcome!</Text>
        <View style={styles.numberField}>
          <TextInput
            underlineColorAndroid={"transparent"}
            allowFontScaling={false}
            placeholder="+234"
            placeholderStyle={{ fontSize: 16, fontFamily: "mont-reg" }}
            placeholderTextColor="#707070"
            style={styles.numberTextInput}
          />
        </View>
        <TouchableOpacity onPress={()=>this.props.navigation.navigate('VerificationScreen')}>
        <View style={styles.sendOtpButton}>
          <Text style={styles.otpText}>Send OTP</Text>
        </View></TouchableOpacity>
        </ScrollView>
        <Image
          source={require("../assets/images/welcomeBottom.png")}
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
  welcomeText: {
    alignSelf: "center",
    fontSize: 40,
    fontFamily: "mont-bold",
    color: "#3E3535",
    marginTop: 123 + StatusBar.currentHeight
  },
  numberField: {
    alignSelf: "center",
    width: "68%",
    height: 34,
    borderWidth: 1,
    borderColor: "#707070",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 68
  },
  numberTextInput: {
    width: "100%",
    height: 32,
    paddingLeft: 9,
    fontFamily: "mont-reg",
    color: "#707070",
    fontSize: 16,
    backgroundColor: "#ffffff"
  },
  sendOtpButton: {
    width: "68%",
    height: 34,
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: "#56C391",
    alignItems: "center",
    justifyContent: "center"
  },
  otpText: {
    alignSelf: "center",
    fontSize: 15,
    color: "#ffffff",
    fontFamily: "mont-bold"
  },
  bottomImage: {
    width: "100%",
    height: 188
  }
});
