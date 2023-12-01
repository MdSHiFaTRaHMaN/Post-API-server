const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dsrj5qk.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const petCollection = client.db('petAdoptionDB').collection('pet');
    const campaignCollection = client.db('petAdoptionDB').collection('campaign');
    const myCampaignCollection = client.db('petAdoptionDB').collection('myCampaign');
    const requestCollection = client.db('petAdoptionDB').collection('request');
    const userInfoCollection = client.db('petAdoptionDB').collection('allUser');
      // addddd pet 
      
    app.post('/pet', async (req, res) => {
      const newPet = req.body;
      const result = await petCollection.insertOne(newPet);
      res.send(result);
    })

    app.get('/pet', async (req, res) => {
      const cursor = petCollection.find();
      const result = await cursor.toArray()
      res.send(result);
    })
    // my campaign
    app.post('/myCampaign', async (req, res) => {
      const myCampaign = req.body;
      const result = await myCampaignCollection.insertOne(myCampaign)
      res.send(result);
    })
    app.get('/myCampaign', async (req, res) => {
      const cursor = myCampaignCollection.find();
      const result = await cursor.toArray()
      res.send(result);
    })
    // add request 
    app.post('/request', async (req, res) => {
      const request = req.body;
      const result = await requestCollection.insertOne(request)
      res.send(result);
    })
    app.get('/request', async (req, res) => {
      const cursor = requestCollection.find();
      const result = await cursor.toArray()
      res.send(result);
    })
    // add user 
    app.post('/allUser', async (req, res) => {
      const newUser = req.body;
      const result = await userInfoCollection.insertOne(newUser);
      res.send(result);
    })
    app.get('/allUser', async(req, res) => {
      const cursor = userInfoCollection.find();
      const result = await cursor.toArray()
      res.send(result);
    })
    // addd campaign 

    app.post('/campaign', async (req, res) => {
      const newCampaign = req.body;
      const result = await campaignCollection.insertOne(newCampaign);
      res.send(result);
    })

    app.get('/campaign', async(req, res) => {
      const cursor = campaignCollection.find();
      const result = await cursor.toArray()
      res.send(result);
    })

      // delete pet 
    app.delete('/pet/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await petCollection.deleteOne(query);
      res.send(result);
    });
    app.get('/pet/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await petCollection.findOne(query);
      res.send(result);
    })
    // request delete 
    app.delete('/request/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await requestCollection.deleteOne(query);
      res.send(result);
    });
    // my donetion delete 



    app.delete('/myCampaign/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await myCampaignCollection.deleteOne(query);
      res.send(result);

    })
    app.delete('/campaign/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await campaignCollection.deleteOne(query);
      res.send(result);
    })

    app.get('/campaign/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await campaignCollection.findOne(query);
      res.send(result);
    })

      // update pet 
    app.put('/pet/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatePet = req.body;
      const pet = {
        $set: {
          name: updatePet.name,
          image: updatePet.image,
          age: updatePet.age,
          location: updatePet.location,
          category: updatePet.category,
          discription: updatePet.discription,
          longDescription: updatePet.longDescription,
          color: updatePet.color,
          gender: updatePet.gender
        }
      }
      const result = await petCollection.updateOne(filter, pet, options);
      res.send(result);
    })

    // update campaign 
    app.put('/campaign/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updateCampaign = req.body;
      const pet = {
        $set: {
          name: updateCampaign.name,
          image: updateCampaign.image,
          lastDate: updateCampaign.lastDate,
          Max: updateCampaign.Max,
          discription: updateCampaign.discription,
          longDescription: updateCampaign.longDescription,
          total: updateCampaign.total,
          email: updateCampaign.email
        }
      }
      const result = await campaignCollection.updateOne(filter, pet, options);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Pet Adopt Server is Running')
})

app.listen(port, () => {
  console.log(`Server Run: ${port}`)
})