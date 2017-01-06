var fs = require("fs");
var _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var userRouter=express.Router();


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


userRouter.route('/')
	.get(function (req, res){
	  
	  	fs.readFile('data/data.json', function (err, data) {
		   if (err) {
		      return console.error(err);
		   }
		   res.send(data.toString());
		   console.log("Get request");
		});
	  

	})

	.put(function (req, res) {
	  	
	  	fs.readFile('data/data.json', function (err, data) {
		   if (err) {
		      return console.error(err);
		   }

		   data=JSON.parse(data.toString());

		   _.forEach(data, function(user){

		   		if(user.name==req.body.name){
		   			user.age=req.body.age;
		   			res.send("Record Updated");
		   			fs.writeFile("data/data.json", JSON.stringify(data));
		   			
		   		}
		   		
		   });
		   res.send("Record Not Found");
			  
		   console.log("PUT request with name");
		});
	})

	.post(function(req, res){
		fs.readFile('data/data.json', function (err, data) {
		   if (err) {
		      return console.error(err);
		   }
		   data=JSON.parse(data.toString());
		   
		   data=data.concat(req.body);
		   //data.push(req.body);
		   
		   fs.writeFile("data/data.json", JSON.stringify(data));

		   res.send("New Record Saved");
		});   
	});


userRouter.route('/:name')
	.get(function (req, res) {
	  
	  	fs.readFile('data/data.json', function (err, data) {
		   if (err) {
		      return console.error(err);
		   }

		   data=JSON.parse(data.toString());
		   var user=_.find(data, { 'name': req.params.name }) || "User Not Found";

		   res.send(user);
		   console.log("Get request with name");
		});
	  

	})
	.delete(function(req, res){
		fs.readFile('data/data.json', function (err, data) {
		   	if (err) {
		    	return console.error(err);
		   	}
		   data=JSON.parse(data.toString());
			_.remove(data, function(userObj) {
				return userObj.name==req.params.name;
			});
			fs.writeFile("data/data.json", JSON.stringify(data));
			res.send("Record Removed...");
		});
	});	


app.use('/user', userRouter);

app.listen(3000, function () {
	console.log("Server started at http://localhost:3000");
});


