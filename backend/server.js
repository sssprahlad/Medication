const express = require('express');
const { open } = require("sqlite");
const path = require("path");
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const nodemailer = require("nodemailer");
const cron = require("node-cron");

const PORT = 3000;


app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, "userDetails.db");
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    
    await db.run(`
      CREATE TABLE IF NOT EXISTS userDetails (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_name TEXT UNIQUE,
        email TEXT,
        age INTEGER,
        password TEXT
      );
    `);

    await db.run(`
      CREATE TABLE IF NOT EXISTS checked_dates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        day TEXT,         
        month TEXT,       
        date INTEGER,     
        time TEXT,        
        fullDate TEXT UNIQUE,
        status TEXT,
        photo TEXT       
      );
    `);

    // await db.run(`
    // CREATE TABLE IF NOT EXISTS medication_alerts (
    //   id INTEGER PRIMARY KEY AUTOINCREMENT,
    //   name TEXT NOT NULL,
    //   email TEXT NOT NULL,
    //   adherenceRate INTEGER NOT NULL,
    //   streak INTEGER NOT NULL,
    //   sentAt TEXT NOT NULL
    // );
    // `);   
    
  
    await db.run(`CREATE TABLE IF NOT EXISTS medication (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day_streak INTEGER DEFAULT 0,
      today_status INTEGER DEFAULT 0,
      monthly_rate INTEGER DEFAULT 0
    )`);
  
    await db.run(`CREATE TABLE IF NOT EXISTS adherence (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      adherence_rate INTEGER DEFAULT 0,
      current_streak INTEGER DEFAULT 0,
      missed_this_month INTEGER DEFAULT 0,
      taken_this_week INTEGER DEFAULT 0
    )`);

    await db.run(`CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      reminder_time TEXT,   
      alert_delay TEXT,  
      message TEXT,
      active INTEGER DEFAULT 1
    )`);    



    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// Sign-up
app.post("/signup", async (request, response) => {
  const { user_name, email, age, password } = request.body;
  console.log(user_name, email, age, password);
  const hashedPassword = await bcrypt.hash(password, 10);
  const selectUserQuery = `SELECT * FROM users WHERE user_name = ?`;
  const dbUser = await db.get(selectUserQuery, [user_name]);

  if (dbUser === undefined) {
    const createUserQuery = `
      INSERT INTO users (user_name, email, age, password)
      VALUES (?, ?, ?, ?)`;
   const result = await db.run(createUserQuery, [user_name, email, age, hashedPassword]);
   console.log("User ID: ", result.lastID);
    response.send({message:"User created successfully"});
  } else {
    response.status(400).send({error:"User already exists"});
  }
});

// Login
app.post("/login", async (request, response) => {
  const { user_name, password } = request.body;
  const selectUserQuery = `SELECT * FROM users WHERE user_name = ?`;
  const dbUser = await db.get(selectUserQuery, [user_name]);

  if (dbUser === undefined) {
    response.status(400).send({error:"Invalid User"});
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    console.log(isPasswordMatched);
    if (isPasswordMatched) {
      const payload = { user_name: dbUser.user_name };
      const jwtToken = jwt.sign(payload, "jwt_secret_key");
      response.send({ jwtToken, user_name: dbUser.user_name, email: dbUser.email });
      console.log(jwtToken);
      
    } else {
      response.status(400).send({error:"Invalid Password"});
    }
  }
});


const authenticateToken = (request, response, next) => {
  const authHeader = request.headers["authorization"];
  let token;
  if (authHeader !== undefined) {
    token = authHeader.split(" ")[1];
  }

  if (token === undefined) {
    response.status(401).send({error:"Token not provided"});
  } else {
    jwt.verify(token, "jwt_secret_key", (error, payload) => {
      if (error) {
        response.status(401).send({error:"Invalid JWT Token"});
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
    const row = await db.get("SELECT * FROM checked_dates WHERE fullDate = ?", [fullDate]);

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
          photoFile ? photoFile.filename : null
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
app.post("/adherence",  (req, res) => {
  const { adherence_rate, current_streak, missed_this_month, taken_this_week } = req.body;
 
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

app.get("/adherence", async(req, res) => {
 try {
    const rows = await db.all("SELECT * FROM adherence");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




