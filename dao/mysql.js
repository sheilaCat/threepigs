var mysql = require('mysql');



var sqlConfig = require('./Config').SqlConfig;

var pool = mysql.createPool(sqlConfig);

function MySql(){
	//var conn = mysql.createConnection(sqlConfig);
	



	this.QueryAll = function(req, res, tablesName) {

		pool.getConnection(function (err, conn) {
			if (err) console.log("POOL ==> " + err);

			var sqlString = 'SELECT * FROM ' + tablesName;
			console.log(conn.threadId + " ==> " + sqlString);
			conn.query(sqlString, function(err, rows, fields) {
	        	if (err) throw err; 
	       		var data = JSON.stringify(rows);
	        	console.log(data);
	       		res.send(data);
	    	});
			conn.release();

		});



		
	}

	this.QueryByFields = function(req, res, tablesName, fieldsObject){
		pool.getConnection(function (err, conn) {
			if (err) console.log("POOL ==> " + err);

			var sqlString = 'SELECT * FROM ' + tablesName + ' WHERE ';

			for( i in fieldsObject ){

				sqlString += i + ' = \'' + fieldsObject[i] + '\' and ';
			}

			sqlString = sqlString.substring(0, sqlString.length - 5);
			console.log(conn.threadId + " ==> " + sqlString);
			conn.query(sqlString, function(err, rows, fields) {
	        	if (err) throw err; 
	       		var data = JSON.stringify(rows);
	        	console.log(data);
	       		res.send(data);
	    	});
			conn.release();
		});


		
	}

	this.DeleteByFields = function(req, res, tablesName, fieldsObject){
		pool.getConnection(function (err, conn) {
			if (err) console.log("POOL ==> " + err);

			var sqlString = 'DELETE FROM ' + tablesName + ' WHERE ';

			for( i in fieldsObject ){

				sqlString += i + ' = \'' + fieldsObject[i] + '\' and ';
			}

			sqlString = sqlString.substring(0, sqlString.length - 5);
			console.log(conn.threadId + " ==> " + sqlString);
			conn.query(sqlString, function(err, rows) {
	        	if (err) throw err; 
	       		var data = 'success';
	       		res.send(data);
    		});
			conn.release();

		});
		
	}

	this.InsertObject = function(req, res, tablesName, fieldsObject){
		pool.getConnection(function (err, conn) {
			if (err) console.log("POOL ==> " + err);

			var sqlString = 'insert into ' + tablesName;
			var sqlField ='(';
			var sqlValue ='(';
			for(i in fieldsObject){
				sqlField += i + ',';
				sqlValue += '\'' + fieldsObject[i] + '\',';
			}
			sqlField = sqlField.substring(0,sqlField.length-1);
			sqlValue = sqlValue.substring(0,sqlValue.length-1);
			sqlField += ')';
			sqlValue += ')';

			sqlString += sqlField + ' values' + sqlValue;

			console.log(conn.threadId + " ==> " + sqlString);

			conn.query(sqlString, function (err, rows) {
	        	if (err) throw err;
	        	var data = 'success';
	       		res.send(data);
	       });

			conn.release();
		});
		
	}


	this.UpdateObject = function(req, res, tablesName, newFieldsObject, oldFieldsObject){
		pool.getConnection(function (err, conn) {
			if (err) console.log("POOL ==> " + err);

			var sqlString = 'UPDATE ' + tablesName + ' set ';
			for(i in newFieldsObject){
				sqlString += i + ' = \'' + newFieldsObject[i] + '\', ';
			}
			sqlString = sqlString.substring(0,sqlString.length-2);


			sqlString += ' WHERE ';


			for( i in oldFieldsObject ){

				sqlString += i + ' = \'' + oldFieldsObject[i] + '\' and ';
			}

			sqlString = sqlString.substring(0, sqlString.length - 5);
			console.log(conn.threadId + " ==> " + sqlString);
			conn.query(sqlString, function (err, rows) {
	        	if (err) throw err;
	        	var data = 'success';
	       		res.send(data);
       		});

			conn.release();

		});
		

	}
}

module.exports = MySql;