
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
// app.use(cors({
//     origin: ['https://assignment-9-hazel-one.vercel.app', 'http://localhost:3000']
// }));
// app.use(express.json());

// // =======================
// // JWT VERIFY MIDDLEWARE
// // =======================
// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.status(401).send({
//       message: "Unauthorized Access",
//     });
//   }

//   const token = authHeader.split(" ")[1];

//   jwt.verify(
//     token,
//     process.env.JWT_SECRET,
//     (err, decoded) => {
//       if (err) {
//         return res.status(403).send({
//           message: "Forbidden Access",
//         });
//       }

//       req.decoded = decoded;
//       next();
//     }
//   );
// };

// // =======================
// // MONGODB URI
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
// // DATABASE FUNCTION
// // =======================
// async function run() {
//   try {
//     // =======================
//     // COLLECTIONS
//     // =======================
//     const tutorCollection = client
//       .db("mediqueueDB")
//       .collection("tutors");

//     const bookingCollection = client
//       .db("mediqueueDB")
//       .collection("bookings");

//     // =======================
//     // JWT ROUTE
//     // =======================
//     app.post("/jwt", async (req, res) => {
//       const user = req.body;

//       const token = jwt.sign(
//         user,
//         process.env.JWT_SECRET,
//         {
//           expiresIn: "7d",
//         }
//       );

//       res.send({ token });
//     });

//     // =======================
//     // ADD TUTOR
//     // =======================
//     app.post("/tutors", async (req, res) => {
//       const tutor = req.body;

//       const result =
//         await tutorCollection.insertOne(tutor);

//       res.send(result);
//     });

    

//     // =======================
//     // FEATURED TUTORS
//     // =======================
//     app.get("/featured-tutors", async (req, res) => {
//       const result =
//         await tutorCollection
//           .find()
//           .limit(6)
//           .toArray();

//       res.send(result);
//     });

//     // =======================
//     // SINGLE TUTOR
//     // =======================
//     app.get("/tutors/:id", async (req, res) => {
//       const id = req.params.id;

//       const query = {
//         _id: new ObjectId(id),
//       };

//       const result =
//         await tutorCollection.findOne(query);

//       res.send(result);
//     });

//     // =======================
//     // UPDATE TUTOR
//     // =======================
//     app.patch("/tutors/:id", async (req, res) => {
//       const id = req.params.id;

//       const updatedData = req.body;

//       const filter = {
//         _id: new ObjectId(id),
//       };

//       const updatedDoc = {
//         $set: updatedData,
//       };

//       const result =
//         await tutorCollection.updateOne(
//           filter,
//           updatedDoc
//         );

//       res.send(result);
//     });

//     // =======================
//     // DELETE TUTOR
//     // =======================
//     app.delete("/tutors/:id", async (req, res) => {
//       const id = req.params.id;

//       const query = {
//         _id: new ObjectId(id),
//       };

//       const result =
//         await tutorCollection.deleteOne(query);

//       res.send(result);
//     });

//    // =======================
//  // GET TUTORS + FILTER
//  // =======================
//  app.get("/tutors", async (req, res) => {

//    const {
//      search,
//      startDate,
//      endDate,
//    } = req.query;

//    let query = {};

//    // SEARCH BY NAME
//    if (search) {

//      query.name = {
//        $regex: search,
//        $options: "i",
//      };

//    }

//    // FILTER BY DATE
//    if (startDate && endDate) {

//      query.sessionDate = {
//        $gte: startDate,
//        $lte: endDate,
//      };

//    }

//    const result =
//      await tutorCollection
//        .find(query)
//        .toArray();

//    res.send(result);

//  });

//     // =======================
//     // CREATE BOOKING
//     // =======================
//     app.post("/bookings", async (req, res) => {
//       const booking = req.body;

//       const tutorId = booking.tutorId;

//       // FIND TUTOR
//       const tutor =
//         await tutorCollection.findOne({
//           _id: new ObjectId(tutorId),
//         });

//       // TUTOR NOT FOUND
//       if (!tutor) {
//         return res.send({
//           message: "Tutor not found",
//         });
//       }

//       // SLOT CHECK
//       if (tutor.totalSlot <= 0) {
//         return res.send({
//           message:
//             "This session is fully booked. You can't join right now.",
//         });
//       }

//       // DATE CHECK
//       const today = new Date();
//       const sessionDate = new Date(
//         tutor.sessionDate
//       );

//       if (today < sessionDate) {
//         return res.send({
//           message:
//             "Booking is not available yet for this tutor",
//         });
//       }

//       // CHECK DUPLICATE BOOKING
//       const alreadyBooked =
//         await bookingCollection.findOne({
//           tutorId: tutorId,
//           studentEmail:
//             booking.studentEmail,
//         });

//       if (alreadyBooked) {
//         return res.send({
//           message:
//             "You already booked this tutor",
//         });
//       }

//       // INSERT BOOKING
//       const result =
//         await bookingCollection.insertOne({
//           ...booking,
//           status: "booked",
//           createdAt: new Date(),
//         });

//       // DECREASE SLOT
//       await tutorCollection.updateOne(
//         {
//           _id: new ObjectId(tutorId),
//         },
//         {
//           $inc: {
//             totalSlot: -1,
//           },
//         }
//       );

//       res.send(result);
//     });

//     // =======================
//     // USER BOOKINGS
//     // =======================
    
// app.get(
//   "/my-bookings",
//   async (req, res) => {

//     const email =
//       req.query.email;

//     const query = {
//       studentEmail: email,
//     };

//     const result =
//       await bookingCollection
//         .find(query)
//         .toArray();

//     res.send(result);

//   }
// );

//     // =======================
//     // CANCEL BOOKING
//     // =======================
//     app.patch(
//       "/bookings/:id",
//       async (req, res) => {
//         const id = req.params.id;

//         const filter = {
//           _id: new ObjectId(id),
//         };

//         const booking =
//           await bookingCollection.findOne(
//             filter
//           );

//         // BOOKING NOT FOUND
//         if (!booking) {
//           return res.send({
//             message:
//               "Booking not found",
//           });
//         }

//         // ALREADY CANCELLED
//         if (
//           booking.status ===
//           "cancelled"
//         ) {
//           return res.send({
//             message:
//               "Already cancelled",
//           });
//         }

//         // UPDATE STATUS
//         const result =
//           await bookingCollection.updateOne(
//             filter,
//             {
//               $set: {
//                 status:
//                   "cancelled",
//               },
//             }
//           );

//         // RETURN SLOT
//         await tutorCollection.updateOne(
//           {
//             _id: new ObjectId(
//               booking.tutorId
//             ),
//           },
//           {
//             $inc: {
//               totalSlot: 1,
//             },
//           }
//         );

//         res.send(result);
//       }
//     );

//     console.log("MongoDB Connected");
//   } finally {
//   }
// }

// run().catch(console.dir);

// // =======================
// // ROOT ROUTE
// // =======================
// app.get("/", (req, res) => {
//   res.send("MediQueue Server Running");
// });


// module.exports = app;



const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

const app = express();

// =======================
// MIDDLEWARE
// =======================
app.use(cors({
    origin: [
        'https://assignment-9-hazel-one.vercel.app', 
        'http://localhost:3000',
        'http://localhost:5173'
    ],
    credentials: true
}));
app.use(express.json());

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
// MONGODB CONNECTION
// =======================
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fjjdbj0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const db = client.db("mediqueueDB");
        const tutorCollection = db.collection("tutors");
        const bookingCollection = db.collection("bookings");

        // --- ROOT ROUTE ---
        app.get("/", (req, res) => {
            res.send("MediQueue Server is Running");
        });

        // --- JWT ROUTE ---
        app.post("/jwt", async (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "7d" });
            res.send({ token });
        });

        // --- TUTOR ROUTES ---
        app.post("/tutors", async (req, res) => {
            const result = await tutorCollection.insertOne(req.body);
            res.send(result);
        });

        app.get("/tutors", async (req, res) => {
            const { search, startDate, endDate } = req.query;
            let query = {};
            if (search) {
                query.name = { $regex: search, $options: "i" };
            }
            if (startDate && endDate) {
                query.sessionDate = { $gte: startDate, $lte: endDate };
            }
            const result = await tutorCollection.find(query).toArray();
            res.send(result);
        });

        app.get("/featured-tutors", async (req, res) => {
            const result = await tutorCollection.find().limit(6).toArray();
            res.send(result);
        });

        app.get("/tutors/:id", async (req, res) => {
            const query = { _id: new ObjectId(req.params.id) };
            const result = await tutorCollection.findOne(query);
            res.send(result);
        });

        app.patch("/tutors/:id", async (req, res) => {
            const filter = { _id: new ObjectId(req.params.id) };
            const updatedDoc = { $set: req.body };
            const result = await tutorCollection.updateOne(filter, updatedDoc);
            res.send(result);
        });

        app.delete("/tutors/:id", async (req, res) => {
            const query = { _id: new ObjectId(req.params.id) };
            const result = await tutorCollection.deleteOne(query);
            res.send(result);
        });

        // --- BOOKING ROUTES ---
        app.post("/bookings", async (req, res) => {
            const booking = req.body;
            const tutorId = booking.tutorId;

            const tutor = await tutorCollection.findOne({ _id: new ObjectId(tutorId) });
            if (!tutor) return res.send({ message: "Tutor not found" });
            if (tutor.totalSlot <= 0) return res.send({ message: "Fully booked" });

            const alreadyBooked = await bookingCollection.findOne({
                tutorId: tutorId,
                studentEmail: booking.studentEmail,
            });
            if (alreadyBooked) return res.send({ message: "Already booked" });

            const result = await bookingCollection.insertOne({
                ...booking,
                status: "booked",
                createdAt: new Date(),
            });

            await tutorCollection.updateOne(
                { _id: new ObjectId(tutorId) },
                { $inc: { totalSlot: -1 } }
            );
            res.send(result);
        });

        app.get("/my-bookings", async (req, res) => {
            const query = { studentEmail: req.query.email };
            const result = await bookingCollection.find(query).toArray();
            res.send(result);
        });

        app.patch("/bookings/:id", async (req, res) => {
            const filter = { _id: new ObjectId(req.params.id) };
            const booking = await bookingCollection.findOne(filter);
            if (!booking || booking.status === "cancelled") {
                return res.send({ message: "Cannot cancel" });
            }

            const result = await bookingCollection.updateOne(filter, {
                $set: { status: "cancelled" },
            });

            await tutorCollection.updateOne(
                { _id: new ObjectId(booking.tutorId) },
                { $inc: { totalSlot: 1 } }
            );
            res.send(result);
        });

    } catch (error) {
        console.error("MongoDB Error:", error);
    }
}

run().catch(console.dir);

// Vercel-এর জন্য এক্সপোর্ট (Listen করার প্রয়োজন নেই)
module.exports = app;