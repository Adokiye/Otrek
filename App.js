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
import Map from "./components/Map"
import FindTrekkerBox from './components/MapBoxes/FindTrekkerBox'
import LoginScreen from './components/AuthenticationScreens/LoginScreen'
import RegisterScreen from './components/AuthenticationScreens/RegisterScreen'
import AccountCreatedScreen from './components/AuthenticationScreens/AccountCreatedScreen'
import Splash from './components/Splash'
import SplashScreen from 'react-native-splash-screen';
import { createStackNavigator } from "react-navigation";
import { persistor, store } from "./store/index";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/es/integration/react';
import FirstTrekkerBox from "./components/MapBoxes/FirstTrekkerBox";
//import { setToken, setType } from "./actions/index";
/*const mapStateToProps = state => ({
  ...state
});
const mapDispatchToProps = dispatch => {
  return {
    setToken: token => dispatch(setToken(token)),
    setType: type => dispatch(setType(type))
  };
}; */
type Props = {};
const RootStack = createStackNavigator({
  Home: {
    screen:  Splash
  },
  WelcomeScreen: {
    screen: WelcomeScreen
  },
  VerificationScreen: {
    screen: VerificationScreen
  },
  Map: {
    screen: Map
  },
  FindTrekkerBox: {
    screen: FindTrekkerBox
  },
  AccountCreatedScreen: {
    screen: AccountCreatedScreen
  },
  RegisterScreen: {
    screen: RegisterScreen
  },
  LoginScreen: {
    screen: LoginScreen
  },
});

class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
    SplashScreen.hide()
  }
  render() {
            return (
              <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <View style={styles.container}>
                  <RootStack />
                </View>
                </PersistGate>
                </Provider>
            );
          }
}
/*function connectWithStore(store, WrappedComponent, ...args) {
  var ConnectedWrappedComponent = connect(...args)(WrappedComponent);
  return function(props) {
    return <ConnectedWrappedComponent {...props} store={store} />;
  };
}*/
/*const App = connectWithStore(
  store,
  reduxApp,
  mapStateToProps,
 // mapDispatchToProps
);*/
export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  }
});


