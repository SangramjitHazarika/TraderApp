import React,{useEffect, useState} from 'react'
import { View, Text, FlatList, StyleSheet, Platform, Linking } from 'react-native'
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const ListItemScreen = () => {

    // items through firestore --> initially empty array
    const [items, setItems] = useState([])
    const[loading, setLoading] = useState(false)

    // hardcoded items
    const myitems = [
        {
            name:"Iphone",
            year:"2022",
            phone:"98789612343",
            image:"https://media.istockphoto.com/photos/blank-screen-smart-phone-mockup-template-picture-id1298005907?b=1&k=20&m=1298005907&s=170667a&w=0&h=64uDTVqfL18K33OroKZICFO1MGL0LDxoq3hBY70xIQQ=",
            desc:"I am selling this iphone. Please contact me if required with the contact details provided"
        },
        {
            name:"Camera",
            year:"2021",
            phone:"98789612344",
            image:"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2FtZXJhfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
            desc:"I am selling this camera. Please contact me if required with the contact details provided"
        }
    ]

    const getDetails = async()=>{ //made this function since under useEffect we can't use async
        const querySnap = await firestore().collection('ads').get() // querySnap is an array conatining the snapshots of the documents
        const result = querySnap.docs.map(docSnap=>docSnap.data()) // returns array containing documents (not actual data), for data need to use keyword data
        console.log(result)
        setItems(result)
    }

    // open Dial (contact screen)
    const openDial = (phone) =>{
        if(Platform.OS === 'android') {
            Linking.openURL(`tel:${phone}`)
        } else { // for IOS
            Linking.openURL(`telprompt:${phone}`)
        }
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
        <View>
            <FlatList
            data={items.reverse()}
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

export default ListItemScreen
