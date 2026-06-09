


// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();

// const {
//   MongoClient,
//   ServerApiVersion,
//   ObjectId,
// } = require("mongodb");

// const jwt = require("jsonwebtoken");

// const app = express();
// const port = process.env.PORT || 5000;

// // =======================
// // MIDDLEWARE
// // =======================
// app.use(cors());
// app.use(express.json());

// // =======================
// // JWT VERIFY (optional use later)
// // =======================
// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.status(401).send({ message: "Unauthorized Access" });
//   }

//   const token = authHeader.split(" ")[1];

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(403).send({ message: "Forbidden Access" });
//     }

//     req.decoded = decoded;
//     next();
//   });
// };

// // =======================
// // DATABASE
// // =======================
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fjjdbj0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// // =======================
// // MAIN RUN
// // =======================
//     let isConnected = false;

// async function run() {
//   try {
//     if (!isConnected) {
//       await client.connect();
//       isConnected = true;
      
//     }

//     const db = client.db("mediqueueDB");
//     const tutorCollection = db.collection("tutors");
//     const bookingCollection = db.collection("bookings");

//     // routes...

//     // =======================
//     // JWT TOKEN
//     // =======================
//     app.post("/jwt", async (req, res) => {
//       const token = jwt.sign(req.body, process.env.JWT_SECRET, {
//         expiresIn: "7d",
//       });

//       res.send({ token });
//     });

//     // =======================
//     // ADD TUTOR
//     // =======================
//     app.post("/tutors", async (req, res) => {
//       const result = await tutorCollection.insertOne(req.body);
//       res.send(result);
//     });

//     // =======================
//     // GET TUTORS (FILTER + SEARCH)
//     // =======================
//     app.get("/tutors", async (req, res) => {
//   const { search, startDate, endDate } = req.query;

//   let query = {};

//   if (search) {
//     query.tutorName = { $regex: search, $options: "i" };
//   }

//   // keep as string comparison — matches how you saved it
//   if (startDate && endDate) {
//     query.sessionStart = {
//       $gte: startDate,
//       $lte: endDate,
//     };
//   }

//   const result = await tutorCollection.find(query).toArray();
//   res.send(result);
// });

//     // =======================
//     // FEATURED TUTORS
//     // =======================
//     app.get("/featured-tutors", async (req, res) => {
//       const result = await tutorCollection.find().limit(6).toArray();
//       res.send(result);
//     });

//     // =======================
//     // SINGLE TUTOR
//     // =======================
//     app.get("/tutors/:id", async (req, res) => {
//       const result = await tutorCollection.findOne({
//         _id: new ObjectId(req.params.id),
//       });

//       res.send(result);
//     });

//     // =======================
//     // UPDATE TUTOR
//     // =======================
//     app.patch("/tutors/:id", async (req, res) => {
//       const result = await tutorCollection.updateOne(
//         { _id: new ObjectId(req.params.id) },
//         { $set: req.body }
//       );

//       res.send(result);
//     });

//     // =======================
//     // DELETE TUTOR
//     // =======================
//     app.delete("/tutors/:id", async (req, res) => {
//       const result = await tutorCollection.deleteOne({
//         _id: new ObjectId(req.params.id),
//       });

//       res.send(result);
//     });

//     // =======================
//     // CREATE BOOKING
//     // =======================
//     app.post("/bookings", async (req, res) => {
//       const booking = req.body;

//       const tutor = await tutorCollection.findOne({
//         _id: new ObjectId(booking.tutorId),
//       });

//       if (!tutor) return res.send({ message: "Tutor not found" });

//       if (tutor.totalSlot <= 0)
//         return res.send({ message: "No slots available" });

//       const alreadyBooked = await bookingCollection.findOne({
//         tutorId: booking.tutorId,
//         studentEmail: booking.studentEmail,
//       });

//       if (alreadyBooked)
//         return res.send({ message: "Already booked" });

//       const result = await bookingCollection.insertOne({
//         ...booking,
//         status: "booked",
//         createdAt: new Date(),
//       });

//       await tutorCollection.updateOne(
//         { _id: new ObjectId(booking.tutorId) },
//         { $inc: { totalSlot: -1 } }
//       );

//       res.send(result);
//     });

//     // =======================
//     // MY BOOKINGS
//     // =======================
//     app.get("/my-bookings", async (req, res) => {
//       const result = await bookingCollection
//         .find({ studentEmail: req.query.email })
//         .toArray();

//       res.send(result);
//     });

//     // =======================
//     // CANCEL BOOKING
//     // =======================
//     app.patch("/bookings/:id", async (req, res) => {
//       const id = req.params.id;

//       const booking = await bookingCollection.findOne({
//         _id: new ObjectId(id),
//       });

//       if (!booking) return res.send({ message: "Not found" });

//       if (booking.status === "cancelled")
//         return res.send({ message: "Already cancelled" });

//       const result = await bookingCollection.updateOne(
//         { _id: new ObjectId(id) },
//         { $set: { status: "cancelled" } }
//       );

//       await tutorCollection.updateOne(
//         { _id: new ObjectId(booking.tutorId) },
//         { $inc: { totalSlot: 1 } }
//       );

//       res.send(result);
//     });

// // =======================
//     // add new BOOKING
//     // =======================

//     app.patch("/bookings/update/:id", async (req, res) => {
//   const id = req.params.id;

//   const updateDoc = {
//     $set: {
//       tutorName: req.body.tutorName,
//       studentName: req.body.studentName,
//       subject: req.body.subject,
//       phone: req.body.phone,
//       sessionStart: req.body.sessionStart,
//     },
//   };

//   const result = await bookingCollection.updateOne(
//     { _id: new ObjectId(id) },
//     updateDoc
//   );

//   res.send(result);
// });

//     // =======================
//     // DELETE BOOKING
//     // =======================
//     app.delete("/bookings/:id", async (req, res) => {
//       const booking = await bookingCollection.findOne({
//         _id: new ObjectId(req.params.id),
//       });

//       if (!booking) return res.send({ message: "Not found" });

//       await tutorCollection.updateOne(
//         { _id: new ObjectId(booking.tutorId) },
//         { $inc: { totalSlot: 1 } }
//       );

//       const result = await bookingCollection.deleteOne({
//         _id: new ObjectId(req.params.id),
//       });

//       res.send(result);
//     });

//     console.log("MongoDB Connected");
//   } catch (error) {
//     console.error(error);
//   }
// }

// run().catch(console.dir);

// // =======================
// // ROOT
// // =======================
// app.get("/", (req, res) => {
//   res.send("MediQueue Server Running");
// });

// app.get("/health", async (req, res) => {
//   try {
//     await client.db("admin").command({ ping: 1 });

//     res.send({
//       success: true,
//       message: "MongoDB Connected",
//     });
//   } catch (error) {
//     res.status(500).send({
//       success: false,
//       message: "MongoDB Disconnected",
//     });
//   }
// });

// module.exports = app;

// // =======================
// // START SERVER
// // =======================
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });



// // app.get("/featured-tutors", async (req, res) => {
// //   const result = await tutorCollection.find().limit(6).toArray();
// //   res.send(result);
// // });

// // run().catch(console.dir);

// // app.get("/", (req, res) => {
// //   res.send("MediQueue Server Running");
// // });

// // module.exports = app;
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 5000;

// =======================
// MIDDLEWARE
// =======================
app.use(cors());
app.use(express.json());

// =======================
// DATABASE CONNECTION
// =======================
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fjjdbj0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let isConnected = false;

async function connectDB() {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
    console.log("MongoDB Connected");
  }
}

// Helper to get collections after ensuring connection
async function getCollections() {
  await connectDB();
  const db = client.db("mediqueueDB");
  return {
    tutorCollection: db.collection("tutors"),
    bookingCollection: db.collection("bookings"),
  };
}

// =======================
// JWT VERIFY MIDDLEWARE
// =======================
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ message: "Unauthorized Access" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Forbidden Access" });
    }
    req.decoded = decoded;
    next();
  });
};

// =======================
// ROOT
// =======================
app.get("/", (req, res) => {
  res.send("MediQueue Server Running");
});

// =======================
// HEALTH CHECK
// =======================
app.get("/health", async (req, res) => {
  try {
    await connectDB();
    await client.db("admin").command({ ping: 1 });
    res.send({ success: true, message: "MongoDB Connected" });
  } catch (error) {
    res.status(500).send({ success: false, message: "MongoDB Disconnected" });
  }
});

// =======================
// JWT TOKEN
// =======================
app.post("/jwt", (req, res) => {
  const token = jwt.sign(req.body, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.send({ token });
});

// =======================
// ADD TUTOR
// =======================
app.post("/tutors", async (req, res) => {
  try {
    const { tutorCollection } = await getCollections();
    const result = await tutorCollection.insertOne(req.body);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
});

// =======================
// GET TUTORS (FILTER + SEARCH)
// =======================
app.get("/tutors", async (req, res) => {
  try {
    const { tutorCollection } = await getCollections();
    const { search, startDate, endDate } = req.query;

    let query = {};

    if (search) {
      query.tutorName = { $regex: search, $options: "i" };
    }

    if (startDate && endDate) {
      query.sessionStart = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    const result = await tutorCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
});

// =======================
// FEATURED TUTORS
// =======================
app.get("/featured-tutors", async (req, res) => {
  try {
    const { tutorCollection } = await getCollections();
    const result = await tutorCollection.find().limit(6).toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
});

// =======================
// SINGLE TUTOR
// =======================
app.get("/tutors/:id", async (req, res) => {
  try {
    const { tutorCollection } = await getCollections();
    const result = await tutorCollection.findOne({
      _id: new ObjectId(req.params.id),
    });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
});

// =======================
// UPDATE TUTOR
// =======================
app.patch("/tutors/:id", async (req, res) => {
  try {
    const { tutorCollection } = await getCollections();
    const result = await tutorCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
});

// =======================
// DELETE TUTOR
// =======================
app.delete("/tutors/:id", async (req, res) => {
  try {
    const { tutorCollection } = await getCollections();
    const result = await tutorCollection.deleteOne({
      _id: new ObjectId(req.params.id),
    });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
});

// =======================
// CREATE BOOKING
// =======================
app.post("/bookings", async (req, res) => {
  try {
    const { tutorCollection, bookingCollection } = await getCollections();
    const booking = req.body;

    const tutor = await tutorCollection.findOne({
      _id: new ObjectId(booking.tutorId),
    });

    if (!tutor) return res.send({ message: "Tutor not found" });

    if (tutor.totalSlot <= 0)
      return res.send({ message: "No slots available" });

    const alreadyBooked = await bookingCollection.findOne({
      tutorId: booking.tutorId,
      studentEmail: booking.studentEmail,
    });

    if (alreadyBooked) return res.send({ message: "Already booked" });

    const result = await bookingCollection.insertOne({
      ...booking,
      status: "booked",
      createdAt: new Date(),
    });

    await tutorCollection.updateOne(
      { _id: new ObjectId(booking.tutorId) },
      { $inc: { totalSlot: -1 } }
    );

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
});

// =======================
// MY BOOKINGS
// =======================
app.get("/my-bookings", async (req, res) => {
  try {
    const { bookingCollection } = await getCollections();
    const result = await bookingCollection
      .find({ studentEmail: req.query.email })
      .toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
});

// =======================
// UPDATE BOOKING DETAILS
// =======================
app.patch("/bookings/update/:id", async (req, res) => {
  try {
    const { bookingCollection } = await getCollections();
    const id = req.params.id;

    const updateDoc = {
      $set: {
        tutorName: req.body.tutorName,
        studentName: req.body.studentName,
        subject: req.body.subject,
        phone: req.body.phone,
        sessionStart: req.body.sessionStart,
      },
    };

    const result = await bookingCollection.updateOne(
      { _id: new ObjectId(id) },
      updateDoc
    );

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
});

// =======================
// CANCEL BOOKING
// =======================
app.patch("/bookings/:id", async (req, res) => {
  try {
    const { tutorCollection, bookingCollection } = await getCollections();
    const id = req.params.id;

    const booking = await bookingCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!booking) return res.send({ message: "Not found" });

    if (booking.status === "cancelled")
      return res.send({ message: "Already cancelled" });

    const result = await bookingCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "cancelled" } }
    );

    await tutorCollection.updateOne(
      { _id: new ObjectId(booking.tutorId) },
      { $inc: { totalSlot: 1 } }
    );

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
});

// =======================
// DELETE BOOKING
// =======================
app.delete("/bookings/:id", async (req, res) => {
  try {
    const { tutorCollection, bookingCollection } = await getCollections();

    const booking = await bookingCollection.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!booking) return res.send({ message: "Not found" });

    await tutorCollection.updateOne(
      { _id: new ObjectId(booking.tutorId) },
      { $inc: { totalSlot: 1 } }
    );

    const result = await bookingCollection.deleteOne({
      _id: new ObjectId(req.params.id),
    });

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
});

// =======================
// START SERVER
// =======================
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;