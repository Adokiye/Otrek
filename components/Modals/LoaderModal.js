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
  ActivityIndicator,
  TouchableNativeFeedback
} from "react-native";
import { Overlay } from 'react-native-elements';
export default class LoaderModal extends Component {
  static navigationOptions = {
    header: null,
    drawerLockMode: "locked-closed"
  };
  constructor(props) {
    super(props);
    this.state = {
     isVisible: true
    };
  }
  backer(){
    this.setState({ isVisible: false });
  }
  render() {
    const { params } = this.props;
    return (
         <Overlay
         isVisible={this.props.regLoader}
         onBackdropPress={this.backer.bind(this)}
         overlayBackgroundColor="white"
      //   borderRadius={10}
         width="auto"
         height="auto"
         containerStyle={{flexDirection: 'row', alignItems: 'center',
         padding: 20, justifyContent: 'space-evenly', position: 'absolute'}}
         >
         <View style={styles.bigView}>
        <ActivityIndicator color='#377848' size='small'/>
        <Text style={styles.loadingText}>
         Loading
         </Text>
         </View>
         </Overlay>
    );
  }
}
const dimensions = Dimensions.get("window");
const styles = StyleSheet.create({
    bigView: {
     width: 120,
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'space-around',
     
    },
    loadingText: {
        fontSize: 20, color: 'black', 
        fontFamily: 'mont-reg', 
        textAlign: 'center', 
        marginLeft: 10
    }
});
