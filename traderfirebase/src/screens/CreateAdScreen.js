import React, {useState} from 'react'
import { View, Text, StyleSheet, KeyboardAvoidingView, Alert } from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';


const CreateAdScreen = () => {
    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')
    const [year, setYear] = useState('')
    const [price, setPrice] = useState('')
    const [phone, setPhone] = useState('')
    const [image, setImage] = useState("")
    const sendNoti = ()=>{
        firestore().collection('usertoken').get().then(querySnap=>{
            // Individual document snapshots
            const userDevicetoken = querySnap.docs.map(docSnap=>{
                return docSnap.data().token
            })

            console.log(userDevicetoken)
            fetch('https://0998-117-194-78-238.ngrok.io/send-noti',{
                method:'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    tokens: userDevicetoken
                })
            })
        })
    }

    const postData=async()=>{
        try{
          await firestore().collection('ads') //done in firestore
        .add({
            name,
            desc,
            year,
            price,
            phone,
            image,
            uid: auth().currentUser.uid,
        })  
        setName('')
        setDesc('')
        setYear('')
        setPrice('')
        setPhone('')
        Alert.alert("Data transferred successfully!!!")
        } catch(err) {
            Alert.alert("Something went wrong. Try again")
        }
        sendNoti()
        

    }

    // use https://github.com/react-native-image-picker/react-native-image-picker
    const openCamera = () => {
        launchImageLibrary({quality: 0.5}, (fileobj)=>{
            //console.log(fileobj.assets[0].uri)
            const uploadTask = storage().ref().child(`/items/${Date.now()}`).putFile(fileobj.assets[0].uri) // child represents path
            // https://firebase.google.com/docs/storage/web/upload-files
            uploadTask.on('state_changed', 
            (snapshot) => {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;            
                if(progress==100) {
                    alert("Uploaded")
                }
            }, 
            (error) => {
                alert("Something went wrong")
            }, 
            () => {
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    console.log(downloadURL)
                    setImage(downloadURL)
                });
              }
            );
        })
    }

    return (
        <KeyboardAvoidingView style={styles.container}>
            <Text style={styles.text}>Create an Advertisement..</Text>
            <TextInput
            label="Add Title"
            value={name}
            mode="outlined"
            onChangeText={text => setName(text)}
            />

            <TextInput
            label="Specify something about the item you are selling"
            value={desc}
            mode="outlined"
            numberOfLines={3}
            multiline={true}
            onChangeText={text => setDesc(text)}
            />

            <TextInput
            label="Year of Purchase"
            value={year}
            mode="outlined"
            keyboardType={'numeric'}
            onChangeText={text => setYear(text)}
            />

            <TextInput
            label="Price in INR"
            value={price}
            mode="outlined"
            keyboardType={'numeric'}
            onChangeText={text => setPrice(text)}
            />

            <TextInput
            label="Contact Number"
            value={phone}
            mode="outlined"
            keyboardType={'numeric'}
            onChangeText={text => setPhone(text)}
            />      

            <Button icon="camera" mode="contained" onPress={() => openCamera()} style = {{margin:10}}>
                Upload Image
            </Button> 

            {/* to work asynchrohnously with image upload(working after image upload) */}
            <Button disabled={image?false:true} mode="contained" onPress={() => postData()}> 
                Submit
            </Button> 
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        marginHorizontal:30,
        justifyContent: 'space-evenly'
    },

    text:{
        fontSize:22,
        fontWeight: 'bold',
        textAlign:'center'
    }
    
  });

export default CreateAdScreen

