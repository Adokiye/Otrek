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
import firebase from "react-native-firebase";
import { GiftedChat } from "react-native-gifted-chat";
var db = firebase.firestore();
const haversine = require('haversine');
import LoaderModal from '../Modals/LoaderModal';
export default class ChatTrekkerBox extends Component {
  static navigationOptions = {
    header: null,
    drawerLockMode: "locked-closed"
  };
  constructor(props) {
    super(props);
    this.state = {
      trekkers: [],
      regLoader: false,
      messages: [],
    };
  }
  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
  //          name: 'React Native',
          },
        },
      ],
    })
  }
 /* onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }*/
  onSend(messages = []) {
    this.setState({messageLoader: true})
    console.log(JSON.stringify(messages)+"\n");
    const { params } = this.props.navigation.state;
    messages[0].sent = true;
    messages[0].received = false;
    messages[0].delivered = false;
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
   // const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    var toBeSent = {text: messages[0].text, user_id: this.props.token, sent: true, 
      updated_at: firebase.firestore.Timestamp.fromDate(new Date()),
      receiver_id: params.receiver.id, id: messages[0]._id, createdAt: new Date()};
    console.log("\n"+"to be sent"+" "+JSON.stringify(toBeSent)+'\n'); 
    var Ref = db.collection('messages').doc(params.me.email)
    .collection(params.receiver.email).doc('messages');
    Ref.get().then((doc) => {
      if(doc.exists){
        console.log('doc exists '+'\n'+'\n'+'\n'+'\n'+'\n'+'\n')
        Ref.update({messages:
        firebase.firestore.FieldValue.arrayUnion({text: messages[0].text, user_id: params.me.id, sent: true, 
        updated_at: firebase.firestore.Timestamp.fromDate(new Date()),
        receiver_id: params.receiver.id, id: messages[0]._id, read: false,
      isLaravel: false})})
      .then(function(){
        var config = {
          headers: {'Authorization': "Bearer " + params.token}
        };
        var bodyParameters = {
         id: params.me.id,
         receiver_id: params.receiver.id,
         message: messages[0].text,
         read: false,
         sent: true,
         message_id: messages[0]._id
        }
        axios.post(
            'http://10.0.2.2:8000/api/sendMessage',
            bodyParameters,
            config
        ).then((response) => {
          var Refnol = db.collection('messages').doc(params.me.email)
          .collection(params.receiver.email);
          Refnol.where('messages', 'array-contains', messages[0]._id).get()
          .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log("\n","\n",'\n','\n','\n', " => ", doc.data(),'\n','\n','\n');
          });
          })
          .catch(function(error) {
          console.log("Error getting documents: ", error);
          });
          this.setState({messageLoader: false})
        console.log(response);
        }).catch((error) => {
          this.setState({messageLoader: false})
            Alert.alert(
                'Error',
                  'Internal Server Error, please try again later',
                [
                  {text: 'OK'},
                ],  );    
                console.log(error); 
        }); 
      }.bind(this));
    }else{
      console.log('doc not exists '+'\n'+'\n'+'\n'+'\n'+'\n'+'\n')
      Ref.set({
        messages: [{text: messages[0].text, user_id: params.me.id, sent: true, 
          updated_at: firebase.firestore.Timestamp.fromDate(new Date()),
        receiver_id: params.receiver.id, id: messages[0]._id, read: false,
        isLaravel: false}]
      }, {merge: true}).then(function(){
        var config = {
          headers: {'Authorization': "Bearer " + params.token}
        };
        var bodyParameters = {
         id: params.me.id,
         receiver_id: params.receiver.id,
         message: messages[0].text,
         read: false,
         sent: true,
         message_id: messages[0]._id
        }
        axios.post(
            'http://10.0.2.2:8000/api/sendMessage',
            bodyParameters,
            config
        ).then((response) => {
          this.setState({messageLoader: false})
          var Refnol = db.collection('messages').doc(params.me.email)
          .collection(params.receiver.email);
          Refnol.where('messages', 'array-contains', messages[0]._id).get()
          .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log("\n","\n",'\n','\n','\n', " => ", doc.data(),'\n','\n','\n');
          });
          })
          .catch(function(error) {
          console.log("Error getting documents: ", error);
          });
        console.log(response);
        }).catch((error) => {
          this.setState({messageLoader: false})
            Alert.alert(
                'Error',
                  'Internal Server Error, please try again later',
                [
                  {text: 'OK'},
                ],  );    
                console.log(error); 
        }); 
    }.bind(this));
  }
  });
  }
  componentDidMount() {
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.cancelView}>
          <Image
            source={require("../../assets/images/cancel.png")}
            resizeMode="contain"
            style={styles.cancelImage}
          />
        </View>
        <View style={styles.firstView}>
        <Image
            source={require("../../assets/images/doe_image.png")}
            resizeMode="cover"
            style={styles.profileImage}
          />
          <Text style={styles.name}>Jane Olaoluwa</Text>
        </View>
        <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
        }}
      />
        <LoaderModal regLoader={this.state.regLoader} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    height: '80%',
    width: "100%",
    borderTopLeftRadius: 40,
    borderWidth: 1,
    borderColor: "#707070",
    position: 'absolute',
    bottom: 0
  },
  giftedChat: {
    width: '100%',
  //  height: '90%',
    marginTop: 8,
    alignSelf: 'center'
  },
  cancelView: {
    width: 13,
    height: 12,
    marginLeft: "6%",
    marginTop: 11.03
  },
  cancelImage: {
    flex: 1
  },
  firstView: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    width: "90%",
    height: 75,
    marginTop: 15
  },
  profileImage: {
    height: 75,
    width: 75,
    borderRadius: 37.5,
    marginLeft: '7%'
  },
  name: {
    color: "#000000",
    fontFamily: "mont-bold",
    fontSize: 20,
    marginLeft: 10
  },
  
});
