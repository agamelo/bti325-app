

/*a5*/ const Sequelize = require("sequelize");
//in review
/*a5*/ var sequelize = new Sequelize(
  "ddnuh05et9qr68",
  "gozisibhrgjbmw",
  "c13d1059393009a357f8ef70273f98f3a33c982eeb8062d97d6eadd92371eee7",
  {
    host: "ec2-3-230-149-158.compute-1.amazonaws.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
    },
    query: { raw: true },
  }
);

/*a5*/ sequelize
  .authenticate()
  .then(function () {
    console.log("Connection has been established successfully.");
  })
  .catch(function (err) {
    console.log("Unable to connect to the database:", err);
  });
// new model

var Employee = sequelize.define("Employee", {
  employeeNum: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
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
  employeeManagerNum: Sequelize.INTEGER,
  status: Sequelize.STRING,
  department: Sequelize.INTEGER,
  hireDate: Sequelize.STRING,
});

var department = sequelize.define("Department", {
  departmentId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  departmentName: Sequelize.STRING,
});

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    sequelize.sync().then(() => {
      Employee.findAll()
        .then((data) => {
          if (data.length > 0) {
            department
              .findAll()
              .then((d) => {
                if (d.length > 0) {
                  resolve("file read successfully");
                }
              })
              .catch(() => {
                reject("unable to sync the database");
              });
          }
        })
        .catch(() => {
          reject("unable to sync the database");
        });
    });
  });
};

/*
module.exports.getAllEmployees = function () {
  return new Promise(function (resolve, reject) {
    sequelize.sync().then(() => {
      Employee.findAll()
        .then((data) => {
          if (data.length > 0) {
            resolve(data);
          }
        })
        .catch(() => {
          reject("No result found");
        });
    });
  });
};


*/
//fixed_version_new
module.exports.getAllEmployees = function () {
  return new Promise((resolve, reject) => {
    Employee.findAll()
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("No results returned.");
      }); //catch
  }); // promise
}; // getAllEmployees

//
//
//

module.exports.getManagers = function () {
  return new Promise(function (resolve, reject) {
    sequelize.sync().then(() => {
      Employee.findAll({ where: { isManager: true } })
        .then((data) => {
          if (data.length > 0) {
            resolve(data);
          }
        })
        .catch(() => {
          reject("No result found");
        });
    });
  });
};

module.exports.getDepartments = function () {
  return new Promise(function (resolve, reject) {
    sequelize.sync().then(() => {
      department
        .findAll()
        .then((data) => {
          if (data.length > 0) {
            resolve(data);
          }
        })
        .catch(() => {
          reject("No result found");
        });
    });
  });
};

module.exports.addEmployee = function (employeeData) {
  return new Promise((resolve, reject) => {
    employeeData.isManager = employeeData.isManager ? true : false;
    for (let prop in employeeData) {
      if (employeeData[prop] == "") employeeData[prop] = null;
    } 
    /*

    Employee.create(employeeData)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject("Cannot add employee.");
      });


      */
      sequelize.sync().then(()=>{
        Employee.create(employeeData).then(() => {resolve("new employee is added ");}).catch(() => {reject("error");});
});
  });
};

module.exports.getEmployeesByStatus = function (status) {
  return new Promise(function (resolve, reject) {
    sequelize.sync().then(() => {
      Employee.findAll({ where: { status: status } })
        .then((data) => {
          if (data.length > 0) {
            resolve(data);
          }
        })
        .catch(() => {
          reject("No result found");
        });
    });
  });
};
module.exports.getEmployeesByDepartment = function (department_query) {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      where: { department: department_query },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("No query results.");
      }); //catch
  }); // promise
};
module.exports.getEmployeesByManager = function (manager_query) {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      where: { employeeManagerNum: manager_query },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("No results returned!");
      }); //catch
  }); // promise
};

module.exports.getEmployeeByNum = function (num) {
  return new Promise(function (resolve, reject) {
    sequelize.sync().then(() => {
      Employee.findAll({ where: { employeeNum: num } })
        .then((data) => {
          if (data.length > 0) {
            resolve(data);
          }
        })
        .catch(() => {
          reject("No result found");
        });
    });
  });
};
module.exports.updateEmployee = function (employeeData) {
  return new Promise((resolve, reject) => {
    employeeData.isManager = employeeData.isManager ? true : false;
    for (let prop in employeeData) {
      if (employeeData[prop] == "") employeeData[prop] = null;
    }
    Employee.update(employeeData, {
      where: { employeeNum: employeeData.employeeNum },
    })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject("cannot update.");
      });
  });
};

module.exports.addDepartment = function (departmentData) {
  return new Promise(function (resolve, reject) {
    for (x in departmentData) {
      if (departmentData.x == "") departmentData.x = null;
    }

    sequelize.sync().then(() => {
      department
        .create(departmentData)
        .then(() => {
          resolve("Department added");
        })
        .catch(() => {
          reject("error");
        });
    });
  });
};

module.exports.updateDepartment = function (departmentData) {
  return new Promise(function (resolve, reject) {
    for (x in departmentData) {
      if (departmentData.x == "") departmentData.x = null;
    }
    sequelize.sync().then(() => {
      department
        .update(departmentData, {
          where: { departmentData: departmentData.departmentId },
        })
        .then(() => {
          resolve("departmentData updated");
        })
        .catch(() => {
          reject("error");
        });
    });
  });
};

module.exports.getDepartmentById = function (departmentData) {
  return new Promise(function (resolve, reject) {
    sequelize.sync().then(() => {
      department
        .findAll({ where: { departmentId: departmentData.departmentId } })
        .then((data) => {
          if (data.length > 0) {
            resolve(data);
          }
        })
        .catch(() => {
          reject("No result found");
        });
    });
  });
};

module.exports.deleteEmployeeByNum = function(empNum){
  return new Promise((resolve, reject)=>{
      Employee.destroy({
                      where: {employeeNum: empNum}
      }).then(()=>{
          resolve();
      }).catch((err)=>{
          reject("Unable to delete employee.");
      });
  })
}

module.exports.getDepartments = function () {
  return new Promise((resolve, reject) => {
    department
      .findAll()
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("No results.");
      }); //catch
  }); // promise
};

