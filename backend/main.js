const express = require("express");
var mysql = require("mysql");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
const connection = require("./db.js");

app.get("/income", (req, res) => {
  connection.query("SELECT * FROM income", (err, results) => {
    if (err) {
      console.error("Error fetching income:", err);
      res.sendStatus(500);
      return;
    }
    res.json(results);
    console.log(results);
  });
});

app.post("/addincome", (req, res) => {
  const { income, description, date } = req.body;
  connection.query(
    "INSERT INTO income (income, description, date) VALUES (?, ?, ?)",
    [income, description, date],
    (err, result) => {
      if (err) {
        console.error("Error adding income:", err);
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    }
  );
});

app.get("/expense", (req, res) => {
  connection.query("SELECT * FROM expense", (err, results) => {
    if (err) {
      console.error("Error fetching expenses:", err);
      res.sendStatus(500);
      return;
    }
    res.json(results);
  });
});

app.post("/addexpense", (req, res) => {
  const { amount, description, date } = req.body;
  const newExpense = { amount, description, date };
  connection.query("INSERT INTO expense SET ?", newExpense, (err, result) => {
    if (err) {
      console.error("Error adding expense:", err);
      res.sendStatus(500);
      return;
    }
    res.sendStatus(200);
  });
});

app.delete("/removeexpense/:id", (req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM expense WHERE id = ?", id, (err, result) => {
    if (err) {
      console.error("Error removing expense:", err);
      res.sendStatus(500);
      return;
    }
    res.sendStatus(200);
  });
});

app.delete("/removeincome/:id", (req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM income WHERE id = ?", id, (err, result) => {
    if (err) {
      console.error("Error removing income:", err);
      res.sendStatus(500);
      return;
    }
    res.sendStatus(200);
  });
});

//establishes connections
app.listen(8080, () => {
  console.log(
    "Server started at port 8080. Open in browser using localhost:8080"
  );
  connection.connect(function (err) {
    if (err) throw err;
    console.log("Database connection success!  good to go:)");
  });
});
