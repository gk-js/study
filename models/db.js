var mysql = require('mysql');

var config = {
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'shop'
}
var connection
function handleDisconnect(){
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
			handleDisconnect();
		}else{
			throw err;
		}
	});
	connection.query('SELECT * FROM products', function(err, rows){
		console.log(rows);
	});
}
handleDisconnect();


