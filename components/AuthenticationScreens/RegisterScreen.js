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
export default class RegisterScreen extends Component {
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
        <ScrollView>
        <Text style={styles.registerText}>Register</Text>
        <View style={styles.textFieldView}>
          <TextInput 
            underlineColorAndroid={"transparent"}
            allowFontScaling={false}
            placeholder="First Name"
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
            placeholderStyle={{ fontSize: 10, fontFamily: "mont-light" }}
            placeholderTextColor="#000302"
            style={styles.textFieldInput}
          />
        </View>
        <View style={styles.passwordView}>
          <TextInput 
            underlineColorAndroid={"transparent"}
            allowFontScaling={false}
            secureTextEntry={true}
            placeholder="Password"
            placeholderStyle={{ fontSize: 10, fontFamily: "mont-light" }}
            placeholderTextColor="#000302"
            style={styles.passwordTextFieldInput}
          />
          <View style={styles.eyeView}>
          <Image
          source={require("../assets/images/eye.png")}
          resizeMode="contain"
          style={styles.eyeImage}
        />
          </View>
        </View>
        <View style={styles.textFieldView}>
          <TextInput 
            underlineColorAndroid={"transparent"}
            allowFontScaling={false}
            placeholder="Interests; separate with comma, i.e Food, Music"
            placeholderStyle={{ fontSize: 10, fontFamily: "mont-light" }}
            placeholderTextColor="#000302"
            style={styles.textFieldInput}
          />
        </View>
       <Text style={styles.agreeText}>Agree to the terms of service and privacy policy</Text>
       <View style={styles.nextButton}>
         <Text style={styles.nextText}>Next</Text>
       </View>
        </ScrollView>
        <Image
          source={require("../assets/images/authBottom.png")}
          resizeMode="contain"
          style={styles.bottomImage}
        />
      </View>
    );
  }
}
const dimensions = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ffffff"
  },
  registerText: {
    color: '#000302',
    fontSize: 26,
    fontFamily: 'mont-bold',
    marginTop: 47.5+StatusBar.currentHeight,
    marginLeft: '16%'
  },
  textFieldView: {
     width: '69.33%',
     alignSelf: 'center',
     borderWidth: 1,
     borderColor: '#707070',
     height: 37,
     alignItems: 'center',
     justifyContent: 'center',
     marginTop: 26
  },
    textFieldInput: {
      height: 35,
      width: '100%',
      backgroundColor: '#ffffff',
      color: '#000302',
      fontFamily: 'mont-light',
      fontSize: 10,
      paddingLeft: 11
    },
    passwordView: {
      width: '69.33%',
      alignSelf: 'center',
      borderWidth: 1,
      borderColor: '#707070',
      height: 37,
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 26,
      flexDirection: 'row'
    },
    passwordTextFieldInput: {
      height: 35,
      width: '85%',
      backgroundColor: '#ffffff',
      color: '#000302',
      fontFamily: 'mont-light',
      fontSize: 10,
      paddingLeft: 11
    },
    eyeView: {
      width: '25%',
      alignItems: 'center',
      justifyContent: 'center',
      height: 35
    },
    eyeImage: {
      width: 12,
      height: 7,
      alignSelf: 'center'
    },
    agreeText: {
      marginTop: 26,
      fontSize: 7,
      color: '#000302',
      fontFamily: 'mont-bold'
    },
    nextButton: {
      width: '55.73%',
      height: 34,
      borderRadius: 9,
      backgroundColor: '#56C391',
      alignSelf: 'center',
      marginTop: 20,
      alignItems: 'center',
      justifyContent: 'center'
    },
    nextText: {
      color: '#ffffff',
      fontSize: 14,
      fontFamily: 'mont-bold'
    },
    bottomImage: {
      width: '100%',
      height: 57.93
    }
});
