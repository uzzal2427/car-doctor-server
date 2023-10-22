const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware

app.use(cors())
app.use(express.json())

// mongodb connection



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gnu7f4d.mongodb.net/?retryWrites=true&w=majority`;

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

    const servicesCollection = client.db('carDoctor').collection('services');
    const bookingCollection = client.db('carDoctor').collection('booking');

    app.get('/services', async(req,res)=>{
        const cursor = servicesCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/services/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)};
        const options = {
            // Sort matched documents in descending order by rating
            // sort: { "imdb.rating": -1 },
            // Include only the `title` and `imdb` fields in the returned document
            projection: { title: 1, price: 1, description: 1, img: 1 },
          };
      
        const result = await servicesCollection.findOne(query,options);
        res.send(result);
    })
    // booking

    app.post('/booking', async(req,res)=>{
      const booking = req.body ;
      console.log(booking);
      const result = await bookingCollection.insertOne(booking);
      res.send(result)
    })

    app.get('/booking',async(req,res)=>{
      console.log(req.query.email);
      let query = {};
      if(req.query?.email){
        query = {email : req.query.email}
      }
      const result = await bookingCollection.find(query).toArray();
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res)=>{
    res.send('car doctor is running')
})

app.listen(port, ()=>{
    console.log(`the port is running on port ${port}`);
})