const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const path = require('path');
const mongoose = require("mongoose");
const multer = require('multer');
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const fs = require('fs');

var number = 0;

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

let length = 1;
mongoose.connect('mongodb+srv://Harsh:test123@cluster0.iqn1prm.mongodb.net/guptaopticals', { useNewUrlParser: true });

const itemsSchema2 = new mongoose.Schema({
  SNo: Number,
  Name: String,
  Mobile: Number,
  Address: String,
  Date: String,
  Right_SPH: String,
  Right_CYL: String,
  Right_AXIS: String,
  Right_ADD: String,
  Right_VISION: String,
  Left_SPH: String,
  Left_CYL: String,
  Left_Axis: String,
  Left_ADD: String,
  Left_VISION: String,
  Items: String,
  Description: String,
  Qty: Number,
  Total: Number
});

const interestSchema = new mongoose.Schema({
  Name: String,
  Email: String,
  Mobile: Number,
});

const Interest = mongoose.model("Interest", interestSchema);

const imagesschema = new mongoose.Schema({
  name: String,
  uploadTime: { type: Date, default: Date.now },
  image: {
    data: Buffer,
    contentType: String
  }
});

const Image = mongoose.model("image", imagesschema);

let tempraryImageDirectory = '';

if (process.env.DEV && process.env.DEV === 'Yes') {
  tempraryImageDirectory = path.join(__dirname, `../../tmp/`);
} else {
  tempraryImageDirectory = './public/uploads';
}

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempraryImageDirectory)
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

var upload = multer({ storage: storage })

itemsSchema2.plugin(passportLocalMongoose);

app.get("/", function (req, res) {
  res.render("form", { newlength: length, number: number })
});

app.get("/blog", function (req, res) {
  res.render("blog")
});

app.get("/about", function (req, res) {
  res.render("about")
});

app.get("/services", function (req, res) {
  res.render("services")
});

app.get("/products", function (req, res) {
  res.render("products")
});

app.get("/blog/eye-health-101", function (req, res) {
  res.render("blog1")
});

app.get("/sales", function (req, res) {
  res.render("sales")
});

app.get("/all", function (req, res) {
  User.find({}, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.render("list", { newlist: data });
    }
  });
});


app.get("/blog/care-tips-for-glasses", function (req, res) {
  res.render("blog2")
});

app.get("/blog/latest-trends-in-eyewear-fashion", function (req, res) {
  res.render("blog3")
});

app.post('/stats', upload.single('avatar'), (req, res) => {
  const obj = {
    name: req.file.filename,
    uploadTime: new Date(),
    image: {
      data: fs.readFileSync(path.join(__dirname + '/public/uploads/' + req.file.filename)),
      contentType: 'image/png'
    }
  }
  Image.create(obj, (err, item) => {
    if (err) {
      console.log(err);
    } else {
      item.save();
      res.redirect('/gallery');
    }
  });
});

app.get('/gallery', (req, res) => {
  Image.find({}).sort('-uploadTime').limit(5).exec((err, images) => {
    if (err) {
      console.log(err);
      res.status(500).send('An error occurred', err);
    } else {
      res.render('gallery', { images: images });
    }
  });
});

// Your other routes go here

const User = mongoose.model("user", itemsSchema2)

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Your other routes go here

const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log("connected to the port 3000");
});
