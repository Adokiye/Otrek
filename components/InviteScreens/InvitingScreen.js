/* eslint-disable quotes */
/* eslint-disable keyword-spacing */
/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable prettier/prettier */
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
import LinearGradient from "react-native-linear-gradient";
import CancelModal from "../Modals/CancelModal";
import LoaderModal from "../Modals/LoaderModal";
import ErrorModal from "../Modals/ErrorModal";
import { Overlay } from "react-native-elements";
import firebase from "react-native-firebase";
import { firebaseApiKey } from "../../config/firebase.js";
var db = firebase.firestore();
import { connect } from "react-redux";
const mapStateToProps = state => ({
  ...state
});

class reduxInvitingScreen extends Component {
  static navigationOptions = {
    header: null,
    drawerLockMode: "locked-closed"
  };
  constructor(props) {
    super(props);
    this.state = {
      regLoader: false,
      error: false,
      error_message: "",
      sure: false,
      fire: "",
      cancelLoader: false,
      deviceToken: ""
    };
  }
  sendPushNotification = async (title, body, token, image, interests) => {
    const FIREBASE_API_KEY = firebaseApiKey;
    console.log("here!!!"+FIREBASE_API_KEY)    
      console.log(this.props.receiver.deviceToken+"toks")
    const message = {

      to: this.props.deviceToken?this.props.deviceToken:"token",
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
    //    receiver: this.props.user,
        receiver_first_name: this.props.user.first_name,
receiver_last_name: this.props.user.last_name,
receiver_email: this.props.user.email,
receiver_interests: this.props.user.interests,
receiver_image: this.props.user.image,
receiver_gender: this.props.user.gender,
sender_first_name: this.props.receiver.first_name,
sender_image: this.props.receiver.image,
  //      sender: this.props.receiver,
        deviceToken: this.props.user_d_t,
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
    console.log(JSON.stringify(response)+"sdssd");
    if (title === "Invite Cancelled") {
      this.props.hideInvite("false");
      this.setState({ cancelLoader: false });
    } else {
      this.setState({ regLoader: false });
    }
  };
  componentDidMount() {
    this.setState({ regLoader: true });
    var Ref = db
      .collection("invites")
      .doc(this.props.token + "_" + this.props.receiver_email);
    var VRef = db
      .collection("invites")
      .doc(this.props.receiver_email + "_" + this.props.token);
    Ref.get().then(doc => {
      if (doc.exists) {
        this.setState({
          fire: this.props.token + "_" + this.props.receiver_email
        });
        console.log("doc exists " + "\n" + "\n" + "\n" + "\n" + "\n" + "\n");
        Ref.update({
          invite: true,
          reject: false,
          accept: false,
          sender: {
            email: this.props.token
          }
        }).then(
          function() {
            //  this.update();
            this.sendPushNotification(
              "New Invite",
              this.props.user.first_name + " has invited you for a trek",
            );
            setTimeout(
              function() {
                this.props.hideInvite("false");
              }
              .bind(this),
              2000
          );
          }.bind(this)
        );
      } else {
        console.log(
          "doc not exists " + "\n" + "\n" + "\n" + "\n" + "\n" + "\n"
        );
        VRef.get().then(doc_ => {
          if (doc_.exists) {
            console.log(
              "doc exists " + "\n" + "\n" + "\n" + "\n" + "\n" + "\n"
            );
            this.setState({
              fire: this.props.receiver_email + "_" + this.props.token
            });
            VRef.update({
              invite: true,
              reject: false,
              accept: false,
              sender: {
                email: this.props.token
              }
            }).then(
              function() {
                //   this.update();
                this.sendPushNotification(
                  "New Invite",
                  this.props.user.first_name +
                    " has invited you for a trek",
                );
                setTimeout(
                  function() {
                    this.props.hideInvite("false");
                  }
                  .bind(this),
                  2000
              );
              }.bind(this)
            );
          } else {
            console.log(
              "doc not exists " + "\n" + "\n" + "\n" + "\n" + "\n" + "\n"
            );
            this.setState({
              fire: this.props.token + "_" + this.props.receiver_email
            });
            Ref.set(
              {
                invite: true,
                reject: false,
                accept: false,
                sender: {
                  email: this.props.token
                }
              },
              { merge: true }
            ).then(
              function() {
                // this.update();
                this.sendPushNotification(
                  "New Invite",
                  this.props.user.first_name +
                    " has invited you for a trek",
                );
                setTimeout(
                  function() {
                    this.props.hideInvite("false");
                  }
                  .bind(this),
                  2000
              );
              }.bind(this)
            );
          }
        });
      }
    });
  }
  hideErrorModal = value => {
    if (value == "true") {
      this.setState({ error: false });
    }
  };

  cancel() {
    this.setState({ cancelLoader: true });
    var Ref = db.collection("invites").doc(this.state.fire);
    Ref.get().then(doc => {
      if (doc.exists) {
        console.log("doc exists " + "\n" + "\n" + "\n" + "\n" + "\n" + "\n");
        Ref.update({
          invite: false,
          reject: false,
          accept: false,
          sender: {
            email: this.props.token
          }
        }).then(
          function() {
            //     this.cancelUpdate();
            this.sendPushNotification(
              "Invite Cancelled",
              this.props.user.first_name + " cancelled the invite",
            );
            
            //  this.props.hideInvite("false");
            //  
          }.bind(this)
        );
      } else {
        console.log(
          "doc not exists " + "\n" + "\n" + "\n" + "\n" + "\n" + "\n"
        );
        Ref.set(
          {
            invite: false,
            reject: false,
            accept: false,
            sender: {
              email: this.props.token
            }
          },
          { merge: true }
        ).then(
          function() {
            //   this.cancelUpdate();
            this.sendPushNotification(
              "Invite Cancelled",
              this.props.user.first_name + " cancelled the invite",
            );

            // this.props.hideInvite("false");
            // this.setState({ cancelLoader: false });
          }.bind(this)
        );
      }
    });
  }
  canceller = ()=>{
    this.props.hideInvite("false");
              this.setState({ cancelLoader: false });
  }
  render() {
    const { params } = this.props.navigation.state;
    let sure = (
      <Overlay
        isVisible={this.state.sure}
        overlayBackgroundColor="white"
        borderRadius={10}
        width="auto"
        height="auto"
        containerStyle={styles.sureContainer}
      >
        <Text style={styles.question}>
          Are you sure you want to cancel your invite
        </Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={this.cancel.bind(this)}>
            <View style={styles.yesView}>
              <Text style={styles.yesText}>YES</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.setState({ sure: false })}>
            <View style={styles.yesView}>
              <Text style={styles.yesText}>NO</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Overlay>
    );
    return (
      <LinearGradient colors={["#57C693", "#377848"]} style={styles.container}>
        <View style={styles.houseView}>
          <View style={styles.checkImageView}>
            <Image
              source={{ uri: this.props.receiver_image }}
              resizeMode="cover"
              style={styles.checkImage}
            />
          </View>
          <Text style={styles.accountCreatedText}>
            Inviting {this.props.receiver.first_name}
          </Text>
          <ActivityIndicator color="#fff" size="small" />
          <TouchableOpacity onPress={() => this.setState({ sure: true })}>
            <View style={styles.continueView}>
              <Text style={styles.continueText}>Cancel</Text>
            </View>
          </TouchableOpacity>
        </View>
        <ErrorModal
          error={this.state.error}
          error_message={this.state.error_message}
          hideError={this.hideErrorModal}
        />
        {sure}
        <CancelModal regLoader={this.state.cancelLoader} />
        <LoaderModal regLoader={this.state.regLoader} />
      </LinearGradient>
    );
  }
}
const InvitingScreen = connect(mapStateToProps)(reduxInvitingScreen);
export default InvitingScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
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
    marginTop: 30,
    marginBottom: 20
  },
  continueView: {
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: 180,
    height: 37,
    marginTop: 30
  },
  continueText: {
    color: "#4B8924",
    fontSize: 13,
    fontFamily: "mont-semi"
  },
  sureContainer: {
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
    justifyContent: "space-evenly",
    position: "absolute"
  },
  question: {
    fontSize: 14,
    color: "black",
    fontFamily: "mont-reg",
    textAlign: "center",
    marginTop: 20
  },
  buttonRow: {
    width: 210,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 30,
    alignSelf: "center",
    marginBottom: 20
  },
  yesView: {
    width: 100,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#377848",
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 10
  },
  yesText: {
    color: "white",
    fontSize: 14,
    alignSelf: "center",
    fontFamily: "mont-reg"
  }
});
