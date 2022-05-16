import React,{useState, useEffect} from 'react'
import { View, Text, FlatList, StyleSheet} from 'react-native'
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore';

const AccountScreen = () => {
     // items through firestore --> initially empty array
     const [items, setItems] = useState([])
     const[loading, setLoading] = useState(false)
 
     const getDetails = async()=>{ //made this function since under useEffect we can't use async
         const querySnap = await firestore().collection('ads')
         .where('uid', '==', auth().currentUser.uid)
         .get() // querySnap is an array conatining the snapshots of the documents
         const result = querySnap.docs.map(docSnap=>docSnap.data()) // returns array containing documents (not actual data), for data need to use keyword data
         console.log(result)
         setItems(result)
     }

     useEffect(()=>{
        getDetails()
        return ()=>{ // cleanup code
            console.log("cleanup")
        }
    },[])

    const renderItem = (item)=>{
        return(
        <Card style={styles.card}>
            <Card.Title title={item.name}/>
            <Card.Content>
            <Paragraph>{item.desc}</Paragraph>
            <Paragraph>{item.year}</Paragraph>
            </Card.Content>
            <Card.Cover source={{ uri: item.image }} />
            <Card.Actions>
            <Button>{item.price}</Button>
            <Button onPress={()=>openDial(item.phone)}> Contact Seller</Button>
            </Card.Actions>
        </Card>
        )
    }

    return (
        <View style={{flex:1}}>
            <View style={{height: "25%", justifyContent:"space-evenly", alignItems:"center"}}>
                <Text style={{fontSize:20}}>{auth().currentUser.email}</Text>
                <Button style={{marginHorizontal: 10}} mode="contained" onPress={() => auth().signOut()}>
                    Logout
                </Button>   
                <Text style={{fontSize:20}}>Your Ads!</Text>
            </View>
            
            <FlatList
            data={items}
            keyExtractor={(item)=>item.phone}
            renderItem={({item})=>renderItem(item)}
            onRefresh={()=>{
                setLoading(true)
                getDetails()
                setLoading(false)
            }}

            refreshing={loading}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        margin:10,
        elevation:8
    }
    
  });

export default AccountScreen
