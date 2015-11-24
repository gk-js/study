/**
 * Created by Administrator on 2015/10/9.
 */
var mongodb = require('./db');
var crypto = require('crypto');

function User(user){
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
};

module.exports = User;

//´¢´æÓÃ»§ÐÅÏ¢
User.prototype.save = function(callback){
    var md5 = crypto.createHash('md5'),
          email_MD5 = md5.update(this.email.toLowerCase()).disest('hex'),
          head = "http://www.gravatar.com/avatar" + email_MD5 + "?s=48";
    var user = {
        name: this.name,
        password: this.password,
        email: this.email,
        head : head
    };
    //´ò¿ªÊý¾Ý¿â
    mongodb.open(function(err, db ){
        if(err){
            return callback(err);//´íÎó£¬·µ»Ø err ÐÅÏ¢
        }
        //¶ÁÈ¡ users ¼¯ºÏ
        db.collection('users',function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);//´íÎó£¬·µ»Ø err ÐÅÏ¢
            }
            //½«ÓÃ»§Êý¾Ý²åÈë users ¼¯ºÏ
            collection.insert(user, {
                safe:  true
            },  function(err,user){
                    mongodb.close();
                    if(err){
                        return callback(err);//return errors
                    }
                    callback(null,  user[0]);//success! return userinfo
                }
            )
        })
    })
}
//¶ÁÈ¡ÓÃ»§ÐÅÏ¢
User.get = function(name,   callback){
    //open db
    mongodb.open(function(err,  db){
        if(err){
            return callback(err);//return errors
        }
        //read users collection
        db.collection('users',  function(err,  collection){
            if(err){
                mongodb.close();
                return callback(err)//return errors
            }
            collection.findOne({
                name: name
            },  function(err, user){
                mongodb.close();
                if(err){
                    return callback(err);//Ê§°Ü·µ»Ø err ÐÅÏ¢
                }
                callback(null,  user);//³É¹¦·µ»Ø²éÑ¯ÐÅÏ¢
            });
        })
    })
}