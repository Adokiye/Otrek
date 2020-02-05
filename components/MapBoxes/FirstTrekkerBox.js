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
import firebase from "react-native-firebase";
import ChatTrekkerBox from "./ChatTrekkerBox";
import InviteScreen from "../InviteScreens/InviteScreen";
import InvitingScreen from "../InviteScreens/InvitingScreen";
var db = firebase.firestore();
const haversine = require("haversine");
import SearchModal from "../Modals/SearchModal";
import { connect } from "react-redux";
const mapStateToProps = state => ({
  ...state
});
class reduxFirstTrekkerBox extends Component {
  static navigationOptions = {
    header: null,
    drawerLockMode: "locked-closed"
  };
  constructor(props) {
    super(props);
    this.state = {
      trekkers: [],
      regLoader: false,
      chat: false,
      invite: false
    };
  }
  getLatLonDiffInMeters(lat1, lon1, lat2, lon2) {
    var R = 6371; // radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1); // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // distance in km
    return d * 1000;
  }
  invite() {
    this.setState({ regLoader: true });
    var Ref = db.collection("invites").doc(this.props.fire);
    Ref.get().then(doc => {
      if (doc.exists) {
        console.log("doc exists " + "\n" + "\n" + "\n" + "\n" + "\n" + "\n");
        Ref.update({
          accept: false,
          reject: true,
          invite: true,
          sender: {
            email: this.props.receiver_email
          }
        }).then(
          function() {
            this.setState({ regLoader: false });
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
            invite: true,
            sender: {
              email: this.props.receiver_email
            }
          },
          { merge: true }
        ).then(
          function() {
            this.setState({ regLoader: false });
          }.bind(this)
        );
      }
    });
  }
  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  componentDidMount() {
    const { params } = this.props.navigation.state;
    this.setState({ regLoader: true });
    this.getMarker().then(data => {
      console.log(data);
      var len = data ? data.length : null;
      for (let i = 0; i < len; i++) {
        let row = data[i];
        if (row.details.start_location && row.details.end_location) {
          console.log(row);
          let diff_in_meters_start = this.getLatLonDiffInMeters(
            row.details.start_location.latitude,
            row.details.start_location.longitude,
            this.props.start_location.latitude,
            this.props.start_location.longitude
          );
          let diff_in_meters_end = this.getLatLonDiffInMeters(
            row.details.end_location.latitude,
            row.details.end_location.longitude,
            this.props.end_location.latitude,
            this.props.end_location.longitude
          );
          if (diff_in_meters_start <= 5000 && diff_in_meters_end <= 5000) {
            console.log("distance checked and true");
            if (row.details.email != this.props.token) {
              this.setState(prevState => ({
                trekkers: [...prevState.trekkers, row]
              }));
            }
          }
        }
      }
      this.setState({ regLoader: false });
    });
  }
  async getMarker() {
    const snapshot = await firebase
      .firestore()
      .collection("users")
      .get();
    return snapshot.docs.map(doc => doc.data());
  }
  chatFalse(value) {
    if (value == "false") {
      this.setState({ chat: false });
    }
  }
  render() {
    let trekkers = "";
    if (this.state.trekkers[0]) {
      trekkers = (
        <View style={styles.underView}>
          <View style={styles.firstView}>
            <Image
              source={{ uri: this.state.trekkers[0].details.image }}
              resizeMode="cover"
              style={styles.profileImage}
            />
            <View style={styles.aboutView}>
              <Text style={styles.name}>
                {this.state.trekkers[0].details.first_name +
                  " " +
                  this.state.trekkers[0].details.last_name}
              </Text>
              <Text style={styles.gender}>
                {this.state.trekkers[0].details.gender}
              </Text>
              <Text style={styles.interests}>
                {this.state.trekkers[0].details.interests}
              </Text>
            </View>
            <View style={styles.iconBox}>
              {/*  <Image
           source={require("../../assets/images/phoneCall.png")}
           resizeMode="contain"
           style={styles.phoneIcon}
         />*/}
              <TouchableOpacity
                activeOpacity={0.7}
                hitSlop={{ top: 2, left: 2, right: 2, bottom: 2 }}
                onPress={() => this.setState({ chat: true, invite: false })}
              >
                <View style={styles.commentIcon}>
                  <Image
                    source={require("../../assets/images/message.png")}
                    resizeMode="contain"
                    style={styles.commentIcon}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                hitSlop={{ top: 2, left: 2, right: 2, bottom: 2 }}
                onPress={() => this.setState({ chat: false, invite: true })}
              >
                <View style={styles.inviteButton}>
                  <Text style={styles.inviteText}>Invite</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.line} />
          <View style={styles.viewMore}>
            <Text style={styles.viewMoreText}>View more trekkers</Text>
          </View>
        </View>
      );
    } else {
      trekkers = (
        <Text
          style={{
            alignSelf: "center",
            color: "#000000",
            fontFamily: "mont-medium",
            fontSize: 14,
            marginTop: "30%"
          }}
        >
          Oops!, No trekker available in your location
        </Text>
      );
    }
    if (this.state.chat && !this.state.invite) {
      return (
        <ChatTrekkerBox
          receiver_email={
            this.state.trekkers[0] ? this.state.trekkers[0].details.email : null
          }
          receiver_name={
            this.state.trekkers[0]
              ? this.state.trekkers[0].details.first_name +
                " " +
                this.state.trekkers[0].details.last_name
              : null
          }
          receiver_id={
            this.state.trekkers[0]
              ? this.state.trekkers[0].details.first_name
              : null
          }
          receiver_image={
            this.state.trekkers[0] ? this.state.trekkers[0].details.image : null
          }
          chatFalse={this.chatFalse.bind(this)}
        />
      );
    } else if (this.state.invite && !this.state.chat) {
      return (
        <InvitingScreen
          navigation={this.props.navigation}
          receiver_email={
            this.state.trekkers[0] ? this.state.trekkers[0].details.email : null
          }
          receiver={this.state.trekkers[0].details}
          receiver_name={
            this.state.trekkers[0]
              ? this.state.trekkers[0].details.first_name +
                " " +
                this.state.trekkers[0].details.last_name
              : null
          }
          receiver_id={
            this.state.trekkers[0]
              ? this.state.trekkers[0].details.first_name
              : null
          }
          receiver_image={
            this.state.trekkers[0] ? this.state.trekkers[0].details.image : null
          }
          chatFalse={this.chatFalse.bind(this)}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.cancelView}>
            <Image
              source={require("../../assets/images/cancel.png")}
              resizeMode="contain"
              style={styles.cancelImage}
            />
          </View>
          <ScrollView>{trekkers}</ScrollView>
          <SearchModal regLoader={this.state.regLoader} />
        </View>
      );
    }
  }
}
const FirstTrekkerBox = connect(mapStateToProps)(reduxFirstTrekkerBox);
export default FirstTrekkerBox;
const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    height: 226,
    width: "100%",
    borderTopLeftRadius: 40,
    borderWidth: 1,
    borderColor: "#707070",
    position: "absolute",
    bottom: 0
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
  underView: {
    flexDirection: "column",
    height: 138,
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "center"
  },
  firstView: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    width: "90%",
    justifyContent: "space-between",
    height: 75,
    marginTop: 15
  },
  profileImage: {
    height: 75,
    width: 75,
    borderRadius: 37.5,
    marginLeft: 10
  },
  aboutView: {
    height: 75,
    flexDirection: "column"
  },
  name: {
    color: "#000000",
    fontFamily: "mont-medium",
    fontSize: 14
  },
  gender: {
    color: "#2B9656",
    fontFamily: "mont-bold",
    fontSize: 14
  },
  interests: {
    fontFamily: "mont-medium-italic",
    fontSize: 9,
    color: "#000703"
  },
  iconBox: {
    width: 52,
    alignItems: "center",
    flexDirection: "column",
    height: 75,
    justifyContent: "space-between"
  },
  phoneIcon: {
    width: 14.01,
    height: 14.12
  },
  commentIcon: {
    width: 20,
    height: 20
  },
  inviteButton: {
    width: 60,
    height: 20,
    borderRadius: 4,
    backgroundColor: "#55C18E",
    alignItems: "center",
    justifyContent: "center"
  },
  inviteText: {
    color: "#ffffff",
    fontFamily: "mont-bold",
    fontSize: 10
  },
  line: {
    width: "89.067%",
    height: 1,
    alignSelf: "center",
    backgroundColor: "#120000",
    marginTop: 5,
    marginBottom: 5
  },
  viewMore: {
    width: 125,
    height: 22,
    alignSelf: "center",
    backgroundColor: "#55C18E",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center"
  },
  viewMoreText: {
    color: "#ffffff",
    fontFamily: "mont-bold",
    fontSize: 9
  }
});
