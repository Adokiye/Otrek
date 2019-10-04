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
export default class InviteScreen extends Component {
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
            source={require("../../assets/images/check.png")}
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
  },
   inviteeView: {
       width: 167,
       height: 167,
       borderWidth: 2,
       borderColor: '#ffffff',
       alignSelf: 'center',
       marginTop:  82- StatusBar.currentHeight,
       borderRadius: 83.5,
       alignItems: 'center',
       justifyContent: 'center'
   },
   inviteeImage: {
       width: 165,
       height: 165,
       alignSelf: 'center',
       borderRadius: 82.5
   },
   name: {
       marginTop: 24,
       alignSelf: 'center',
       color: '#ffffff',
       fontSize: 20,
       fontFamily: 'mont-bold'
   },
   isInviting: {
       color: '#fffffff',
       alignSelf: 'center',
       fontFamily: 'mont-semi',
       fontSize: 11
   },
   acceptView: {
    alignSelf: 'center',
   alignItems: 'center',
   justifyContent: 'center',
   backgroundColor: '#36FF3E',
   borderRadius: 6,
   marginTop: 25
   },
    acceptText: {
    color: '#454040',
    fontFamily: 'mont-semi',
    fontSize: 11
    },
    rejectView: {
        alignSelf: 'center',
       alignItems: 'center',
       justifyContent: 'center',
       backgroundColor: '#EB4848',
       borderRadius: 6,
       marginTop: 16
       },
        acceptText: {
        color: '#454040',
        fontFamily: 'mont-semi',
        fontSize: 11
        },
        interests: {
            marginTop: 16,
            fontSize: 10,
            fontFamily: 'mont-medium-italic',
            color: '#ffffff'
        }
});
