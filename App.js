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
import VerificationScreen from "./components/VerificationScreen";
import Map from "./components/Map";
import FindTrekkerBox from "./components/MapBoxes/FindTrekkerBox";
import LoginScreen from "./components/AuthenticationScreens/LoginScreen";
import RegisterScreen from "./components/AuthenticationScreens/RegisterScreen";
import AccountCreatedScreen from "./components/AuthenticationScreens/AccountCreatedScreen";
import AcceptedInviteScreen from "./components/InviteScreens/AcceptedInviteScreen";
import InviteScreen from "./components/InviteScreens/InviteScreen";
import InvitingScreen from "./components/InviteScreens/InvitingScreen";
import RejectedInviteScreen from "./components/InviteScreens/RejectedInviteScreen";
import Splash from "./components/Splash";
import SplashScreen from "react-native-splash-screen";
import { createStackNavigator, createAppContainer } from "react-navigation";
import NavigationService from './components/NavigationService';
import { persistor, store } from "./store/index";
import { Provider } from "react-redux";
import type { Notification, NotificationOpen } from "react-native-firebase";
import { PersistGate } from "redux-persist/es/integration/react";
import firebase from "react-native-firebase";
import AsyncStorage from "@react-native-community/async-storage";
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
  InviteScreen: {
    screen: InviteScreen
  },
  AcceptedInviteScreen: {
    screen: AcceptedInviteScreen
  },
  RejectedInviteScreen: {
    screen: RejectedInviteScreen
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
  }
});
const AppContainer = createAppContainer(RootStack);
class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      new_invite: false,
      accept_invite: false,
      reject_invite: false,
      cancel_invite: false,
      receiver: {},
      sender: {},
      fire: '',
      deviceToken: ''
    };
  }
  async componentDidMount() {
    const channel = new firebase.notifications.Android.Channel(
      "default",
      "Channel Name",
      firebase.notifications.Android.Importance.Max
    ).setDescription("A natural description of the channel");
    firebase.notifications().android.createChannel(channel);
    this.checkPermission();
    this.createNotificationListeners();
    SplashScreen.hide();
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
    this.messageListener();
    this.notificationOpenedListener();
    clearTimeout(this.timeout);
  }
  async createNotificationListeners() {
    /*
     * Triggered when a particular notification has been received in foreground
     * */
    console.log("notification function");
    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        console.log("data===>"+JSON.stringify(notification.data));

        console.log("received");
        const localNotification = new firebase.notifications.Notification({
          sound: "default",
          show_in_foreground: true
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
          .android.setColor("#377848");
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
        const notification = notificationOpen.notification;
   //     console.log(JSON.stringify(notificationOpen.notification))
        if (notification.data.title === "Invite Accepted") {
          this.setState(
            {
              accept_invite: true
            },
            () =>
            NavigationService.navigate("AcceptedInviteScreen", {
              // chatName: `${data.channelName}`,
              // chatId: `${data.channelId}`
            })
              // this.showAccept.bind(
              //   this,
              //   notification.data.receiver.first_name,
              //   notification.data.receiver.image
              // )
          );
          // this.timeout = setTimeout(() => {
          //   this.setState(() => ({ invite: false }));
          // }, 4000);
        } else if (notification.data.title === "Invite Rejected") {
          this.setState(
            {
              reject_invite: true 
            },
            () =>
            NavigationService.navigate("RejectedInviteScreen", {
              // chatName: `${data.channelName}`,
              // chatId: `${data.channelId}`
            })
              // this.showReject.bind(
              //   this,
              //   notification.data.first_name,
              //   notification.data.image
              // )
         );
          // this.timeout = setTimeout(() => {
          //   this.setState(() => ({ invite: false }));
          // }, 4000);
        } else if (notification.data.title === "New Invite") {
          console.log("new new!")
          this.setState(
            {
              new_invite: true,
              receiver: notification.data.receiver,
              sender: notification.data.sender
            },
            () =>
            NavigationService.navigate("InviteScreen", {
              // chatName: `${data.channelName}`,
              // chatId: `${data.channelId}`
            })
          );
          // this.timeout = setTimeout(() => {
          //   this.setState(() => ({ invite: false }));
          // }, 4000);
        } else if (notification.data.title === "Invite Cancelled") {
        }
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
      console.log(JSON.stringify(notificationOpen.notification))
      //   this.showAlert.bind(this, title, body);
    }
    /*
     * Triggered for data only payload in foreground
     * */
    this.messageListener = firebase.messaging().onMessage(message => {
      console.log("data===>"+JSON.stringify(message));
      //process data message
     
    });
  }
  showReject(name, image) {
    // if (this.state.invite) {
      NavigationService.navigate("Notification", {
        // chatName: `${data.channelName}`,
        // chatId: `${data.channelId}`
      });
      return (
        <RejectedInviteScreen
          receiver_image={image}
          receiver_first_name={name}
        />
      );
    // } else {
    //   return null;
    // }
  }
  showAccept =(name, image) => {
    if (this.state.invite) {
      return (
        <AcceptedInviteScreen
          receiver_image={image}
          receiver_first_name={name}
        />
      );
    } else {
      return null;
    }
  }
  showInvite = (receiver, sender, fire, deviceToken) => {
    // if (this.state.invite) {
    //   console.log("true  ")
      return (<InviteScreen receiver={receiver} 
      fire={fire} sender={sender} 
        deviceToken={deviceToken}
      />);
    // } else {
    //   console.log("false  ")
    //   return null;
    // }
  }
  render() {
    if(this.state.new_invite){

    }else if(this.state.accept_invite){

    }else if(this.state.reject_invite){

    }else{

    }
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <View style={styles.container}>
          <AppContainer  ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}/>
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
    backgroundColor: "#ffffff"
  }
});
