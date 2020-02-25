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
  Platform,
  PermissionsAndroid,
  Alert,
  TouchableNativeFeedback,
  BackHandler,
  DeviceEventEmitter,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import MapView, {
  Marker,
  Callout,
  AnimatedRegion,
  Animated,
} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geocoder from 'react-native-geocoding';
import FindTrekkerBox from './MapBoxes/FindTrekkerBox';
import FirstTrekkerBox from './MapBoxes/FirstTrekkerBox';
import ChosenTrekkerBox from './MapBoxes/ChosenTrekkerBox';
import ChatTrekkerBox from './MapBoxes/ChatTrekkerBox';
import Polyline from '@mapbox/polyline';
import Geolocation from '@react-native-community/geolocation';
const google_api_key = 'AIzaSyBRWIXQCbRpusFNiQitxMJy_89gguGk66w';
import firebase from 'react-native-firebase';
import LinearGradient from 'react-native-linear-gradient';
var db = firebase.firestore();
const haversine = require('haversine');
Geocoder.init(google_api_key);
const LATITUDE_DELTA = 0.0005;
const LONGITUDE_DELTA = 0.005;
const default_region = {
  latitude: 6.45407,
  longitude: 3.39467,
  latitudeDelta: 1,
  longitudeDelta: 1,
};
import { connect } from 'react-redux';
const mapStateToProps = state => ({
  ...state,
});
class reduxMap extends Component {
  getMapRegion = () => ({
    latitude: this.state.changedLatitude,
    longitude: this.state.changedLongitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  static navigationOptions = {
    header: null,
    drawerLockMode: 'locked-closed',
  };
  getEndLocation = (lat, long) => {
    this.setState(
      {
        end_location: {
          latitude: lat,
          longitude: long,
        },
      },
      () =>
        db
          .collection('users')
          .doc(this.props.token)
          .update({
            'details.end_location': { latitude: lat, longitude: long },
          })
          .then(function() {
            console.log('Document successfully updated!');
          })
    );
  };
  constructor(props) {
    super(props);
    this.from_region = null;
    //  this.watchId = null;
    this.state = {
      destinationRegion: '',
      latitude: null,
      longitude: null,
      concat: null,
      concatCord: null,
      coords: [],
      x: 'false',
      cordLatitude: null,
      cordLongitude: null,
      y: '',
      z: '',
      from: '',
      to: '',
      region: default_region,
      start_location: null,
      end_location: null,
      currentCoordinate: new AnimatedRegion({
        latitude: 6.45407,
        longitude: 3.39467,
        latitudeDelta: 0,
        longitudeDelta: 0,
      }),
      distanceTravelled: '',
      prevLatLng: [],
      debugText: '',
      changedLatitude: null,
      changedLongitude: null,
      marginBottom: 1,
      start_location: null,
      end_location: null,
      email: null,
      startTrek: false,
      chat: false,
      receiver: {},
      fire: '',
      deviceToken: '',
      invited_location: null,
      find: true,
      chosen: false,
      user_name: ''
    };
    this.mergeLot = this.mergeLot.bind(this);
    this.getDirectionsTo = this.getDirectionsTo.bind(this);
    this.getLocation = this.getLocation.bind(this);
  }
  componentWillUnmount() {
    clearInterval(this.intervalId);
    Geolocation.clearWatch(this.watchID);
  }

  componentDidUpdate() {
    const { params } = this.props.navigation.state;
    if (params && params.chat) {
      params.chat = false;
      console.log('chat true');
      this.setState(
        {
          receiver: params.receiver,
          user_name: params.user_name,
          fire: params.fire,
          deviceToken: params.deviceToken,
        },
        () => this.setState({ chat: true })
      );
    }
    if (params && params.invite) {
      console.log(params.start_location)
      console.log(JSON.log(params.start_location))
      params.invite = false;
      this.setState({ invited_location: params.start_location });
    }
    if (params && params.chosen) {
      params.chosen = false;
      this.setState({ receiver: params.receiver }, () =>
        this.setState({ find: false })
      );
    }
  }

  setChat = () => {
    this.setState({ chat: false }, ()=> console.log("chat==> false"));
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
      longitudeDelta: Math.max(0, lonDelta),
    };
  }
  getLocation() {
    this.watchID = Geolocation.watchPosition(
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
          longitudeDelta: LONGITUDE_DELTA,
        };
        /*      this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
               currentCoordinate: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                }
              }) */
        if (Platform.OS === 'android') {
          if (this.marker) {
            console.log('marker exists');
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
        distanceFilter: 1,
      }
    );
  }
  hideErrorModal = value => {
    if (value == 'true') {
      this.setState({ error: false });
    }
  };
  async requestGeolocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Otrek Geolocation Permission',
          message: 'Otrek needs access to your current location',
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
                  longitude: position.coords.longitude,
                },
                currentCoordinate: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
                },
              },
              () =>
                db
                  .collection('users')
                  .doc(this.props.token)
                  .update({
                    'details.start_location': {
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude,
                    },
                  })
                  .then(function() {
                    console.log('Document successfully updated!');
                  })
            );
          },
          error => console.log(error.message + ' issues')
          // {enableHighAccuracy: false, timeout: 20000,

          // },
        );
      } else {
        console.log('Geolocation permission denied');
      }
    } catch (err) {
      console.warn(err + 'fkfk');
    }
  }
  async requestGeolocationPermissionSecond() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Otrek Geolocation Permission',
          message: 'Otrek needs access to your current location',
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
              longitudeDelta: LONGITUDE_DELTA,
            };
            this.setState({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              currentCoordinate: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              },
            });
            if (Platform.OS === 'android') {
              if (this.marker) {
                console.log('marker exists');
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
            timeout: 10000,
            //maximumAge: 3000
          }
        );
        //   timer = setInterval(this.getLocation,3000);
      } else {
        console.log('Geolocation permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    if (params && params.chat) {
      params.chat = false;
      this.setState(
        {
          receiver: params.receiver,
          fire: params.fire,
          deviceToken: params.deviceToken,
        },
        () => this.setState({ chat: true })
      );
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
    console.log('tweak');
    Geocoder.from({
      latitude: evt.nativeEvent.coordinate.latitude,
      longitude: evt.nativeEvent.coordinate.longitude,
    }).then(response => {
      this.setState({
        to: response.results[0].formatted_address,
      });
    });
    this.setState({
      end_location: evt.nativeEvent.coordinate,
    });
  };
  _onMapReady = () => this.setState({ marginBottom: 0 });
  mergeLot() {
    if (this.state.latitude != null && this.state.longitude != null) {
      let concatLot = this.state.latitude + ',' + this.state.longitude;
      this.setState({
        concat: concatLot,
      });
    }
  }
  calcDistance = newLatLng => {
    const { prevLatLng } = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  };
  getDirectionsTo() {
    if (this.state.cordLatitude != null && this.state.cordLongitude != null) {
      let concatLot = this.state.cordLatitude + ',' + this.state.cordLongitude;
      this.setState(
        {
          concatCord: concatLot,
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
          longitude: point[1],
        };
      });
      this.setState({ coords: coords });
      this.setState({ x: 'true' });
      return coords;
    } catch (error) {
      console.log(JSON.stringify(error));
      this.setState({ x: 'error' });
      return error;
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 90,
            //      marginBottom: this.state.marginBottom
          }}
          showsUserLocation={true}
          followsUserLocation={this.state.startTrek}
          region={{
            latitude: this.state.latitude
              ? this.state.latitude
              : default_region.latitude,
            longitude: this.state.longitude
              ? this.state.longitude
              : default_region.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          zoomEnabled={true}
          zoomControlEnabled={true}
        >
          {/*     {!!this.state.latitude && !!this.state.longitude && <MapView.Marker
              coordinate={{"latitude":this.state.latitude,"longitude":this.state.longitude}}
              title={"Start"}
              pinColor="#39ffb3"
            />*/}

          {this.state.start_location && (
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
          )}
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
          {this.state.end_location && this.state.startTrek && (
            <Marker.Animated
              ref={marker => {
                this.marker = marker;
              }}
              image={require('../assets/images/person-walking.png')}
              coordinate={this.state.currentCoordinate}
            />
          )}
          {this.state.invited_location && (
            <Marker.Animated
              ref={marker => {
                this.marker = marker;
              }}
              image={require('../assets/images/personwalk.png')}
              coordinate={this.state.invited_location}
            />
          )}
          {this.state.start_location && this.state.end_location && (
            <MapViewDirections
              origin={{
                latitude: this.state.start_location.latitude,
                longitude: this.state.start_location.longitude,
              }}
              destination={{
                latitude: this.state.end_location.latitude,
                longitude: this.state.end_location.longitude,
              }}
              strokeWidth={5}
              strokeColor={'#39ffb3'}
              // mode={"WALKING"}
              apikey={'AIzaSyBRWIXQCbRpusFNiQitxMJy_89gguGk66w'}
            />
          )}
        </MapView>
        {this.state.start_location && this.state.end_location && (
          <TouchableNativeFeedback onPress={this.startTrek.bind(this)}>
            <LinearGradient
              colors={['#57C693', '#377848']}
              style={styles.startTrekButton}
            >
              <Image
                source={require('../assets/images/person-walking-white.png')}
                resizeMode="contain"
                style={{ height: 20, width: 10 }}
              />
            </LinearGradient>
          </TouchableNativeFeedback>
        )}
        <TouchableNativeFeedback onPress={this.navigator.bind(this)}>
          <LinearGradient
            colors={['#57C693', '#377848']}
            style={styles.myLocationButton}
          >
            <Image
              source={require('../assets/images/location.png')}
              resizeMode="contain"
              style={{ height: 20, width: 20 }}
            />
          </LinearGradient>
        </TouchableNativeFeedback>
        {this.state.find ? (
          <FindTrekkerBox
            start={this.state.from ? this.state.from : 'Your current Location'}
            endLocation={this.getEndLocation}
            start_location={this.state.start_location}
            navigation={this.props.navigation}
            chat={this.state.chat}
            receiver={this.state.receiver}
            user_name={this.state.user_name}
            fire={this.state.fire}
            deviceToken={this.state.deviceToken}
            setChat={this.setChat.bind(this)}
          />
        ) : (
          <ChosenTrekkerBox
            receiver={this.state.receiver}
            fire={this.state.fire}
            deviceToken={this.state.deviceToken}
          />
        )}
      </View>
    );
  }
}
const Map = connect(mapStateToProps)(reduxMap);
export default Map;
const styles = StyleSheet.create({
  map: {},
  container: {
    flex: 1,
  },
  startCircleBig: {
    backgroundColor: 'rgba(89, 172, 123, 0.56)',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startCircleSmall: {
    backgroundColor: 'rgba(89, 172, 123, 1)',
    width: 16,
    height: 16,
    borderRadius: 10,
  },
  endCircleBig: {
    backgroundColor: 'rgba(255, 0, 0, 0.56)',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endCircleSmall: {
    backgroundColor: 'rgba(255, 0, 0, 1)',
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  startTrekButton: {
    position: 'absolute',
    top: 15,
    left: 8,
    width: 35,
    height: 35,
    borderRadius: 9,
    //     backgroundColor: 'rgba(89, 172, 123, 1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  myLocationButton: {
    position: 'absolute',
    top: 15,
    right: 8,
    width: 35,
    height: 35,
    borderRadius: 9,
    //     backgroundColor: 'rgba(89, 172, 123, 1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
