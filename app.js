//jshint esversion:6
// using ejs templates
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + '/date.js');

const mongoose = require("mongoose");

const app = express();
const items =["eat" ,"sleep" ,"code"];
const workItems = [];
app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine', 'ejs');
app.use(express.static("public"));

// to connect to our mongodb server
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser: true});

// creating schema

const itemsSchema = {
  name : String
};
const Item = mongoose.model("Item" , itemsSchema);

app.get("/", function(req, res) {

const day = date.getDate() ;

  res.render("list", {
    listTitle: day,
    newListItems: items
  });


});

app.post("/",function(req,res){
  const item = req.body.newItem;
  // console.log(req.body);
  if(req.body.list === "Work"){
    workItems.push(item);
    res.redirect("/work");
  } else{
    items.push(item);
    res.redirect("/");
    // console.log(item);
  }
});

app.get("/work",function(req,res){
  res.render("list",{listTitle:"Work List" ,newListItems : workItems });
});
app.post("/work",function(req,res){
let item = res.body.newItem;
workItems.push(newItem);
res.redirect("/work")

})
app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
