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
import { Overlay } from "react-native-elements";
export default class CompletedTrekModal extends Component {
  static navigationOptions = {
    header: null,
    drawerLockMode: "locked-closed"
  };
  constructor(props) {
    super(props);
    this.state = {
      isVisible: true
    };
  }
  backer() {
    this.setState({ isVisible: false });
  }
  render() {
    return (
      <Overlay
        isVisible={this.props.submit}
        onBackdropPress={this.backer.bind(this)}
        overlayBackgroundColor="white"
        borderRadius={8}
        width="auto"
        height="auto"
        containerStyle={styles.overlayStyle}
      >
        <Text style={styles.completedText}>Completed!</Text>
        <Text style={styles.meterText}>Meter:20.80 Steps Taken:3000</Text>
        <Image
          source={require("../../assets/images/doe_image.png")}
          resizeMode="contain"
          style={styles.image}
        />
        <Text style={styles.rateText}>Rate your Trekpal!</Text>
        <View style={styles.commentBox}>
          <TextInput
            underlineColorAndroid={"transparent"}
            allowFontScaling={false}
            multiline={true}
            placeholder="Email"
            placeholderStyle={{ fontSize: 8, fontFamily: "mont-medium-italic" }}
            placeholderTextColor="#000000"
            style={styles.commentTextInput}
          />
        </View>
        <View style={styles.submitBox}>
          <Text styles={styles.submitText}>Submit</Text>
        </View>
      </Overlay>
    );
  }
}
const styles = StyleSheet.create({
  overlayStyle: {
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
    justifyContent: "space-evenly",
    position: "absolute"
  },
  completedText: {
    alignSelf: "center",
    fontSize: 40,
    color: "#000000",
    fontFamily: "mont-bold"
  },
  meterText: {
    fontFamily: "mont-bold",
    fontSize: 10,
    color: "#000000"
  },
  image: {
    width: 52,
    height: 52,
    borderRadius: 26
  },
  rateText: {
    color: "#000000",
    fontFamily: "mont-bold",
    fontSize: 10
  },
  commentBox: {
    height: 42,
    width: "72.267%",
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#707070",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff"
  },
  commentTextInput: {
    width: "100%",
    fontFamily: "mont-medium-italic",
    fontSize: 8,
    color: "#000000",
    paddingLeft: 8
  },
  submitBox: {
    width: 91,
    height: 18,
    borderRadius: 5,
    backgroundColor: "#4CAC7E",
    alignItems: "center",
    justifyContent: "center"
  },
  submitText: {
    color: "#ffffff",
    fontFamily: "mont-bold",
    fontSize: 8
  }
});
