const express = require('express')
const app = express();
const admin = require("firebase-admin");
const credentials = require("./key.json");
admin.initializeApp({
    credential: admin.credential.cert(credentials)
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
const db = admin.firestore();

app.post('/create',async (req,res) =>{
    try{
        console.log(req.body);
        const id = req.body.email;
        const userJson = {
            email: req.body.email,
            firstName : req.body.firstName,
            lastName : req.body.lastName
        };
        const response =await db.collection("users").add(userJson);
        res.send(response);
    }catch(error){
        res.send(error);
    }
});

app.get('/read/all',async(req,res) =>{
    try{
        const ref = db.collection("users");
        const response = await ref.get();
        let resArr = [];
        response.forEach(doc =>{
            resArr.push(doc.data());
        });
        res.send(resArr);

    }catch(error){
        res.send(error);
    }
});

app.get('/read/:id',async(req,res) =>{
    try{
        const ref1 = db.collection("users").doc(req.params.id);
        const response = await ref1.get();
        res.send(response.data());

    }catch(error){
        res.send(error);
    }
});

app.post('/update',async (req,res) =>{
    try{
        const id = req.body.id;
        const newfirstName = "newNmae";
        const ref = await db.collection("users").doc(id)
        .update({
            firstName:newfirstName
        });
        res.send(ref);
    }catch(error){
        res.send(error);
    }
});

app.delete('/delete/:id',async(req,res)=>{
    try{
        const response = await db.collection("users").doc(req.params.id).delete();
        res.send(response);
    }catch(error){
        res.send(error);
    }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT,() =>{
    console.log("server is runnin gon port ${PORT}.");
})
