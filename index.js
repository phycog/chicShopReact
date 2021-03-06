const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
//////////////////

const path = require('path');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const Router = require('./Router');

//////////////////

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());

//////////////////

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: '',
  database: "chicshop_userdata",
});

db.connect(function(err){
  if (err){
      console.log('DB error');
      throw err;
      return false;
  }
});

const sessionStore = new MySQLStore({
  expiration : (1825*86400*1000),
  endConnectionOnClose: false
},db);

app.use(session({
  key: 'phycoG',
  secret : 'GGG',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
      maxAge : (1825*86400*1000),
      httpOnly:false
  }
}));

new Router(app,db);

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname,'build','index.html'));
});
app.get('/member',function(req,res){
  res.sendFile(path.join(__dirname,'build','index.html'));
});
app.get('/shop',function(req,res){
  res.sendFile(path.join(__dirname,'build','index.html'));
});
app.get('/login',function(req,res){
  res.sendFile(path.join(__dirname,'build','index.html'));
});
app.get('/register',function(req,res){
  res.sendFile(path.join(__dirname,'build','index.html'));
});
app.get('/info',function(req,res){
  res.sendFile(path.join(__dirname,'build','index.html'));
});
app.get('/contact',function(req,res){
  res.sendFile(path.join(__dirname,'build','index.html'));
});

////////////////////////////

///////REGISTER ZONE////////

app.post("/userdata", (req, res) => {
  const username = req.body.username;

    db.query("SELECT * FROM userdata WHERE username = ?",username, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        res.send({
          info : result,
          success : true
        });
      }
    });
});


//
const bcrypt = require('bcrypt');
function encrypt(user_password){
  let pswrd = bcrypt.hashSync(user_password,9);
  return pswrd
}
//
app.post("/create", (req, res) => {
  const username = req.body.username;
  const user_password = req.body.user_password;
  const tel = req.body.tel;
  const email = req.body.email;
  const address = req.body.address;

  let encrypt_user_password = encrypt(user_password);

  db.query(
    "INSERT INTO userdata (username, password, tel, email, address) VALUES (?,?,?,?,?)",
    [username, encrypt_user_password, tel, email, address],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Values Inserted");
        
      }
    }
  );
});

app.post("/OrdersToDB", (req, res) => {
  const username = req.body.username;
  const Total = req.body.Total;
  const paying = req.body.paying;
  const crongCP = req.body.crongCP;
  const kha = req.body.kha;
  const nongkai = req.body.nongkai;
  const kruengnai = req.body.kruengnai;
  const norsor = req.body.norsor;
  const ogkai = req.body.ogkai;
  const peakbon = req.body.peakbon;
  const peakkai = req.body.peakkai;
  const peakram = req.body.peakram;
  const SBB = req.body.SBB;
  const sestit = req.body.sestit;
  const sunnai = req.body.sunnai;



  db.query(
    "INSERT INTO user_orders (username, Total, paying, crongCP, kha,nongkai, kruengnai, norsor, ogkai, peakbon,peakkai,peakram,SBB,sestit,sunnai) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [username, Total, paying, crongCP, kha,nongkai, kruengnai, norsor, ogkai, peakbon,peakkai, peakram, SBB, sestit, sunnai],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.json({
          success : true
      })
        console.log("Values Inserted");
        
      }
    }
  );
});

app.put("/updateAddress", (req, res) => {
  const id = req.body.id;
  const address = req.body.address;
  db.query(
    "UPDATE userdata SET address = ? WHERE id = ?",
    [address, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.put("/updateTel", (req, res) => {
  const id = req.body.id;
  const tel = req.body.tel;
  db.query(
    "UPDATE userdata SET tel = ? WHERE id = ?",
    [tel, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.put("/updateEmail", (req, res) => {
  const id = req.body.id;
  const email = req.body.email;
  db.query(
    "UPDATE userdata SET email = ? WHERE id = ?",
    [email, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM userdata WHERE id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});
///////////////////////////////


app.listen(3000, () => {
    console.log("Yey, your server is running on port 3000");
});


