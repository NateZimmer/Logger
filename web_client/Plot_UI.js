csvAPI = require('./CSV_File_API.js');

plotyLayout.font = {color: '#EEE'};
plotyLayout.xaxis.color = '#EEE';
plotyLayout.yaxis.color = '#EEE';
plotyLayout.legend = {};
plotyLayout.legend.x=0.03;
plotyLayout.legend.y=0.1;
plotyLayout.legend.bgcolor = 'rgba(0,0,0,0.8)';
plotyLayout.titlefont = {size:12};
plotyLayout.width=$('#mainContent')[0].clientWidth - Wpb;
plotyLayout.height=$('#mainContent')[0].clientHeight;
plotyLayout.margin.b=50;

function testForIE()
{
	var browserVal = navigator.userAgent.indexOf("MSIE");
	if(browserVal !=-1)
	{
		alert('This page does not work in IE. Please use chrome or firefox');
	}
}
testForIE();

var Wpb = 10;

 var cW = $('#mainContent')[0].clientWidth - Wpb;
 var cH = $('#mainContent')[0].clientHeight;
 
 
 function updateSizes()
 {
	 var cx = $('#mainContent')[0].clientWidth - Wpb;
	 var cy = $('#mainContent')[0].clientHeight;
	 var difY = Math.abs(cH - cy);
	 var difX = Math.abs(cW - cx); 
	 if((difX>100) || (difY>100))
	 {
		 $('#refreshPlot').click();
		 cW = $('#mainContent')[0].clientWidth - Wpb;
		 cH = $('#mainContent')[0].clientHeight;
	 }
 }
 

 function loadSelected()
 {
	 var fileNameSelected = $('#fileSelect')[0].value;
	 var selectedIndexVal = $('#fileSelect')[0].selectedIndex;
	 var fileNameText = $('#fileSelect')[0].options[selectedIndexVal].text;
	 csvAPI.getFile(fileNameText);	 
 }

 
 $('#fileSelect').on( "change", function(){
	loadSelected();
 }); 


 $('#refreshPlot').on('click',function(){
 
	 var minY = parseFloat( $('#minYBound')[0].value);
	 var maxY = parseFloat( $('#maxYBound')[0].value);
	 
	 plotyLayout.width=$('#mainContent')[0].clientWidth - Wpb;
	 plotyLayout.height=$('#mainContent')[0].clientHeight;
 
	 if( (minY == 0) && (maxY == 0))
	 {
		 plotyLayout.yaxis.range ='';
	 }
	 else
	 {
		 plotyLayout.yaxis.range = [minY,maxY];
	 }
 
	 loadSelected();
 
 });



 setInterval(updateSizes,1000);

 console.log('Plot_UI Loaded');