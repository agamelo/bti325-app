var mongoose = require("mongoose");

var bodyParser = require("body-parser");
var Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

var userSchema = new Schema({
  userName: { type: String, unique: true },
  password: String,
  email: String,
  loginHistory: [{ dateTime: Date, userAgent: String }],
});

let User = mongoose.model("User", userSchema);

module.exports.initialize = () => {
  return new Promise((resolve, reject) => {
    let url =
      "mongodb+srv://Anshul:Seneca123@senecaweb.mql1i.mongodb.net/Testusers?retryWrites=true&w=majority";
    let db = mongoose.createConnection(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (error) {
        if (error) {
          reject(error);
        } else {
          User = db.model("users", userSchema);
          console.log("connection successful.");
          resolve();
        }
      }
    );
  });
};

module.exports.registerUser = (data) => {
  return new Promise((resolve, reject) => {
    if (data.password.trim().length == 0 || data.password2.trim().length == 0)
      reject(" ERRor - user name cannot be empty or only white  spaces");
    else if (data.password != data.password2)
      reject("Error: Passwords is different");
    else {
      bcrypt.genSalt(12, function (err, salt) {
        if (err) {
          reject(" Error in encrypting the password");
        }
        bcrypt.hash(data.password, salt, function (err, value) {
          if (err) reject("Error in  encrypting the password");
          else {
            let newUser = new User(data);
            newUser.password = value;
            newUser.save((err) => {
              if (err) {
                if (err.code == 11000) reject("user exists");
                else reject("Error in creating the Newuser: " + err);
              } else resolve();
            });
          }
        });
      });
    }
  });
};

module.exports.checkUser = function (data) {
  return new Promise((resolve, reject) => {
    User.findOne({ userName: data.userName })
      .exec()
      .then((user) => {
        bcrypt
          .compare(data.password, user.password)
          .then((res) => {
            if (res === false) reject("Password wrong Please try again");
            else {
              user.loginHistory.push({
                dateTime: new Date().toString(),
                userAgent: data.userAgent,
              });
              User.updateOne(
                { userName: data.userName },
                { $set: { loginHistory: user.loginHistory } }
              )
                .exec()
                .then(() => {
                  resolve(user);
                })
                .catch((err) => {
                  reject(" Error in verifying the client: " + err);
                });
            }
          })
          .catch((err) => {
            reject("Error in verifying the client: " + err);
          });
      })
      .catch(() => {
        reject("No user found: " + data.userName);
      });
  });
};
