/* eslint-disable prettier/prettier */
/* eslint-disable comma-dangle */
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
  ActivityIndicator
} from "react-native";
import firebase from "react-native-firebase";
import LoaderModal from "../Modals/LoaderModal";
import LinearGradient from "react-native-linear-gradient";
import { firebaseApiKey } from "../../config/firebase.js";
var db = firebase.firestore();
import { connect } from "react-redux";
const mapStateToProps = state => ({
  ...state
});

class reduxInviteScreen extends Component {
  static navigationOptions = {
    header: null,
    drawerLockMode: "locked-closed"
  };
  constructor(props) {
    super(props);
    this.state = {
      regLoader: false,
      fire: "",
      sender: {},
      receiver: {}
    };
  }
  componentDidMount() {
    this.setState({ regLoader: true });
    const { params } = this.props.navigation.state;
    this.setState(
      {
        receiver: params.receiver,
        sender: params.sender,
        fire: params.fire,
        deviceToken: params.deviceToken
      },
      () => this.setState({ regLoader: false })
    );
  }
  sendPushNotification = async (title, body, token, image, interests) => {
    const { params } = this.props.navigation.state;
    const FIREBASE_API_KEY = firebaseApiKey;
    const message = {
      to: params.deviceToken ? params.deviceToken : "token",
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
        token: token,
        receiver: params.sender,
        sender: params.receiver,
        fire: this.state.fire,
        receiver_first_name: params.sender_first_name,
        receiver_start_location: params.sender_start_location,
        receiver_image: params.sender_image
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
    console.log(response);
    this.setState({ regLoader: false });
  };
  accept() {
    this.setState({ regLoader: true });
    const { params } = this.props.navigation.state;
    var Ref = db.collection("invites").doc(this.state.fire);
    db.collection("users")
      .doc(params.receiver_email)
      .get()
      .then(user_doc => {
        if (user_doc.data().invite.isInvited) {
          this.props.navigation.pop("Map", {
            message: {message: "User is not available", status: 'danger'}
          });
        } else {
          Ref.get().then(doc => {
            if (doc.exists) {
              console.log(
                "doc exists " + "\n" + "\n" + "\n" + "\n" + "\n" + "\n"
              );
              Ref.update({
                accept: true,
                reject: false,
                invite: false,
                sender: {
                  email: params.receiver_email
                }
              }).then(
                async function() {
                  this.sendPushNotification(
                    "Invite Accepted",
                    params.sender_first_name + " accepted your invite"
                  );
                  this.props.navigation.pop("Map", {
                    invite: true,
                    chosen: true,
                    receiver: params.receiver,
                    deviceToken: params.deviceToken,
                    start_location: params.receiver_start_location
                  });
                }.bind(this)
              );
            } else {
              console.log(
                "doc not exists " + "\n" + "\n" + "\n" + "\n" + "\n" + "\n"
              );
              Ref.set(
                {
                  accept: true,
                  reject: false,
                  invite: false,
                  sender: {
                    email: params.receiver_email
                  }
                },
                { merge: true }
              ).then(
                async function() {
                  await this.sendPushNotification(
                    "Invite Accepted",
                    params.sender_first_name + " accepted your invite"
                  );
                  this.props.navigation.pop("Map", {
                    invite: true,
                    chosen: true,
                    receiver: params.receiver,
                    deviceToken: params.deviceToken,
                    start_location: params.receiver_start_location
                  });
                }.bind(this)
              );
            }
          });
        }
      });
  }
  reject() {
    this.setState({ regLoader: true });
    const { params } = this.props.navigation.state;
    var Ref = db.collection("invites").doc(this.state.fire);
    Ref.get().then(doc => {
      if (doc.exists) {
        console.log("doc exists " + "\n" + "\n" + "\n" + "\n" + "\n" + "\n");
        Ref.update({
          accept: false,
          reject: true,
          invite: false,
          sender: {
            email: params.receiver_email
          }
        }).then(
          function() {
            this.sendPushNotification(
              "Invite Rejected",
              params.sender_first_name + " has rejected your invite"
            );
          }.bind(this)
        );
      } else {
        console.log(
          "doc not exists " + "\n" + "\n" + "\n" + "\n" + "\n" + "\n"
        );
        Ref.set(
          {
            accept: false,
            reject: true,
            invite: false,
            sender: {
              email: params.receiver_email
            }
          },
          { merge: true }
        ).then(
          function() {
            this.sendPushNotification(
              "Invite Rejected",
              params.sender_first_name + " has rejected your invite"
            );
          }.bind(this)
        );
      }
    });
  }
  render() {
    const { params } = this.props.navigation.state;
    // console.log(params.receiver[0].first_name)
    console.log(params.receiver_first_name + "j");
    //   console.log(JSON.parse(JSON.stringify(params.receiver.first_name)))
    return (
      <LinearGradient colors={["#57C693", "#377848"]} style={styles.container}>
        <View style={styles.houseView}>
          <View style={styles.checkImageView}>
            <Image
              source={{ uri: params.receiver_image }}
              resizeMode="cover"
              style={styles.checkImage}
            />
          </View>
          <Text style={styles.accountCreatedText}>
            {params.receiver_first_name} {params.receiver_last_name}
          </Text>
          <Text style={styles.invitingText}>
            is inviting you to be{" "}
            {params.receiver_gender == "M" ? "his" : "her"} trekpal
          </Text>
          <TouchableOpacity onPress={this.accept.bind(this)}>
            <View style={styles.acceptView}>
              <Text style={styles.acceptText}>Accept</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.reject.bind(this)}>
            <View style={styles.rejectView}>
              <Text style={styles.rejectText}>Reject</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.interestText}>
            Interests: {params.receiver_interests}
          </Text>
        </View>
        <LoaderModal regLoader={this.state.regLoader} />
      </LinearGradient>
    );
  }
}
const InviteScreen = connect(mapStateToProps)(reduxInviteScreen);
export default InviteScreen;
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0
  },
  houseView: {
    flexDirection: "column",
    alignItems: "center"
  },
  checkImage: {
    width: 132,
    height: 132,
    alignSelf: "center",
    borderRadius: 66
  },
  checkImageView: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white"
  },
  accountCreatedText: {
    color: "#ffffff",
    fontFamily: "mont-bold",
    fontSize: 20,
    alignSelf: "center",
    marginTop: 30
  },
  rejectView: {
    backgroundColor: "#B70000",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: 140,
    height: 37,
    marginTop: 15
  },
  rejectText: {
    color: "#000",
    fontSize: 13,
    fontFamily: "mont-semi"
  },
  acceptView: {
    backgroundColor: "#29E934",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: 140,
    height: 37,
    marginTop: 30
  },
  acceptText: {
    color: "#000",
    fontSize: 13,
    fontFamily: "mont-semi"
  },
  invitingText: {
    color: "#ffffff",
    fontFamily: "mont-bold",
    fontSize: 16,
    alignSelf: "center",
    marginBottom: 20
  },
  interestText: {
    marginTop: 15,
    color: "#fff",
    fontFamily: "mont-italic",
    fontSize: 16,
    alignSelf: "center"
  }
});
