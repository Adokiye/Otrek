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
export default class FindTrekkerBox extends Component {
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
        <View style={styles.textInputView}>
          <View style={styles.greenCircle}></View>
          <TextInput
            underlineColorAndroid={"transparent"}
            allowFontScaling={false}
            placeholder="Start"
            placeholderStyle={{ fontSize: 14, fontFamily: "mont-medium" }}
            placeholderTextColor="#000000"
            style={styles.textInput}
          />
        </View>
        <View style={styles.textInputView}>
          <View style={styles.redCircle}></View>
          <TextInput
            underlineColorAndroid={"transparent"}
            allowFontScaling={false}
            placeholder="End"
            placeholderStyle={{ fontSize: 14, fontFamily: "mont-medium" }}
            placeholderTextColor="#000000"
            style={styles.textInput}
          />
        </View>
        <View style={styles.findTrekkerButton}>
          <Text style={styles.findTrekkerText}>Find Trekker</Text>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    height: 226,
    width: "100%",
    borderTopLeftRadius: 40,
    borderWidth: 1,
    borderColor: "#707070",
    alignItems: "center",
    justifyContent: "space-around"
  },
  textInputView: {
    width: "60.267%",
    height: 32,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#707070",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "center"
  },
  textInput: {
    width: "89%",
    height: 30,
    color: "#000000",
    fontSize: 14,
    fontFamily: "mont-medium"
  },
  redCircle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FF0000"
  },
  circleView: {
    width: "11%",
    height: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  greenCircle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#55C18E"
  },
  findTrekkerButton: {
    height: 36,
    borderRadius: 9,
    alignSelf: "center",
    backgroundColor: "#55C18E",
    width: "60.267%",
    alignItems: "center",
    justifyContent: "center"
  },
  findTrekkerText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "mont-bold"
  }
});
