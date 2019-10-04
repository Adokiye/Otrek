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
  TouchableWithoutFeedback,
  TouchableNativeFeedback
} from "react-native";
import { Overlay } from "react-native-elements";
export default class ErrorModal extends Component {
  static navigationOptions = {
    header: null,
    drawerLockMode: "locked-closed"
  };
  constructor(props) {
    super(props);
    this.state = {
      isVisible: true,
      error: true
    };
  }
  backer() {
    this.setState({ error: false });
  }
  hideErrorModal = () => {
    let value = "true"
    this.props.hideError(value);
  };
  render() {
    return (
      <Overlay
        isVisible={this.props.error&&this.state.error}
        onBackdropPress={this.backer.bind(this)}
        overlayBackgroundColor="white"
        borderRadius={8}
        width="auto"
        height="auto"
        containerStyle={styles.overlayStyle}
      >
        <View style={styles.errorView}>
          <Image
            resizeMode="contain"
            style={{ flex: 1 }}
            source={require("../../assets/images/warning.png")}
          />
        </View>
        <Text style={styles.oops}>Oops!</Text>
        <Text style={styles.messageText}>{this.props.error_message}</Text>
        <TouchableNativeFeedback
          onPress={this.hideErrorModal.bind(this)}
          background={TouchableNativeFeedback.Ripple("rgba(0,0,0,.1)",true)}
        >
          <View style={styles.submitBox}>
            <Text style={styles.submitText}>Okay</Text>
          </View>
        </TouchableNativeFeedback>
      </Overlay>
    );
  }
}
const styles = StyleSheet.create({
  errorView: {
    width: 45,
    height: 45,
    alignItems: "center",
    alignSelf: "center"
  },
  oops: {
    fontSize: 20,
    color: "black",
    fontFamily: "mont-reg",
    textAlign: "center",
    marginTop: 10
  },
  overlayStyle: {
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
    justifyContent: "space-evenly",
    position: "absolute"
  },
  messageText: {
    fontSize: 14,
    color: "black",
    fontFamily: "mont-reg",
    textAlign: "center",
    marginTop: 10
  },
  submitBox: {
    width: 91,
    height: 25,
    borderRadius: 5,
    backgroundColor: "#4CAC7E",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    alignSelf: 'center'
  },
  submitText: {
    color: "white",
    fontFamily: "mont-reg",
    fontSize: 14
  }
});
