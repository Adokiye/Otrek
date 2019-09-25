/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  AsyncStorage,
  Alert,
  TouchableOpacity
} from "react-native";
import WelcomeScreen from "./components/WelcomeScreen";
import VerificationScreen from "./components/VerificationScreen"
import { createStackNavigator } from "react-navigation";
type Props = {};
const RootStack = createStackNavigator({
  Home: {
    screen: WelcomeScreen
  },
  WelcomeScreen: {
    screen: WelcomeScreen
  },
  VerificationScreen: {
    screen: VerificationScreen
  }
});

class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
            return (
                <View style={styles.container}>
                  <RootStack />
                </View>
            );
          }
}
export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  }
});


