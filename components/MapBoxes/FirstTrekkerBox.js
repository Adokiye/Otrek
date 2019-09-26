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
export default class FirstTrekkerBox extends Component {
  static navigationOptions = {
    header: null,
    drawerLockMode: "locked-closed"
  };
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.cancelView}>
          <Image
            source={require("../assets/images/cancel.png")}
            resizeMode="contain"
            style={styles.cancelImage}
          />
        </View>
        <View style={styles.underView}>
          <View style={styles.firstView}>
            <Image
              source={require("../assets/images/doe_image.png")}
              resizeMode="contain"
              style={styles.profileImage}
            />
            <View style={styles.aboutView}>
              <Text style={styles.name}>Jane Olaoluwa</Text>
              <Text style={styles.gender}>F</Text>
              <Text style={styles.interests}>Interests: Sports,Food,Music</Text>
            </View>
            <View style={styles.iconBox}>
              <Image
                source={require("../assets/images/phoneCall.png")}
                resizeMode="contain"
                style={styles.phoneIcon}
              />
              <Image
                source={require("../assets/images/message.png")}
                resizeMode="contain"
                style={styles.commentIcon}
              />
              <View style={styles.inviteButton}>
                <Text style={styles.inviteText}>Invite</Text>
              </View>
            </View>
          </View>
          <View style={styles.line}></View>
          <View style={styles.viewMore}>
            <Text style={styles.viewMoreText}>View more trekkers</Text>
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    height: 226,
    width: "100%",
    borderTopLeftRadius: 40,
    borderWidth: 1,
    borderColor: "#707070"
  },
  cancelView: {
    width: 13,
    height: 12,
    marginLeft: "7.2%",
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
    width: "83.2%",
    justifyContent: "space-between",
    height: 75,
    marginTop: 15
  },
  profileImage: {
    height: 75,
    width: 75,
    borderRadius: 37.5
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
    width: 15.32,
    height: 15.13
  },
  inviteButton: {
    width: 51,
    height: 16,
    borderRadius: 4,
    backgroundColor: "#55C18E",
    alignItems: "center",
    justifyContent: "center"
  },
  inviteText: {
    color: "#ffffff",
    fontFamily: "mont-bold",
    fontSize: 8
  },
  line: {
    width: "89.067%",
    height: 1,
    alignSelf: "center",
    backgroundColor: "#120000"
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
