/*********************************************************************************
* BTI325 – Assignment 5
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: _Anshul Gandhi_____________________ Student ID: _140953191_____________ Date: ____09-nov-2021____________
*
* Online (Heroku) Link: https://glacial-earth-36489.herokuapp.com 
*
********************************************************************************/ 
//link  https://glacial-earth-36489.herokuapp.com
//update a5
// require module



//express
var express = require("express");
var data_from_server = require('./data-service');

var app = express();
// multer assignmet-3
const multer = require("multer");



//path
var path = require("path");
const { json } = require("express");
//assigment- 3 fs module
const fs = require("fs");
//body parser assig-3
var bodyParser = require("body-parser");
//port 

//-------a4 added require express handle bar
var exphbs = require("express-handlebars");

var HTTP_PORT = process.env.PORT || 8080;
app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
   })


//-----a4 to tell server to use handle bar here
app.engine(".hbs", exphbs({
    extname:".hbs" ,
    defaultLayout: "main",
    helpers:{
        navLink: function(url, options){
            return '<li' + 
            ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
            '><a href=" ' + url + ' ">' + options.fn(this) + '</a></li>';
           },
           equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
            return options.inverse(this);
            } else {
            return options.fn(this);
            }
           }

    }
}));
app.set("view engine", ".hbs");


//------------a4 to fix navbar


// listennign to which server 
function onHttpStart(){
    console.log("Express http server listening on: " + HTTP_PORT);
}

// middleware for site css
app.use(express.static('public'));
app.use( bodyParser.urlencoded({ extended: true }));
//multer disk storage assignmet-3
const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
        }
});

const upload = multer({storage:storage});
/*

// home route
app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "/views/home.html"))
}); 
*/




//---------a4 update the get route "/" to render the home view
app.get("/", function(req, res){
    res.render(path.join(__dirname, "/views/home"))
    
}); 
//about route
//---------a4 update the get to render
app.get("/about", function(req, res){
    res.render(path.join(__dirname, "/views/about"))
});

//new routes for a3 added in employe


function empty_obj(obj) {
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
}
app.get("/employees",function(req,res){
    if(empty_obj(req.query)){
        data_from_server.getAllEmployees()
        .then((data)=> res.render("employees",{data}))
        .catch(()=>res.render({message: "no results"}));
    }
    else if(req.query.status){
        data_from_server.getEmployeesByStatus(req.query.status)
        .then((data)=> res.render("employees",{data}))
        .catch(()=>res.render({message: "no results"}));
    }
    else if (req.query.department){
        data_from_server.getEmployeesByDepartment(req.query.department)
        .then((data)=> res.render("employees",{data}))
        .catch(()=>res.render({message: "no results"}));
    }
    else if (req.query.manager)
    {
        data_from_server.getEmployeesByManager(req.query.manager)
        .then((data)=> res.render("employees",{data}))
        .catch(()=>res.render({message: "no results"}));
    }
});
//a3- to get the one employee by value 
//fix it at end to rend
app.post("/employee/update", (req, res) => {
    data_from_server.updateEmployee(req.body).then(()=>{
        res.redirect("/employees");
    });
});


/*

app.get("/employee/:employeeNum",(req,res)=>{
    data_from_server.getEmployeeByNum(req.params.employeeNum)
    .then((data)=> {
        if(data && data[0])
            res.render("employee",{employee: data[0]})
        
    })
    .catch(()=>res.render({message: "no results"}));
});

*/


app.get("/employee/:empNum", (req, res) => {
    // initialize an empty object to store the values
    let viewData = {};
    dataService.getEmployeeByNum(req.params.empNum).then((data) => {
    if (data) {
    viewData.employee = data; //store employee data in the "viewData" object as "employee"
    } else {
    viewData.employee = null; // set employee to null if none were returned
    }
    }).catch(() => {
    viewData.employee = null; // set employee to null if there was an error 
    }).then(dataService.getDepartments)
    .then((data) => {
    viewData.departments = data; // store department data in the "viewData" object as "departments"
    // loop through viewData.departments and once we have found the departmentId that matches
    // the employee's "department" value, add a "selected" property to the matching 
    // viewData.departments object
    for (let i = 0; i < viewData.departments.length; i++) {
    if (viewData.departments[i].departmentId == viewData.employee.department) {
    viewData.departments[i].selected = true;
    }
    }
    }).catch(() => {
    viewData.departments = []; // set departments to empty if there was an error
    }).then(() => {
    if (viewData.employee == null) { // if no employee - return an error
    res.status(404).send("Employee Not Found");
    } else {
    res.render("employee", { viewData: viewData }); // render the "employee" view
    }
    });
   })
app.get("/managers",function(req,res){
    data_from_server.getManagers()
    .then((mangerarr)=> res.json(mangerarr))
    .catch(()=>res.status(404))
});

app.get("/departments",function(req,res){
    data_from_server.getDepartments()
    .then((data)=> res.render("departments",{data}))
    .catch(()=>res.render({message: "no results"}));
});

//assignment 3 more feature added

// a4--- update to get route to render .hbs
app.get("/employees/add", (req, res) => {
    data_from_server.getDepartments().then((data) =>{res.render("addemployee"), {department: data} }).catch(()=>{res.render("addEmployee", {departments: []});
});
});


//------a4 update to render the hbs 
app.get("/images/add", (req, res) => {
    res.render(path.join(__dirname, "/views/addImage"));
});

app.get("/images",(req,res)=>{
const dir = "./public/images/uploaded";
fs.readdir(dir,function(err,items){
    res.render("images", {items});
}) 

});

// department a5

app.get("/departments/add", (req, res) => {
    res.render(path.join(__dirname, "/views/addDepartment"));
});

app.post("/departments/add",(req,res)=>{
    data_from_server.addDepartment(req.body);
    res.redirect("/departments");
});

 app.post("/department/update", (req, res) => {
    data_from_server.updateDepartment(req.body).then(()=>{
        res.redirect("/departments");
    })
});

app.get("/department/:departmentId",(req,res)=>{
    data_from_server.getDepartmentById(req.params.employeeNum)
    .then((data)=> {
        if(data && data[0])
            res.render("department",{department: data[0]})
        
    })
});




app.post("/images/add", upload.single("imageFile"),(req,res)=>{
    res.redirect("/images");
});

app.post("/employees/add",(req,res)=>{
   data_from_server.addEmployee(req.body);
   res.redirect("/employees");
});





app.use((req,res)=>{
res.status(404).send("Page not found.");
});

data_from_server.initialize().then(() => {
    app.listen(HTTP_PORT, onHttpStart);
})
.catch((err) => {
    console.log("File not opened")
});

//app.listen(HTTP_PORT, onHttpStart);

