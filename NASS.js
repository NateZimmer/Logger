var express = require('express');
var fs = require('fs');
var app = express();

app.set('port', 3000);
app.use(express.static('./'));


// Listen for requests
var server = app.listen(app.get('port'), function(r) {
  var port = server.address().port;
  console.log('Magic happens on port ' + port);
  console.log(r);
});

app.get('/Data',function(req,res){
	updateDataFileList();
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(dataFileList));
  console.log('JSON request made');
});

var dataFileList = [];

function updateDataFileList()
{
	var fileListTemp = fs.readdirSync('./Data');
	dataFileList = []; 
	for(var i = 0; i < fileListTemp.length; i++)
	{
		if(fileListTemp[i].includes('.csv'))
		{
			dataFileList.push(fileListTemp[i]);
		}
	}
}