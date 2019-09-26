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
export default class SideBar extends Component {
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
        
      </View>
    );
  }
}
const dimensions = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ffffff",
    alignItems: 'center'
  },
  image: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginTop: 30-StatusBar.currentHeight
  },
  name: {
      marginTop: 11,
      color: '#000000',
      fontFamily: 'mont-semi',
      fontSize: 20
  },
  viewProfile: {
      width: '100%',
      height: 1,
      backgroundColor: 'rgba(2, 0, 0, 0.6)',
      marginTop: 8
  },
  
});
