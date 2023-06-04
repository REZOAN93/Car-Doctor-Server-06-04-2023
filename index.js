const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://rezoanshawon:ZFjodrZsnJM8IQ9H@cluster0.smadxws.mongodb.net/?retryWrites=true&w=majority";

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const database = client.db("CarDoctorClients");
    const Products = database.collection("Products");
    const OrderCollection = database.collection("OrderCollection");

    app.get("/product", async (req, res) => {
      const query = {};
      const cursor = Products.find(query);
      const pr = await cursor.toArray();
      res.send(pr);
    });

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const services = await Products.findOne(query);
      res.send(services);
    });

    app.post("/order", async (req, res) => {
      const order = req.body;
      console.log(order);
      const result = await OrderCollection.insertOne(order);
      console.log(result);
      res.send(result);
    });

    app.get("/order", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = { email: req.query.email };
      }
      const cursor = OrderCollection.find(query);
      const neworder = await cursor.toArray();
      res.send(neworder);
    });

    app.delete("/order/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await OrderCollection.deleteOne(query);
      res.send(result);
      console.log(result);
    });

    app.patch("/order/:id", async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          status: status,
        },
      };
      const result = await OrderCollection.updateOne(filter, updateDoc);
      res.send(result);
      console.log(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, function () {
  console.log("CORS-enabled web server listening on port 80");
});
