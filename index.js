const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const cors = require("cors");
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://task_tracker:Vno4J6OUTUfEdNmR@cluster0.nbkl0so.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = () => {
  try {
    const taskCollection = client.db("task_tracker").collection("tasks");

    app.get("/", async (req, res) => {
      const cursor = await taskCollection.find({});
      const tasks = await cursor.limit(3).toArray();
      res.send({ result: tasks });
    });
    app.get("/my-tasks", async (req, res) => {
      const cursor = await taskCollection.find({ completed: false });
      const tasks = await cursor.toArray();
      res.send({ result: tasks });
    });
    app.get("/my-tasks/:id", async (req, res) => {
      const id = ObjectId(req.params.id);
      const query = { _id: id };
      const task = await taskCollection.findOne(query);
      res.send(task);
    });
    app.post("/", async (req, res) => {
      const task = req.body;
      console.log(task);
      const result = await taskCollection.insertOne(task);
      res.send({ message: "Task added successfully!!" });
    });
    app.patch("/my-tasks/:id", async (req, res) => {
      console.log(req.body.comment);
      const id = ObjectId(req.params.id);
      const filter = { _id: id };
      const updatedDoc = {
        $set: {
          completed: true,
          comment: req.body.comment,
        },
      };
      const result = await taskCollection.updateOne(filter, updatedDoc);
      res.send({ message: "Task Completed !!!" });
    });
    app.patch("/edit-task/:id", async (req, res) => {
      const id = ObjectId(req.params.id);
      const filter = { _id: id };
      const updatedDoc = {
        $set: {
          title: req.body.title,
          description: req.body.description,
          image: req.body.image,
        },
      };
      const result = await taskCollection.updateOne(filter, updatedDoc);
      res.send({ message: "Task Completed !!!" });
    });
    app.delete("/my-tasks/:id", async (req, res) => {
      const id = ObjectId(req.params.id);
      const query = { _id: id };
      const result = await taskCollection.deleteOne(query);
      res.send({ message: "Task has been deleted !!!" });
    });
  } catch (error) {
    console.error(error);
  }
};

run();

app.listen(port, () => {});
