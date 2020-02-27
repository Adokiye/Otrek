import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  StatusBar,
  View
} from "react-native";
import LoaderModal from './Modals/LoaderModal';
var SharedPreferences = require("react-native-shared-preferences");
type Props = {};
import { connect } from "react-redux";
const mapStateToProps = state => ({
  ...state
});
class reduxSplash extends Component<Props> {
  static navigationOptions = {
    header: null,
    drawerLockMode: "locked-closed"
  };
  constructor(props) {
    super(props);
    this.state = {
     regLoader: true
    };
  }
  componentDidMount(){
   if(this.props.token){
     this.setState({regLoader: false})
  this.props.navigation.navigate('Map')
    // this.props.navigation.navigate('RegisterScreen')
   }else{
    this.setState({regLoader: false})
    this.props.navigation.navigate('RegisterScreen')
   }
  }
  render() {
    return (
       <LoaderModal
       regLoader={this.state.regLoader}
        />
    );
  }
}
const Splash = connect(
  mapStateToProps,
)(reduxSplash);
export default Splash;
const styles = StyleSheet.create({
});
