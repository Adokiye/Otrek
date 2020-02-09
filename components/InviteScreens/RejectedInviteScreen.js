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
class reduxRejectedInviteScreen extends Component {
  static navigationOptions = {
    header: null,
    drawerLockMode: "locked-closed"
  };
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    setTimeout(
      function() {
          this.props.navigation.navigate('Map');
      }
      .bind(this),
      4000
  );
  }
  render() {
    const { params } = this.props.navigation.state;
    return (
      <View style={styles.container}>
        <View style={styles.houseView}>
          <Image
            source={require("../../assets/images/rejectedIcon.png")}
            resizeMode="contain"
            style={styles.checkImage}
          />
                    {/* <View style={styles.checkImageView}>
            <Image
              source={{ uri: params.receiver_image }}
              resizeMode="cover"
              style={styles.checkImage}
            />
          </View> */}
          <Text style={styles.name}>{params.receiver_first_name}</Text>
          <Text style={styles.accepted}>Rejected your request</Text>
    {/*   <View style={styles.continueView}>
            <Text style={styles.continueText}>Continue</Text>
          </View> */}
        </View>
      </View>
    );
  }
}
const RejectedInviteScreen = connect(
  mapStateToProps
)(reduxRejectedInviteScreen);
export default RejectedInviteScreen;
const dimensions = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#B70000",
    alignItems: "center"
  },
  houseView: {
    flexDirection: "column",
    alignItems: "center"
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
  }
});
