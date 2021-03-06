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
import { connect } from "react-redux";
import firebase from "react-native-firebase";
const mapStateToProps = state => ({
  ...state
});
class reduxAcceptedInviteScreen extends Component {
  static navigationOptions = {
    header: null,
    drawerLockMode: "locked-closed"
  };
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const { params } = this.props.navigation.state;
    console.log(params)
    setTimeout(
      function() {
        this.props.navigation.pop("Map", {
          invite: true,
          chosen: true,
          receiver: params.receiver,
          start_location: params.receiver_start_location
        });
      }.bind(this),
      4000
    );
  }
  render() {
    const { params } = this.props.navigation.state;
    return (
      <View style={styles.container}>
        <View style={styles.houseView}>
          <View style={styles.checkImageView}>
            <Image
              source={{uri: params.receiver_image}}
              resizeMode="contain"
              style={{    width: 140,
    height: 140,
    borderRadius: 70,}}
            />
          </View>
          <Text style={styles.name}>{params.receiver_first_name}</Text>
          <Text style={styles.accepted}>Accepted your request</Text>
          {/*   <View style={styles.continueView}>
            <Text style={styles.continueText}>Continue</Text>
          </View> */}
        </View>
      </View>
    );
  }
}
const AcceptedInviteScreen = connect(mapStateToProps)(
  reduxAcceptedInviteScreen
);
export default AcceptedInviteScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#377848",
    alignItems: "center",
    justifyContent: 'center'
  },
  checkImage: {
    width: "30%",
    height: 107,
    alignSelf: "center",
    marginTop: "25.20%"
  },
  name: {
    marginTop: "5%",
    alignSelf: "center",
    color: "#ffffff",
    fontSize: 35,
    fontFamily: "mont-bold"
  },
  accepted: {
    color: "#ffffff",
    fontFamily: "mont-bold",
    fontSize: 20
  },
  continueView: {
    marginBottom: "25.5%",
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    width: 192,
    height: 28,
    alignItems: "center",
    justifyContent: "center"
  },
  continueText: {
    color: "#393232",
    fontSize: 15,
    fontFamily: "mont-bold"
  },
  houseView: {
    flexDirection: "column",
    alignItems: "center"
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
  }
});
