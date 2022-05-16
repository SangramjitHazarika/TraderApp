const admin = require('firebase-admin')
const express = require('express')
const app = express()

var serviceAccount = require("./trader-e49f8-firebase-adminsdk-dzn3v-f1234c9a8b.json");

// for parsing the data sent by frontend
app.use(express.json())

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.post('/send-noti',(req, res)=>{
    console.log(req.body)
    const message = {
    notification:{
        title:"new ad",
        body:"new ad posted click to open"
    },
    tokens: req.body.tokens
    }

    admin.messaging().sendMulticast(message).then(res=>{
        console.log('Send successfully')
    }).catch(err=>{
        console.log(err)
    })
})

app.listen(3000, ()=>{
    console.log('Server running')
})
