//Drew is the man.  For Real
var AWS = require("aws-sdk");
var moment = require('moment');
var docClient = new AWS.DynamoDB();
var table = "ev_rent_payments";
    
AWS.config.update({region: 'us-east-1'});

exports.handler = (event) => {

   var sns = event.Records[0].Sns;
   console.log("SNS ", sns);

   var eventBody = JSON.parse(sns.Message);
   console.log("json body: ", eventBody);
   
   var params = {
       TableName: table,
       Item:{
            "payment_id": {S: eventBody.Property + "_" + moment(sns.Timestamp).format('YYYYMMDDHHmmss')},
            "subject": {S: sns.Subject},
            "property": {S: eventBody.Property},
            "amount" : {N: eventBody.Amount},
            "timestamp" : {S: sns.Timestamp}
          
       },
       ReturnValues: "NONE"
   };

    docClient.putItem(params, function(err, data) {
        if (err) {
            console.log("Unable to add item. Error JSON:", err);
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
        }
    });
   
};
