/* eslint-disable prettier/prettier */
/* eslint-disable comma-dangle */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
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
} from 'react-native';
import firebase from 'react-native-firebase';
import LoaderModal from '../Modals/LoaderModal';
import LinearGradient from 'react-native-linear-gradient';
import { firebaseApiKey } from "../../config/firebase.js";
var db = firebase.firestore();
import { connect } from 'react-redux';
const mapStateToProps = state => ({
  ...state
});

class reduxInviteScreen extends Component {
  static navigationOptions = {
    header: null,
    drawerLockMode: 'locked-closed'
  };
  constructor(props) {
    super(props);
    this.state = {
      regLoader: false
    };
  }
  componentDidMount() {}
  sendPushNotification = async (title, body, token, image, interests) => {
    const FIREBASE_API_KEY = firebaseApiKey;
    const message = {
      to: this.props.receiver.deviceToken,
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
        receiver: this.props.sender,
        sender: this.props.receiver,
        fire: this.props.fire,
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
    response = await response.json();
    console.log(response);
      this.setState({ regLoader: false });
    
  };
  accept() {
    this.setState({ regLoader: true });
    var Ref = db.collection('invites').doc(this.props.fire);
    Ref.get().then(doc => {
      if (doc.exists) {
        console.log('doc exists ' + '\n' + '\n' + '\n' + '\n' + '\n' + '\n');
        Ref.update({
          accept: true,
          reject: false,
          invite: false,
          sender: {
            email: this.props.receiver.email
          }
        }).then(
          function() {
            this.sendPushNotification(
              "Invite Accepted",
              this.props.sender.first_name + " accepted your invite",
            );
      //      this.setState({ regLoader: false });
          }.bind(this)
        );
      } else {
        console.log(
          'doc not exists ' + '\n' + '\n' + '\n' + '\n' + '\n' + '\n'
        );
        Ref.set(
          {
            accept: true,
            reject: false,
            invite: false,
            sender: {
              email: this.props.receiver.email
            }
          },
          { merge: true }
        ).then(
          function() {
            this.sendPushNotification(
              "Invite Accepted",
              this.props.sender.first_name + " accepted your invite",
            );
          }.bind(this)
        );
      }
    });
  }
  reject() {
    this.setState({ regLoader: true });
    var Ref = db.collection('invites').doc(this.props.fire);
    Ref.get().then(doc => {
      if (doc.exists) {
        console.log('doc exists ' + '\n' + '\n' + '\n' + '\n' + '\n' + '\n');
        Ref.update({
          accept: false,
          reject: true,
          invite: false,
          sender: {
            email: this.props.receiver.email
          }
        }).then(
          function() {
            this.sendPushNotification(
              "Invite Rejected",
              this.props.sender.first_name + " has rejected your invite",
            );
          }.bind(this)
        );
      } else {
        console.log(
          'doc not exists ' + '\n' + '\n' + '\n' + '\n' + '\n' + '\n'
        );
        Ref.set(
          {
            accept: false,
            reject: true,
            invite: false,
            sender: {
              email: this.props.receiver.email
            }
          },
          { merge: true }
        ).then(
          function() {
            this.sendPushNotification(
              "Invite Rejected",
              this.props.sender.first_name + " has rejected your invite",
            );
          }.bind(this)
        );
      }
    });
  }
  render() {
    const { params } = this.props.navigation.state;
    return (
      <LinearGradient colors={['#57C693', '#377848']} style={styles.container}>
        <View style={styles.houseView}>
          <View style={styles.checkImageView}>
            <Image
              source={{ uri: this.props.receiver.image }}
              resizeMode="cover"
              style={styles.checkImage}
            />
          </View>
          <Text style={styles.accountCreatedText}>
            {this.props.receiver.first_name} {this.props.receiver.last_name}
          </Text>
          <Text style={styles.invitingText}>
            is inviting you to be{' '}
            {this.props.receiver.gender == 'M' ? 'his' : 'her'} trekpal
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
            Interests: {this.props.receiver.interests}
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
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  houseView: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  checkImage: {
    width: 132,
    height: 132,
    alignSelf: 'center',
    borderRadius: 66
  },
  checkImageView: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white'
  },
  accountCreatedText: {
    color: '#ffffff',
    fontFamily: 'mont-bold',
    fontSize: 20,
    alignSelf: 'center',
    marginTop: 30
  },
  rejectView: {
    backgroundColor: '#B70000',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 37,
    marginTop: 15
  },
  rejectText: {
    color: '#000',
    fontSize: 13,
    fontFamily: 'mont-semi'
  },
  acceptView: {
    backgroundColor: '#29E934',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 37,
    marginTop: 30
  },
  acceptText: {
    color: '#000',
    fontSize: 13,
    fontFamily: 'mont-semi'
  },
  invitingText: {
    color: '#ffffff',
    fontFamily: 'mont-bold',
    fontSize: 16,
    alignSelf: 'center',
    marginBottom: 20
  },
  interestText: {
    marginTop: 15,
    color: '#fff',
    fontFamily: 'mont-italic',
    fontSize: 16,
    alignSelf: 'center'
  }
});
