// Load packages and access services
const express = require("express");
const app = express();
const path = require("path");

require('dotenv').config()



const multer = require("multer");
const upload = multer();

//const dblib = require("./dblib.js");

// Setup view engine to ejs
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
// Serve static content directly
app.use(express.static("css"));

//
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Setup view engine to ejs
app.set('view engine', 'ejs');

// Serve static content directly
app.use(express.static("css"));



// Start listening to incoming requests
// If process.env.PORT is not defined, port number 3000 is used
const listener = app.listen(process.env.PORT || 3000, () => {
    console.log(`Your app is listening on port ${listener.address().port}`);
});

// Route to welcome page
app.get('/', (request, response) => {
    response.render("index");
});
//////////////////////////////////////////////////////////////////////
app.get("/input", (req, res) => {
    res.render("input");
 });
 
 app.post("/input",  upload.single('filename'), (req, res) => {
     if(!req.file || Object.keys(req.file).length === 0) {
         message = "Error: Import file not uploaded";
         return res.send(message);
     };
     //Read file line by line, inserting records
     const buffer = req.file.buffer; 
     const lines = buffer.toString().split(/\r?\n/);
 
     lines.forEach(line => {
          //console.log(line);
          book = line.split(",");
          //console.log(product);
          const sql = "INSERT INTO book (book_id, title, total_pages, rating, isbn, published_date) VALUES ($1, $2, $3, $4, $5, $6)";
          pool.query(sql, book, (err, result) => {
              if (err) {
                  console.log(`Insert Error.  Error message: ${err.message}`);
              } else {
                  console.log(`Inserted successfully`);
              }
         });
     });
     message = `Processing Complete - Processed ${lines.length} records`;
     res.send(message);
 });
 //////////////////////////////////////////////////////////////
 // GET Route to form page
app.get('/sum', (request, response) => {
    const message = "get";
    const data = {
        num1: "",
        num2: "",
        inc: ""
    };
    response.render("sum", 
        {
            message: message,
            data: data
        });

});
// POST Route to form page
// GET Route to form page
app.get('/formAjax', (request, response) => {
    response.render("formAjax")
});

// POST Route to form page
app.post('/formAjax', upload.array(), (request, response) => {    
    // Send form data back to the form
    const data = {
        num1: request.body.num1,
        num2: request.body.num2,
        inc: request.body.inc
    };
    //Call formPost passing message and name
    response.json(data);
});
//////////////////////////////////////////////////////////////////
// Enable CORS (see https://enable-cors.org/server_expressjs.html)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });