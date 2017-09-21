
var api = {}; 

var ignoreList = ['dateStr','dateNums','JoesTemp','EmmUnitTest'];
api.ignoreList = ignoreList;

var multiplyList = [];

var currentFile = {};
currentFile.data = '';
var headerFile = {foundHeader:false,obj:{}};
var fileArraySorted = [];


function loadHeaderFile()
{
	var theRequest = $.ajax({url: 'header.json',method: 'GET'}).done(function(data){
		headerFile.obj =data;
		console.log('header found!');
		headerFile.foundHeader=true;
		if(typeof(data.digitalInputs)!='undefined')
		{
			multiplyList = data.digitalInputs;
		} 

	});
}


function getFile(fileName)
{

	document.getElementById('loaderDiv').style.display ='';
	document.getElementById('plotDiv').style.display ='none';
	
	var theRequest = $.ajax({
		url: ('Data/'+fileName),
		method: 'GET'
	}).done(function(data){
		currentFile.data = data;
		currentFile.data = csvParse(currentFile.data); // Format Data 
		
		document.getElementById('loaderDiv').style.display ='none';
		document.getElementById('plotDiv').style.display ='';
		
		plotSelectedFile(); // Plot Data
	});
}
api.getFile = getFile; 


function getFiles()
{
	var dateArrayMul = [33,1,1000,1000];
	loadHeaderFile();
	var theRequest = $.ajax({url: 'Data/',method: 'GET'}).done(function(data){
		var contentListing = data;
		fileArray = [];
		for(var i = 0; i < contentListing.length; i++)
		{
			if(contentListing[i].includes('.csv'))
			{
				var tempName = contentListing[i].replace('.csv','').split('_');
				var shortDate = 0;
				var dateMul=0;
				for(var j = 0; j < tempName.length; j++)
				{
					//myFile_3_8_1991.csv for example 
					if(!isNaN(tempName[j]))
					{
						shortDate = shortDate + parseFloat(tempName[j])*dateArrayMul[dateMul];
						dateMul = dateMul<3 ? dateMul+1 : dateMul; // For ranking file listing 						
					}
				}
				
				fileArraySorted.push([shortDate,contentListing[i]]);
				fileArray.push({'name':contentListing[i]});

			}
		}	
		fileArraySorted.sort(sortFunction);
		console.log('Found '+fileArray.length+' files');
		updateFileList();
		
	}); // End ajax call 
	return fileArraySorted;
}
api.getFiles = getFiles;


function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] > b[0]) ? -1 : 1;
    }
}


function getDateArray(mVal)
{
	var arr = [];
	for(var i = 0; i < mVal.value.length; i++)
	{
		var matlabOffset = 719528.79;
		var dateNum = (mVal.value[i][0] - matlabOffset)*60*60*24*1000;
		dateNum += 60*60*1000*5;
		if(dateNum<0)
		{
			dateNum = (mVal.max() - matlabOffset)*60*60*24*1000;
		}
		
		var dateVal = new Date( dateNum );
		arr.push([dateVal]);
	}
	return arr;
}
api.getDateArray = getDateArray;


function csvHasHeader(textData)
{
	var returnValue = false; 
	var dataHeads = textData.split(',');
	for(var i = 0; i < dataHeads.length; i++)
	{
		if(isNaN(dataHeads[i]))
		{
			returnValue = true;
			break;
		}
	}
	return returnValue;
}


function csvParse(textData)
{
	var rows = textData.split('\n')
	var csvArray = {'data':[]};

	if(csvHasHeader(rows[0]))
	{
		csvArray.header = rows[0].split(',');
		rows.shift();
	}
	else if(headerFile.foundHeader)
	{
		csvArray.header = headerFile.obj.header;
	}
	else
	{
		var dummyHeader =[];
		for(var i = 0; i < rows[0].split(',').length;i++)
		{
			dummyHeader.push((i+1).toString());
		}
		csvArray.header = dummyHeader;
	}

	for(var i = 0 ; i < rows.length-1; i++)
	{
		csvArray.data[i] = rows[i].split(',');
		for(var j = 0; j < csvArray.data[i].length; j++)
		{
			var val = parseFloat(csvArray.data[i][j]);
			csvArray.data[i][j] = (isNaN(val)) ? NaN : val;
		}
	}
	return csvArray;
}


function plotSelectedFile()
{
	var M = Matrixs.make(currentFile.data.data);
	var plotDatas =[]
	var plotTexts = [];
	var dateArray = [];
	var columnNum = M.shape()[1];
	var datesFound= false;
	
	var matlabTime = currentFile.data.header.indexOf('dateNums\r');
	var dateYear = (new Date(M.column(columnNum-1).value[2][0])).getFullYear();

	if(matlabTime>=0)
	{
		datesFound = true;
		dateArray = getDateArray(M.column(matlabTime)); 
	}
	else if (dateYear>2000 && dateYear<2050)
	{
		datesFound = true;
		var datePos = M.value[0].length-1;
		dateArray = [];
		dateArrayRaw = M.column(datePos).value;
		for(var i = 0; i < dateArrayRaw.length; i++)
		{
			dateArray.push(new Date(dateArrayRaw[i][0]))
		}
	}

	for(var i = 0; i < columnNum-1; i++)
	{
		var plotData = M.column(i);
		var plotText = currentFile.data.header[i];
		
		if(multiplyList.indexOf(plotText) !=-1)
		{
			plotData = plotData.multiply(5).add(65);
		}
		
		if(ignoreList.indexOf(plotText)==-1)
		{
			plotTexts.push(plotText);
			
			if(datesFound)
			{
				plotDatas.push([Matrixs.make(dateArray),plotData]);
			}
			else
			{
				plotDatas.push(plotData);
			}
		}
		
	}
	var dataPoints = plotData.value.length;
	$('#dataPointTotal')[0].innerHTML = dataPoints.toString();
	Plots.create( plotDatas[0],{div:'plotDiv',name:plotTexts[0]});
	for(var i = 1; i < plotDatas.length -1; i++)
	{
		Plots.add(plotDatas[i],{div:'plotDiv',name:plotTexts[i],noDraw:true});
	}
	Plots.add(plotDatas[i],{div:'plotDiv',name:plotTexts[i]});
	
}


function updateFileList()
{
	for(var i = 0; i < fileArraySorted.length; i++)
	{
		$('#fileSelect').append('<option value=' + fileArraySorted[i][1] +'>' + fileArraySorted[i][1] + '</option>')
	}

	$('#fileSelect')[0].selectedIndex = 0;
	
	var fileNameSelected = fileArraySorted[0][1];
	getFile(fileNameSelected);
}


getFiles();
console.log('CSV_File_API Loaded');
module.exports = api;
