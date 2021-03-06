//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
//const date = require(__dirname + '/date.js');

const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();
const items =["eat" ,"sleep" ,"code"];
const workItems = [];
app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine', 'ejs');
app.use(express.static("public"));

// to connect to our mongodb server
mongoose.connect("mongodb+srv://admin-surajv:mongoDB1@cluster0.iroid.mongodb.net/todolistDB",{useNewUrlParser: true});

// creating schema

const itemsSchema = {
  name : String
};

// new schema
const listSchema = {

  name : String,
  items : [itemsSchema]
};

const List = mongoose.model("List" , listSchema);

const Item = mongoose.model("Item" , itemsSchema);
const item1 = new Item({
  name : "welcome"
});
const item2 = new Item({
  name : "code"
});
const item3 = new Item({
  name : "coffee"
});
const item4 = new Item({
  name : "repeat"
});

const defaultItems = [item1 , item2 , item3];

app.get("/", function(req, res) {



// now to find items

Item.find({} , function(err , foundItems){
//console.log(foundItems);
if(foundItems.length===0){
  // if there are no items in the DB then only we would insertMany

  Item.insertMany(defaultItems , function(err){
    if(err){
      console.log(err);
    }
    else{
      console.log("running");
    }
  });
res.redirect("/");
}

else{
  res.render("list", {
    listTitle: "Today's",
    newListItems: foundItems
  });// but it would print many items as insertMany fun()

}

});


});

// route parameters
app.get("/:customListName" , function(req , res){
const customListName = _.capitalize(req.params.customListName);
List.findOne({name: customListName} , function(err , foundList){
if(!err){
  if(!foundList){
  // console.log("error");}
// create a new list
const list = new List({
  name :customListName,
  items: defaultItems
});
list.save();
res.redirect("/" + customListName);
}
  else{
    // console.log("working");
    res.render("list" , {listTitle : foundList.name , newListItems : foundList.items});
  }
}
});


});

app.post("/",function(req,res){
  const itemName = req.body.newItem;
  const listName = req.body.list;
// now we'll use mongodb to pass
const item  = new Item({
  name : itemName
});
if(listName ==="Today's"){

item.save()
res.redirect("/");
}
else{
  List.findOne({name:listName} , function(err , foundList){

foundList.items.push(item);
foundList.save();
res.redirect("/" + listName);

  })
}

});

app.post("/delete" , function(req,res){

  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

if(listName==="Today's"){

Item.findByIdAndRemove(checkedItemId , function(err){
if(!err){
  console.log("deleted");
  res.redirect("/");
}
});
}
else{
  List.findOneAndUpdate({name : listName} , {$pull: {items: {_id : checkedItemId}}} , function(err , foundList){
if(!err){
  res.redirect("/" + listName);
}
});

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

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function() {
  console.log("Server running");
});
