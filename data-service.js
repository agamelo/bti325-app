
/*

var employees = [];
var departments = [];

const { json } = require("express");
const fs = require("fs");
const { resolve } = require("path");
module.exports.initialize= function()
{
    return new Promise((resolve,reject)=>{
        fs.readFile('./data/employees.json',(err,data)=>{
            if(err)
            {
                reject("Unable to read file-employee");
            }
            employees =JSON.parse(data);
            fs.readFile('./data/departments.json',(err,data)=>{
                if(err)
                {
                    reject("Unable to read file-data");
                }
                departments =JSON.parse(data);
                resolve();
            });
        });
    });
};

module.exports.getAllEmployees = function(){
    return new Promise((resolve,reject)=>{
        if(employees.length >0){
            resolve(employees);
        }
        else 
        {
            reject("NO result returned");
        }
    });
    
    
};
module.exports.getManagers = function () {
    return new Promise((resolve, reject) => {
        let managersarr = [];
        employees.forEach(function (employee) {
            if (employee.isManager) {
                managersarr.push(employee);
            }
        });
        
        if (managersarr.length > 0)
        resolve(managersarr);
        else
        reject("NO result returned");
    });
};

module.exports.getDepartments = function()
{
    return new Promise((resolve,reject)=>{
        if(departments.length >0){
            resolve(departments);
        }
        else 
        {
            reject("NO result returned");
        }
    });
}


module.exports.addEmployee = function(employeeData)
{
    return new Promise((resolve,reject)=>{
        if(employeeData.isManager == undefined){
            employeeData.isManager = false;
        }
        else 
        {
            employeeData.isManager = true;
        }
        employeeData.employeeNum= employees.length +1;
        employees.push(employeeData);
        resolve (employees);
    });
};

module.exports.getEmployeesByStatus = function(status)
{
    var filter_emp_status;
    return new Promise((resolve,reject)=>{
        
        filter_emp_status = employees.filter(function( ret_status){
            return ret_status.status == status
        });
        if(filter_emp_status.length >0)
        {
            resolve(filter_emp_status);
        }else{
            reject("no results returned");
        }
    });
};
module.exports.getEmployeesByDepartment = function(department)
{
    var filter_emp_dept;
    return new Promise((resolve,reject)=>{
        filter_emp_dept = employees.filter(function( ret_dept){
            return ret_dept.department == department
        });
        if( filter_emp_dept.length >0)
        {
            resolve( filter_emp_dept);
        }else{
            reject("no results returned");
        }
    });
};
//need to fix
module.exports. getEmployeesByManager = function(manager)
{
    var filter_emp_manger;
    return new Promise((resolve,reject)=>{
        filter_emp_manger = employees.filter(function( ret_mang){
            return ret_mang.employeeManagerNum == manager;
        });
        if(filter_emp_manger.length >0)
        {
            resolve( filter_emp_manger);
        }else{
            reject("no results returned");
        }
    });
};

module.exports.getEmployeeByNum = function(num){
    var filter_emp_by_num;
    return new Promise((resolve,reject)=>{
        filter_emp_by_num = employees.filter(function( ret_empbyNum){
            return ret_empbyNum.employeeNum == num;
        });
        if( filter_emp_by_num.length >0)
        {
            resolve(filter_emp_by_num);
        }else{
            reject("no results returned");
        }
    });
};

module.exports.updateEmployee = function (employeeData) {
    return new Promise((resolve, reject) => {
        employeeData.isManager = employeeData.isManager != undefined;
        var foundIndex = employees.findIndex(x => x.employeeNum == employeeData.employeeNum);
        employees[foundIndex] = employeeData;
        resolve();
    });
};
*/


//A5

 /*a5*/ const Sequelize = require('sequelize')

 /*a5*/ var sequelize = new Sequelize('ddnuh05et9qr68', 'gozisibhrgjbmw', 'c13d1059393009a357f8ef70273f98f3a33c982eeb8062d97d6eadd92371eee7', {
    host: 'ec2-3-230-149-158.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { require:true,
             rejectUnauthorized: false }
    },
    query: { raw: true }
});



/*a5*/sequelize
.authenticate()
.then(function() {
    console.log('Connection has been established successfully.');
})
.catch(function(err) {
    console.log('Unable to connect to the database:', err);
});
// new model 

var Employee = sequelize.define('Employee', {
    employeeNum:{ 
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true},
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum:Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
});

var department = sequelize.define('Department', {
    departmentId:{
        type:Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true},
    departmentName:Sequelize.STRING
});

module.exports.initialize= function()
{

    return new Promise((resolve,reject)=>{
        sequelize.sync().then(()=> {
            Employee.findAll().then((data)=>{
                if(data.length >0)
                {

                    department.findAll().then((d)=>{
                        if(d.length >0)
                        {
                            resolve("file read successfully");
                        }
                    }).catch(() => {reject ("unable to sync the database")});
                }
            }).catch(() => {reject ("unable to sync the database")});
        });     
       
    });
 
};

module.exports.getAllEmployees = function(){
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(()=> {
            Employee.findAll().then((data)=>{
                if(data.length >0){
                    resolve(data);
                }
            }).catch(() => {
                reject("No result found");
            });

        });
     });
    
};
module.exports.getManagers = function () {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(()=> {
            Employee.findAll({where: {isManager:true}}).then((data)=>{
                if(data.length >0){
                    resolve(data);
                }
            }).catch(() => {
                reject("No result found");
            });

        });

    });
};

module.exports.getDepartments = function()
{
    return new Promise(function (resolve, reject) {
    
    sequelize.sync().then(()=> {
        department.findAll().then((data)=>{
            if(data.length >0){
                resolve(data);
            }
        }).catch(() => {
            reject("No result found");
        });

    });

   });
}


module.exports.addEmployee = function(employeeData)
{
    return new Promise(function (resolve, reject) {
        if(employeeData.isManager == undefined){
            employeeData.isManager = false;
        }
        else 
        {
            employeeData.isManager = true;
        }
        for(x in employeeData)
        {
            if(employeeData.x  == "")
            employeeData.x = null;
        }

        sequelize.sync().then(()=> {
            Employee.create(employeeData).then(() => {
               resolve("employee added")
                
            }).catch(()=> {reject("error")});
    
            });        
       
    

     });
};

module.exports.getEmployeesByStatus = function(status)
{
    return new Promise(function (resolve, reject) {
       
        sequelize.sync().then(()=> {
            Employee.findAll({where: {status:status}}).then((data)=>{
                if(data.length >0){
                    resolve(data);
                }
            }).catch(() => {
                reject("No result found");
            });

        });

    });
};
module.exports.getEmployeesByDepartment = function(department)
{
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(()=> {
            Employee.findAll({where: {department:department}}).then((data)=>{
                if(data.length >0){
                    resolve(data);
                }
            }).catch(() => {
                reject("No result found");
            });

        }); 


    });
};
module.exports. getEmployeesByManager = function(manager)
{
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(()=> {
            Employee.findAll({where: {manager:manager}}).then((data)=>{
                if(data.length >0){
                    resolve(data);
                }
            }).catch(() => {
                reject("No result found");
            });

        });

    });
};

module.exports.getEmployeeByNum = function(num){
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(()=> {
            Employee.findAll({where: {employeeNum:num}}).then((data)=>{
                if(data.length >0){
                    resolve(data);
                }
            }).catch(() => {
                reject("No result found");
            });

        });

    
     });
};

module.exports.updateEmployee = function (employeeData) {
    return new Promise(function (resolve, reject) {
        if(employeeData.isManager == undefined){
            employeeData.isManager = false;
        }
        else 
        {
            employeeData.isManager = true;
        }
        for(x in employeeData)
        {
            if(employeeData.x  == "")
            employeeData.x = null;
        }
        sequelize.sync().then(()=> {
            Employee.update(employeeData,{where: { employeeNum: employeeData.employeeNum}}).then(() => {
               resolve("employee added")
                
            }).catch(()=> {reject("error")});
    
            });  

    });
};


module.exports.addDepartment= function(departmentData)
{    return new Promise(function (resolve, reject) {

        for(x in departmentData)
        {
            if(departmentData.x  == "")
            departmentData.x = null;
        }

        sequelize.sync().then(()=> {
            department.create(departmentData).then(() => {
               resolve("Department added")
                
            }).catch(()=> {reject("error")});
    
            });        
    
     });
};

module.exports.updateDepartment = function (departmentData) {
    return new Promise(function (resolve, reject) {
       
        for(x  in departmentData)
        {
            if(departmentData.x  == "")
            departmentData.x = null;
        }
        sequelize.sync().then(()=> {
            department.update(departmentData,{where: { departmentData: departmentData.departmentId}}).then(() => {
               resolve("departmentData updated")
                
            }).catch(()=> {reject("error")});
    
            });  

    });
};


module.exports.getDepartmentById = function(id){
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(()=> {
            department.findAll({where: {departmentId: departmentData.departmentId}}).then((data)=>{
                if(data.length >0){
                    resolve(data);
                }
            }).catch(() => {
                reject("No result found");
            });

        });

    
     });
};