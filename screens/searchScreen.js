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
import SwitchSelector from "react-native-switch-selector";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalSelector from 'react-native-modal-selector'
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import {firebaseConfig} from '../fireconf';


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();



const Searchscreen = () => {
  var theBigDay = new Date(2000, 1, 2);
  const [choosedPlase, setchoosedPlase] = useState(" ")
  const [textInputValue, setTextInputValue] = useState(
    {
      mail: "admin",
      key: 1,
      name: "Joe",
      type: "admin"
    }
  );
  const [datas, setDatas] = useState([
    {
      key: 1,
      name: "Joe",
      type: "admin"
    }
  ]);
  const [sstate, setState] = useState({
      
    tableData: [
      ['1'],
      ['17'],
      ['52'],
      ['74'],
    ]
  }) 
  console.log('table=' + sstate.tableData[0][0])

  useEffect(() => {


    console.log(textInputValue.mail)

    const  choosePlaceRequest = async () => {
      const placesPool = collection(db, "people");
      const placesSnapshot = await getDocs(placesPool);
      const placesList = placesSnapshot.docs.map((doc) => doc.data());
      
      var fruits = placesList.filter(human => human.takerMail  == auth.currentUser?.email )

      const docRef = await doc(db, "people", fruits[0].mail);
        const docSnap = await getDoc(docRef);
        setchoosedPlase(docSnap.data().permPlace)

        sstate.tableData = [
          ['1', '2', '3', '4', '5','6', '7','8', '9', '10','11', '12', '13', '14', '15', '16'],
          ['17', '18', '19', '20', '21','22', '23', '24', '25','26','27', '28', '29', '30','31', '32', '33', '34', '35', '36'],
          ['52', '51', '50', '49','48', '47', '46', '45', '44', '43','42', '41', '40', '39','38','37'],
          ['74', '73', '72','71', '70', '69', '68', '67','66', '65', '64', '63', '62', '61','60', '59', '58', '57','56', '55', '54', '53'],
        ]

        for (let index = 0; index < sstate.tableData.length; index++) {
          console.log('if'+sstate.tableData[index])
          
          for (let indexx = 0; indexx < sstate.tableData[index].length; indexx++) {
           
            if(docSnap.data().permPlace == sstate.tableData[index][indexx]){
  
              console.log('if'+sstate.tableData[index][indexx])
              sstate.tableData[index][indexx] = '*';
              console.log('if'+sstate.tableData[index][indexx])
              setState(sstate)
              console.log(sstate)
            }
          }
        }






    }
    choosePlaceRequest()
    const  checlDoubles = async () => {

    const placesPool = collection(db, "people");
      const placesSnapshot = await getDocs(placesPool);
      const placesList = placesSnapshot.docs.map((doc) => doc.data());
      
      var fruits = placesList.filter(human => human.takerMail  == auth.currentUser?.email )
      console.log('takers')
      console.log(fruits)

      for (let index = 0; index < fruits.length; index++) {
      
        const docRef = await doc(db, "people", fruits[index].mail);
        const docSnap = await getDoc(docRef);

        const docData = {
          currentPlace: 0,
          mail: docSnap.data().mail,
          permPlace: docSnap.data().permPlace,
          date: docSnap.data().date,
          dateMax : docSnap.data().dateMax,
          statusOfPermPla: "free",
          searchStatus: docSnap.data().searchStatus,
          takingEnd: theBigDay,
          takingStart: theBigDay,
          takerMail: 'admin'
        };
        await setDoc(doc(db, "people", fruits[index].mail), docData);
        console.log('удалили старое')
      }
      

    }
    

        const  setPlace = async () => {
        
          const docRef = await doc(db, "people", textInputValue.mail);
      const docSnap = await getDoc(docRef);

      const docData = {
        currentPlace: 0,
        mail: docSnap.data().mail,
        permPlace: docSnap.data().permPlace,
        date: docSnap.data().date,
        dateMax : docSnap.data().dateMax,
        statusOfPermPla: "free",
        searchStatus: docSnap.data().searchStatus,
        takingEnd: docSnap.data().date,
        takingStart:textInputValue.dateMax,
        takerMail: auth.currentUser?.email
      };
      
      await setDoc(doc(db, "people", textInputValue.mail), docData);
      console.log('set do=' + sstate.tableData)
      
      
      console.log('set after=' + sstate.tableData)

      
      setchoosedPlase(docSnap.data().permPlace)
      console.log(docSnap.data().permPlace)
      console.log('вставили новое')
      
      }
      if (textInputValue.mail != 'admin') {
        checlDoubles();
        setTimeout(setPlace, 500)
        
        
      } else{console.log('mail is admin')}

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
        await AsyncStorage.setItem(
          'switcherStatusStorage',
          'a'
        );
    };


    const optionsOFSwitcher = [
      { label: "Just not for long", value: 0 },
      { label: "long-term", value: 1 },
    ];
    async function searchFreePlace() {
      console.log("get start");

      
      const placesPool = collection(db, "people");
      const placesSnapshot = await getDocs(placesPool);
      const placesList = placesSnapshot.docs.map((doc) => doc.data());
      
      var fruits = placesList.filter(human => human.date.toDate().toLocaleDateString('en-us')  != theBigDay.toLocaleDateString('en-us'))
      console.log(fruits)
      fruits.sort((a, b) => a.date - b.date);

      let i = 0;                            //сказал димыч
      // fruits.forEach((object, i) => {
      //   object.date = object.date.toDate().toLocaleDateString('en-us') 
      //   object.key = i;
      //   i = i + 1;
      // });
      fruits.forEach(object => {
        object.date = object.date.toDate().toLocaleDateString('en-us') 
        object.key = i;
        i = i + 1;
      });
     
    await setDatas(fruits);
    console.log('---------')
    console.log(datas)
    }
      
return (
  
  <View style={styles.container}>
    <Text>{auth.currentUser?.email}</Text>
    <Text>Choosed {choosedPlase}</Text>
        <Table style={styless.container} borderStyle={{borderWidth: 1}}>
         
          <TableWrapper style={styless.wrapper}>
            <Col data={sstate.tableTitle} style={styless.title} heightArr={[28,28]} textStyle={styless.text}/>
            <Rows data={sstate.tableData} flexArr={[1, 1, 1]} style={styless.row} textStyle={styless.text}/>
          </TableWrapper>
        </Table>
    <SwitchSelector
    buttonColor={'#000000'}
    
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
    <ModalSelector
    
                    data={datas}
                    initValue="Select something yummy!"
                    supportedOrientations={['landscape']}
                    accessible={true}
                    scrollViewAccessibilityLabel={'Scrollable options'}
                    cancelButtonAccessibilityLabel={'Cancel Button'}
                    labelExtractor= {item => item.date}

                    onChange={(option)=>{ setTextInputValue(option)}}>
                    
                </ModalSelector>
                
        
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
input:{
  color: "red",
  fontWeight: "700",
  fontSize: 16,
},


});

const styless = StyleSheet.create({
  container: { width: '100%', height: 115,marginBottom:10},

  wrapper: {flex: 1, flexDirection: 'row' },
  title: { flex: 1, backgroundColor: 'black' },
  row: {  height: 28  },
  text: { textAlign: 'center' }
});
