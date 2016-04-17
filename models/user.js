var db = require('../models/db');
function User(user) {
    this.userName = user.userName,
    this.password = user.password
}

module.exports = User;

User.prototype.save = function(callback){
    var user = {
        userName: this.userName,
        password: this.password
    };
    var sql = "INSERT INTO USER(UserName,PASSWORD) VALUES ('"+ user.userName +"','"+ user.password +"')";
    db(sql, function(rows){
        return callback(rows);
    });
};
User.get = function(callback) {
    
}