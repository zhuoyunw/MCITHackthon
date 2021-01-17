const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const findOrCreate = require('mongoose-findorcreate');

const requireAdmin = require(__dirname+"/requireLogged.js");

const date = require(__dirname + "/date.js");
1
const app = express();

app.set("view engine","ejs");


var items=[];
var username;
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://hanyew:1926@cluster0.ayfxg.mongodb.net/todolistDB2", {useNewUrlParser: true});
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});



app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.get("/essentials", function(req, res){
  if (!req.isAuthenticated()){
    res.redirect("/");
  }else {
    res.render("essentials");
  }
});

app.get("/calendar", function(req, res){
  if (!req.isAuthenticated()){
    res.redirect("/");
  }else{
    res.render("calendar");
  }
});


const itemsSchema = {
  todoData: String
};
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  todoData: "Write down your todo list!"
})

const defaultItem = [item1];





//add one new username to the data Schema
//1. username
//2. date
//3. todolist schema for this date
const dataSchema = {
  username: String,
  date: String,
  items: [itemsSchema]
}

const Data = mongoose.model("Data",dataSchema);

var today = new Date();
today=date.getDate(today);

app.get("/today",function(req,res){
  if (!req.isAuthenticated()){
    res.redirect("/");
  }else{
    Data.findOne({username: username, date: today}, function (err, foundList){
      if(!foundList){
        const data = new Data({
          username: username,
          date: today,
          items: defaultItem
        });
        //save the list into db
        data.save();
        res.redirect("/today");
      }else{
        res.render("list",{listTitle:"Today",newListItems:foundList.items, nameOfUsr: username});
      }
      /

  });

app.post("/today",function(req,res){
  const itemName = req.body.newItem;
  const selectedDate = req.body.list;

  //add items to db
  const item = new Item({
    todoData: itemName
  });

  if (selectedDate === "Today"){
    Data.findOne({username: username, date: today}, function (err, foundList){
      if (!foundList) {
        //create a new list
        const data = new Data({
          username: username,
          date: today,
          items: [item]
        });
        //save the list into db
        data.save();
      }else{
        foundList.items.push(item);
        foundList.save();
      }
      //   res.redirect("/"+customListName);
      res.redirect("/today");
    })
  }else{
    Data.findOne({username: username, date: selectedDate}, function (err, foundList){
      if (!foundList) {
        //create a new list
        const data = new Data({
          username: username,
          date: selectedDate,
          items: [item]
        });
        //save the list into db
        data.save();
      }else{
        foundList.items.push(item);
        foundList.save();
      }
        res.redirect("/"+selectedDate);
    })
  }

});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const selectedDate = req.body.listName;
  const nameOfUsr = req.body.nameOfUsr;

  if(selectedDate === "Today"){

      Data.findOneAndUpdate(
          {username: nameOfUsr,date: today},
          {$pull: {items:{_id: checkedItemId}}},
          function (err, foundList){
            if (!err){
              res.redirect("/today");
            }
          });
    }else{
    Data.findOneAndUpdate(
        {username: nameOfUsr, date: selectedDate},
        {$pull: {items: {_id: checkedItemId}}},
        function (err, foundList) {
          if (!err) {
            console.log(foundList);
            res.redirect("/" + selectedDate);
          }
        });
  }


});


app.post("/register", function(req, res){

  User.register({username: req.body.username}, req.body.password, function(err, user){
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function(){
        username = req.body.username;
        res.redirect("/today");
      });
    }
  });

});

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

app.post("/login", function(req, res){

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err){
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local",  { failureRedirect: '/login' })(req, res, function(){
        username = req.body.username;
        res.redirect("/today");
      });
    }
  });

});

app.get("/:selectedDate", function (req,res){
  if (!req.isAuthenticated()){
    res.redirect("/");
  }else {
    const selectedDate = _.capitalize(req.params.selectedDate);

    //selectedDate is the date selected
    Data.findOne({username: username, date: selectedDate}, function (err, foundList) {
      if (!err) {
        if (!foundList) {
          //create a new list
          const data = new Data({
            username: username,
            date: selectedDate,
            items: defaultItem
          });
          console.log("hello");
          //save the list into db
          data.save();
          res.redirect("/" + selectedDate);
        } else {
          //show an existing list
          res.render("listForSelectedDate", {
            listTitle: foundList.date,
            newListItems: foundList.items,
            nameOfUsr: username
          });
        }
      }
    });

let port = process.env.PORT;
if (port == null || port == "") {
  port = 1200;
}


app.listen(port,function(){
  console.log("Server has started successfully");
});
