const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;
const app = express()

//middleware
app.use(cors())
app.use(express.json())

//connecting mongodb app

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.odmwm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect()
    const database = client.db('bikebd');
    const productsCollection = database.collection('products');
    const ordersCollection = database.collection('orders');
    const usersCollection = database.collection('users');
    const reviewCollection = database.collection('reviews');


    // GET PRODUCT API
    app.get('/products', async (req, res) => {
      const cursor = productsCollection.find({});
      const products = await cursor.toArray();
      res.send(products)
    })


    //GET SINGLE PRODUCT 
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productsCollection.findOne(query);
      res.json(product);
    })

    // GET CUSTOMER REVIEW
    app.get('/reviews', async (req, res) => {
      const cursor = reviewCollection.find({});
      const reviews = await cursor.toArray();
      res.json(reviews);
    });


    //GET ORDER
    app.get('/orders', async (req, res) => {
      const cursor = ordersCollection.find({})
      const orders = await cursor.toArray();
      res.json(orders)
    });


    // GET ORDER BY EMAIL
    app.get('/orders', async (req, res) => {
      const email = req.query.email;
      const query = { email: email }
      const cursor = ordersCollection.find(query);
      const orders = await cursor.toArray();
      res.json(orders)
    })



    // GET ADMIN
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email }
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === 'admin') {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    })


    // MAKE ADMIN
    app.put('/users/admin', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: 'admin' } };
      const result = await usersCollection.updateOne(filter, updateDoc)
      res.json(result)
    })

    // POST PRODUCT API
    app.post('/products', async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product)
      res.json(result)
    });

    // POST ORDER API
    app.post('/orders', async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order)
      res.json(result)
    });

    // POST USER TO DATABASE
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user)
      res.json(result)
    })

    app.put('/users', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user }
      const result = await usersCollection.updateOne(filter, updateDoc, options)
      res.json(result);
    })

    // POST REVIEW API
    app.post('/reviews', async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review)
      res.json(result);
    });



  }
  finally {
    // await client.close()
  }
}

run().catch(console.dir)


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(` listening at `, port)
})