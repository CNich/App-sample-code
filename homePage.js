//HOME
$(document).on("pagebeforecreate","#home",function(){
		writeGroupnames();
});

function uploadGroupData(){
	jQuery.support.cors = true;
	$.ajax({
		crossDomain: true,
		type: 'POST',
		url: saveGroupDataURL,
		data: {'fid': userData.id, 'groupData': groupData},
		dataType: 'json',
		success: function(data, status) {
		},
		error: function(xhr, desc, err) {
		console.log(xhr);
		console.log("Details: " + desc + "\nError:" + err);
		}
	}); // end ajax call
}

function writeGroupnames(){

	for (var i=groupData.showNames.length-1; i>=0;i--){
		if(groupData[groupData.showNames[i]+'showPeople']==null)
			groupData[groupData.showNames[i]+'showPeople']=new Array();
	}
	
	var temp="";
	for (var i=groupData.showNames.length-1; i>=0;i--){
		temp+="<input type=\"checkbox\" name=\"show"+i+"\" id=\"show"+i+"\" class=\"custom\" />	<label id=\"checkLabelShow" + i + "\" for=\"show"+i+"\">"+groupData.showNames[i]+"</label>";
	}
	//temp+="<input type=\"button\" value=\"New Group\" onClick='location.href=\"#addUserLocalStorage(show)\"' data-icon=\"plus\">";
	temp+="<input type=\"button\" value=\"New Group\" onClick='makeNewGroupPage(\"show\")' data-icon=\"plus\">";
	$('#showing_panel').html(temp);
	$( "#showing" ).trigger( "updatelayout" );
	
	temp="";
	for (var i=groupData.viewNames.length-1; i>=0;i--){
		temp+="<input type=\"checkbox\" name=\"view"+i+"\" id=\"view"+i+"\" class=\"custom\" />	<label  id=\"checkLabelView" + i + "\" for=\"view"+i+"\">"+groupData.viewNames[i]+"</label>";
	}
	temp+="<input type=\"button\" value=\"New Group\" onClick='makeNewGroupPage(\"view\")' data-icon=\"plus\">";
	
	for (var i=groupData.hashtagsNames.length-1; i>=0;i--){
		temp+="<input type=\"checkbox\" name=\"hashtags"+i+"\" id=\"hashtags"+i+"\" class=\"custom\" />	<label  id=\"checkLabelHashtags" + i + "\" for=\"hashtags"+i+"\">"+groupData.hashtagsNames[i]+"</label>";
	}
	
	$('#viewing_panel').html(temp);
	$( "#viewing" ).trigger( "updatelayout" );
	
	//initialize the checkboxes to previous values
	for (var i=groupData.showNames.length-1; i>=0;i--){
		var selectorName="#show"+i;
		var s2 = "#checkLabelShow" + i;
		if(groupData.showStatus[i]==true){
			$(selectorName).prop( "checked", true );
			//$(s2).removeClass("unselectedPerson").addClass("selectedPerson");
			} else {
			$(selectorName).prop( "checked", false );
			//$(s2).removeClass("selectedPerson").addClass("unselectedPerson");
		}
	}
	
	for (var i=groupData.viewNames.length-1; i>=0;i--){
		var selectorName="#view"+i;
		var s2 = "checkLabelView" + i;
		if(groupData.viewStatus[i]==true){
			$(selectorName).prop( "checked", true );
			//$(s2).removeClass("unselectedPerson").addClass("selectedPerson");
			} else {
			$(selectorName).prop( "checked", false );
			//$(s2).removeClass("selectedPerson").addClass("unselectedPerson");
			}
	}

	for (var i=groupData.hashtagsNames.length-1; i>=0;i--){
		var selectorName="#hashtags"+i;
		var s2 = "checkLabelHashtags" + i;
		if(groupData.hashtagsStatus[i]==true){
			$(selectorName).prop( "checked", true );
			//$(s2).removeClass("unselectedPerson").addClass("selectedPerson");
			} else {
			$(selectorName).prop( "checked", false );
			//$(s2).removeClass("selectedPerson").addClass("unselectedPerson");
			}
	}
	
	//if(userData.viewFuture){
	//	$('#viewFuture').prop( "checked", true );
	//}
	if(userData.viewFuture)
		$('#viewFuture').attr('src',"./images/viewFutures.png");
	else
		$('#viewFuture').attr('src',"./images/dontViewFutures.png");
	
	if(userData.showMe)
		//$('#showMe').prop( "checked", true );
		$('#showMe').attr('src',"./images/showMe.png");
	else
		$('#showMe').attr('src',"./images/dontShowMe.png");
	
}

$(document).on("pageshow","#home", function(){
	//fixes a weird bug...
	setTimeout(function(){
		map.invalidateSize();
		}, 1);
		
	setTimeout(function(){
		map.on('zoomend', function() {
			updateMarkers();
		});
	}, 1);
});

function makeHome(){
	alert('MAKE HOME');
//$(document).on("pageshow","#home",function(){

	if(mapInitialized==false){
		currentLocation=userData.Location;
		map = L.map('map').setView(currentLocation, 13);
		mapInitialized=true;
	}
	
	if(settings.tracking_switch==true){
	console.log("tracking switch true");
		$('#tracking').val('on').slider('refresh');
		getLocation();
		intervalObject= setInterval(function(){getLocation()},settings.timeInterval);
	}
	
	$('#status').attr("placeholder", userData['status']);
	
	var tile_layer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
    maxZoom: 18
	}).addTo(map);
	
	//friendsLayer=L.layerGroup().addTo(map);
	friendsLayer = L.markerClusterGroup().addTo(map);	
	
	//trying to invalidate map size after map is loaded...
	//http://stackoverflow.com/questions/22288933/how-to-tell-when-all-visible-tiles-have-fully-loaded
	//tile_layer.on("load",function() { console.log("all visible tiles have been loaded"); map.invalidateSize(); });
	//map.on("load",function() { console.log("map: all visible tiles have been loaded"); map.invalidateSize();});
}

//status change
$('#status').change(function() {
	updateStatus();
});

function updateStatus(){
	console.log("Chaingin Status");
	userData['status']=$('#status').val();
	$('#status').attr("placeholder", userData['status']);
	//$('#status').val("");
	
	window.localStorage.setItem( 'userData', JSON.stringify(userData));
}

//home page flip switch
$('#tracking').change(function() {
    if($(this).val()=='on'){
		intervalFunction();
		intervalObject= setInterval(function(){intervalFunction()},settings.timeInterval);
		settings.tracking_switch=true;
		window.localStorage.setItem( 'settings', JSON.stringify(settings));
    }
	else{
		// Stop tracking the user
		navigator.geolocation.clearWatch(watch_id);

		// Reset watch_id and tracking_data 
		var watch_id = null;
		var tracking_data = null;
		clearInterval(intervalObject);
		settings.tracking_switch=false;
		window.localStorage.setItem( 'settings', JSON.stringify(settings));
	}
});

$("#showing").on( "panelclose", function() {
	for (var i=groupData.showNames.length-1; i>=0;i--){
		var selectorName="#show"+i;
		groupData.showStatus[i]=$(selectorName).prop('checked');
	}
	window.localStorage.setItem( 'groupData', JSON.stringify(groupData));
});

$("#viewing").on( "panelclose", function() {
	for (var i=groupData.viewNames.length-1; i>=0;i--){
		var selectorName="#view"+i;
		groupData.viewStatus[i]=$(selectorName).prop('checked');
	}
	
	for (var i=groupData.hashtagsNames.length-1; i>=0;i--){
		var selectorName="#hashtags"+i;
		groupData.hashtagsStatus[i]=$(selectorName).prop('checked');
	}
	
	window.localStorage.setItem( 'groupData', JSON.stringify(groupData));
});

function intervalFunction(){
//parts: upload location, download friends location (if set to true in any)
getLocation(); //this function gets and uploads our location.
downloadLocation();
}

function getLocation(){
	// Start tracking location
    watch_id = navigator.geolocation.getCurrentPosition(
    	// When success, do following:
        function(position){
			//console.log('get location; fmap = ' + fmap);
				if (fmap == 0) {
					myIconData = L.Icon.Label.extend({
					options: {
						iconUrl: String(imageRetrieverURL+userData.id),
						shadowUrl: 'images/marker1.png',
						
						iconSize:     [40, 40], // size of the icon
						shadowSize:   [50, 55], // size of the shadow
						iconAnchor:   [20, 50], // point of the icon which will correspond to marker's location
						shadowAnchor: [25, 55],  // the same for the shadow
						popupAnchor:  [0, -55], // point from which the popup should open relative to the iconAnchor
					
						labelAnchor: [0, 0],
						wrapperAnchor: [20, 50],
						labelClassName: 'sweet-deal-label'
					}
					});
					mymarker=new L.Marker([position.coords.latitude, position.coords.longitude],{ 'icon': new myIconData(), 'title': userData.first_name });
					
					if(userData.showMe)
						mymarker.addTo(map);
					
					currentLocation=[position.coords.latitude, position.coords.longitude];
					sendLocation();
					fmap = 1;
				} else {
					mymarker.setLatLng([position.coords.latitude,position.coords.longitude]).update();
					currentLocation=[position.coords.latitude, position.coords.longitude];
					sendLocation();
				}
				userData.Location=currentLocation;
				window.localStorage.setItem( 'userData', JSON.stringify(userData));
		},
        
        // When error, do following:
        function(error){
            console.log(error);
        },
        
        // Settings
        { enableHighAccuracy: true });
}

function sendLocation(){

	//We first check we want to share with at least one of our groups
	var oneCheckTrue=false;
	for (i=0; i<groupData.showStatus.length;i++){
		if(groupData.showStatus[i]==true)
			oneCheckTrue=true;
	}
	
	if(oneCheckTrue){
		jQuery.support.cors = true;
		$.ajax({
			crossDomain: true,
			url: saveLocationURL,
			type: 'post',
			data: {'fid': userData.id, 'latitude': currentLocation[0], 'longitude': currentLocation[1], 'status': userData['status'], 'groupStatus': groupData.showStatus},
			success: function(data, status) {
			},
			error: function(xhr, desc, err) {
			console.log(xhr);
			console.log("Details: " + desc + "\nError:" + err);
			}
		}); // end ajax call
	}
}

function centerMap(){
	map.panTo(currentLocation);
}

function optionSettings(form){
	settings.timeI = form.timeI.value;
	clearInterval(intervalObject);
	intervalFunction();
	intervalObject= setInterval(function(){intervalFunction()},settings.timeI);
	window.localStorage.setItem( 'settings', JSON.stringify(settings));
}

function downloadLocation(){

	console.log("Downloading locations");
	
	//We first check we want to share with at least one of our groups
	var oneCheckTrue=false;
	for (i=0; i<groupData.viewStatus.length;i++){
		if(groupData.viewStatus[i]==true)
			oneCheckTrue=true;
	}
	
	if(oneCheckTrue){
		jQuery.support.cors = true;
		$.ajax({
			crossDomain: true,
			type: 'POST',
			url: getFriendsLocationURL,
			data: {'fid': userData.id, 'groupStatus': groupData.viewStatus, 'AT': accessToken['accessToken']},
			dataType: 'json',
			success: function(data, status) {
				//console.log(data);
				friendsData=data;
				showTo = showingToFunc(friendsData);
				updateMarkers();
				
				window.localStorage.setItem( 'friendsData', JSON.stringify(friendsData));
			},
			error: function(xhr, desc, err) {
			console.log(xhr);
			console.log("Details: " + desc + "\nError:" + err);
			}
		}); // end ajax call
	}
	else{
		friendsLayer.clearLayers();
	}
}

//Find friends who are being shown to
function showingToFunc(friendsData){
	var showTo = new Array();
	for(i=0; i<groupData.showStatus.length; i++){
		if(i == 0 && groupData.showStatus[0] == true){
			showTo = showTo.concat(groupData[groupData.showNames[i] + 'showPeople']);
			showTo = unique(showTo);
			break;
		} else if (groupData.showStatus[i] == true){
			showTo = showTo.concat(groupData[groupData.showNames[i] + 'showPeople']);
			showTo = unique(showTo);
		}
	}
	return showTo;
}

//Remove duplicate ids
function unique(/*str[]*/ arr) {  
     var o={},  
          r=[],  
          n = arr.length,  
          i;  
  
     for( i=0 ; i<n ; ++i )  
          o[arr[i]] = null;  
  
     for( i in o )  //convert to integers
          r.push(parseInt(i));  
  
     return r;  
} 


function updateMarkers(){
	friendsLayer.clearLayers();
	notShown = 0;
	
	var iconData = L.Icon.Label.extend({
		options: {
			shadowUrl: 'images/marker2.png',
			
			iconSize:     [40, 40], // size of the icon
			shadowSize:   [50, 55], // size of the shadow
			iconAnchor:   [20, 50], // point of the icon which will correspond to marker's location
			shadowAnchor: [25, 55],  // the same for the shadow
			popupAnchor:  [0, -55], // point from which the popup should open relative to the iconAnchor

			labelAnchor: [0, 0],
			wrapperAnchor: [20, 50],
			labelClassName: 'sweet-deal-label'
		}
		});
	
	console.log();
	console.log("Updating map...");
	
	oneHashtag=false;
	hasTagNames=[];
	for(i=0;i<groupData.hashtagsStatus.length;i++){
		if(groupData.hashtagsStatus[i]==true){
			oneHashtag=true;
			hasTagNames.push(groupData.hashtagsNames[i]);
		}
	}
	
	for (i=0; i<friendsData.length;i++){
	
		if(friendsData[i].latitude==0 && friendsData[i].longitude==0)
			continue;
		
		if(oneHashtag){
			friendHashtags=findHashtags(friendsData[i].status);
			oneMatch=false;
			for(j=0;j<friendHashtags.length;j++){
				for(k=0;k<groupData.hashtagsNames.length;k++){
					if(friendHashtags[j]==groupData.hashtagsNames[k] && groupData.hashtagsStatus[k]==true)
						oneMatch=true;
				}
			}
			
			if(oneMatch==false)
				continue;
		}
		
		if(showTo.indexOf(parseInt(friendsData[i].owner)) != -1){
			markerIcon = 'images/marker2.png';
			notShown = 1;
		}
		else{
			markerIcon = 'images/marker3.png';
			notShown = 0;
		}

		var currentTime=new Date();
		var timeStamp=new Date(friendsData[i].timeStamp);
		var timeDiff=((currentTime-timeStamp)/1000/60);
		
		var tempMarker=new L.Marker([friendsData[i].latitude, friendsData[i].longitude],{ 'icon': new iconData({shadowUrl: markerIcon, 
		iconUrl: imageRetrieverURL+friendsData[i].owner}), 'title': friendsData[i].owner});
		tempMarker.on('click', openProfile); 
		
		friendsLayer.addLayer(tempMarker);
		//console.log(friendsData[i].owner);
		if(notShown != 1){
			tempMarker.setOpacity(0.7);
			console.log("Not seeing me:\t" + friendsData[i].owner);
		}
		else{
			tempMarker.setOpacity(1);
			console.log("Seeing me:\t" + friendsData[i].owner);
		}
		friendsLayer.addLayer(tempMarker);
	
	}
}

function openProfile(e){
	tempUsername=e.target._icon.title;
	
	jQuery.support.cors = true;
	$.ajax({
		crossDomain: true,
		type: 'POST',
		url: getFriendDataURL,
		data: {'fid': userData.id, 'infoOn': tempUsername},
		dataType: 'json',
		success: function(data, status) {
				createUserProfilePage(data[0]);
		},
		error: function(xhr, desc, err) {
		console.log(xhr);
		console.log("Details: " + desc + "\nError:" + err);
		}
	}); // end ajax call
}

function openProfile2(name){
	tempUsername=name;
	jQuery.support.cors = true;
	$.ajax({
		crossDomain: true,
		type: 'POST',
		url: getFriendDataURL,
		data: {'fid': userData.id, 'infoOn': tempUsername},
		dataType: 'json',
		success: function(data, status) {
		
				if(data[0]==null){
					//console.log("Setting default values");
					data=[[]];
					data[0]['owner']=tempUsername;
					data[0].longitude=0;
					data[0].latitude=0;
					data[0].status="";
					data[0].timestamp="2010-07-19 17:52:22";
				}
				createUserProfilePage(data[0]);
		},
		error: function(xhr, desc, err) {
		console.log(xhr);
		console.log("Details: " + desc + "\nError:" + err);
		}
	}); // end ajax call
}

function createUserProfilePage(viewingData){
	
	var c = $("#profileViewerCanvas").get(0);
	var ctx = c.getContext("2d");
	
	ctx.shadowBlur=20;
	ctx.shadowColor="black";

	var img = new Image();
	img.src = imageRetrieverURL+viewingData.owner;
	
	img.onload = function(){
		ctx.drawImage(img,5,5, 190, 190); // Or at whatever offset you like
	};
	
	var temp="";
	
	temp+="<center><h1>"+viewingData.ownerName+"</h1></center>";

	temp+="<center><h4>"+viewingData.status+"</h4></center>";
	
	var currentTime=new Date();
	var timeStamp=new Date(viewingData.timeStamp);
	var timeDiff=((currentTime-timeStamp)/1000/60);
	
	temp+="<center><h5>Last seen: ( ";
	if(timeDiff>0)
		temp+=Math.round(timeDiff);
			
	temp+="m ago) </h5></center>";
	
	temp += "<ul data-role=\"listview\" data-split-icon=\"delete\">";
	for (var i=groupData.showNames.length-1; i>=0;i--){
		var tempName=groupData.showNames[i]+'showPeople'
	
		var index = groupData[tempName].indexOf(tempUsername);
		
		if(index>-1){
			temp+="<li><a>"+groupData.showNames[i]+"</a><a onclick=\"removeUser('"+tempName+"', '"+index+"')\">Delete</a></li>";
		}
	}
	temp+="</ul>";
	
	$('#viewUserGroups').html(temp);
	$("#viewUserProfile").trigger("create");
	$.mobile.changePage($("#viewUserProfile"));
}

function uploadDefaultPicture(){
	jQuery.support.cors = true;
	$.ajax({
		crossDomain: true,
		type: 'POST',
		url: uploadDefaultPictureURL,
		data: {'fid': userData.id},
		success: function() {
			console.log('uploadDefaultPicture... Success!');
		},
		error: function(xhr, desc, err) {
		console.log(xhr);
		console.log("Details: " + desc + "\nError:" + err);
		}
	}); // end ajax call
}

//END OF HOME

//Tap and hold functions
map.on('contextmenu', function(e) {
    //alert(e.latlng);
	$.mobile.changePage($("#setFutureLocation"));
	
	userData.futureLat=e.latlng.lat;
	userData.futureLon=e.latlng.lng;
});

$(document).on("pageshow","#setFutureLocation", function(){
	var d = new Date();

	//$('#datetimepicker').datetimepicker({value:'2015/04/15 05:00',step:30});
	//var temp=d.getFullYear()+'/'+d.getMonth()+1+'/'+d.getDate()+' '+d.getHours()+':'+d.getMinutes();
	var month=d.getMonth()+1;
	var temp=d.getFullYear()+'/'+month+'/'+d.getDate()+' '+d.getHours()+':'+d.getMinutes();
	$('#datetimepicker_start').datetimepicker({value: temp,step:30});
	$('#datetimepicker_end').datetimepicker({value: temp,step:30});
});

function submitFuture(){
	console.log($('#datetimepicker_start').val());
	console.log($('#future_status').val());
	
	jQuery.support.cors = true;
	$.ajax({
		crossDomain: true,
		url: setFutureLocationURL,
		type: 'post',
		data: {'fid': userData.id, 'latitude': userData.futureLat, 'longitude': userData.futureLon, 'startTime': $('#datetimepicker_start').val(), 'endTime': $('#datetimepicker_end').val(), 'status':$('#future_status').val(), 'groupStatus': groupData.showStatus},
		success: function(data, status) {
			$.mobile.changePage($("#home"));
		},
		error: function(xhr, desc, err) {
		console.log(xhr);
		console.log("Details: " + desc + "\nError:" + err);
		}
	}); // end ajax call
	
}


//show future locations
//$('#viewFuture').change(function() {
$('#viewFuture').click(function(){
	//userData.viewFuture=$('#viewFuture').prop('checked');
	//if($('#viewFuture').val()=='off')
	//	userData.viewFuture=false;
	//else
	//	userData.viewFuture=true;
	
	userData.viewFuture=!userData.viewFuture;
	
	if(userData.viewFuture)
		$('#viewFuture').attr('src',"./images/viewFutures.png");
	else
		$('#viewFuture').attr('src',"./images/dontViewFutures.png");
	
	console.log("viewFuture: "+userData.viewFuture);
	if(userData.viewFuture){
		if(typeof friendsData !== 'undefined')
			updateFutureMarkers();
	}
	else{
		if(typeof friendsData !== 'undefined')
			updateMarkers();
	}
	window.localStorage.setItem( 'userData', JSON.stringify(userData));
});

//show myself
//$('#showMe').change(function() {
$('#showMe').click(function(){
	//userData.showMe=$('#showMe').prop('checked');

	userData.showMe=!userData.showMe;
	
	if(userData.showMe)
		$('#showMe').attr('src',"./images/showMe.png");
	else
		$('#showMe').attr('src',"./images/dontShowMe.png");
	
	console.log("showme:" + userData.showMe);
	if(userData.showMe){
		if(typeof mymarker !== 'undefined')
			mymarker.addTo(map);
	}
	else{
		if(typeof mymarker !== 'undefined')
			map.removeLayer(mymarker);
	}
	window.localStorage.setItem( 'userData', JSON.stringify(userData));
});



function updateFutureMarkers(){
	friendsLayer.clearLayers();

	for (i=0; i<friendsData.length;i++){
	
		if(friendsData[i].futureLatitude==0 && friendsData[i].futureLongitude==0)
			continue;
		
		var iconData = L.Icon.Label.extend({
		options: {
			iconUrl: imageRetrieverURL+friendsData[i].owner,
			shadowUrl: 'images/marker1.png',
			
			iconSize:     [40, 40], // size of the icon
			shadowSize:   [50, 55], // size of the shadow
			iconAnchor:   [20, 50], // point of the icon which will correspond to marker's location
			shadowAnchor: [25, 55],  // the same for the shadow
			popupAnchor:  [0, -55], // point from which the popup should open relative to the iconAnchor

			labelAnchor: [0, 0],
			wrapperAnchor: [20, 50],
			labelClassName: 'sweet-deal-label'
		}
		});

		var currentTime=new Date();
		var startTimeStamp=new Date(friendsData[i].startTimeStamp);
		var endTimeStamp=new Date(friendsData[i].endTimeStamp);
		
		if(currentTime>endTimeStamp) //if event has passed
			continue;
		
		var popupString=friendsData[i].ownerName+": "+friendsData[i].futureStatus;
		
		//if(timeDiff<99)
		//	popupString+=" ("+Math.round(timeDiff)+"m)";
			
		var tempMarker=new L.Marker([friendsData[i].futureLatitude, friendsData[i].futureLongitude],{ 'icon': new iconData({ labelText: popupString }), 'title': friendsData[i].owner })
		tempMarker.on('click', openProfile); 
		friendsLayer.addLayer(tempMarker);
	
	}
}

$(function(){
	$(".leaflet-control").hide()
});

//Show dropup menu on click
$("#dropUpMenu").click(function(){
	$("#homeDropUpMenuID").slideDown(400); //not sure why it's not slideUp
	$("#trackingSwitchDiv").hide();
	$(".leaflet-control-attribution").hide()
});

//Close drop up menu when clicking outside the container
$(document).mouseup(function (e)
{
    var container = $("#homeDropUpMenuID");

    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
        $("#homeDropUpMenuID").slideUp(400);
		$("#trackingSwitchDiv").show();
		$(".leaflet-control-attribution").show()
    }
});

$("#map").click(function(){
	if($("#homeDropUpMenuID").is(':visible') == true){
		$("#homeDropUpMenuID").slideUp(400);
		$("#trackingSwitchDiv").show();
		$(".leaflet-control-attribution").show();
	}
});
/////////////////////////////////////////////////////////////////////////
//Home page checkbox indicators
/////////////////////////////////////////////////////////////////////////
$("#showMe").click(function(){
	if($("#showMe").is(":checked") === true){
		$("#homePageFrontShowMe").css("background-color","#330066");
	}
	else{
		$("#homePageFrontShowMe").css("background-color","#e6e6e6");
	}
});

$("#viewFuture").click(function(){
	if($("#viewFuture").is(":checked") === true){
		$("#homePageFrontFuture").css("background-color","#330066");
	}
	else{
		$("#homePageFrontFuture").css("background-color","#e6e6e6");
	}
});
/////////////////////////////////////////////////////////////////////////