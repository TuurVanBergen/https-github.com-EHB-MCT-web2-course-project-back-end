const express= require('express');
const app = express();
const cors = require('cors');
const {MongoClient} = require('mongodb');
const {v4: uuidv4} = require('uuid')

//deze video's zijn algemeen over het maken van een backend, en gaan dus over verschillende delen in het document
// https://app.pluralsight.com/library/courses/nodejs-express-web-applications-building/table-of-contents
// https://www.youtube.com/watch?v=kUZl7usU6_U

app.use(express.urlencoded({extended:false}));
app.use(cors());
app.use(express.json())

app.listen(3000);
console.log("app running at http://localhost:3000");

async function getDatabase() {
                                                                                                                                          
    const url = "mongodb+srv://tuurvanbergen:Tuur.1234@web2.mjdzevf.mongodb.net/?retryWrites=true&w=majority";
    // Connect to Atlas
    const client = new MongoClient(url);

    await client.connect();
    console.log("Successfully connected to Atlas");

    return client.db('brussel_in_beeld');
}

// /Artist Get route, this route gets the data out of the db, searches for a sepcific document. after that it sends a response wit that document.
// https://expressjs.com/en/starter/basic-routing.html
app.get("/Artist", async(req,res)=>{
    let database;
    try{
         database = await getDatabase();

        //retrieve data
        const colli = database.collection('artist')
        const artist = await colli.find({}).toArray();

        //send back the data with response
        res.status(200).send(artist);

        //catch possible errors
    }catch(error){
        console.log(error)
        res.status(500).send({
            error: 'Something went wrong!',
            value: error
        });
    }finally{       
        //close connection
        await database.client.close();
    }
})

// /Table-of-contents Get route, this route gets the data out of the db, searches for a sepcific document. after that it sends a response wit that document.
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
        //close connection     
        await database.client.close();
    }
})

// /Artwork Get route, this route gets the data out of the db, searches for a sepcific document. after that it sends a response wit that document.
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
        //close connection 
        await database.client.close();
    }
})

// /addGallery post route, this wil add a new gallery to the database.
app.post('/addGallery', async (request, response) => {
    let database;

    try {
        database = await getDatabase();

        //put all the galleries inisde galleriesCollection
        const galleriesCollection = await database.collection('galleries');

        //This if statement ensures that there can only be a maximum of 10 documents.
        //de countDocuments() heb ik op onderstaande link gevonden.
        // https://www.mongodb.com/docs/manual/reference/method/db.collection.countDocuments/
        if(await galleriesCollection.countDocuments() >=10){
            return response.status(400).send({ error: 'Maximum galleries reached.' });
        }

        const existingGallery = await galleriesCollection.findOne({ title: request.body.title });

        //this if statement ensures that there are no empty fields.
        if (!request.body.title || !request.body.artist || !request.body.opening_hours || !request.body.price || !request.body.location || !request.body.accesability || !request.body.facebook_link || !request.body.instagram_link || !request.body.website_link || !request.body.text_1_title || !request.body.text_1 || !request.body.text_2_title || !request.body.text_2 || !request.body.category) {
            return response.status(400).send({ error: 'Vul elk veld in.' });
        }

        //ensures that there are no duplicates
        if (existingGallery) {
            return response.status(400).send({ error: 'Gallery exists already' });
        }

        const newGallery = request.body;
        //info over uuid heb ik op onderstaande link gevonden
        // https://www.mongodb.com/docs/manual/reference/method/UUID/
        newGallery.uuid = uuidv4();

        //insert a new gallery.
        //de insert functie heb ik van onderstaande brond
        // https://www.mongodb.com/docs/manual/crud/
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

// /deleteGallery delete route, this wil delete a gallery.
//de deleteOne functie heb ik gevonden op onderstaande link.
// https://www.mongodb.com/docs/drivers/node/current/usage-examples/deleteOne/
app.delete('/deleteGallery', async (req, res) => {
    let database;
    try {

        database = await getDatabase();

        const deleteGallery = req.body.title;
        const galleriesCollection = await database.collection('galleries');


        // Find the document using the title field
       const existingGallery = await galleriesCollection.findOne({ title: deleteGallery });

        if (existingGallery) {
            // If there is already a document with the same name.
          const result = await galleriesCollection.deleteOne({ title: deleteGallery });
           if (result.deletedCount == 1) {
            // Document successfully deleted
               res.status(200).send({ message: 'Gallery successfully deleted' });
            } else {
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

// /updateGallery put route, this wil update a gallery.
//de updateOne() heb ik op onderstaande link gevonden.
// https://www.mongodb.com/docs/manual/reference/method/db.collection.updateOne/
app.put('/updateGallery', async(req, res) => {
    let database;
    try {
        database = await getDatabase();

        //this if statement checks for empty fields.
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

        //$set will, update the existing fields with new data.
        if (existingGallery) {
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
        //close the connection
        await database.client.close();
    }
})