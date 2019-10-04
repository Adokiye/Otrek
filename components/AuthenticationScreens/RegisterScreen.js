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
import ImagePicker from "react-native-image-crop-picker";
import firebase from "react-native-firebase";
import ErrorModal from "../Modals/ErrorModal";
import LoaderModal from "../Modals/LoaderModal";
import HideWithKeyboard from "react-native-hide-with-keyboard";
import AccountCreatedScreen from './AccountCreatedScreen'
import axios from "axios";
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
var SharedPreferences = require("react-native-shared-preferences");
var db = firebase.firestore();
class reduxRegisterScreen extends Component {
  static navigationOptions = {
    header: null,
    drawerLockMode: "locked-closed"
  };
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      first_name: null,
      last_name: null,
      email: null,
      password: null,
      interests: null,
      error: false,
      error_message: null,
      location: "RegisterScreen",
      eye_of_tiger: true,
      regLoader: false,
      imageCloud: null
    };
  }
  hideErrorModal = value => {
    if (value == "true") {
      this.setState({ error: false });
    }
  };
  registerUser() {
    let regg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!this.state.first_name) {
      this.setState({
        error: true,
        error_message: "First name field is required"
      });
    } else if (!this.state.last_name) {
      this.setState({
        error: true,
        error_message: "Last name field is required"
      });
    } else if (!this.state.password || this.state.password < 8) {
      this.setState({
        error: true,
        error_message: "Password field is invalid, must contain 8 or more characters"
      });
    } else if (!this.state.interests) {
      this.setState({
        error: true,
        error_message: "Interests field is required"
      });
    } else if (regg.test(this.state.email) === false) {
      this.setState({ error: true, error_message: "Email field is invalid" });
    } else if (!this.state.image) {
      this.setState({ error: true, error_message: "Please upload a Profile Picture" });
    } else {
      this.setState({ regLoader: true });
      let email = this.state.email;
      var Ref = db
        .collection("users")
        .doc(this.state.email);
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(() =>
          Ref.get().then(doc => {
              console.log(
                "doc not exists " + "\n" + "\n" + "\n" + "\n" + "\n" + "\n"
              );
              Ref.set(
                {
                  details: {
                      first_name: this.state.first_name,
                      last_name: this.state.last_name,
                      email: this.state.email,
                      created_at: firebase.firestore.Timestamp.fromDate(
                        new Date()
                      ),
                      password: this.state.password,
                      interests: this.state.interests,
                      image: this.state.imageCloud,
                      start_location: null,
                      end_location: null
                    }
                },
                { merge: true }
              ).then(function(){
                this.props.setToken(this.state.email);
                this.setState({ regLoader: false, }, );
                this.props.navigation.navigate("AccountCreatedScreen");
              }.bind(this)) })  ).catch(error =>
          this.setState({
            error_message: error.message,
            error: true,
            regLoader: false
          })
        );
    }
  }
  imageUpload() {
    ImagePicker.openPicker({
      //   multiple: true,
      cropping: true,
      includeExif: true,
      mediaType: "photo"
    })
      .then(image => {
        if (image) {
          this.setState({regLoader: true,image: image.path})
          const data = new FormData();
          data.append("timestamp", Date.now());
          data.append("api_key", "892238245892288");
          data.append("file", {
            uri: image.path,
            type: image.mime,
            name: Date.now() + "image"
          });
          axios
          .post(
            " https://api.cloudinary.com/v1_1/whavit/image/upload?upload_preset=y0hy1byx",
            data
          )
          .then(response => {
            this.setState({ regLoader: false, imageCloud: response.data.url, image: response.data.url });
            console.log(response);
          })
          .catch(error => {
            this.setState({regLoader: false });
            console.log(error);
          });
        }
        console.log(this.state.image);
      })
      .catch(e => console.log(e));
  }
  componentDidMount() {}
  render() {
    if (this.state.imageCloud) {
      picture = (
        <Image
          style={{
            width: 132,
            height: 132,
            borderRadius: 66,
            alignSelf: "center"
          }}
          resizeMode="cover"
          source={{ uri: this.state.imageCloud }}
        />
      );
    } else {
      picture = (
        <Image
          style={{
            width: 132,
            height: 132,
            borderRadius: 66,
            alignSelf: "center"
          }}
          resizeMode="cover"
          source={require("../../assets/images/addImage.png")}
        />
      );
    }
    return (
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.registerText}>Register</Text>
          <TouchableOpacity onPress={this.imageUpload.bind(this)}>
          <View style={styles.pictureView}>
            {picture}
          </View></TouchableOpacity>
          <View style={styles.textFieldView}>
            <TextInput
              underlineColorAndroid={"transparent"}
              allowFontScaling={false}
              placeholder="First Name"
              value={this.state.first_name}
              onChangeText={first_name => this.setState({ first_name })}
              placeholderStyle={{ fontSize: 10, fontFamily: "mont-light" }}
              placeholderTextColor="#000302"
              style={styles.textFieldInput}
            />
          </View>
          <View style={styles.textFieldView}>
            <TextInput
              underlineColorAndroid={"transparent"}
              allowFontScaling={false}
              placeholder="Last Name"
              value={this.state.last_name}
              onChangeText={last_name => this.setState({ last_name })}
              placeholderStyle={{ fontSize: 10, fontFamily: "mont-light" }}
              placeholderTextColor="#000302"
              style={styles.textFieldInput}
            />
          </View>
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
          <View style={styles.textFieldView}>
            <TextInput
              underlineColorAndroid={"transparent"}
              allowFontScaling={false}
              placeholder="Interests; separate with comma, i.e Food, Music"
              value={this.state.interests}
              onChangeText={interests => this.setState({ interests })}
              placeholderStyle={{ fontSize: 10, fontFamily: "mont-light" }}
              placeholderTextColor="#000302"
              style={styles.textFieldInput}
            />
          </View>
          <View style={styles.alreadyView}>
          <Text style={styles.agreeText}>
            Already have an Account?
          </Text>
          <TouchableNativeFeedback onPress={()=>this.props.navigation.navigate('LoginScreen')}>
          <View><Text style={styles.logInText}>LOG IN</Text></View>
          </TouchableNativeFeedback>
          </View>
          <TouchableNativeFeedback onPress={this.registerUser.bind(this)}>
            <View style={styles.nextButton}>
              <Text style={styles.nextText}>Next</Text>
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
const RegisterScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(reduxRegisterScreen);
export default RegisterScreen;
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
