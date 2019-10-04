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
  PermissionsAndroid
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
export default class FindTrekkerBox extends Component {
  static navigationOptions = {
    header: null,
    drawerLockMode: "locked-closed"
  };
  constructor(props) {
    super(props);
    this.state = {
      address: null,
      region: null,
      end_location: null,
      to: null,
      enterLocation: false
    };
  }
  selectDestination = (data, details = null) => {
    const latDelta =
      Number(details.geometry.viewport.northeast.lat) -
      Number(details.geometry.viewport.southwest.lat);
    const lngDelta =
      Number(details.geometry.viewport.northeast.lng) -
      Number(details.geometry.viewport.southwest.lng);
    let region = {
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta
    };
    console.log(this.refs.endlocation.getAddressText());
    this.getEndLocation(
      details.geometry.location.lat,
      details.geometry.location.lng
    );
    //    this.refs.endlocation.getAddressText());
    this.setState({
      end_location: {
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng
      },
      region: region,
      to: this.refs.endlocation.getAddressText() // get the full address of the user's destination
    });
    this.setState({ enterLocation: false });
  };
  getEndLocation = (lat, long) => {
    this.props.endLocation(lat, long);
  };
  componentDidMount() {}
  render() {
    return (
      <View
        style={
          this.state.enterLocation ? styles.container : styles.containerSmall
        }
      >
        {/*    <View style={styles.textInputView}>
          <View style={styles.greenCircle}></View>
          <Text style={styles.text}>{this.props.start}</Text>
        </View> 
        <View style={styles.textInputView}>
          <View style={styles.redCircle}></View>*/}
        <ScrollView>
          <View style={styles.redCircle} />
          <GooglePlacesAutocomplete
            ref="endlocation"
            placeholder="Where to?"
            textInputProps={{
              onTouchStart: () => {
                this.setState({ enterLocation: true });
              }
            }}
            minLength={1}
            returnKeyType={"search"}
            listViewDisplayed="auto"
            fetchDetails={true}
            onPress={this.selectDestination}
            query={{
              key: "AIzaSyBRWIXQCbRpusFNiQitxMJy_89gguGk66w",
              language: "en",
              components: "country:ng"
            }}
            nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            GooglePlacesDetailsQuery={{
              fields: "formatted_address"
            }}
            styles={{
              textInputContainer: {
                width: "60.267%",
                height: 34,
                backgroundColor: "white",
                alignItems: "center",
                alignSelf: "center"
              },
              textInput: {
                width: "100%",
                height: 34,
                color: "#000000",
                fontSize: 14,
                fontFamily: "mont-medium"
              },
              description: {
                fontFamily: "mont-medium",
                fontSize: 14,
                color: "#000000",
                alignSelf: "center"
              },
              predefinedPlacesDescription: {
                fontFamily: "mont-medium",
                fontSize: 14,
                color: "#000000"
              },
              placeholderStyle: {
                fontSize: 14,
                fontFamily: "mont-medium",
                color: "#000000"
              },
              listView: {
                //   alignSelf: 'center'
              },
              row: {
                width: "80%",
                alignSelf: "center"
                //       opacity: !this.state.enterLocation?0:1
              }
            }}
            debounce={200}
          />
        </ScrollView>
        {/*  <TextInput
            underlineColorAndroid={"transparent"}
            allowFontScaling={false}
            placeholder="End"
            placeholderStyle={{ fontSize: 14, fontFamily: "mont-medium" }}
            placeholderTextColor="#000000"
            style={styles.textInput}
          />  
        </View>*/}
        <TouchableOpacity>
        <View style={styles.findTrekkerButton}>
          <Text style={styles.findTrekkerText}>Find Trekker</Text>
        </View></TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 40,
    borderWidth: 1,
    borderColor: "#707070",
    width: '100%',
    height: '70%',
    position: "absolute",
    bottom: 0
 //   flex: 1
  },
  containerSmall: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    height: 90,
    width: "100%",
    borderTopLeftRadius: 40,
    borderWidth: 1,
    borderColor: "#707070",
    //  alignItems: "center",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 0
  },
  textInputView: {
    width: "60.267%",
    height: 34,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#707070",
    //  alignItems: "center",
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-around"
  },
  textInput: {
    width: "87%",
    height: 34,
    color: "#000000",
    fontSize: 14,
    fontFamily: "mont-medium",
    alignItems: "center"
  },
  text: {
    color: "#000000",
    fontSize: 14,
    fontFamily: "mont-medium",
    marginTop: 5
  },
  redCircle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FF0000",
    top: 12,
    position: "absolute",
    left: "15%"
  },
  greenCircle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#55C18E",
    marginTop: 12
  },
  findTrekkerButton: {
    height: 36,
    borderRadius: 9,
    alignSelf: "center",
    backgroundColor: "#55C18E",
    width: "60.267%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10
  },
  findTrekkerText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "mont-bold"
  }
});
