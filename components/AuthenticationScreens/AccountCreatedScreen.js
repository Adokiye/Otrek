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
import LinearGradient from 'react-native-linear-gradient';
export default class AccountCreatedScreen extends Component {
  static navigationOptions = {
    header: null,
    drawerLockMode: "locked-closed"
  };
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    setTimeout(
      function() {
          this.props.navigation.navigate('Map');
      }
      .bind(this),
      2000
  );
  }
  render() {
    return (
      <LinearGradient colors={['#57C693', '#377848']} style={styles.container}>
        <View style={styles.houseView}>
          <Image
            source={require("../../assets/images/check.png")}
            resizeMode="contain"
            style={styles.checkImage}
          />
          <Text style={styles.accountCreatedText}>Account Created</Text>
        </View>
        </LinearGradient>
    );
  }
}
const dimensions = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  houseView: {
    flexDirection: "column",
    alignItems: "center"
  },
  checkImage: {
    width: 200,
    height: 200,
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
