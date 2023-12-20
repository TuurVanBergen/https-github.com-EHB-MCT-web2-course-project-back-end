const express= require('express');
const app = express();
const cors = require('cors');
const {MongoClient} = require('mongodb');
const {v4: uuidv4, validate: uuidValidate} = require('uuid')
require('dotenv').config()

//create monogclient
const client = new MongoClient("mongodb+srv://tuurvanbergen:Tuur.1234@web2.mjdzevf.mongodb.net/?retryWrites=true&w=majority")
let users = [];

app.use(express.urlencoded({extended:false}));
app.use(cors());
app.use(express.json())

app.get("/testMongo", async(req,res)=>{
    try{
        await client.connect();

        //retrieve data
        const colli = client.db('brussel_in_beeld').collection('users')
        const users = await colli.find({}).toArray();

        //send back the data with response
        res.status(200).send(users);
    }catch(error){
        console.log(error)
        res.status(500).send({
            error: 'Something went wrong!',
            value: error
        });
    }finally{
        await client.close();
    }
})

app.get("/Artist", async(req,res)=>{
    try{
        await client.connect();

        //retrieve data
        const colli = client.db('brussel_in_beeld').collection('artist')
        const artist = await colli.find({}).toArray();

        //send back the data with response
        res.status(200).send(artist);
    }catch(error){
        console.log(error)
        res.status(500).send({
            error: 'Something went wrong!',
            value: error
        });
    }finally{
        await client.close();
    }
})

app.get("/Table-of-contents", async(req,res)=>{
    try{
        await client.connect();

        //retrieve data
        const colli = client.db('brussel_in_beeld').collection('galleries');
        const tableOfContents = await colli.find({}).toArray();

        //send back the data with response
        res.status(200).send(tableOfContents);
    }catch(error){
        console.log(error)
        res.status(500).send({
            error: 'Something went wrong!',
            value: error
        });
    }finally{
        await client.close();
    }
})

app.get("/Artwork", async(req,res)=>{
    try{
        await client.connect();

        //retrieve data
        const colli = client.db('brussel_in_beeld').collection('artwork');
        const tableOfContents = await colli.find({}).toArray();

        //send back the data with response
        res.status(200).send(tableOfContents);
    }catch(error){
        console.log(error)
        res.status(500).send({
            error: 'Something went wrong!',
            value: error
        });
    }finally{
        await client.close();
    }
})

// app.post('/register', async (request, response) => {
//     if (! request.body.username || !request.body.email || !request.body.password) {
//         return response.send({ error: 'Missing username, email or password' }).status(400);
//     }

//     const usersCollection =await client.db('brussel_in_beeld').collection('users');

//     const existingUser = await usersCollection.findOne({ email: request.body.email });

//     if (existingUser) {
//         return response.send({ error: 'User exists already' }).status(400);
//     }

//     const newUser = request.body;
//     newUser.uuid = uuidv4();

//     await usersCollection.insertOne(newUser);

//     return response.send({ message: 'Register succesful! '});
// });
// app.post('/login', async (request, response) => {
//     if (! request.body.email || !request.body.password) {
//         return response.send({ error: 'Missing email or password' }).status(400);
//     }


//     const usersCollection =     await client.db('brussel_in_beeld').collection('users');
//     const user = await usersCollection.findOne({ email: request.body.email });
//     console.log(user);

//     if (!user) {
//         return response.send({ error: 'No user found' }).status(400);
//     }

//     if (user.password !== request.body.password) {
//         return response.send({ error: 'Wrong password' }).status(400);
//     }

//     return response.send({ username: user.username, uuid: user.uuid });
// });
// app.post('/verifyID', async (request, response) => {

//     const user = await client.db('brussel_in_beeld').collection('users').findOne({ uuid: request.body.uuid });

//     if (!user) {
//         return response.send({ message: 'No user found' });
//     }

//     return response.send({ email: user.email, uuid: user.uuid });
// });

app.post('/addGallery', async (request, response) => {
    if (!request.body.title|| !request.body.artist|| !request.body.opening_hours|| !request.body.price|| !request.body.location|| !request.body.accesability|| !request.body.facebook_link|| !request.body.instagram_link|| !request.body.website_link|| !request.body.text_1_title|| !request.body.text_1|| !request.body.text_2_title|| !request.body.text_2|| !request.body.category) {
        return response.send({ error: 'Vul elk veld in.' }).status(400);
    }

    const usersCollection =await client.db('brussel_in_beeld').collection('galleries');

    const existingUser = await usersCollection.findOne({ title: request.body.title });

    if (existingUser) {
        return response.send({ error: 'User exists already' }).status(400);
    }

    const newUser = request.body;
    newUser.uuid = uuidv4();

    await usersCollection.insertOne(newUser);

    return response.send({ message: 'Register succesful! '});
});

app.listen(3000);
console.log("app running at http://localhost:3000");