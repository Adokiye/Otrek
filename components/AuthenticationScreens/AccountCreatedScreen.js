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
export default class AccountCreatedScreen extends Component {
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
        <View style={styles.houseView}>
          <Image
            source={require("../assets/images/check.png")}
            resizeMode="contain"
            style={styles.checkImage}
          />
          <Text style={styles.accountCreatedText}>Account Created</Text>
        </View>
      </View>
    );
  }
}
const dimensions = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#377848",
    alignItems: "center",
    justifyContent: "center"
  },
  houseView: {
    flexDirection: "column",
    alignItems: "center"
  },
  checkImage: {
    width: "50.67%",
    height: 187,
    alignSelf: "center"
  },
  accountCreatedText: {
    color: "#ffffff",
    fontFamily: "mont-bold",
    fontSize: 22,
    alignSelf: "center",
    marginTop: 33.53
  }
});
