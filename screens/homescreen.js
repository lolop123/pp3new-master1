import {
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
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
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView, { Marker } from 'react-native-maps';
import {firebaseConfig} from '../fireconf';


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

const HomeScreen = () => {
  var theBigDay = new Date(2000, 1, 2);
  const [reload, setReload] = useState(0);

 

  useEffect(() => {
    const getcurrPlace = async () => {
      const docRef = doc(db, "people", auth.currentUser?.email);
      const docSnap = await getDoc(docRef);
      console.log("-------");
      
      const timeElapsed = Date.now();
      const today = new Date(timeElapsed);
      let numberMinusDays =
        docSnap.data().date.toDate().setHours(0, 0, 0, 0) -
        today.setHours(0, 0, 0, 0);
      console.log(numberMinusDays / (1000 * 60 * 60 * 24));
      if (numberMinusDays / (1000 * 60 * 60 * 24) > 0) {
        console.log("Using");
        setplaceStatus("Using");
      } else if (
        numberMinusDays / (1000 * 60 * 60 * 24) < 1 &&
        numberMinusDays / (1000 * 60 * 60 * 24) > -50
      ) {
        setplaceStatus("Free");
        console.log("free");
      } else if (numberMinusDays / (1000 * 60 * 60 * 24) < -50) {
        setplaceStatus("Not sharing");
      }

      setSelectedLocation(docSnap.data().geop);
      setSelectedLocation(docSnap.data().geop);
      console.log("запросили geop:" );
      console.log(docSnap.data().geop)
      console.log(selectedLocation)

      
      
      console.log("in bd " +  docSnap.data().permPlace);
      
       setpermPlace(docSnap.data().permPlace)
      

      console.log("in state " + permanentPlace);

      console.log("entered effect" + docSnap.data().date.toDate());
      setShareDateStart(
        docSnap.data().date.toDate().toLocaleDateString("en-us")
      );
      if (
        docSnap.data().dateMax.toDate().setHours(0, 0, 0, 0) ==
        theBigDay.setHours(0, 0, 0, 0)
      ) {
        console.log('в докснепе'+docSnap.data().dateMax.toDate().setHours(0, 0, 0, 0))
        console.log('в бигдейте'+theBigDay.setHours(0, 0, 0, 0))
        setshareDateEnd(" ");
      } else {
        
        setshareDateEnd(
          docSnap.data().dateMax.toDate().toLocaleDateString("en-us")
        );
      }

      console.log("get" + permanentPlace);
      if (docSnap.data().permPlace == "Please enter your permanent place") {
        setPermPlaceVisible(true);
      } else {
        setPermPlaceVisible(false);
      }
      if (
        docSnap.data().date.toDate().setHours(0, 0, 0, 0) ==
        theBigDay.setHours(0, 0, 0, 0)
      ) {
        setSharePlaceVisible(false);
      } else {
        setSharePlaceVisible(true);
      }
    };
    getcurrPlace();
  }, [reload]);

  async function settPlace() {
    const docSnap = await getDoc(doc(db, "people", auth.currentUser?.email));
    const docData = {
      currentPlace: 0,
      mail: auth.currentUser?.email,
      permPlace: parkingPlace,
      date: docSnap.data().date,
      dateMax: docSnap.data().dateMax,
      statusOfPermPla: "free",
      searchStatus: docSnap.data().searchStatus,
      takingEnd: docSnap.data().takingEnd,
      takingStart: docSnap.data().takingStart,
      takerMail: docSnap.data().takerMail,
    };

    setDoc(doc(db, "people", auth.currentUser?.email), docData);
    setpermPlace(parkingPlace);
 
    setReload((oldKey) => oldKey + 2);

  }

  const [parkingPlace, setPlace] = useState("");
  const [currPlace, setcurrPlace] = useState("");
  const [permanentPlace, setpermPlace] = useState("111");
  const [placeStatus, setplaceStatus] = useState("222");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisibleMax, setDatePickerVisibilityMax] = useState(false);
  const [isPermPlaceVisible, setPermPlaceVisible] = useState(false);
  const [isSharePlaceVisible, setSharePlaceVisible] = useState(false);
  const [shareDateStart, setShareDateStart] = useState("");
  const [shareDateEnd, setshareDateEnd] = useState("");
  const [selectedLocation, setSelectedLocation] = useState({
    "latitude": 0,
    "longitude": 0,
  });

  const handleMapPress = async(event)=> {
    const lat = Number(event.nativeEvent.coordinate.latitude);
    const lg = Number(event.nativeEvent.coordinate.longitude);
    await setSelectedLocation({
      latitude: lat,
      longitude: lg,
    })
   
    
    //console.log("только что выбрали:");
    //console.log(selectedLocation);

    const docSnap = await getDoc(doc(db, "people", auth.currentUser?.email));

    const docData = {
      currentPlace: 0,
      mail: auth.currentUser?.email,
      permPlace: docSnap.data().permPlace,
      date: docSnap.data().date,
      dateMax: docSnap.data().dateMax,
      statusOfPermPla: docSnap.data().statusOfPermPla,
      searchStatus: docSnap.data().searchStatus,
      takingEnd: docSnap.data().takingEnd,
      takingStart: docSnap.data().takingStart,
      takerMail: docSnap.data().takerMail,
      geop:{
        "latitude": lat,
        "longitude": lg,
      }
    };
  setDoc(doc(db, "people", auth.currentUser?.email), docData); 

  setReload((oldKey) => oldKey + 2);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const showDatePickerMax = () => {
    setDatePickerVisibilityMax(true);
  };

  const hideDatePickerMax = () => {
    setDatePickerVisibilityMax(false);
  };

  const handleConfirm = async (date) => {
    console.log("A min date has been picked: ", date);
    const docSnap = await getDoc(doc(db, "people", auth.currentUser?.email));

    const docData = {
      currentPlace: 0,
      mail: auth.currentUser?.email,
      permPlace: docSnap.data().permPlace,
      date: date,
      dateMax: docSnap.data().dateMax,
      statusOfPermPla: 'free',
      searchStatus: docSnap.data().searchStatus,
      takingEnd: docSnap.data().takingEnd,
      takingStart: docSnap.data().takingStart,
      takerMail: docSnap.data().takerMail,
    };
    
     setDoc(doc(db, "people", auth.currentUser?.email), docData);
    
    hideDatePicker();

    console.log("hi " + shareDateStart);
    
  };

  const handleConfirmMax = async (date) => {
    console.log("A max date has been picked: ", date);

    const docSnap = await getDoc(doc(db, "people", auth.currentUser?.email));

    const docData = {
      currentPlace: 0,
      mail: auth.currentUser?.email,
      permPlace: docSnap.data().permPlace,
      date: docSnap.data().date,
      dateMax: date,
      statusOfPermPla: "free",
      searchStatus: docSnap.data().searchStatus,
      takingEnd: docSnap.data().takingEnd,
      takingStart: docSnap.data().takingStart,
      takerMail: docSnap.data().takerMail,
    };
    setDoc(doc(db, "people", auth.currentUser?.email), docData);
    hideDatePickerMax();
    setReload((oldKey) => oldKey + 1);
  };

  const navigation = useNavigation();

  const handleSignOut = async () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => alert(error.message));
    await AsyncStorage.setItem("switcherStatusStorage", "a");
  };
  // async function getPlace() {
  //   const docSnap = await getDoc(doc(db, "people", auth.currentUser?.email));

  //   const docData = {
  //     currentPlace: docSnap.data().currentPlace,
  //     mail: auth.currentUser?.email,
  //     permPlace: docSnap.data().permPlace,
  //     date: docSnap.data().date,
  //     dateMax: docSnap.data().dateMax,
  //     statusOfPermPla: docSnap.data().statusOfPermPla,
  //     searchStatus: docSnap.data().searchStatus,
  //     takingEnd: theBigDay,
  //     takingStart: theBigDay,
  //     takerMail: docSnap.data().takerMail,
  //   };
  //   setDoc(doc(db, "people", auth.currentUser?.email), docData);
  // }
  async function getpermPlace() {
    const docRef = doc(db, "people", "lol@gmail.com");
    const docSnap = await getDoc(docRef);

    //console.log("Document data:", docSnap.data().permPlace);
    setpermPlace(docSnap.data().permPlace);
  }

  async function dontShareF() {
    const docSnap = await getDoc(doc(db, "people", auth.currentUser?.email));

    const docData = {
      currentPlace: docSnap.data().currentPlace,
      mail: auth.currentUser?.email,
      permPlace: docSnap.data().permPlace,
      date: theBigDay,
      dateMax: theBigDay,
      statusOfPermPla: docSnap.data().statusOfPermPla,
      searchStatus: docSnap.data().searchStatus,
      takingEnd: docSnap.data().takingEnd,
      takingStart: docSnap.data().takingStart,
      takerMail: docSnap.data().takerMail,
    };
    try {
      setDoc(doc(db, "people", auth.currentUser?.email), docData);
    } catch (e) {
      logMyErrors(e);
    }
    setReload((oldKey) => oldKey + 1);
  }

  return (
    <View style={styles.container}>
      <Text>Email: {auth.currentUser?.email}</Text>
      
      <TextInput
        
        placeholder={permanentPlace}
        value={parkingPlace}
        onChangeText={(text) => setPlace(text)}
        onSubmitEditing={settPlace}
      />
      {!isPermPlaceVisible ? (<Text>Your place status: {placeStatus}</Text>   ) : null}
      {isSharePlaceVisible ? (
        <Text>
          You will share place from: {shareDateStart} to {shareDateEnd}{" "}
        </Text>
      ) : null}
      {isPermPlaceVisible ? (
        <TouchableOpacity onPress={settPlace} style={styles.button}>
          <Text style={styles.buttonText}>Set my place</Text>
        </TouchableOpacity>
      ) : null}
      {!isPermPlaceVisible ? (
      <TouchableOpacity onPress={showDatePicker} style={styles.button}>
        <Text style={styles.buttonText}>set date min</Text>
      </TouchableOpacity>
       ) : null}
       {!isPermPlaceVisible ? (
      <TouchableOpacity onPress={showDatePickerMax} style={styles.button}>
        <Text style={styles.buttonText}>set date max</Text>
      </TouchableOpacity>
       ) : null}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisibleMax}
        mode="date"
        onConfirm={handleConfirmMax}
        onCancel={hideDatePickerMax}
      />
      {/* <TouchableOpacity onPress={getPlace} style={styles.button}>
        <Text style={styles.buttonText}>My place</Text>
      </TouchableOpacity> */}
      {isSharePlaceVisible ? (
      <TouchableOpacity onPress={dontShareF} style={styles.button}>
        <Text style={styles.buttonText}>Dont share</Text>
      </TouchableOpacity>
        ) : null}
      <TouchableOpacity onPress={handleSignOut} style={styles.button}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>

      <MapView style={styles.map} onPress={handleMapPress}  region={{ latitude: 49.9808, longitude: 36.2527, latitudeDelta: 0.21, longitudeDelta: 0.21 }} >
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title="Selected Location"
            description="This is the selected location"
          />
        )}
      </MapView>

    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: 200,
    height: 200,
  },
  button: {
    backgroundColor: "#000000",
    width: "60%",
    padding: 14,
    borderRadius: 19,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: "700",
    fontSize: 16,
  },
  input: {
    color: "red",
    fontWeight: "700",
    fontSize: 16,
  },
});
