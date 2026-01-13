const express = require("express");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcrypt");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const jwt = require("jsonwebtoken");

const { open } = require("sqlite");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// const dbPath = path.join(__dirname, "userDetails.db");
// let db = null;

// const initializeDBAndServer = async () => {
//   try {
//     db = await open({
//       filename: dbPath,
//       driver: sqlite3.Database,
//     });
//     await db.run(`
//       CREATE TABLE IF NOT EXISTS users (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         user_name TEXT UNIQUE,
//         email TEXT,
//         age INTEGER,
//         password TEXT
//       );
//     `);

//     await db.run(`
//       CREATE TABLE IF NOT EXISTS checked_dates (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         day TEXT,
//         month TEXT,
//         date INTEGER,
//         time TEXT,
//         fullDate TEXT UNIQUE,
//         status TEXT,
//         photo TEXT
//       );
//     `);

//     await db.run(`CREATE TABLE IF NOT EXISTS medication (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       day_streak INTEGER DEFAULT 0,
//       today_status INTEGER DEFAULT 0,
//       monthly_rate INTEGER DEFAULT 0
//     )`);

//     await db.run(`CREATE TABLE IF NOT EXISTS adherence (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       adherence_rate INTEGER DEFAULT 0,
//       current_streak INTEGER DEFAULT 0,
//       missed_this_month INTEGER DEFAULT 0,
//       taken_this_week INTEGER DEFAULT 0
//     )`);

//     await db.run(`CREATE TABLE IF NOT EXISTS notifications (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       name TEXT,
//       email TEXT,
//       reminder_time TEXT,
//       alert_delay TEXT,
//       message TEXT,
//       active INTEGER DEFAULT 1
//     )`);

//     app.listen(3000, () => {
//       console.log("Server running at http://localhost:3000/");
//     });
//   } catch (e) {
//     console.log(`DB Error: ${e.message}`);
//     process.exit(1);
//   }
// };

// initializeDBAndServer();

const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

// Use a path relative to the current file
const dbPath = path.join(__dirname, "userDetails.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Connected to SQLite database at:", dbPath);
  }
});

const initializeDBAndServer = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_name TEXT UNIQUE,
        email TEXT UNIQUE,
        age INTEGER,
        password TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS checked_dates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        day TEXT,
        month TEXT,
        date INTEGER,
        time TEXT,
        fullDate TEXT UNIQUE,
        status TEXT,
        photo TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS medication (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        day_streak INTEGER DEFAULT 0,
        today_status INTEGER DEFAULT 0,
        monthly_rate INTEGER DEFAULT 0
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS adherence (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        adherence_rate INTEGER DEFAULT 0,
        current_streak INTEGER DEFAULT 0,
        missed_this_month INTEGER DEFAULT 0,
        taken_this_week INTEGER DEFAULT 0
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        reminder_time TEXT,
        alert_delay TEXT,
        message TEXT,
        active INTEGER DEFAULT 1
      )
    `);

    console.log("All tables created successfully");

    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000/");
    });
  });
};

initializeDBAndServer();

// Sign-up
app.post("/signup", (request, response) => {
  const { user_name, email, age, password } = request.body;
  console.log(user_name, email, age, password, "signup");

  // First check if username or email already exists
  const checkUserQuery = `SELECT * FROM users WHERE user_name = ? OR email = ?`;
  db.get(checkUserQuery, [user_name, email], async (err, existingUser) => {
    if (err) {
      console.error("Database error:", err);
      return response.status(500).send({ error: "Database error" });
    }

    if (existingUser) {
      const field = existingUser.user_name === user_name ? "username" : "email";
      return response
        .status(400)
        .send({ error: `User with this ${field} already exists` });
    }

    try {
      // Hash password and create user if no duplicates found
      const hashedPassword = await bcrypt.hash(password, 10);
      const createUserQuery = `
        INSERT INTO users (user_name, email, age, password)
        VALUES (?, ?, ?, ?)`;

      db.run(
        createUserQuery,
        [user_name, email, age, hashedPassword],
        function (err) {
          if (err) {
            console.error("Error creating user:", err);
            return response
              .status(500)
              .send({ error: "Failed to create user" });
          }
          console.log("User created with ID:", this.lastID);
          response.status(201).send({ message: "User created successfully" });
        }
      );
    } catch (error) {
      console.error("Error in signup:", error);
      response
        .status(500)
        .send({ error: "Internal server error during signup" });
    }
  });
});

// Login
app.post("/login", (request, response) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return response
      .status(400)
      .send({ error: "Email and password are required" });
  }

  console.log("Login attempt for user:", email);

  const selectUserQuery = `SELECT * FROM users WHERE email = ?`;

  // Using callback style to be consistent with sqlite3
  db.get(selectUserQuery, [email], async (err, dbUser) => {
    if (err) {
      console.error("Database error during login:", err);
      return response.status(500).send({ error: "Database error" });
    }

    console.log("Database user found:", dbUser ? "Yes" : "No");

    if (!dbUser) {
      return response
        .status(400)
        .send({ error: "Invalid username or password" });
    }

    try {
      const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
      console.log("Password match:", isPasswordMatched);

      if (!isPasswordMatched) {
        return response
          .status(400)
          .send({ error: "Invalid username or password" });
      }

      // If we get here, login is successful
      const payload = { username: dbUser.user_name };
      const token = jwt.sign(payload, "your_jwt_secret", { expiresIn: "1h" });

      response.send({
        message: "Login successful",
        token,
        user: {
          username: dbUser.user_name,
          email: dbUser.email,
        },
      });
    } catch (error) {
      console.error("Error during password comparison:", error);
      response
        .status(500)
        .send({ error: "Internal server error during login" });
    }
  });
});

const authenticateToken = (request, response, next) => {
  const authHeader = request.headers["authorization"];
  let token;
  if (authHeader !== undefined) {
    token = authHeader.split(" ")[1];
  }

  if (token === undefined) {
    response.status(401).send({ error: "Token not provided" });
  } else {
    jwt.verify(token, "jwt_secret_key", (error, payload) => {
      if (error) {
        response.status(401).send({ error: "Invalid JWT Token" });
      } else {
        request.user_name = payload.user_name;
        next();
      }
    });
  }
};

app.get("/home", authenticateToken, (request, response) => {
  const user_name = request.user_name;
  console.log(user_name);
  response.send(`Welcome, ${user_name}`);
});

// Calendar

app.get("/dates", async (req, res) => {
  try {
    const rows = await db.all("SELECT * FROM checked_dates");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle date check/uncheck

app.post("/dates", upload.single("photo"), async (req, res) => {
  const { day, month, date, time, fullDate, status } = req.body;
  const photoFile = req.file;

  console.log("Received fields:", req.body);
  console.log("Received file:", photoFile);

  try {
    const row = await db.get("SELECT * FROM checked_dates WHERE fullDate = ?", [
      fullDate,
    ]);

    if (!row) {
      await db.run(
        "INSERT INTO checked_dates (day, month, date, time, fullDate, status, photo) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          day,
          month,
          date,
          time,
          fullDate,
          status,
          photoFile ? photoFile.filename : null,
        ]
      );
    }

    const updatedDates = await db.all("SELECT * FROM checked_dates");
    res.json(updatedDates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "k.sssprahlad@gmail.com",
    pass: "sqdcoqmyjtmtjcwx",
  },
});

// POST /send-alert route
app.post("/send-alert", async (req, res) => {
  const { name, email, message } = req.body;
  console.log(name, email, message);

  const mailOptions = {
    from: '"MediAlert System" <k.sssprahlad@gmail.com>',
    to: email,
    subject: `Medication Alert - ${name}`,
    text: `${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent to", email);
    res.status(200).send("Alert email sent successfully.");
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).send("Failed to send alert email.");
  }
});

// app.post("/send-alert", (req, res) => {
//   const { name, email, reminderTime, alertDelay, message } = req.body;
//   db.run(
//     `INSERT INTO notifications (name, email, reminder_time, alert_delay, message) VALUES (?, ?, ?, ?, ?)`,
//     [name, email, reminderTime, alertDelay, message],
//     (err) => {
//       if (err) {
//         console.error(err.message);
//         return res.status(500).send("Error saving settings");
//       }
//       res.send("Notification settings saved");
//     }
//   );
// });

// cron.schedule("*/5 * * * *", () => {
//   const now = new Date();
//   const currentMinutes = now.getHours() * 60 + now.getMinutes();

//   db.all("SELECT * FROM notifications WHERE active = 1", (err, rows) => {
//     if (err) return console.error("DB fetch error:", err);

//     rows.forEach((user) => {
//       console.log(user);
//       // Convert "HH:MM" to minutes
//       const [hours, minutes] = user.reminder_time.split(":").map(Number);
//       const reminderMinutes = hours * 60 + minutes;

//       // Parse alert_delay ("1 hour", "2 hours") into minutes
//       const delayMinutes = parseInt(user.alert_delay) || 60; // fallback: 60 minutes

//       // Check if current time is within the delay window
//       const minutesSinceReminder = currentMinutes - reminderMinutes;

//       if (minutesSinceReminder >= 0 && minutesSinceReminder <= delayMinutes) {
//         // Send email
//         const mailOptions = {
//           from: '"MediAlert" <k.sssprahlad@gmail.com>',
//           to: user.email,
//           subject: `Medication Alert - ${user.name}`,
//           text: user.message || `Reminder: ${user.name} has not taken medication.`,
//         };

//         transporter.sendMail(mailOptions, (err, info) => {
//           if (err) return console.error("Mail error:", err);
//           console.log(`Email sent to ${user.email}`);
//         });
//       }
//     });
//   });
// });

// CRUD for medication_stats
app.post("/medication", (req, res) => {
  const { day_streak, today_status, monthly_rate } = req.body;
  console.log(day_streak, today_status, monthly_rate);
  db.run(
    `INSERT INTO medication (day_streak, today_status, monthly_rate) VALUES (?, ?, ?)`,
    [day_streak, today_status, monthly_rate],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

app.get("/medication", async (req, res) => {
  try {
    const rows = await db.all("SELECT * FROM medication");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CRUD for adherence_stats
app.post("/adherence", (req, res) => {
  const { adherence_rate, current_streak, missed_this_month, taken_this_week } =
    req.body;

  db.run(
    `INSERT INTO adherence (adherence_rate, current_streak, missed_this_month, taken_this_week)
     VALUES (?, ?, ?, ?)`,
    [adherence_rate, current_streak, missed_this_month, taken_this_week],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

app.get("/adherence", async (req, res) => {
  try {
    const rows = await db.all("SELECT * FROM adherence");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
