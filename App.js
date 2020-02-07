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
import AcceptedInviteScreen from './components/InviteScreens/AcceptedInviteScreen'
import InviteScreen from './components/InviteScreens/InviteScreen'
import InvitingScreen from './components/InviteScreens/InvitingScreen'
import RejectedInviteScreen from './components/InviteScreens/RejectedInviteScreen'
import Splash from './components/Splash'
import SplashScreen from 'react-native-splash-screen';
import { createStackNavigator } from "react-navigation";
import { persistor, store } from "./store/index";
import { Provider } from "react-redux";
import type { Notification, NotificationOpen } from "react-native-firebase";
import { PersistGate } from 'redux-persist/es/integration/react';
import firebase from "react-native-firebase";
import AsyncStorage from '@react-native-community/async-storage';
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
    screen: Splash
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
      invite: false
    };
  }
  async componentDidMount() {
      const channel = new firebase.notifications.Android.Channel(
    'default',
    'Channel Name',
    firebase.notifications.Android.Importance.Max
  ).setDescription('A natural description of the channel');
  firebase.notifications().android.createChannel(channel);
  this.checkPermission();
  this.createNotificationListeners();
    SplashScreen.hide()
  }
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }
  async getToken() {
    let fcmToken = await AsyncStorage.getItem("fcmToken");
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem("fcmToken", fcmToken);
      }
    }
  }
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log("permission rejected");
    }
  }
  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
    clearTimeout(this.timeout);
  }
  async createNotificationListeners() {
    /*
     * Triggered when a particular notification has been received in foreground
     * */
    console.log("notification function");
    this.notificationListener = firebase.notifications().onNotification(notification => {
        console.log("received")
      const localNotification = new firebase.notifications.Notification({
        sound: 'default',
        show_in_foreground: true,
      })
          .setNotificationId(notification.notificationId)
          .setTitle(notification.title)
          .setSubtitle(notification.subtitle)
          .setBody(notification.body)
          .setData(notification.data)
           .ios.setBadge(notification.ios.badge)
          .android.setChannelId("default")
          .android.setPriority(firebase.notifications.Android.Priority.High)
          .android.setSmallIcon("@drawable/ic_stat_otrek")
          .android.setColor('#377848');
        firebase
          .notifications()
          .displayNotification(localNotification)
          .catch(err => console.error(err));
      });
  
    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
     * */
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        const { title, body } = notificationOpen.notification;
        // NavigationService.navigate("Orders", {
        //   // chatName: `${data.channelName}`,
        //   // chatId: `${data.channelId}`
        // });
   //     this.showAlert.bind(this, title, body);
      });
  
    /*
     * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
     * */
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
   //   this.showAlert.bind(this, title, body);
    }
    /*
     * Triggered for data only payload in foreground
     * */
    this.messageListener = firebase.messaging().onMessage(message => {
      console.log(JSON.stringify(message));
      //process data message
      if(message.title === 'Invite Accepted'){
        this.setState({
          invite: true
        }, ()=>
         this.showAccept.bind(this, message.receiver.first_name, message.receiver.image)
        )
        this.timeout = setTimeout(() => { 
          this.setState(() => ({invite: false}))
        }, 4000);
      }else if(message.title === 'Invite Rejected'){
        this.setState({
          invite: true
        }, ()=> this.showReject.bind(this, message.receiver.first_name, message.receiver.image)
        )
        this.timeout = setTimeout(() => { 
          this.setState(() => ({invite: false}))
        }, 4000);
       
      }else if(message.title === 'New Invite'){
        this.setState({
          invite: true
        }, ()=> this.showInvite.bind(this, message.receiver, message.sender, message.fire)
        )
        this.timeout = setTimeout(() => { 
          this.setState(() => ({invite: false}))
        }, 4000);

      }else if(message.title === 'Invite Cancelled'){

      }

    });
  }
  showReject(name, image){
    if(this.state.invite){
   return(
    <RejectedInviteScreen 
    receiver_image={image}
    receiver_first_name={name}
    />
   );
    }else{
      return null
    }

  }
  showAccept(name, image){
    if(this.state.invite){
    return(
    <AcceptedInviteScreen
          receiver_image={image}
    receiver_first_name={name}
    />
    )
    }else{
      return null
    }
  }
  showInvite(receiver, sender, fire){
    if(this.state.invite){
    return(
      <InviteScreen
        receiver={receiver}
        fire={fire}
        sender={sender}
      />
    )
    }else{
      return null
    }
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


