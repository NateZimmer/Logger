


var pageArray = ['Plotting','Bacnet','Logging'];
var pageDivs = [['sideNavPlot','plotMainContent']];


$('.navItem').on('click',function(e){
	
	$('.navContent').hide();
	$('.navItem').css('color','#fff');
	for(var i = 0; i < pageArray.length; i++)
	{
		if(pageArray[i] == e.currentTarget.innerHTML)
		{
			e.currentTarget.style.color='#ff6000';
			if(pageDivs[i] != undefined)
			{
				for(var j = 0; j< pageDivs[i].length; j++)
				{
					$( '#'+pageDivs[i][j]).show();
				}
				break;
			}
		}
	}
});