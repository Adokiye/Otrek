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
  TouchableNativeFeedback
} from "react-native";
import firebase from "react-native-firebase";
import ErrorModal from "../Modals/ErrorModal";
import LoaderModal from "../Modals/LoaderModal";
import axios from "axios";
import HideWithKeyboard from "react-native-hide-with-keyboard";
var SharedPreferences = require("react-native-shared-preferences");
var db = firebase.firestore();
import { connect } from "react-redux";
import { setToken } from "../../actions/index";
const mapStateToProps = state => ({
  ...state
});
// setmobilenumber was used instead of setprice :)
const mapDispatchToProps = dispatch => {
  return {
    setToken: token => dispatch(setToken(token)),
  };
};
class reduxLoginScreen extends Component {
  static navigationOptions = {
    header: null,
    drawerLockMode: "locked-closed"
  };
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      regLoader: false,
      password: null,
      error: false,
      error_message: null,
      location: 'LoginScreen',
      eye_of_tiger: true
    };
  }
  hideErrorModal = value => {
    if (value == "true") {
      this.setState({ error: false });
    }
  };
  logIn(){
    let regg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!this.state.password || this.state.password < 8) {
          this.setState({
            error: true,
            error_message: "Invalid Credentials"
          });
        }else if (regg.test(this.state.email) === false) {
          this.setState({ error: true, error_message: "Invalid Credentials" });
        }else{
          this.setState({regLoader: true});
          firebase
          .auth()
          .signInWithEmailAndPassword(this.state.email, this.state.password)
          .then(
            function(){
              this.props.setToken(this.state.email);
              this.setState({ regLoader: false, }, );
              this.props.navigation.navigate("Map");
            }.bind(this)).catch(error => 
              this.setState({ error_message: error.message, error: true, regLoader: false }))
        } 
  }
  componentDidMount() {}
  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
        <Text style={styles.registerText}>Log in</Text>
        <View style={styles.textFieldView}>
          <TextInput 
            underlineColorAndroid={"transparent"}
            allowFontScaling={false}
            placeholder="Email"
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
            placeholderStyle={{ fontSize: 10, fontFamily: "mont-light" }}
            placeholderTextColor="#000302"
            style={styles.textFieldInput}
          />
        </View>
        <View style={styles.passwordView}>
          <TextInput 
            underlineColorAndroid={"transparent"}
            allowFontScaling={false}
            secureTextEntry={this.state.eye_of_tiger}
            placeholder="Password"
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
            placeholderStyle={{ fontSize: 10, fontFamily: "mont-light" }}
            placeholderTextColor="#000302"
            style={styles.passwordTextFieldInput}
          />
          <TouchableNativeFeedback
              onPress={() =>
                this.setState({ eye_of_tiger: !this.state.eye_of_tiger })
              }
            >
              <View style={styles.eyeView}>
                <Image
                  source={require("../../assets/images/eye.png")}
                  resizeMode="contain"
                  style={styles.eyeImage}
                />
              </View>
            </TouchableNativeFeedback>
        </View>
        <View style={styles.alreadyView}>
          <Text style={styles.agreeText}>
            Don't have an Account?
          </Text>
          <TouchableNativeFeedback onPress={()=>this.props.navigation.navigate('RegisterScreen')}>
          <View><Text style={styles.logInText}>REGISTER</Text></View>
          </TouchableNativeFeedback>
          </View>
        <TouchableNativeFeedback onPress={this.logIn.bind(this)}>
       <View style={styles.nextButton}>
         <Text style={styles.nextText}>Log in</Text>
       </View>
       </TouchableNativeFeedback>
        </ScrollView>
        <HideWithKeyboard>
        <Image
          source={require("../../assets/images/authBottom.png")}
          resizeMode="cover"
          style={styles.bottomImage}
        /></HideWithKeyboard>
        <ErrorModal
          error={this.state.error}
          error_message={this.state.error_message}
          location={this.state.location}
          hideError={this.hideErrorModal}
        />
        <LoaderModal regLoader={this.state.regLoader} />
      </View>
    );
  }
}
const LoginScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(reduxLoginScreen);
export default LoginScreen;
const dimensions = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ffffff"
  },
  alreadyView: {
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'space-around',
     marginTop: 20,
     width:180,
     alignSelf: 'center'
  },
  logInText: {
    fontSize: 10,
    color: "#56C391",
    fontFamily: "mont-bold"
  },
  pictureView: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "transparent",
    borderColor: "#377848",
    borderWidth: 3,
    marginTop: 20,
    alignSelf: "center",
    justifyContent: "center"
  },
  registerText: {
    color: "#000302",
    fontSize: 26,
    fontFamily: "mont-bold",
    marginTop: 47.5 + StatusBar.currentHeight,
 //   marginLeft: "16%"
   alignSelf: 'center'
  },
  textFieldView: {
    width: "69.33%",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#707070",
    height: 37,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 26,
    marginBottom: 10
  },
  textFieldInput: {
    height: 33,
    width: "95%",
    backgroundColor: "#ffffff",
    color: "#000302",
    fontFamily: "mont-light",
    fontSize: 10,
    paddingLeft: 11
  },
  passwordView: {
    width: "69.33%",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#707070",
    height: 37,
  //  alignItems: "center",
    justifyContent: "space-between",
    marginTop: 26,
    flexDirection: "row",
    marginBottom: 10
  },
  passwordTextFieldInput: {
    height: 33,
    width: "80%",
    backgroundColor: "#ffffff",
    color: "#000302",
    fontFamily: "mont-light",
    fontSize: 10,
    paddingLeft: 11
  },
  eyeView: {
    width: "25%",
    alignItems: "center",
    justifyContent: "center",
    height: 35
  },
  eyeImage: {
    width: 12,
    height: 7,
    alignSelf: "center"
  },
  agreeText: {
    fontSize: 10,
    color: "#000302",
    fontFamily: "mont-bold"
  },
  nextButton: {
    width: "55.73%",
    height: 34,
    borderRadius: 9,
    backgroundColor: "#56C391",
    alignSelf: "center",
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10
  },
  nextText: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "mont-bold"
  },
  bottomImage: {
    width: "100%",
    height: 50,
  }
});
