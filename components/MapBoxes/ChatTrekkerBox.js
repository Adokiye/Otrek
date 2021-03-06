/* eslint-disable comma-dangle */
/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component, Fragment } from "react";
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
  ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import _ from "lodash";
import firebase from "react-native-firebase";
import { GiftedChat } from "react-native-gifted-chat";
var db = firebase.firestore();
import { firebaseApiKey } from "../../config/firebase.js";
// const fs = require('fs');
const haversine = require("haversine");
import LoaderModal from "../Modals/LoaderModal";
import { connect } from "react-redux";
const mapStateToProps = state => ({
  ...state
});
class reduxChatTrekkerBox extends Component {
  static navigationOptions = {
    header: null,
    drawerLockMode: "locked-closed"
  };
  constructor(props) {
    super(props);
    this.state = {
      trekkers: [],
      regLoader: true,
      messages: [],
      fire: "",
      isTyping: false,
      oppTyping: false,
      x: true,
      lastId: "",
      fcmToken: "",
      receiver_email: ''
    };
    this.onSend = this.onSend.bind(this);
    this.isTyping = this.isTyping.bind(this);
    this.notTyping = this.notTyping.bind(this);
    this.detectTyping = this.detectTyping.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
  }
  onSend(messages = []) {
    let fire;
    this.setState({ messageLoader: true });
    messages[0].sent = true;
    messages[0].received = false;
    messages[0].delivered = false;
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
    // const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    var letSend = {
      _id: Math.round(Math.random() * 100000),
      text: messages[0].text,
      createdAt: messages[0].createdAt,
      user: {
        _id: this.props.token
      },
      sent: true,
      received: false,
      delivered: false
    };
    fire = this.state.fire
      ? this.state.fire
      : this.props.token + "_" + this.props.receiver_email;
    var Ref = db.collection("messages").doc(fire);
    Ref.get().then(doc => {
      if (doc.exists) {
        //      console.log("doc exists " + "\n" + "\n" + "\n" + "\n" + "\n" + "\n");
        Ref.update({
          messages: firebase.firestore.FieldValue.arrayUnion(letSend)
        }).then(
          function() {
            this.sendPushNotification(
              "New Message",
              this.props.user_name + ": " + messages[0].text
            );
          }.bind(this)
        );
      } else {
        // console.log(
        //   "doc not exists " + "\n" + "\n" + "\n" + "\n" + "\n" + "\n"
        // );
        Ref.set(
          {
            messages: [letSend]
          },
          { merge: true }
        ).then(
          function() {
            this.sendPushNotification(
              "New Message",
              this.props.user_name + ": " + messages[0].text
            );
          }.bind(this)
        );
      }
    });
  }
  sendPushNotification = async (title, body) => {
    const FIREBASE_API_KEY = firebaseApiKey;
    console.log("here!!!" + FIREBASE_API_KEY);
    const message = {
      to: this.props.deviceToken ? this.props.deviceToken : "token",
      notification: {
        title: title,
        body: body,
        vibrate: 1,
        sound: 1,
        show_in_foreground: true,
        priority: "high",
        content_available: true
      },
      data: {
        title: title,
        body: body,
        receiver: this.props.receiver,
        user_name: this.props.user_name,
        //      sender: this.props.receiver,
        deviceToken: this.state.fcmToken,
        fire: this.state.fire
      }
    };

    let response = await fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "key=" + FIREBASE_API_KEY
      },
      body: JSON.stringify(message)
    });
    response = await response.text();
    console.log(JSON.stringify(response) + "chat");
  };
  componentWillMount() {
    var self = this;
    // this.init is fix as the indicator would run when the app mounts
    this.init = false;
    this.startTyping = _.debounce(
      function() {
        if (!this.init) return;
        self.setState({ isTyping: true });
      },
      500,
      { leading: true, trailing: false }
    );

    this.stopTyping = _.debounce(function() {
      if (!this.init) return;
      self.setState({ isTyping: false });
    }, 500);
  }
  detectTyping(text) {
    if (text != "") {
      this.init = true;
      this.startTyping();
      this.stopTyping();
    }
  }
  async componentDidMount() {
    this.setState({receiver_email: this.props.receiver_email})
    console.log(this.props.receiver_email);

    await this.checkPermission();
  this.getMessages();

  }

   getMessages = () => {
     if(this.state.receiver_email !== this.props.receiver_email){
            this.setState({regLoader: true})
     }
     console.log("trust trust!!!")
    db.collection("messages")
      .doc(this.props.token + "_" + this.props.receiver_email)
      .onSnapshot(
        function(doc) {
          if (doc.data()) {
            this.setState({
              fire: this.props.token + "_" + this.props.receiver_email
            });
            //     console.log(doc.data()[this.props.receiver_id]);
            this.setState({ oppTyping: doc.data()[this.props.receiver_id] });
            //         console.log("Current data: ", doc.data());
            if (doc.data().messages) {
              let len = doc.data().messages.length;
              if (this.state.messages.length >= 1) {
                let state_length = this.state.messages.length;
                doc.data().messages = doc.data().messages.reverse();
                if (
                  this.state.messages[state_length - 1]._id !=
                    doc.data().messages[0]._id &&
                  doc.data().messages[0]._id != this.state.lastId &&
                  state_length < doc.data().messages.length
                ) {
                  this.setState({ lastId: doc.data().messages[0]._id });
                  console.log(this.state.messages.length + " :messages length");
                  console.log(
                    doc.data().messages.length + " :doc-messages length"
                  );
                  doc.data().messages[0].createdAt = doc
                    .data()
                    .messages[0].createdAt.toDate();
                  this.setState(previousState => ({
                    messages: GiftedChat.append(
                      previousState.messages,
                      doc.data().messages[0]
                    )
                  }));

                } else {
                  console.log("else ");
                  for (let i = doc.data().messages.length - 1; i < 0; i--) {
                    let messages = [...this.state.messages];
                    let message = { ...messages[i] };
                    message.received = doc.data().messages[i].received;
                    messages[i] = message;
                    this.setState({ messages });
                  }
                }
              } else {
                for (let i = 0; i < len; i++) {
                  let sender_check = doc.data().messages[i].user._id;
                  if (sender_check != this.props.token) {
                    doc.data().messages[i].received = true;
                  }
                  doc.data().messages[i].createdAt = doc
                    .data()
                    .messages[i].createdAt.toDate();
                }
                this.setState(
                  previousState => ({
                    messages: GiftedChat.append(
                      previousState.messages,
                      doc.data().messages.reverse()
                    )
                  }),
                  () => console.log(this.state.messages)
                );
                this.setState({regLoader: false});
              }
            }
          }else{
            this.setState({x: false})
          }
        }.bind(this)
      );
    db.collection("messages")
      .doc(this.props.receiver_email + "_" + this.props.token)
      .onSnapshot(
        function(doc) {
          if (doc.data()) {
            this.setState({
              fire: this.props.receiver_email + "_" + this.props.token
            });
            //     console.log(doc.data()[this.props.receiver_id]);
            this.setState({ oppTyping: doc.data()[this.props.receiver_id] });
            //         console.log("Current data: ", doc.data());
            if (doc.data().messages) {
              let len = doc.data().messages.length;
              if (this.state.messages.length >= 1) {
                let state_length = this.state.messages.length;
                doc.data().messages = doc.data().messages.reverse();
                if (
                  this.state.messages[state_length - 1]._id !=
                    doc.data().messages[0]._id &&
                  doc.data().messages[0]._id != this.state.lastId &&
                  state_length < doc.data().messages.length
                ) {
                  this.setState({ lastId: doc.data().messages[0]._id });
                  console.log(this.state.messages.length + " :messages length");
                  console.log(
                    doc.data().messages.length + " :doc-messages length"
                  );
                  doc.data().messages[0].createdAt = doc
                    .data()
                    .messages[0].createdAt.toDate();
                  this.setState(previousState => ({
                    messages: GiftedChat.append(
                      previousState.messages,
                      doc.data().messages[0]
                    )
                  }));
                } else {
                  console.log("else ");
                  for (let i = doc.data().messages.length - 1; i < 0; i--) {
                    let messages = [...this.state.messages];
                    let message = { ...messages[i] };
                    message.received = doc.data().messages[i].received;
                    messages[i] = message;
                    this.setState({ messages });
                  }
                }
              } else {
                for (let i = 0; i < len; i++) {
                  let sender_check = doc.data().messages[i].user._id;
                  if (sender_check != this.props.token) {
                    doc.data().messages[i].received = true;
                  }
                  doc.data().messages[i].createdAt = doc
                    .data()
                    .messages[i].createdAt.toDate();
                }
                this.setState(
                  previousState => ({
                    messages: GiftedChat.append(
                      previousState.messages,
                      doc.data().messages.reverse()
                    )
                  }),
                  () => console.log(this.state.messages)
                );
                this.setState({regLoader: false});
              }
            }
          }else{
            if(!this.state.x){
              this.setState({regLoader: false})
            }
          }
        }.bind(this)
      );
   }
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      console.log("enabled");
      this.getToken();
    } else {
      console.log("unenabled");
      this.requestPermission();
    }
  }

  //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem("fcmToken");
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        this.setState({ fcmToken });
        console.log(fcmToken);
        await AsyncStorage.setItem("fcmToken", fcmToken);
      } else {
        console.log("\n" + "\n" + "no token" + "\n" + "\n");
      }
    } else {
      console.log("here");
      this.setState({ fcmToken });
      console.log(fcmToken);
    }
  }

  //2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      console.log("admin authorised");
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log("permission rejected");
    }
  }

  renderFooter() {
    if (this.state.oppTyping)
      return (
        <Text style={{ marginBottom: 10, fontFamily: "mont-light-italic" }}>
          {this.props.receiver_id} is typing
        </Text>
      );
    else {
      return null;
    }
  }
  goBack() {
    this.props.chatFalse("false");
  }
  isTyping() {
    //   console.log("here " + this.props.received);
    fire = this.state.fire
      ? this.state.fire
      : this.props.token + "_" + this.props.receiver_email;
    var Ref = db.collection("messages").doc(fire);
    Ref.get().then(doc => {
      if (doc.exists) {
        //console.log("doc exists " + "\n" + "\n" + "\n" + "\n" + "\n" + "\n");
        Ref.update({ [this.props.first_name]: true }).then(
          function() {}.bind(this)
        );
      } else {
        // console.log(
        //   "doc not exists " + "\n" + "\n" + "\n" + "\n" + "\n" + "\n"
        // );
        Ref.set(
          {
            [this.props.first_name]: true
          },
          { merge: true }
        ).then(function() {}.bind(this));
      }
    });
  }
  componentDidUpdate() {
    if (this.state.isTyping) {
      //   console.log("is typing fn");
      this.isTyping();
    } else {
      //  console.log("not typing fn");
      this.notTyping();
    }
    if(this.props.update){
     this.getMessages();
     this.props.updateFalse();
    }
  }
  notTyping() {
    fire = this.state.fire
      ? this.state.fire
      : this.props.token + "_" + this.props.receiver_email;
    var Ref = db.collection("messages").doc(fire);
    Ref.get().then(doc => {
      if (doc.exists) {
        // console.log("doc exists " + "\n" + "\n" + "\n" + "\n" + "\n" + "\n");
        Ref.update({ [this.props.first_name]: false }).then(
          function() {}.bind(this)
        );
      } else {
        // console.log(
        //   "doc not exists " + "\n" + "\n" + "\n" + "\n" + "\n" + "\n"
        // );
        Ref.set(
          {
            [this.props.first_name]: false
          },
          { merge: true }
        ).then(function() {}.bind(this));
      }
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.goBack.bind(this)}
                    hitSlop={{ left: 2, right: 2, top: 2, bottom: 2 }}
                    activeOpacity={0.7}>
          <View style={styles.cancelView}>
            <Image
              source={require("../../assets/images/cancel.png")}
              resizeMode="contain"
              style={styles.cancelImage}
            />
          </View>
        </TouchableOpacity>
        {this.state.regLoader ?
        <ActivityIndicator color={'#1bc47d'} size={'large'} />
        :
                <Fragment>
        <View style={styles.firstView}>
          <Image
            source={{ uri: this.props.receiver_image }}
            resizeMode="cover"
            style={styles.profileImage}
          />
          <Text style={styles.name}>{this.props.receiver_name}</Text>
        </View>
          <GiftedChat
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            extraData={this.state}
            user={{
              _id: this.props.token
            }}
            onInputTextChanged={this.detectTyping}
            renderFooter={this.renderFooter}
          />
</Fragment>
        }

      </View>
    );
  }
}
const ChatTrekkerBox = connect(mapStateToProps)(reduxChatTrekkerBox);
export default ChatTrekkerBox;
const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    height: "80%",
    width: "100%",
    borderTopLeftRadius: 40,
    borderWidth: 1,
    borderColor: "#707070",
    position: "absolute",
    bottom: 0
  },
  giftedChat: {
    width: "100%",
    //  height: '90%',
    marginTop: 8,
    alignSelf: "center"
  },
  cancelView: {
    width: 20,
    height: 20,
    marginLeft: "6%",
    marginTop: 11.03
  },
  cancelImage: {
    flex: 1
  },
  firstView: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    width: "90%",
    height: 75,
    marginTop: 15
  },
  profileImage: {
    height: 75,
    width: 75,
    borderRadius: 37.5,
    marginLeft: "7%"
  },
  name: {
    color: "#000000",
    fontFamily: "mont-bold",
    fontSize: 20,
    marginLeft: 10,
    flex: 1,
    flexWrap: 'wrap'
  }
});
