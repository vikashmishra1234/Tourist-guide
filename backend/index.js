const express = require("express");
require('dotenv').config();
const Connection = require('./Database/database');
const Router = require('./routes/Route');
const cors = require('cors');
const app = express();

// app.use(cors());
app.use(
    cors({
      origin: ["https://tourist-guide-ashen.vercel.app","https://priest-finder-web-app.onrender.com"],
      methods: ["POST", "GET", "PUT"],
      credentials: true,
    })
  );
app.use(express.json());
app.use('/',Router);

const Port = 5000;



Connection();
app.listen(Port,()=>console.log(`server running http://localhost:${Port}`));
