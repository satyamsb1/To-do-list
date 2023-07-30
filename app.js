const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/todolistDB").then(() => {
    console.log("Connected to Database");
    }).catch((err) => {
        console.log("Not Connected to Database ERROR! ", err);
});

const itemsSchema = {
    name:{
        type: String,
        required: true
    }
};
const Item = mongoose.model('Item', itemsSchema);

const work = new Item({
    name: "Welcome to your todolist"
});
const home = new Item({
    name: "Hit the + button to add a new item."
});
const school = new Item({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [work, home, school];

const listSchema = 
{
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

// Item.insertMany(defaultItems, (err)=>
// {
//     if(err) console.log(err);
//     else console.log("Items added successfully.");
// });
// List.deleteMany({},(err)=>
// {
//     if(err) console.log(err);
//     else console.log("Successfully deleted the entry");
// });


app.get("/", function(req, res)
{
    
    Item.find({}, (err, items)=>
    {
        if(items.length===0)
        {
            Item.insertMany(defaultItems, (err)=>
            {
                if(err){ console.log(err);}
                else {
                    console.log("Items added successfully.");
                }
                res.redirect("/");
            });  
        }
        else{
            res.render("list", {listTitle : "Today", newListItems: items});   
        }
    });
});

app.post("/", (req, res) =>
{
   const itemName = req.body.newItem;
   
   const item = new Item({
    name: itemName
   });
   item.save();
   res.redirect("/");
});

app.post("/delete", (req, res)=>
{
    console.log(req.body.checkbox);
    const checkedItemId =req.body.checkbox;
    Item.deleteOne({_id: checkedItemId}, (err)=>
    {
        if(err) console.log(err);
        else
        {
            console.log("Succesfully deleted");
        }
        res.redirect("/");
    })
});


app.get("/:customListName", (req, res)=>
{
    const customListName= req.params.customListName;
    List.findOne({name: customListName}, function(err, result){
        if(!err){
            if(result){
                res.render("list",{listTitle : result.name, newListItems: result.items});
            }
            else
            {
                const list = new List({
                    name: customListName,
                    items : defaultItems
                });
                list.save();
                res.redirect("/"+customListName);
            }
        }
        else console.log(err);
    });
    
}); 

app.get("/work", (req, res)=>
{
    res.render("list", {listTitle:"Work List", newChores: workItems});
});

app.post("/work", function(req, res)
{
    const item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});


app.listen(3000, function()
{
    console.log("Server started on port 3000");
});