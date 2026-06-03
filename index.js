
// // const express = require("express");
// // const cors = require("cors");
// // require("dotenv").config();

// // const {
// //   MongoClient,
// //   ServerApiVersion,
// //   ObjectId,
// // } = require("mongodb");

// // const jwt = require("jsonwebtoken");

// // const app = express();
// // const port = process.env.PORT || 5000;

// // // =======================
// // // MIDDLEWARE
// // // =======================
// // app.use(cors());
// // app.use(express.json());

// // // =======================
// // // JWT VERIFY MIDDLEWARE
// // // =======================
// // const verifyToken = (req, res, next) => {
// //   const authHeader = req.headers.authorization;

// //   if (!authHeader) {
// //     return res.status(401).send({
// //       message: "Unauthorized Access",
// //     });
// //   }

// //   const token = authHeader.split(" ")[1];

// //   jwt.verify(
// //     token,
// //     process.env.JWT_SECRET,
// //     (err, decoded) => {
// //       if (err) {
// //         return res.status(403).send({
// //           message: "Forbidden Access",
// //         });
// //       }

// //       req.decoded = decoded;
// //       next();
// //     }
// //   );
// // };

// // // =======================
// // // MONGODB URI
// // // =======================
// // const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fjjdbj0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// // const client = new MongoClient(uri, {
// //   serverApi: {
// //     version: ServerApiVersion.v1,
// //     strict: true,
// //     deprecationErrors: true,
// //   },
// // });

// // // =======================
// // // DATABASE FUNCTION
// // // =======================
// // async function run() {
// //   try {
// //     // =======================
// //     // COLLECTIONS
// //     // =======================
// //     const tutorCollection = client
// //       .db("mediqueueDB")
// //       .collection("tutors");

// //     const bookingCollection = client
// //       .db("mediqueueDB")
// //       .collection("bookings");

// //     // =======================
// //     // JWT ROUTE
// //     // =======================
// //     app.post("/jwt", async (req, res) => {
// //       const user = req.body;

// //       const token = jwt.sign(
// //         user,
// //         process.env.JWT_SECRET,
// //         {
// //           expiresIn: "7d",
// //         }
// //       );

// //       res.send({ token });
// //     });

// //     // =======================
// //     // ADD TUTOR
// //     // =======================
// //     app.post("/tutors", async (req, res) => {
// //       const tutor = req.body;

// //       const result =
// //         await tutorCollection.insertOne(tutor);

// //       res.send(result);
// //     });

    

// //     // =======================
// //     // FEATURED TUTORS
// //     // =======================
// //     app.get("/featured-tutors", async (req, res) => {
// //       const result =
// //         await tutorCollection
// //           .find()
// //           .limit(6)
// //           .toArray();

// //       res.send(result);
// //     });

// //     // =======================
// //     // SINGLE TUTOR
// //     // =======================
// //     app.get("/tutors/:id", async (req, res) => {
// //       const id = req.params.id;

// //       const query = {
// //         _id: new ObjectId(id),
// //       };

// //       const result =
// //         await tutorCollection.findOne(query);

// //       res.send(result);
// //     });

// //     // =======================
// //     // UPDATE TUTOR
// //     // =======================
// //     app.patch("/tutors/:id", async (req, res) => {
// //       const id = req.params.id;

// //       const updatedData = req.body;

// //       const filter = {
// //         _id: new ObjectId(id),
// //       };

// //       const updatedDoc = {
// //         $set: updatedData,
// //       };

// //       const result =
// //         await tutorCollection.updateOne(
// //           filter,
// //           updatedDoc
// //         );

// //       res.send(result);
// //     });

// //     // =======================
// //     // DELETE TUTOR
// //     // =======================
// //     app.delete("/tutors/:id", async (req, res) => {
// //       const id = req.params.id;

// //       const query = {
// //         _id: new ObjectId(id),
// //       };

// //       const result =
// //         await tutorCollection.deleteOne(query);

// //       res.send(result);
// //     });

// //    // =======================
// //  // GET TUTORS + FILTER
// //  // =======================
// //  app.get("/tutors", async (req, res) => {

// //    const {
// //      search,
// //      startDate,
// //      endDate,
// //    } = req.query;

// //    let query = {};

// //    // SEARCH BY NAME
// //    if (search) {

// //      query.name = {
// //        $regex: search,
// //        $options: "i",
// //      };

// //    }

// //    // FILTER BY DATE
// //    if (startDate && endDate) {

// //      query.sessionDate = {
// //        $gte: startDate,
// //        $lte: endDate,
// //      };

// //    }

// //    const result =
// //      await tutorCollection
// //        .find(query)
// //        .toArray();

// //    res.send(result);

// //  });

// //     // =======================
// //     // CREATE BOOKING
// //     // =======================
// //     app.post("/bookings", async (req, res) => {
// //       const booking = req.body;

// //       const tutorId = booking.tutorId;

// //       // FIND TUTOR
// //       const tutor =
// //         await tutorCollection.findOne({
// //           _id: new ObjectId(tutorId),
// //         });

// //       // TUTOR NOT FOUND
// //       if (!tutor) {
// //         return res.send({
// //           message: "Tutor not found",
// //         });
// //       }

// //       // SLOT CHECK
// //       if (tutor.totalSlot <= 0) {
// //         return res.send({
// //           message:
// //             "This session is fully booked. You can't join right now.",
// //         });
// //       }

// //       // DATE CHECK
// //       const today = new Date();
// //       const sessionDate = new Date(
// //         tutor.sessionDate
// //       );

// //       if (today < sessionDate) {
// //         return res.send({
// //           message:
// //             "Booking is not available yet for this tutor",
// //         });
// //       }

// //       // CHECK DUPLICATE BOOKING
// //       const alreadyBooked =
// //         await bookingCollection.findOne({
// //           tutorId: tutorId,
// //           studentEmail:
// //             booking.studentEmail,
// //         });

// //       if (alreadyBooked) {
// //         return res.send({
// //           message:
// //             "You already booked this tutor",
// //         });
// //       }

// //       // INSERT BOOKING
// //       const result =
// //         await bookingCollection.insertOne({
// //           ...booking,
// //           status: "booked",
// //           createdAt: new Date(),
// //         });

// //       // DECREASE SLOT
// //       await tutorCollection.updateOne(
// //         {
// //           _id: new ObjectId(tutorId),
// //         },
// //         {
// //           $inc: {
// //             totalSlot: -1,
// //           },
// //         }
// //       );

// //       res.send(result);
// //     });

// //     // =======================
// //     // USER BOOKINGS
// //     // =======================
    
// // app.get(
// //   "/my-bookings",
// //   async (req, res) => {

// //     const email =
// //       req.query.email;

// //     const query = {
// //       studentEmail: email,
// //     };

// //     const result =
// //       await bookingCollection
// //         .find(query)
// //         .toArray();

// //     res.send(result);

// //   }
// // );200022

// //     // =======================
// //     // CANCEL BOOKING
// //     // =======================
// //     app.patch(
// //       "/bookings/:id",
// //       async (req, res) => {
// //         const id = req.params.id;

// //         const filter = {
// //           _id: new ObjectId(id),
// //         };

// //         const booking =
// //           await bookingCollection.findOne(
// //             filter
// //           );

// //         // BOOKING NOT FOUND
// //         if (!booking) {
// //           return res.send({
// //             message:
// //               "Booking not found",
// //           });
// //         }

// //         // ALREADY CANCELLED
// //         if (
// //           booking.status ===
// //           "cancelled"
// //         ) {
// //           return res.send({
// //             message:
// //               "Already cancelled",
// //           });
// //         }

// //         // UPDATE STATUS
// //         const result =
// //           await bookingCollection.updateOne(
// //             filter,
// //             {
// //               $set: {
// //                 status:
// //                   "cancelled",
// //               },
// //             }
// //           );

// //         // RETURN SLOT
// //         await tutorCollection.updateOne(
// //           {
// //             _id: new ObjectId(
// //               booking.tutorId
// //             ),
// //           },
// //           {
// //             $inc: {
// //               totalSlot: 1,
// //             },
// //           }
// //         );

// //         res.send(result);
// //       }
// //     );

// //     console.log("MongoDB Connected");
// //   } finally {
// //   }
// // }

// // run().catch(console.dir);

// // // =======================
// // // ROOT ROUTE
// // // =======================
// // app.get("/", (req, res) => {
// //   res.send("MediQueue Server Running");
// // });

// // // =======================
// // // SERVER
// // // =======================
// // app.listen(port, () => {
// //   console.log(
// //     `Server running on port ${port}`
// //   );
// // });





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
// // JWT VERIFY MIDDLEWARE
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
// // MONGODB
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
// // MAIN FUNCTION
// // =======================
// async function run() {
//   try {
//     const tutorCollection = client.db("mediqueueDB").collection("tutors");
//     const bookingCollection = client.db("mediqueueDB").collection("bookings");

//     // =======================
//     // JWT
//     // =======================
//     app.post("/jwt", async (req, res) => {
//       const user = req.body;

//       const token = jwt.sign(user, process.env.JWT_SECRET, {
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
//     // GET TUTORS
//     // =======================
//     app.get("/tutors", async (req, res) => {
//       const { search, startDate, endDate } = req.query;

//       let query = {};

//       if (search) {
//         query.tutorName = {
//           $regex: search,
//           $options: "i",
//         };
//       }

//       if (startDate && endDate) {
//         query.sessionStartDate = {
//           $gte: startDate,
//           $lte: endDate,
//         };
//       }

//       const result = await tutorCollection.find(query).toArray();
//       res.send(result);
//     });

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
//     // BOOKINGS CREATE
//     // =======================
//     app.post("/bookings", async (req, res) => {
//       const booking = req.body;

//       const tutor = await tutorCollection.findOne({
//         _id: new ObjectId(booking.tutorId),
//       });

//       if (!tutor) return res.send({ message: "Tutor not found" });

//       if (tutor.totalSlot <= 0)
//         return res.send({ message: "No slots available" });

//       const already = await bookingCollection.findOne({
//         tutorId: booking.tutorId,
//         studentEmail: booking.studentEmail,
//       });

//       if (already)
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
//     // CANCEL BOOKING (PATCH)
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

//     // =======================
//     // DELETE BOOKING (FIXED)
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
//   } finally {
//   }
// }

// run().catch(console.dir);

// // =======================
// // ROOT
// // =======================
// app.get("/", (req, res) => {
//   res.send("MediQueue Server Running");
// });

// // =======================
// // START SERVER
// // =======================
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });


const express = require("express");
const cors = require("cors");
require("dotenv").config();

const {
  MongoClient,
  ServerApiVersion,
  ObjectId,
} = require("mongodb");

const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 5000;

// =======================
// MIDDLEWARE
// =======================
app.use(cors());
app.use(express.json());

// =======================
// JWT VERIFY (optional use later)
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
// DATABASE
// =======================
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fjjdbj0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// =======================
// MAIN RUN
// =======================
async function run() {
  try {
    const db = client.db("mediqueueDB");
    const tutorCollection = db.collection("tutors");
    const bookingCollection = db.collection("bookings");

    // =======================
    // JWT TOKEN
    // =======================
    app.post("/jwt", async (req, res) => {
      const token = jwt.sign(req.body, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.send({ token });
    });

    // =======================
    // ADD TUTOR
    // =======================
    app.post("/tutors", async (req, res) => {
      const result = await tutorCollection.insertOne(req.body);
      res.send(result);
    });

    // =======================
    // GET TUTORS (FILTER + SEARCH)
    // =======================
    app.get("/tutors", async (req, res) => {
  const { search, startDate, endDate } = req.query;

  let query = {};

  if (search) {
    query.tutorName = {
      $regex: search,
      $options: "i",
    };
  }

  if (startDate && endDate) {
  query.sessionStartDate = {
    $gte: new Date(startDate),
    $lte: new Date(endDate),
  };
}

  const result = await tutorCollection.find(query).toArray();
  res.send(result);
});

    // =======================
    // FEATURED TUTORS
    // =======================
    app.get("/featured-tutors", async (req, res) => {
      const result = await tutorCollection.find().limit(6).toArray();
      res.send(result);
    });

    // =======================
    // SINGLE TUTOR
    // =======================
    app.get("/tutors/:id", async (req, res) => {
      const result = await tutorCollection.findOne({
        _id: new ObjectId(req.params.id),
      });

      res.send(result);
    });

    // =======================
    // UPDATE TUTOR
    // =======================
    app.patch("/tutors/:id", async (req, res) => {
      const result = await tutorCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body }
      );

      res.send(result);
    });

    // =======================
    // DELETE TUTOR
    // =======================
    app.delete("/tutors/:id", async (req, res) => {
      const result = await tutorCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });

      res.send(result);
    });

    // =======================
    // CREATE BOOKING
    // =======================
    app.post("/bookings", async (req, res) => {
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

      if (alreadyBooked)
        return res.send({ message: "Already booked" });

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
    });

    // =======================
    // MY BOOKINGS
    // =======================
    app.get("/my-bookings", async (req, res) => {
      const result = await bookingCollection
        .find({ studentEmail: req.query.email })
        .toArray();

      res.send(result);
    });

    // =======================
    // CANCEL BOOKING
    // =======================
    app.patch("/bookings/:id", async (req, res) => {
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
    });

    // =======================
    // DELETE BOOKING
    // =======================
    app.delete("/bookings/:id", async (req, res) => {
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
    });

    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error);
  }
}

run().catch(console.dir);

// =======================
// ROOT
// =======================
app.get("/", (req, res) => {
  res.send("MediQueue Server Running");
});

// =======================
// START SERVER
// =======================
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});