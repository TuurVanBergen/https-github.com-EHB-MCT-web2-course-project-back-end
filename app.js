const express= require('express');
const app = express();
const cors = require('cors');
const {MongoClient} = require('mongodb');
const {v4: uuidv4, validate: uuidValidate} = require('uuid')
const { ObjectId } = require('mongodb');

app.use(express.urlencoded({extended:false}));
app.use(cors());
app.use(express.json())

app.listen(3000);
console.log("app running at http://localhost:3000");

async function getDatabase() {                                                                                                                                      
    const url = "mongodb+srv://tuurvanbergen:Tuur.1234@web2.mjdzevf.mongodb.net/?retryWrites=true&w=majority";

    // Connect to your Atlas cluster
    const client = new MongoClient(url);

    await client.connect();
    console.log("Successfully connected to Atlas");

    return client.db('brussel_in_beeld');
}



//create monogclient
//const client = new MongoClient("mongodb+srv://tuurvanbergen:Tuur.1234@web2.mjdzevf.mongodb.net/?retryWrites=true&w=majority")
//let users = [];


app.get("/Artist", async(req,res)=>{
    let database;
    try{
         database = await getDatabase();

        //retrieve data
        const colli = database.collection('artist')
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
        await database.client.close();
    }
})

app.get("/Table-of-contents", async(req,res)=>{
    let database;
    try{
        database = await getDatabase();

        //retrieve data
        const colli = database.collection('galleries');
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
    await database.client.close();
    }
})

// app.get("/Table-of-contents/:id",async(req,res)=>{

// } )

app.get("/Artwork", async(req,res)=>{
    let database;
    try{
        database = await getDatabase();

        //retrieve data
        const colli = await database.collection('artwork');
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
        await database.client.close();
    }
})

app.post('/addGallery', async (request, response) => {
    let database;
    try {
        database = await getDatabase();
        const galleriesCollection = await database.collection('galleries');

        if(await galleriesCollection.countDocuments() >=10){
            return response.status(400).send({ error: 'Maximum galleries reached.' });
        }

        const existingGallery = await galleriesCollection.findOne({ title: request.body.title });

        if (!request.body.title || !request.body.artist || !request.body.opening_hours || !request.body.price || !request.body.location || !request.body.accesability || !request.body.facebook_link || !request.body.instagram_link || !request.body.website_link || !request.body.text_1_title || !request.body.text_1 || !request.body.text_2_title || !request.body.text_2 || !request.body.category) {
            return response.status(400).send({ error: 'Vul elk veld in.' });
        }

        if (existingGallery) {
            return response.status(400).send({ error: 'Gallery exists already' });
        }

        const newGallery = request.body;
        newGallery.uuid = uuidv4();

        await galleriesCollection.insertOne(newGallery);

        return response.send({ message: 'Gallery added successfully!' });
    } catch (error) {
        console.log(error);
        return response.status(500).send({
            error: 'Something went wrong!',
            value: error
        });
    } finally {
        await database.client.close();
    }
});



app.delete('/deleteGallery', async (req, res) => {
    let database;
    try {

        database = await getDatabase();

        const deleteGallery = req.body.title;
        const galleriesCollection = await database.collection('galleries');


        // Find the document using the title field
       const existingGallery = await galleriesCollection.findOne({ title: deleteGallery });

        if (existingGallery) {
            // If the document with the given _id exists, you can delete it
          const result = await galleriesCollection.deleteOne({ title: deleteGallery });
           if (result.deletedCount == 1) {
            // Document successfully deleted
               res.status(200).send({ message: 'Gallery successfully deleted' });
            } else {
                 // Delete operation did not affect any documents
                res.status(404).send({ message: 'Gallery not found' });
            }
         } else {
             // Gallery with the given title not found
             res.status(404).send({ message: 'Gallery not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ message: 'Internal server error' });
    } finally {
        await database.client.close();
    }
});

app.put('/updateGallery', async(req, res) => {
    let database;
    try {
        database = await getDatabase();

        if (!req.body.title || !req.body.price || !req.body.artist || !req.body.adres || !req.body.url || !req.body.Iurl || !req.body.Furl) {
            return res.send({ error: 'Missing title, price, artist, adres, url, Iurl or Furl' }).status(400);
        }


        const updateGallery = {
            title:req.body.title,
            price:req.body.price,
            artist:req.body.artist,
            adres:req.body.adres,
            url:req.body.url,
            Iurl:req.body.Iurl,
            Furl:req.body.Furl,
        }
        const galleriesCollection = await database.collection('galleries');



        // Find the document using the title field
        const existingGallery = await galleriesCollection.findOne({ title: updateGallery.title });

        if (existingGallery) {
           // updateOne()
           const result = await galleriesCollection.updateOne(
            { title: updateGallery.title },
            {
                $set: {
                    price: updateGallery.price,
                    artist: updateGallery.artist,
                    location: updateGallery.adres,
                    website_link: updateGallery.url,
                    instagram_link: updateGallery.Iurl,
                    facebook_link: updateGallery.Furl
                }
            }
        );
           if (result.modifiedCount == 1) {
            // Document successfully updated
            res.status(200).send({ message: 'Gallery was updated succesfully' });
           } else {
                  // Update operation did not affect any documents
                 res.status(404).send({ message: 'Gallery not found' });
            }
        } else {
            // Gallery with the given title not found
            res.status(404).send({ message: 'Gallery not found'});
         }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ message: 'Internal server error' });
    } finally {
        await database.client.close();
    }
})