const express = require('express');
const { open } = require("sqlite");
const sqlite3 = require('sqlite3');
const path = require("path");
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

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
      response.send({ jwtToken });
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
