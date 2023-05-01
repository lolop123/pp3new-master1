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
import {Picker} from "@react-native-picker/picker"
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
import SwitchSelector from "react-native-switch-selector";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView, { Marker } from "react-native-maps";
import { firebaseConfig } from "../fireconf";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

const Searchscreen = () => {
  var theBigDay = new Date(2000, 1, 2);
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [choosedPlase, setchoosedPlase] = useState(" ");
  const [textInputValue, setTextInputValue] = useState({
    mail: "admin",
    key: 1,
    name: "Joe",
    type: "admin",
  });
  const [datas, setDatas] = useState([
    {
      key: 1,
      name: "Joe",
      type: "admin",
    },
  ]);

  const [selectedLocation, setSelectedLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {

   
    console.log(textInputValue.mail);
    
    const getlocationofUser = async () => {
      const docRef = doc(db, "people", auth.currentUser?.email);
      const docSnap = await getDoc(docRef);
      setSelectedLocation(docSnap.data().interestGeop);
    };getlocationofUser();

    const choosePlaceRequest = async () => {
      const placesPool = collection(db, "people");
      const placesSnapshot = await getDocs(placesPool);
      const placesList = placesSnapshot.docs.map((doc) => doc.data());

      var fruits = placesList.filter(
        (human) => human.takerMail == auth.currentUser?.email
      );

      const docRef = await doc(db, "people", fruits[0].mail);
      const docSnap = await getDoc(docRef);
      setchoosedPlase(docSnap.data().permPlace);
     
     
    };
    choosePlaceRequest();
    const checlDoubles = async () => {
      const placesPool = collection(db, "people");
      const placesSnapshot = await getDocs(placesPool);
      const placesList = placesSnapshot.docs.map((doc) => doc.data());

      var fruits = placesList.filter(
        (human) => human.takerMail == auth.currentUser?.email
      );
      console.log("takers");
      console.log(fruits);

      for (let index = 0; index < fruits.length; index++) {
        const docRef = await doc(db, "people", fruits[index].mail);
        const docSnap = await getDoc(docRef);

        const docData = {
          currentPlace: 0,
          mail: docSnap.data().mail,
          permPlace: docSnap.data().permPlace,
          date: docSnap.data().date,
          dateMax: docSnap.data().dateMax,
          statusOfPermPla: "free",
          searchStatus: docSnap.data().searchStatus,
          takingEnd: theBigDay,
          takingStart: theBigDay,
          takerMail: "admin",
          geop: docSnap.data().geop,
          interestGeop: docSnap.data().interestGeop
        };
        await setDoc(doc(db, "people", fruits[index].mail), docData);
        console.log("удалили старое");
      }
    };

    const setPlace = async () => {
      const docRef = await doc(db, "people", textInputValue.mail);
      const docSnap = await getDoc(docRef);

      const docData = {
        currentPlace: 0,
        mail: docSnap.data().mail,
        permPlace: docSnap.data().permPlace,
        date: docSnap.data().date,
        dateMax: docSnap.data().dateMax,
        statusOfPermPla: "free",
        searchStatus: docSnap.data().searchStatus,
        takingEnd: docSnap.data().date,
        takingStart: textInputValue.dateMax,
        takerMail: auth.currentUser?.email,
        geop: docSnap.data().geop,
        interestGeop: docSnap.data().interestGeop
      };

      await setDoc(doc(db, "people", textInputValue.mail), docData);


      setchoosedPlase(docSnap.data().permPlace);
      console.log(docSnap.data().permPlace);
      console.log("вставили новое");
    };
    if (textInputValue.mail != "admin") {
      checlDoubles();
      setTimeout(setPlace, 500);
    } else {
      console.log("mail is admin");
    }
    
  }, [textInputValue]);

  const navigation = useNavigation();
  const [switcherStatus, setswitcherStatus] = useState(1);
  const handleSignOut = async () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => alert(error.message));
    await AsyncStorage.setItem("switcherStatusStorage", "a");
  };
  const handleSubmit = async () => {
    setTextInputValue(datas[0]);
  };
  const optionsOFSwitcher = [
    { label: "Just not for long", value: 0 },
    { label: "long-term", value: 1 },
  ];

  const handleMapPress = async (event) => {
    const lat = Number(event.nativeEvent.coordinate.latitude);
    const lg = Number(event.nativeEvent.coordinate.longitude);
    await setSelectedLocation({
      latitude: lat,
      longitude: lg,
    });

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
      geop: docSnap.data().geop,
      interestGeop:{
        latitude: lat,
        longitude: lg,
      }
    };
    setDoc(doc(db, "people", auth.currentUser?.email), docData);

    setReload((oldKey) => oldKey + 2);
  };

  async function searchFreePlace() {
    console.log("get start");

    const placesPool = collection(db, "people");
    const placesSnapshot = await getDocs(placesPool);
    const placesList = placesSnapshot.docs.map((doc) => doc.data());

    var fruits = placesList.filter(
      (human) =>
        human.date.toDate().toLocaleDateString("en-us") !=
        theBigDay.toLocaleDateString("en-us")
    );
    console.log(fruits);
    fruits.sort((a, b) => b.date - a.date);

    let i = 0; //сказал димыч
    // fruits.forEach((object, i) => {
    //   object.date = object.date.toDate().toLocaleDateString('en-us')
    //   object.key = i;
    //   i = i + 1;
    // });
    fruits.forEach((object) => {
      object.date = object.date.toDate().toLocaleDateString("en-us");
      object.dateMax = object.dateMax.toDate().toLocaleDateString("en-us");
      object.key = i;
      i = i + 1;
    });

    await setDatas(fruits);
    console.log("---------");
    console.log(datas);
  }

  return (
    <View style={styles.container}>
      <Text>{auth.currentUser?.email}</Text>
      <Text>Choosed {choosedPlase}</Text>

      <SwitchSelector
        buttonColor={"#000000"}
        options={optionsOFSwitcher}
        initial={0}
        onPress={(value) => setswitcherStatus(value)}
      />
      <TouchableOpacity onPress={searchFreePlace} style={styles.button}>
        <Text style={styles.buttonText}>Search free place</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSignOut} style={styles.button}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
     
  
      <View style={styles.submitView }> 

      <Picker  style={{ height: 50, width: 250 }}
        selectedValue={selectedLanguage}
        onValueChange={(itemValue, itemIndex) => setTextInputValue(datas[itemIndex])}
      >
         {datas.map((datasoption) => (
    <Picker.Item key={datasoption.key} label={datasoption.date + " - " + datasoption.dateMax} value={datasoption.key} />
  ))}
      </Picker>
      <TouchableOpacity onPress={handleSubmit} style={styles.buttonSub}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      </View>

      <MapView
        style={styles.map}
        onPress={handleMapPress}
        region={{
          latitude: 49.9808,
          longitude: 36.2527,
          latitudeDelta: 0.21,
          longitudeDelta: 0.21,
        }}
      >
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

export default Searchscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: 420,
    height: 200,
    marginTop: 10
  },
  buttonSub:{
    backgroundColor: "#000000",
    width: "20%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 0,
  },
  submitView:{
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',marginTop: 10
  },
  button: {
    backgroundColor: "#000000",
    width: "60%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  input: {
    color: "red",
    fontWeight: "700",
    fontSize: 16,
  },
});
