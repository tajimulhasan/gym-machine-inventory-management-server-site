const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

//middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mgih8cm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run(){
try{
await client.connect();
const gymCollection = client.db("inventory").collection("collections");
app.get("/inventory", async(req, res) =>{
  const query = {};
  const cursor = gymCollection.find(query);
  const result = await cursor.toArray();
  res.send(result); 

  app.get('/inventory/:id', async(req, res) =>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const service = await gymCollection.findOne(query);
    res.send(service)
});
app.put('/inventory/:id', async(req, res) =>{
      const id = req.params.id;
      const updateQuantity = req.body;
      const filter = {_id: new ObjectId(id)};
      const option = {upsert: true};
      const updatedQuantity = {
        $set: {
          quantity: updateQuantity.quantity
        }
      };
      const result = await gymCollection.updateOne(filter, updatedQuantity, option);
      res.send(result);
    })
});

// post (add items)
app.post("/inventory", async(req, res) =>{
  const newAdding = req.body;
  const result = await gymCollection.insertOne(newAdding);
  res
  .send(result);
});

// delete items/manage
app.delete("/inventory/:id", async(req, res) =>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await gymCollection.deleteOne(query);
    res.send(result);
})

// new collections
//my items find with email
app.get(`/inventory/email/:email`, async (req, res) => {
  const email = req.params.email;
  const query = { "email": email};
  const cursor = gymCollection.find(query);
  const result = await cursor.toArray();
  res.send(result);
});
}
finally{

}
}

run().catch(console.dir);


//root level 
app.get('/', (req, res) =>{
    res.send('I am runnig properly')
})

app.listen(port, () =>{
    console.log('Listening port is running', port);
}) 