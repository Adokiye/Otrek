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
import _ from "lodash";
import firebase from "react-native-firebase";
import { GiftedChat } from "react-native-gifted-chat";
var db = firebase.firestore();
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
      regLoader: false,
      messages: [],
      fire: "",
      isTyping: false,
      oppTyping: false,
      lastId: ""
    };
    this.onSend = this.onSend.bind(this);
    this.isTyping = this.isTyping.bind(this);
    this.notTyping = this.notTyping.bind(this);
    this.detectTyping = this.detectTyping.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
  }
  /* onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }*/
  onSend(messages = []) {
    this.setState({ messageLoader: true });
    console.log(JSON.stringify(messages) + "\n");
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
    console.log("\n" + "to be sent" + " " + JSON.stringify(letSend) + "\n");
    fire = this.state.fire
      ? this.state.fire
      : this.props.token + "_" + this.props.receiver_email;
    var Ref = db.collection("messages").doc(fire);
    Ref.get().then(doc => {
      if (doc.exists) {
        //      console.log("doc exists " + "\n" + "\n" + "\n" + "\n" + "\n" + "\n");
        Ref.update({
          messages: firebase.firestore.FieldValue.arrayUnion(letSend)
        }).then(function() {}.bind(this));
      } else {
        // console.log(
        //   "doc not exists " + "\n" + "\n" + "\n" + "\n" + "\n" + "\n"
        // );
        Ref.set(
          {
            messages: [letSend]
          },
          { merge: true }
        ).then(function() {}.bind(this));
      }
    });
  }
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
  componentDidMount() {
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
                console.log(
                  JSON.stringify(this.state.messages) +
                    "\n" +
                    JSON.stringify(doc.data().messages)
                );
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
                  console.log(JSON.stringify(doc.data().messages[0]));
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
                  for (let i = 0; i < doc.data().messages.length; i++) {
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
              }
            }
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
                console.log(
                  JSON.stringify(this.state.messages) +
                    "\n" +
                    JSON.stringify(doc.data().messages)
                );
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
                  console.log(JSON.stringify(doc.data().messages[0]));
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
                  for (let i = 0; i < doc.data().messages.length; i++) {
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
              }
            }
          }
        }.bind(this)
      );
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
    value = "false";
    this.props.chatFalse(value);
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
        <TouchableOpacity onPress={this.goBack.bind(this)}>
          <View style={styles.cancelView}>
            <Image
              source={require("../../assets/images/cancel.png")}
              resizeMode="contain"
              style={styles.cancelImage}
            />
          </View>
        </TouchableOpacity>
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
        <LoaderModal regLoader={this.state.regLoader} />
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
    marginLeft: 10
  }
});
