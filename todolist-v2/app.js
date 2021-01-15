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

mongoose.connect("mongodb://localhost:27017/todolistDB2", {useNewUrlParser: true});
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
          items: [defaultItem]
        });
        //save the list into db
        data.save();
        res.redirect("/today");
      }else{
        res.render("list",{listTitle:"Today",newListItems:foundList.items, nameOfUsr: username});
      }
      // console.log("check the ")
      // console.log(foundList);



      // if (foundItems.length === 0){
      //   Item.insertMany(defaultItems, function (err) {
      //   if (err){
      //     console.log(err);
      //   }else {
      //     console.log("Successfully saved default items to DB.");
      //   }
      // });
      //   res.redirect("/");
      // }else{
    })
  }

  });

app.post("/today",function(req,res){
  const itemName = req.body.newItem;
  // const listName = req.body.list;

  //add items to db
  const item = new Item({
    todoData: itemName
  });

  // if (listName === "Today"){
  //   item.save();
  //   res.redirect("/today");
  // }else{
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
  // }

});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  const nameOfUsr = req.body.nameOfUsr;

  if(listName === "Today"){
    Data.findOneAndUpdate(
        {username: nameOfUsr,date: today},
        {$pull: {items:{_id: checkedItemId}}},
        function (err, foundList){
          if (!err){

            res.redirect("/"+listName);
          }
        });
  }

  // if (listName === "Today"){
  //
  //   Data.findOne({username: nameOfUsr, date: listName}, function (err, foundList){
  //   }
  // })
  // }
  //   Item.findByIdAndRemove(checkedItemId, function (err) {
  //     if(!err){
  //       console.log("Successfully deleted!")
  //       res.redirect("/today");
  //     }
    // });
  // }else{
  //
  // }

});
//
// app.get("/:customListName", function (req,res){
//   const customListName = _.capitalize(req.params.customListName);
//
//   List.findOne({name:customListName}, function (err, foundList){
//     if (!err){
//       if (!foundList){
//         //create a new list
//         const list = new List({
//           name: customListName,
//           items: defaultItems
//         });
//         //save the list into db
//         list.save();
//         res.redirect("/"+customListName);
//       }else{
//         //show an existing list
//         res.render("list",{listTitle:foundList.name,newListItems:foundList.items});
//       }
//     }
//   });
//
// });

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
  res.redirect("/login");
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
      passport.authenticate("local")(req, res, function(){
        username = req.body.username;
        res.redirect("/today");
      });
    }
  });

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 1200;
}


app.listen(port,function(){
  console.log("Server has started successfully");
});
