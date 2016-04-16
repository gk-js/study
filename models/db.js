var mysql = require('mysql');

var config = {
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'shop'
}
var connection,res;
function handleDisconnect(sql, callback){
	connection = mysql.createConnection(config);
	connection.connect(function(err){
		if(err){
			console.log('there is an error on mysql connect!' + err);
			setTimeout(handleDisconnect, 2000);
		}
	});	
	connection.on('error', function(err){
		console.log('there is an error' + err);
		if(err.code === 'PROTOCOL_CONNECTION_LOST'){
			handleDisconnect(sql);
		}else{
			throw err;
		}
	});
	var query = connection.query(sql, function(err, rows){
		res = rows;
		return callback(rows);
	});
	connection.end();
    // return res;
}
module.exports = handleDisconnect;


