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

// // // middleware
// // app.use(cors());

// // app.use(express.json());

// // // mongodb uri
// // const uri =
// //   `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// // const client = new MongoClient(uri, {

// //   serverApi: {
// //     version: ServerApiVersion.v1,
// //     strict: true,
// //     deprecationErrors: true,
// //   },

// // });

// // async function run() {

// //   try {

// //     // collections
// //     const tutorCollection =
// //       client
// //         .db("mediqueueDB")
// //         .collection("tutors");

// //     const bookingCollection =
// //       client
// //         .db("mediqueueDB")
// //         .collection("bookings");

// //     // =========================
// //     // ADD TUTOR
// //     // =========================

// //     app.post("/tutors",
// //       async (req, res) => {

// //         const tutor = req.body;

// //         const result =
// //           await tutorCollection.insertOne(
// //             tutor
// //           );

// //         res.send(result);
// //       }
// //     );

// //     // =========================
// //     // GET ALL TUTORS
// //     // =========================

// //     app.get("/tutors",
// //       async (req, res) => {

// //         const result =
// //           await tutorCollection
// //             .find()
// //             .toArray();

// //         res.send(result);
// //       }
// //     );

// //     // =========================
// //     // FEATURED TUTORS
// //     // =========================

// //     app.get("/featured-tutors",
// //       async (req, res) => {

// //         const result =
// //           await tutorCollection
// //             .find()
// //             .limit(6)
// //             .toArray();

// //         res.send(result);
// //       }
// //     );

// //     // =========================
// //     // SINGLE TUTOR
// //     // =========================

// //     app.get("/tutors/:id",
// //       async (req, res) => {

// //         const id = req.params.id;

// //         const query = {
// //           _id: new ObjectId(id),
// //         };

// //         const result =
// //           await tutorCollection.findOne(query);

// //         res.send(result);
// //       }
// //     );

// //     // =========================
// //     // UPDATE TUTOR
// //     // =========================

// //     app.patch("/tutors/:id",
// //       async (req, res) => {

// //         const id = req.params.id;

// //         const updatedData =
// //           req.body;

// //         const filter = {
// //           _id: new ObjectId(id),
// //         };

// //         const updatedDoc = {
// //           $set: updatedData,
// //         };

// //         const result =
// //           await tutorCollection.updateOne(
// //             filter,
// //             updatedDoc
// //           );

// //         res.send(result);
// //       }
// //     );

// //     // =========================
// //     // DELETE TUTOR
// //     // =========================

// //     app.delete("/tutors/:id",
// //       async (req, res) => {

// //         const id = req.params.id;

// //         const query = {
// //           _id: new ObjectId(id),
// //         };

// //         const result =
// //           await tutorCollection.deleteOne(query);

// //         res.send(result);
// //       }
// //     );

// //     // =========================
// //     // SEARCH TUTOR
// //     // =========================

// //     app.get("/search",
// //       async (req, res) => {

// //         const search =
// //           req.query.name;

// //         const query = {

// //           tutorName: {
// //             $regex: search,
// //             $options: "i",
// //           },

// //         };

// //         const result =
// //           await tutorCollection
// //             .find(query)
// //             .toArray();

// //         res.send(result);
// //       }
// //     );

// //     // =========================
// //     // FILTER BY DATE
// //     // =========================

// //     app.get("/filter",
// //       async (req, res) => {

// //         const {
// //           startDate,
// //           endDate,
// //         } = req.query;

// //         const query = {

// //           sessionDate: {

// //             $gte: startDate,

// //             $lte: endDate,

// //           },

// //         };

// //         const result =
// //           await tutorCollection
// //             .find(query)
// //             .toArray();

// //         res.send(result);
// //       }
// //     );

// //     console.log(
// //       "MongoDB Connected"
// //     );

// //   } finally {

// //   }
// // }

// // run().catch(console.dir);

// // // root route
// // app.get("/", (req, res) => {
// //   res.send("MediQueue Server Running");
// // });

// // // server
// // app.listen(port, () => {
// //   console.log(
// //     `Server running on ${port}`
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

// // middleware
// app.use(cors());

// app.use(express.json());

// // jwt middleware
// const verifyToken =
//   (req, res, next) => {

//     const authHeader =
//       req.headers.authorization;

//     if (!authHeader) {

//       return res.status(401).send({
//         message: "Unauthorized",
//       });
//     }

//     const token =
//       authHeader.split(" ")[1];

//     jwt.verify(
//       token,
//       process.env.JWT_SECRET,
//       (err, decoded) => {

//         if (err) {

//           return res.status(403).send({
//             message: "Forbidden",
//           });
//         }

//         req.decoded = decoded;

//         next();
//       }
//     );
//   };

// // mongodb uri
// const uri =
//   `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fjjdbj0.mongodb.net/?appName=Cluster0`;

// const client =
//   new MongoClient(uri, {

//     serverApi: {

//       version:
//         ServerApiVersion.v1,

//       strict: true,

//       deprecationErrors: true,
//     },

//   });

// async function run() {

//   try {

//     // collections
//     const tutorCollection =
//       client
//         .db("mediqueueDB")
//         .collection("tutors");

//     const bookingCollection =
//       client
//         .db("mediqueueDB")
//         .collection("bookings");

//     // JWT ROUTE
//     app.post("/jwt",
//       async (req, res) => {

//         const user = req.body;

//         const token = jwt.sign(
//           user,
//           process.env.JWT_SECRET,
//           {
//             expiresIn: "7d",
//           }
//         );

//         res.send({ token });
//       }
//     );

//     // ADD TUTOR
//     app.post("/tutors",
//       async (req, res) => {

//         const tutor = req.body;

//         const result =
//           await tutorCollection.insertOne(
//             tutor
//           );

//         res.send(result);
//       }
//     );

//     // GET ALL TUTORS
//     app.get("/tutors",
//       async (req, res) => {

//         const result =
//           await tutorCollection
//             .find()
//             .toArray();

//         res.send(result);
//       }
//     );

//     // FEATURED TUTORS
//     app.get("/featured-tutors",
//       async (req, res) => {

//         const result =
//           await tutorCollection
//             .find()
//             .limit(6)
//             .toArray();

//         res.send(result);
//       }
//     );

//     // SINGLE TUTOR
//     app.get("/tutors/:id",
//       async (req, res) => {

//         const id =
//           req.params.id;

//         const query = {
//           _id:
//             new ObjectId(id),
//         };

//         const result =
//           await tutorCollection.findOne(query);

//         res.send(result);
//       }
//     );

//     // UPDATE TUTOR
//     app.patch("/tutors/:id",
//       async (req, res) => {

//         const id =
//           req.params.id;

//         const updatedData =
//           req.body;

//         const filter = {
//           _id:
//             new ObjectId(id),
//         };

//         const updatedDoc = {

//           $set: updatedData,

//         };

//         const result =
//           await tutorCollection.updateOne(
//             filter,
//             updatedDoc
//           );

//         res.send(result);
//       }
//     );

//     // DELETE TUTOR
//     app.delete("/tutors/:id",
//       async (req, res) => {

//         const id =
//           req.params.id;

//         const query = {
//           _id:
//             new ObjectId(id),
//         };

//         const result =
//           await tutorCollection.deleteOne(query);

//         res.send(result);
//       }
//     );

//     // SEARCH
//     app.get("/search",
//       async (req, res) => {

//         const search =
//           req.query.name;

//         const query = {

//           tutorName: {

//             $regex: search,

//             $options: "i",

//           },

//         };

//         const result =
//           await tutorCollection
//             .find(query)
//             .toArray();

//         res.send(result);
//       }
//     );

//     // FILTER
//     app.get("/filter",
//       async (req, res) => {

//         const {
//           startDate,
//           endDate,
//         } = req.query;

//         const query = {

//           sessionDate: {

//             $gte: startDate,

//             $lte: endDate,

//           },

//         };

//         const result =
//           await tutorCollection
//             .find(query)
//             .toArray();

//         res.send(result);
//       }
//     );

//     // CREATE BOOKING
// app.post("/bookings", async (req, res) => {
//   const booking = req.body;
//   const tutorId = booking.tutorId;

//   // find tutor
//   const tutor = await tutorCollection.findOne({
//     _id: new ObjectId(tutorId),
//   });

//   // tutor not found
//   if (!tutor) {
//     return res.send({
//       message: "Tutor not found",
//     });
//   }

//   // SLOT CHECK
//   if (tutor.totalSlot <= 0) {
//     return res.send({
//       message: "This session is fully booked. You can’t join at the moment.",
//     });
//   }

//   // DATE CHECK
//   const today = new Date();
//   const sessionDate = new Date(tutor.sessionDate);

//   if (today < sessionDate) {
//     return res.send({
//       message: "Booking is not available yet for this tutor",
//     });
//   }

//   // INSERT BOOKING
//   const result = await bookingCollection.insertOne({
//     ...booking,
//     status: "booked",
//     createdAt: new Date(),
//   });

//   // DECREASE SLOT
//   await tutorCollection.updateOne(
//     { _id: new ObjectId(tutorId) },
//     { $inc: { totalSlot: -1 } }
//   );

//   res.send(result);
// });


// // USER BOOKINGS
// app.get("/my-bookings", verifyToken, async (req, res) => {
//   const email = req.query.email;

//   const query = {
//     studentEmail: email,
//   };

//   const result = await bookingCollection.find(query).toArray();

//   res.send(result);
// });


// // CANCEL BOOKING
// app.patch("/bookings/:id", async (req, res) => {
//   const id = req.params.id;

//   const filter = {
//     _id: new ObjectId(id),
//   };

//   const booking = await bookingCollection.findOne(filter);

//   if (!booking) {
//     return res.send({ message: "Booking not found" });
//   }

//   if (booking.status === "cancelled") {
//     return res.send({ message: "Already cancelled" });
//   }

//   // UPDATE STATUS
//   const result = await bookingCollection.updateOne(filter, {
//     $set: { status: "cancelled" },
//   });

//   // RETURN SLOT
//   await tutorCollection.updateOne(
//     { _id: new ObjectId(booking.tutorId) },
//     { $inc: { totalSlot: 1 } }
//   );

//   res.send(result);
// });

//     console.log(
//       "MongoDB Connected"
//     );

//   } finally {

//   }
// }

// run().catch(console.dir);

// app.get("/", (req, res) => {
//   res.send("MediQueue Server Running");
// });

// app.listen(port, () => {
//   console.log(
//     `Server running on ${port}`
//   );
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
app.use(cors({
  origin: ['https://assignment-9-hazel-one.vercel.app', 'http://localhost:3000'],
  credentials: 'include'
}));
app.use(express.json());

// =======================
// JWT VERIFY MIDDLEWARE
// =======================
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({
      message: "Unauthorized Access",
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    (err, decoded) => {
      if (err) {
        return res.status(403).send({
          message: "Forbidden Access",
        });
      }

      req.decoded = decoded;
      next();
    }
  );
};

// =======================
// MONGODB URI
// =======================
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fjjdbj0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@nabilsiddik.4hqorox.mongodb.net/?appName=nabilsiddik`

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// =======================
// DATABASE FUNCTION
// =======================
async function run() {
  try {
    // =======================
    // COLLECTIONS
    // =======================
    const tutorCollection = client
      .db("mediqueueDB")
      .collection("tutors");

    const bookingCollection = client
      .db("mediqueueDB")
      .collection("bookings");

    // =======================
    // JWT ROUTE
    // =======================
    app.post("/jwt", async (req, res) => {
      const user = req.body;

      const token = jwt.sign(
        user,
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      res.send({ token });
    });

    // =======================
    // ADD TUTOR
    // =======================
    app.post("/tutors", async (req, res) => {
      const tutor = req.body;

      const result =
        await tutorCollection.insertOne(tutor);

      res.send(result);
    });

    

    // =======================
    // FEATURED TUTORS
    // =======================
    app.get("/featured-tutors", async (req, res) => {
      const result =
        await tutorCollection
          .find()
          .limit(6)
          .toArray();

      res.send(result);
    });

    // =======================
    // SINGLE TUTOR
    // =======================
    app.get("/tutors/:id", async (req, res) => {
      const id = req.params.id;

      const query = {
        _id: new ObjectId(id),
      };

      const result =
        await tutorCollection.findOne(query);

      res.send(result);
    });

    // =======================
    // UPDATE TUTOR
    // =======================
    app.patch("/tutors/:id", async (req, res) => {
      const id = req.params.id;

      const updatedData = req.body;

      const filter = {
        _id: new ObjectId(id),
      };

      const updatedDoc = {
        $set: updatedData,
      };

      const result =
        await tutorCollection.updateOne(
          filter,
          updatedDoc
        );

      res.send(result);
    });

    // =======================
    // DELETE TUTOR
    // =======================
    app.delete("/tutors/:id", async (req, res) => {
      const id = req.params.id;

      const query = {
        _id: new ObjectId(id),
      };

      const result =
        await tutorCollection.deleteOne(query);

      res.send(result);
    });

   // =======================
 // GET TUTORS + FILTER
 // =======================
 app.get("/tutors", async (req, res) => {

   const {
     search,
     startDate,
     endDate,
   } = req.query;

   let query = {};

   // SEARCH BY NAME
   if (search) {

     query.name = {
       $regex: search,
       $options: "i",
     };

   }

   // FILTER BY DATE
   if (startDate && endDate) {

     query.sessionDate = {
       $gte: startDate,
       $lte: endDate,
     };

   }

   const result =
     await tutorCollection
       .find(query)
       .toArray();

   res.send(result);

 });

    // =======================
    // CREATE BOOKING
    // =======================
    app.post("/bookings", async (req, res) => {
      const booking = req.body;

      const tutorId = booking.tutorId;

      // FIND TUTOR
      const tutor =
        await tutorCollection.findOne({
          _id: new ObjectId(tutorId),
        });

      // TUTOR NOT FOUND
      if (!tutor) {
        return res.send({
          message: "Tutor not found",
        });
      }

      // SLOT CHECK
      if (tutor.totalSlot <= 0) {
        return res.send({
          message:
            "This session is fully booked. You can't join right now.",
        });
      }

      // DATE CHECK
      const today = new Date();
      const sessionDate = new Date(
        tutor.sessionDate
      );

      if (today < sessionDate) {
        return res.send({
          message:
            "Booking is not available yet for this tutor",
        });
      }

      // CHECK DUPLICATE BOOKING
      const alreadyBooked =
        await bookingCollection.findOne({
          tutorId: tutorId,
          studentEmail:
            booking.studentEmail,
        });

      if (alreadyBooked) {
        return res.send({
          message:
            "You already booked this tutor",
        });
      }

      // INSERT BOOKING
      const result =
        await bookingCollection.insertOne({
          ...booking,
          status: "booked",
          createdAt: new Date(),
        });

      // DECREASE SLOT
      await tutorCollection.updateOne(
        {
          _id: new ObjectId(tutorId),
        },
        {
          $inc: {
            totalSlot: -1,
          },
        }
      );

      res.send(result);
    });

    // =======================
    // USER BOOKINGS
    // =======================
    
app.get(
  "/my-bookings",
  async (req, res) => {

    const email =
      req.query.email;

    const query = {
      studentEmail: email,
    };

    const result =
      await bookingCollection
        .find(query)
        .toArray();

    res.send(result);

  }
);200022

    // =======================
    // CANCEL BOOKING
    // =======================
    app.patch(
      "/bookings/:id",
      async (req, res) => {
        const id = req.params.id;

        const filter = {
          _id: new ObjectId(id),
        };

        const booking =
          await bookingCollection.findOne(
            filter
          );

        // BOOKING NOT FOUND
        if (!booking) {
          return res.send({
            message:
              "Booking not found",
          });
        }

        // ALREADY CANCELLED
        if (
          booking.status ===
          "cancelled"
        ) {
          return res.send({
            message:
              "Already cancelled",
          });
        }

        // UPDATE STATUS
        const result =
          await bookingCollection.updateOne(
            filter,
            {
              $set: {
                status:
                  "cancelled",
              },
            }
          );

        // RETURN SLOT
        await tutorCollection.updateOne(
          {
            _id: new ObjectId(
              booking.tutorId
            ),
          },
          {
            $inc: {
              totalSlot: 1,
            },
          }
        );

        res.send(result);
      }
    );

    console.log("MongoDB Connected");
  } finally {
  }
}

run().catch(console.dir);

// =======================
// ROOT ROUTE
// =======================
app.get("/", (req, res) => {
  res.send("MediQueue Server Running");
});

// =======================
// SERVER
// =======================
app.listen(port, () => {
  console.log(
    `Server running on port ${port}`
  );
});