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
  Platform,
  PermissionsAndroid,
  Alert,
  TouchableNativeFeedback,
  BackHandler,
  DeviceEventEmitter,
  SafeAreaView
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

import MapView, {
  Marker,
  Callout,
  AnimatedRegion,
  Animated
} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import Geocoder from "react-native-geocoding";
import FindTrekkerBox from "./MapBoxes/FindTrekkerBox";
import AlertModal from "./Modals/AlertModal"
import FirstTrekkerBox from "./MapBoxes/FirstTrekkerBox";
import ChosenTrekkerBox from "./MapBoxes/ChosenTrekkerBox";
import ChatTrekkerBox from "./MapBoxes/ChatTrekkerBox";
import Polyline from "@mapbox/polyline";
import Geolocation from "@react-native-community/geolocation";
const google_api_key = "AIzaSyBRWIXQCbRpusFNiQitxMJy_89gguGk66w";
import firebase from "react-native-firebase";
import LinearGradient from "react-native-linear-gradient";
var db = firebase.firestore();
const haversine = require("haversine");
Geocoder.init(google_api_key);
const LATITUDE_DELTA = 0.0005;
const LONGITUDE_DELTA = 0.005;
const default_region = {
  latitude: 6.45407,
  longitude: 3.39467,
  latitudeDelta: 1,
  longitudeDelta: 1
};
import { connect } from "react-redux";
const mapStateToProps = state => ({
  ...state
});

class reduxMap extends Component {
  getMapRegion = () => ({
    latitude: this.state.changedLatitude,
    longitude: this.state.changedLongitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  });
  static navigationOptions = {
    header: null,
    drawerLockMode: "locked-closed"
  };

  getEndLocation = (lat, long) => {
    this.setState(
      {
        end_location: {
          latitude: lat,
          longitude: long
        }
      },
      () =>
        db
          .collection("users")
          .doc(this.props.token)
          .update({
            "details.end_location": { latitude: lat, longitude: long }
          })
          .then(function() {
            console.log("Document successfully updated!");
          })
    );
  };
  constructor(props) {
    super(props);
    this.from_region = null;
    //  this.watchId = null;
    this.state = {
      destinationRegion: "",
      latitude: null,
      longitude: null,
      concat: null,
      concatCord: null,
      coords: [],
      x: "false",
      cordLatitude: null,
      cordLongitude: null,
      y: "",
      z: "",
      from: "",
      to: "",
      region: default_region,
      start_location: null,
      end_location: null,
      currentCoordinate: new AnimatedRegion({
        latitude: 6.45407,
        longitude: 3.39467,
        latitudeDelta: 0,
        longitudeDelta: 0
      }),
      distanceTravelled: "",
      prevLatLng: [],
      debugText: "",
      changedLatitude: null,
      changedLongitude: null,
      marginBottom: 1,
      start_location: null,
      end_location: null,
      email: null,
      startTrek: false,
      chat: false,
      receiver: {},
      fire: "",
      deviceToken: "",
      invited_location: null,
      find: true,
      chosen: false,
      user_name: "",
      user: {},
      status: 'success',
      message: null
    };
    this.mergeLot = this.mergeLot.bind(this);
    this.getDirectionsTo = this.getDirectionsTo.bind(this);
    this.getLocation = this.getLocation.bind(this);
  }
  componentWillUnmount() {
    clearInterval(this.intervalId);
    Geolocation.clearWatch(this.watchID);
  }
  passMessage = (status, message) => {
    this.setStatus({
      status
    }, ()=> this.setState({message}))
  }

  componentDidUpdate() {
    const { params } = this.props.navigation.state;
    if (params && params.chat) {
      params.chat = false;
      console.log("chat true");
      this.setState(
        {
          receiver: params.receiver,
          user_name: params.user_name,
          fire: params.fire,
          deviceToken: params.deviceToken
        },
        () => this.setState({ chat: true })
      );
    }
    if( params && params.message){
      
      console.log("message true");
      this.setState(
        {
          status: params.message.status,
        },
        () => this.setState({ message: params.message.message, },
          ()=>params.message = false )
      );
    }
    if (params && params.invite) {
      console.log(params.start_location);
      params.invite = false;
      this.setState({ invited_location: null }, () => {
        this.setState(
          { invited_location: JSON.parse(params.start_location) },
          () => this.watchInvite.bind(this)
        );
      });
    }
    if (params && params.chosen) {
      params.chosen = false;
      db.collection("users")
        .doc(params.receiver.email)
        .update({
          "invite.start_location": {
            latitude: this.state.latitude,
            longitude: this.state.longitude
          },
          "invite.isInvited": true,
          "invite.receiver": this.state.user
        })
        .then(function() {
          console.log("DocumentInvite successfully updated!");
        });
      this.setState(
        { receiver: params.receiver, deviceToken: params.deviceToken },
        () => this.setState({ find: false })
      );
    }
  }

  setChat = () => {
    this.setState({ chat: false }, () => console.log("chat==> false"));
  };

  watchInvite = () => {
    if (!this.state.find) {
      db.collection("users")
        .doc(this.state.receiver.email)
        .onSnapshot(function(doc) {
          if (
            doc.data() &&
            doc.data().invite &&
            doc.data().invite.start_location
          ) {
            if (this.markerQ) {
              console.log("markerq exists");
              this.markerQ._component.animateMarkerToCoordinate(
                doc.data().invite.start_location,
                500
              );
            }
            this.setState({
              invited_location: doc.data().invite.start_location
            });

          }
        });
    }
  };

  regionFrom(lat, lon, accuracy) {
    const oneDegreeOfLongitudeInMeters = 111.32 * 1000;
    const circumference = (40075 / 360) * 1000;

    const latDelta = accuracy * (1 / (Math.cos(lat) * circumference));
    const lonDelta = accuracy / oneDegreeOfLongitudeInMeters;

    return {
      latitude: lat,
      longitude: lon,
      latitudeDelta: Math.max(0, latDelta),
      longitudeDelta: Math.max(0, lonDelta)
    };
  }
  updateLocation = (lat, long) => {
    if (!this.state.find) {
      db.collection("users")
        .doc(this.state.receiver.email)
        .update({
          "invite.start_location": {
            latitude: lat,
            longitude: long
          }
        })
        .then(function() {
          console.log("Document2 successfully updated!");
        });
    } else {
      db.collection("users")
        .doc(this.props.token)
        .update({
          "details.start_location": {
            latitude: lat,
            longitude: long
          }
        });
    }
  };
  getLocation() {
    this.watchID = Geolocation.watchPosition(
      async position => {
        const newCoordinate = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        };
        if (Platform.OS === "android") {
          this.updateLocation(
            position.coords.latitude,
            position.coords.longitude
          );
          if (this.marker) {
            console.log("marker exists");
            this.marker._component.animateMarkerToCoordinate(
              newCoordinate,
              500
            );
          }
        } else {
          currentCoordinate.timing(newCoordinate).start();
        }
        this.mergeLot();
      },
      error => console.log(error.message),

      {
        enableHighAccuracy: true,
        timeout: 10000,
        //        maximumAge: 0,
        distanceFilter: 1
      }
    );
  }
  hideErrorModal = value => {
    if (value == "true") {
      this.setState({ error: false });
    }
  };
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
  async requestGeolocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Otrek Geolocation Permission",
          message: "Otrek needs access to your current location"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          position => {
            console.log(JSON.stringify(position.coords));
            this.setState(
              {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                start_location: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude
                },
                currentCoordinate: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA
                }
              },
              () => {
                db.collection("users")
                  .doc(this.props.token)
                  .get()
                  .then(user_doc => {
                    this.setState({ user: user_doc.data().details });
                    if (user_doc.data().invite.isInvited) {
                      console.log("dfdfdd");
                      this.setState(
                        {
                          invited_location: user_doc.data().invite
                            .start_location,
                          receiver: user_doc.data().invite.receiver
                        },
                        () => this.setState({ find: false })
                      );
                      db.collection("users")
                        .doc(user_doc.data().invite.receiver.email)
                        .update({
                          "invite.start_location": {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                          }
                        })
                        .then(function() {
                          console.log(user_doc.data().invite.receiver.email+"Documentkkk successfully updated!");
                        });
                    }
                  });
                db.collection("users")
                  .doc(this.props.token)
                  .update({
                    "details.start_location": {
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude
                    }
                  })
                  .then(function() {
                    console.log("Document successfully updated!");
                  });
              }
            );
          },
          error => console.log(error.message + " issues")
          // {enableHighAccuracy: false, timeout: 20000,

          // },
        );
      } else {
        console.log("Geolocation permission denied");
      }
    } catch (err) {
      console.warn(err + "fkfk");
    }
  }
  back = () => {
    this.setState({ find: true, invited_location: null });
    db.collection("users")
      .doc(this.props.token)
      .update({
        "invite.isInvited": false,
        "invite.receiver": null,
        "invite.start_location": null
      })
      .then(function() {
        console.log("Document successfully updated!");
      });
  };
  async requestGeolocationPermissionSecond() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Otrek Geolocation Permission",
          message: "Otrek needs access to your current location"
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          position => {
            /*   var region = this.regionFrom(
                    position.coords.latitude,
                    position.coords.longitude,
                    position.coords.accuracy
                  ); */
            const newCoordinate = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA
            };
            this.setState({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              currentCoordinate: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
              }
            });
            if (Platform.OS === "android") {
              if (this.marker) {
                console.log("marker exists");
                this.marker._component.animateMarkerToCoordinate(
                  newCoordinate,
                  500
                );
              }
            } else {
              currentCoordinate.timing(newCoordinate).start();
            }
            /*     Geocoder.from({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                  })
                  .then((response) => {
                    // the response object is the same as what's returned in the HTTP API: https://developers.google.com/maps/documentation/geocoding/intro

                    this.from_region = region; // for storing the region in case the user presses the "reset" button

                    // update the state to indicate the user's origin on the map (using a marker)
                    this.setState({
                      start_location: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                      },
                      region: region, // the region displayed on the map
                      from: response.results[0].formatted_address // the descriptive name of the place
                    });

                  });*/

            /*        this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                currentCoordinate: {"latitude": position.coords.latitude, "longitude": position.coords.longitude},
                error: null,
                y: {"latitude": position.coords.latitude, "longitude": position.coords.longitude}
              });*/
            this.mergeLot();
          },
          error => console.log(error.message),
          {
            enableHighAccuracy: true,
            timeout: 10000
            //maximumAge: 3000
          }
        );
        //   timer = setInterval(this.getLocation,3000);
      } else {
        console.log("Geolocation permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    console.log("gfg"+params)
    if (params && params.chat) {
      params.chat = false;
      this.setState(
        {
          receiver: params.receiver,
          fire: params.fire,
          deviceToken: params.deviceToken
        },
        () => this.setState({ chat: true })
      );
    }
    if( params && params.message){

      console.log("message true"+JSON.stringify(params.message));
      this.setState(
        {
          status: params.message.status,message: params.message.message,
        },
        ()=> params.message = false)
      
           
    }
    this.requestGeolocationPermission();
    console.log(this.props.first_name);
  }
  navigator() {
    if (!this.state.end_location) {
      this.requestGeolocationPermission();
    } else {
      this.requestGeolocationPermissionSecond();
    }
  }
  startTrek() {
    this.getLocation();
    this.setState({ startTrek: true });
  }
  tweakDestination = () => {
    console.log("tweak");
    Geocoder.from({
      latitude: evt.nativeEvent.coordinate.latitude,
      longitude: evt.nativeEvent.coordinate.longitude
    }).then(response => {
      this.setState({
        to: response.results[0].formatted_address
      });
    });
    this.setState({
      end_location: evt.nativeEvent.coordinate
    });
  };
  _onMapReady = () => this.setState({ marginBottom: 0 });
  mergeLot() {
    if (this.state.latitude != null && this.state.longitude != null) {
      let concatLot = this.state.latitude + "," + this.state.longitude;
      this.setState({
        concat: concatLot
      });
    }
  }
  calcDistance = newLatLng => {
    const { prevLatLng } = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  };
  getDirectionsTo() {
    if (this.state.cordLatitude != null && this.state.cordLongitude != null) {
      let concatLot = this.state.cordLatitude + "," + this.state.cordLongitude;
      this.setState(
        {
          concatCord: concatLot
        },
        () => {
          this.getDirections(this.state.concat, concatLot);
        }
      );
    }
  }
  async getDirections(startLoc, destinationLoc) {
    try {
      let resp = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}`
      );
      let respJson = await resp.json();
      let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
      let coords = points.map((point, index) => {
        return {
          latitude: point[0],
          longitude: point[1]
        };
      });
      this.setState({ coords: coords });
      this.setState({ x: "true" });
      return coords;
    } catch (error) {
      console.log(JSON.stringify(error));
      this.setState({ x: "error" });
      return error;
    }
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>

              {/* <AlertModal status={this.state.status} message={this.state.message} /> */}
        <MapView
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 90
            //      marginBottom: this.state.marginBottom
          }}
          showsUserLocation={true}
     //     followsUserLocation={this.state.startTrek}
          region={{
            latitude: this.state.latitude
              ? this.state.latitude
              : default_region.latitude,
            longitude: this.state.longitude
              ? this.state.longitude
              : default_region.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          }}
          zoomEnabled={true}
          zoomControlEnabled={true}
        >
          {/*     {!!this.state.latitude && !!this.state.longitude && <MapView.Marker
              coordinate={{"latitude":this.state.latitude,"longitude":this.state.longitude}}
              title={"Start"}
              pinColor="#39ffb3"
            />*/}

          {/* {this.state.start_location && (
            <Marker
              coordinate={this.state.start_location}
              draggable
              onDragEnd={e =>
                this.setState({ start_location: e.nativeEvent.coordinate })
              }
              //        image={require('../assets/images/person-walking.png')}
            >
              <View style={styles.startCircleBig}>
                <View style={styles.startCircleSmall} />
              </View>
            </Marker>
          )} */}
          {this.state.end_location && (
            <Marker
              coordinate={this.state.end_location}
              draggable
              //        onDragEnd={this.tweakDestination}
              onDragEnd={e =>
                this.setState({ end_location: e.nativeEvent.coordinate })
              }
            >
              <View style={styles.endCircleBig}>
                <View style={styles.endCircleSmall} />
              </View>
            </Marker>
          )}
          {this.state.startTrek && (
            <Marker.Animated
              ref={marker => {
                this.marker = marker;
              }}
              image={require("../assets/images/person-walking.png")}
              coordinate={this.state.currentCoordinate}
            />
          )}
          {this.state.invited_location && (
            <Marker.Animated
              ref={markerQ => {
                this.markerQ = markerQ;
              }}
              image={require("../assets/images/personwalk.png")}
              coordinate={this.state.invited_location}
            />
          )}
          {this.state.start_location && this.state.end_location && (
            <MapViewDirections
              origin={{
                latitude: this.state.start_location.latitude,
                longitude: this.state.start_location.longitude
              }}
              destination={{
                latitude: this.state.end_location.latitude,
                longitude: this.state.end_location.longitude
              }}
              strokeWidth={5}
              strokeColor={"#39ffb3"}
              // mode={"WALKING"}
              apikey={"AIzaSyBRWIXQCbRpusFNiQitxMJy_89gguGk66w"}
            />
          )}
        </MapView>
        {this.state.start_location  && (
          <TouchableNativeFeedback onPress={this.startTrek.bind(this)}>
            <LinearGradient
              colors={["#57C693", "#377848"]}
              style={styles.startTrekButton}
            >
              <Image
                source={require("../assets/images/person-walking-white.png")}
                resizeMode="contain"
                style={{ height: 20, width: 10 }}
              />
            </LinearGradient>
          </TouchableNativeFeedback>
        )}
        {/* <TouchableNativeFeedback onPress={this.navigator.bind(this)}>
          <LinearGradient
            colors={["#57C693", "#377848"]}
            style={styles.myLocationButton}
          >
            <Image
              source={require("../assets/images/location.png")}
              resizeMode="contain"
              style={{ height: 20, width: 20 }}
            />
          </LinearGradient>
        </TouchableNativeFeedback> */}
        {this.state.find ? (
          <FindTrekkerBox
            start={this.state.from ? this.state.from : "Your current Location"}
            endLocation={this.getEndLocation}
            start_location={this.state.start_location}
            navigation={this.props.navigation}
            chat={this.state.chat}
            receiver={this.state.receiver}
            user_name={this.state.user_name}
            fire={this.state.fire}
            deviceToken={this.state.deviceToken}
            setChat={this.setChat.bind(this)}
            passMessage={this.passMessage.bind(this)}
          />
        ) : (
          <ChosenTrekkerBox
            receiver={this.state.receiver}
            fire={this.state.fire}
            deviceToken={this.state.deviceToken}
            back={this.back.bind(this)}
            deviceToken={this.state.deviceToken}
            passMessage={this.passMessage.bind(this)}
          />
        )}
      </SafeAreaView>
    );
  }
}
const Map = connect(mapStateToProps)(reduxMap);
export default Map;
const styles = StyleSheet.create({
  map: {},
  container: {
    flex: 1
  },
  startCircleBig: {
    backgroundColor: "rgba(89, 172, 123, 0.56)",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  startCircleSmall: {
    backgroundColor: "rgba(89, 172, 123, 1)",
    width: 16,
    height: 16,
    borderRadius: 10
  },
  endCircleBig: {
    backgroundColor: "rgba(255, 0, 0, 0.56)",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  endCircleSmall: {
    backgroundColor: "rgba(255, 0, 0, 1)",
    width: 16,
    height: 16,
    borderRadius: 8
  },
  startTrekButton: {
    position: "absolute",
    top: 15,
    left: 8,
    width: 35,
    height: 35,
    borderRadius: 9,
    //     backgroundColor: 'rgba(89, 172, 123, 1)',
    alignItems: "center",
    justifyContent: "center"
  },
  myLocationButton: {
    position: "absolute",
    top: 15,
    right: 8,
    width: 35,
    height: 35,
    borderRadius: 9,
    //     backgroundColor: 'rgba(89, 172, 123, 1)',
    alignItems: "center",
    justifyContent: "center"
  }
});
