const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Mongo Connection URI
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.3v9uvsg.mongodb.net/?appName=Cluster0`;

// MongoClient with Stable API
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const db = client.db("nextStore");
    const productsCollection = db.collection("products");

    //  Get All Products
    app.get("/products", async (req, res) => {
      const result = await productsCollection.find().toArray();
      res.send(result);
    });

    // latest products route
    app.get("/products", async (req, res) => {
      const result = await productsCollection
        .find()
        .sort({ date: -1 })
        .limit(6)
        .toArray();

      res.send(result);
    });

    //  Add New Product
    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.send({
        success: true,
        result,
      });
    });

    //  Get Single Product
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const result = await productsCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // Find
    app.get("/products", async (req, res) => {
      const email = req.query.email;
      const products = await productsCollection
        .find({ userEmail: email })
        .toArray();
      res.send(products);
    });

    // Delete Product
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const result = await productsCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send({
        success: true,
        result,
      });
    });

    console.log("MongoDB Connected Successfully (Products API Ready)");
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
