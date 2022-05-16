import React, {useState} from 'react'
import { View, Text, Image, StyleSheet, KeyboardAvoidingView, TouchableOpacity, Alert } from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

const LoginScreen = ({navigation}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    
    const userSignup = async ()=>{
        if(!email || !password) {
            Alert.alert("Please Fill all the fields")
            return;
        }

        try{
            await auth().createUserWithEmailAndPassword(email, password)
            messaging().getToken().then(token=>{
                // store list of tokens from different users
                firestore().collection('usertoken').add({
                    token:token
                })
            })
        } catch(err) {
            Alert.alert("Something went wrong. Please Try with different password")
        }
        
    }

    return (
        <KeyboardAvoidingView behavior="position">
           <View style={styles.box1}>
               <Image style={{width:400, height:200}} source={require('../assets/login.jpeg')}/>
               <Text></Text>
               <Text style={styles.text}>Create a new Account!!</Text>
           </View>
           <View style={styles.box2}>
           <TextInput
            label="Email"
            value={email}
            mode="outlined"
            onChangeText={text => setEmail(text)}
            />

        <TextInput
            label="Password"
            value={password}
            mode="outlined"
            secureTextEntry = {true}
            onChangeText={text => setPassword(text)}
            />       
            <Button mode="contained" onPress={()=>userSignup()}>
                Signup
            </Button>   
            <TouchableOpacity onPress={()=>navigation.goBack()}><Text style={{textAlign:"center"}}>Login?</Text></TouchableOpacity>
           </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    box1:{
      alignItems:'center'
    },

    box2:{
        paddingHorizontal:40,
        // backgroundColor: 'lightgrey', 
        height:"50%",
        justifyContent:"space-evenly"
    },

    text:{
        fontSize: 22,
        fontWeight: 'bold'
    }
    
  });

export default LoginScreen
