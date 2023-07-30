const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const date =  require(__dirname + "/date.js");


const items=["Buy Food",  //in js we can push elements in array but cannot assign new values 
                        // to  them
"Cook Food",
"Eat Food"];    
const workItems=[];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');


app.get("/", function(req, res)
{
    const day =date.getDay();
    res.render("list", {listTitle : day, newChores: items});   
});

app.post("/", (req, res) =>
{
    item = req.body.newItem;
    if(req.body.list=== "Work")
    {
        workItems.push(item);
        res.redirect("/work");   
    }
    else
    {
        items.push(item); 
        res.redirect("/");
    }  
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