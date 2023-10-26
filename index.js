const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
//  middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6nq2qod.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const productCollection = client.db("automotiveDB").collection("products");
    const userCollection = client.db("automotiveDB").collection("users");
    const brandCollection = client.db("automotiveDB").collection("brands");
    const cartCollection = client.db("automotiveDB").collection("carts");
    const messageCollection = client.db("automotiveDB").collection("messages");

    app.get('/product', async (req, res) => {
      const cars = productCollection.find();
      const result = await cars.toArray();
      res.send(result);
    })

    app.post('/product', async (req, res) => {
      const newCars = req.body;
      console.log(newCars);
      const result = await productCollection.insertOne(newCars);
      res.send(result);
    })

    // product update
    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productCollection.findOne(query);
      res.send(result);
    })

    app.put('/product/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const updateProduct = req.body;
      const product = {
        $set: {
          productName: updateProduct.productName,
          brand_name: updateProduct.brand_name,
          type: updateProduct.type,
          price: updateProduct.price,
          image: updateProduct.image,
          description: updateProduct.description,
          rating: updateProduct.rating
        }
      }
      const result = await productCollection.updateOne(filter, product);
      res.send(result);
    })
    // product delete
    app.delete('/product/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) }
      const result = await productCollection.deleteOne(query);
      res.send(result);
    })

    app.get('/user', async (req, res) => {
      const users = userCollection.find();
      const result = await users.toArray();
      res.send(result);
    })

    app.post('/user', async (req, res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    })

    // my cart
    app.post('/my-cart', async (req, res) => {
      const newCart = req.body;
      console.log(newCart);
      const result = await cartCollection.insertOne(newCart);
      res.send(result);
    })
    app.get('/my-cart', async (req, res) => {
      const carts = cartCollection.find();
      const result = await carts.toArray();
      res.send(result);
    })
    app.delete('/my-cart/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) }
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    })

    app.get('/brand', async (req, res) => {
      const brands = brandCollection.find();
      const result = await brands.toArray();
      res.send(result);
    })
    app.post('/brand', async (req, res) => {
      const newBrand = req.body;
      console.log(newBrand);
      const result = await brandCollection.insertOne(newBrand);
      res.send(result);
    })
    app.delete('/brand/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) }

      const result = await brandCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    })
    app.put('/brand/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) }
      const updatedBrand = req.body;
      const brand = {
        $set: {
          brandName: updatedBrand.brandName,
          brandImage: updatedBrand.brandImage,
        }
      }

      const result = await brandCollection.updateOne(query, brand);
      res.send(result);
    })
// contact us
    app.post('/contact', async (req, res) => {
      const newMessage = req.body;
      const result = await messageCollection.insertOne(newMessage);
      res.send(result);
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



app.get('/', (req, res) => {
  res.send('Automotive server is on live.....')
})

app.listen(port, () => {
  console.log(`car server is on port ${port}`);
})