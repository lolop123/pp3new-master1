import {
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import SwitchSelector from "react-native-switch-selector";
import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";



import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {firebaseConfig} from '../fireconf';

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getAuth1, signInWithEmailAndPassword } from "firebase/auth";



const _storeData = async (value) => {
  try {
    await AsyncStorage.setItem(
      'switcherStatusStorage',
      value
    );
    console.log(value)
  } catch (error) {
    // Error saving data
  }
};
async function retrieveData () {
  console.log('попали в');
  try {
    const value = await AsyncStorage.getItem('switcherStatusStorage');
    if (value !== null) {
      console.log('лежит' + value);
      return(value)
    }
  } catch (error) {
    console.log(error)
  }
  
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();


const LoginScreen = () => {
  var theBigDay = new Date(2000, 1, 2);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [switcherStatus, setswitcherStatus] = useState(0);

  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => 
    {
      retrieveData().then(data =>{
        console.log('effect' + data)
        if (user && (data === 'a')) {
          navigation.replace("Home");
        } else if(user && (data === 'b')){
          navigation.replace("Search");
        }
      });
      })
      
      
          
    
        return unsubscribe;
      });

  const handleSignUp = async () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Registered with:", user.email);
        const docData = {
          currentPlace: 0,
          mail: user.email,
          permPlace: 'Please enter your permanent place',
          date: theBigDay,
          dateMax : theBigDay,
          statusOfPermPla: "free",
          searchStatus: 'a',
          takingEnd: theBigDay,
          takingStart:theBigDay,
          takerMail: 'admin',
          geop:{
            "latitude": 0.0,
            "longitude": 0.0,
          }
        };
        console.log('check register1')
       setDoc(doc(db, "people", user.email), docData);
        console.log('check register2')
      })
      .catch((error) => alert(error.message));
      console.log('check register2')
    

    
  };

  const handleLogin = async () => {
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Logged in with:", user.email);
      })
      .catch((error) => alert(error.message));
      console.log('logged in')
    // sendSearchStatus();
  };

  // async function sendSearchStatus() {
  //   console.log("get start");
  //   const docSnap = await getDoc(doc(db, "people", auth.currentUser?.email));
  //   const docData = {
  //     currentPlace: docSnap.data().currentPlace,
  //     mail: auth.currentUser?.email,
  //     permPlace: docSnap.data().permPlace,
  //     date: docSnap.data().date,
  //     dateMax: docSnap.data().dateMax,
  //     statusOfPermPla: docSnap.data().statusOfPermPla,
  //     searchStatus: switcherStatus,
  //   };

  //   setDoc(doc(db, "people", auth.currentUser?.email), docData);
  //   console.log("sended" + switcherStatus);
  //   console.log("login end");
  // }

  const optionsOFSwitcher = [
    { label: "I have place", value: 'a' },
    { label: "Ill search place", value: 'b' },
  ];
  
  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.inputContainer}>
        <SwitchSelector
        buttonColor={'#000000'}
          options={optionsOFSwitcher}
          initial={0}
          onPress={(value) => _storeData(value)}
          
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handleSignUp}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
       {/*  <MapView style={styles.map} />*/}
      </View> 
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "#000000",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutlineText: {
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

