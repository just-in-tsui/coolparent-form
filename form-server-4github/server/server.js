const express = require( "express" );;
const path = require('path');
const fs = require('fs');
var AWS = require("aws-sdk");

var endOfLine = require('os').EOL;
const app = express();

//server settings
const port = 3060;
var table = "test";
const AWSKeyID = "AKIAXDR5MUZ72TLCFL3R";
const AWSSecretKey = "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";
const AWSregion = "ap-southeast-1";

AWS.config.update({
  region: AWSregion,
  //endpoint: 'http://localhost:8000',
  // accessKeyId default can be used while using the downloadable version of DynamoDB. 
  // For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.
  accessKeyId: AWSKeyID,
  // secretAccessKey default can be used while using the downloadable version of DynamoDB. 
  // For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.
  secretAccessKey: AWSSecretKey
});

var docClient = new AWS.DynamoDB.DocumentClient();


//app.use(express.static('public'));
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));



// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    //res.sendFile(path.join(__dirname,'public','home.html'));
	res.sendFile(path.join(__dirname,'home.html'));
} );

app.post('/submit', (req, res) => {

    //res.set({ 'Content-Type': 'text/plain; charset=utf-8' });

    let name = req.body.name_;
    let email = req.body.email;
	//let desc = req.body.tellussth;
    let rolee = req.body.role;
	let q1 = req.body.q1;
	let q2 = req.body.q2;
	let q3 = req.body.q3;
	
	
	var params = {
		TableName:table,
		Key:{
			"email": email,
			"name": name,
		},
        UpdateExpression: "set #r= :v0, q1=:v1, q2=:v2, q3=:v3",
		ConditionExpression: "attribute_exists(email)",
        ExpressionAttributeValues:{
			":v0":rolee,
            ":v1":q1,
            ":v2":q2,
			":v3":q3
        },
		ExpressionAttributeNames:{"#r": "role"},
        ReturnValues:"UPDATED_NEW"
	};
	
	docClient.update(params, function(err,data){
		if(err){
		console.log(err)
		res.sendFile(path.join(__dirname,'failed.html'));
		} else {
		console.log("_______________________________________");
		console.log("SUCCESSFULL PUT",params);
		console.log("_______________________________________");
		res.sendFile(path.join(__dirname,'thanks.html'));
		}
	});
});

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );