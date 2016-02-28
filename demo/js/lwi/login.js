//LOGIN
$(document).ready(function() {

	windowWidth = $(window).width();
	
	if(windowWidth < 600){
		temp = "background: url('images/hot-air-balloons-islands_00443417 - Copy.jpg') 50% 50% no-repeat;\
		background-size: 100% 100%;\
		background-attachment: fixed;\
		background-position: center; \
		border-color: #bbb;\
		color: #333;\
		text-shadow: 0 1px 0 #f3f3f3;";
		$('<style> .ui-overlay-a, .ui-page-theme-a, .ui-page-theme-a .ui-panel-wrapper {' + temp + ' }</style>').appendTo('head'); 
	}

      window.fbAsyncInit = function() {
        FB.init({
          appId      : "236859373182152",
          xfbml      : true,
          version    : 'v2.0'
        });
		checkLogin();
      };

      (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         //js.src = "//connect.facebook.net/en_US/sdk.js";
		 js.src="https://connect.facebook.net/en_US/all.js"
         fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk'));
});

//document.addEventListener('deviceready', function() {
//	try {
//	alert('Device is ready! Write your app id below .For demo i put my app id there.');
//		FB.init({ appId: "236859373182152", nativeInterface: CDV.FB, useCachedDialogs: false, oauth: true });
//		checkLogin();
//		//document.getElementById('data').innerHTML = "";
//	} catch (e) {
//	alert(e);
//	}
//}, false);

function checkLogin(){
	FB.getLoginStatus(function(response) {
		if (response.status == 'connected') {
			accessToken = FB.getAuthResponse();
			//console.log('getLoginStatus response: ' + JSON.stringify(response, null, 4));
			FB.api('/me',
				function (response) {
				if (response && !response.error) { //if logged into FB
					if(window.localStorage.getItem('userData')){	//check for userData
						userData= JSON.parse(window.localStorage.getItem('userData'));
						console.log('here2');
						updateHomeUserIcon();
					}
					else{ //if no userData, set to Default
						var dt = new Date();
						userData = {
							status: "The current time is: " + dt,
							first_name: response.first_name,
							id: response.id,
							Location: {latitude: 0, longtitude: 0}
						}; 
						console.log('here1');
						updateHomeUserIcon();
					
						//userData.Status='Hey All';
						//userData.Location.longitude=0;
						//userData.Location.latitude=0;
						//
						//userData.first_name=response.first_name;
						//userData.id=response.id;
						
						window.localStorage.setItem( 'userData', JSON.stringify(userData));
					}
							
					registerUser();
					
					//console.log('userData: ' + JSON.stringify(userData, null, 4));
					
					if(window.localStorage.getItem('groupData')){ //check for groupData
						groupData= JSON.parse(window.localStorage.getItem('groupData'));
					} else { //check on server, which returns default if it does not exist
						jQuery.support.cors = true;
							$.ajax({
								crossDomain: true,
								//url: 'http://yatchium.com/lwi/Site/php/new/getGroupData.php',
								url: 'http://yatchium.com/lwi2/php/new/getGroupData.php',
								type: 'post',
								data: {'fid': userData.id},
								async: false,
								success: function(data, status) {
									console.log(groupData);
									groupData=data;
									window.localStorage.setItem( 'groupData', JSON.stringify(groupData));				
								},
								error: function(xhr, desc, err) {
								console.log(xhr);
								console.log("Details: " + desc + "\nError:" + err);
								}
							}); // end ajax call
					}
					//console.log('groupData: ' + JSON.stringify(groupData, null, 4));
					
					if(window.localStorage.getItem('settings')){	//check for Settings
						settings= JSON.parse(window.localStorage.getItem('settings'));
						//console.log('settings exists: ' + JSON.stringify(settings, null, 4));
					}
					else{ //if no Settings, set to Default
						settings = {
							tracking_switch: false,
							timeInterval: 10000
						};						
						window.localStorage.setItem( 'settings', JSON.stringify(settings));
						//console.log('settings is now made: ' + JSON.stringify(settings, null, 4));
					}
					//console.log('settings: ' + JSON.stringify(settings, null, 4));
					
					if(window.localStorage.getItem('friendData')){	//check for friendData
						friendData= JSON.parse(window.localStorage.getItem('friendData'));
					}
					else{ //if no friendData, set to Default
						friendData = {
							names: [],
							timeStamp: [],
							status: [],
							latitude: [],
							longtitude: [],
							id: []
						};
						
						window.localStorage.setItem( 'friendData', JSON.stringify(friendData));
					}
					//console.log('friendData: ' + JSON.stringify(friendData, null, 4));
					findAppFriends();					
				}
			});
		} else{
			alert('Not connected');
		}
	});
}

// add id and first name to server
function registerUser(){
	console.log('REGISTER USER');
	jQuery.support.cors = true;
			$.ajax({
				crossDomain: true,
				url: 'http://yatchium.com/lwi2/php/new/registerUserInfo.php', //TO EDIT
				type: 'post',
				data: {'userName': userData.first_name, 'fid': userData.id},
				async: false,
				success: function(data, status) {
				//updateHomeUserIcon();
				},
				error: function(xhr, desc, err) {
				console.log(xhr);
				console.log("Details: " + desc + "\nError:" + err);
				}
			}); // end ajax call		
}

function findAppFriends(){
	FB.api('/me/friends', { fields: 'id' },  function(response) {
	if (response.error) {
		alert(JSON.stringify(response.error));
	} else {
	var friends=response.data;
	var friendIDs=new Array();
		
	for (var k = 0; k < friends.length && k < 5000; k++) {
		friendIDs[k] = friends[k].id;
	}
			//send all friend ids
			//get back friends who use the app
			//Will set to empty ([]) when no longer testing
			groupData.EverybodyshowPeople = [];
			groupData.EverybodyviewPeople = [];
			friendData.names = [];
			jQuery.support.cors = true;
					$.ajax({
						crossDomain: true,
						url: 'http://yatchium.com/lwi2/php/new/populateEverybodyGroup.php',
						type: 'post',
						data: {'id': userData.id, 'friendIDs': friendIDs},
						dataType: 'json',
						async: false,
						success: function(data, status) {
							//console.log('find app friend success: ' + JSON.stringify(data, null, 4));
							for(i=0;i<data.length;i++){
								groupData.EverybodyshowPeople.push(data[i].FBID);
								groupData.EverybodyviewPeople.push(data[i].FBID);
								friendData.id.push(data[i].FBID);
								friendData.names.push(data[i].userName);
							}
							//add browser friend
							groupData.EverybodyshowPeople.push("100000000");
							groupData.EverybodyviewPeople.push("100000000");
							friendData.id.push("100000000");
							friendData.names.push('The Ultimate User');
							//add browser friend
							
							window.localStorage.setItem( 'groupData', JSON.stringify(groupData));
							//console.log('group data for upload: ' + JSON.stringify(groupData, null, 4));
							uploadGroupData();
							$("#home").trigger("create");
							makeHome();
							$.mobile.changePage($("#home"));
						},
					error: function(xhr, desc, err) {
						console.log(xhr);
						console.log("Details: " + desc + "\nError:" + err);
					}
					}); //end ajax call
				
			//console.log('groupData: ' + JSON.stringify(groupData, null, 4));
			//console.log('friendData: ' + JSON.stringify(friendData, null, 4));
	}
	});
}

function loginWithFB(){
		FB.login(
			function(response) {
				if (response.authResponse.userID) {
					var FBUID =   response.authResponse.userID;
					console.log('loginWithFB response: ' + JSON.stringify(response, null, 4));
					checkLogin();
				} else {
                   console.log('NO FACEBOOK DETECTED');
				}
			}, 
			{ scope: 'user_friends,public_profile,email' }
		);
		
}
//END OF LOGIN

function logout(){
	FB.logout(function(response) {
		alert('logged out');
	});
	
	localStorage.removeItem("groupData");
	localStorage.removeItem("settings");
	localStorage.removeItem("object_array");
	localStorage.removeItem("friendData");
	localStorage.removeItem("userData");
	
	groupData		= null;
	settings		= null;
	object_array	= null;
	friendData		= null;
	userData		= null;
	
	$.mobile.changePage($("#login"));
}
 
 function browserLogin(){
	groupData = {
		"showNames":["Everybody","TeamRocket"],
		"showStatus":["false", "false"],
		"viewNames":["Everybody"],
		"viewStatus":["false"],
		"TeamRocketshowPeople":[1001000871, 506011480, 100008349674430, 1658550217],
		"EverybodyshowPeople":[559045996,503321561,1658550217,1001000871,506011480,100008349674430,511042629, 743526343],
		"EverybodyviewPeople":[559045996,503321561,1658550217,1001000871,506011480,100008349674430,511042629, 743526343]
	};
	
	var dt = new Date();
	userData = {
		status: "The current time is: " + dt,
		username: 'Cdog',
		first_name: 'Ultimate user',
		id:"100000000",
		Location: {latitude: 0, longtitude: 0}
	}; 
	
	settings = {
		tracking_switch: false,
		timeInterval: 10000
	};
	
	friendData = {
		names: ["hart","Mihai","Jacob","Jeff","Neel","Joseph","Yaaseen", "Costa"],
		timeStamp: [],
		status: [],
		latitude: [0, 10, 20, 30, 40, 50, 60],
		longtitude: [0, 10, 20, 30, 40, 50, 60],
		id: [559045996,503321561,1658550217,1001000871,506011480,100008349674430,511042629, 743526343]
	};
	
	$.mobile.changePage($("#home"));
	window.location = '#home';
	
	registerUser();
	uploadGroupData();
	updateHomeUserIcon();
 }
 
 function updateHomeUserIcon(){
	if(typeof userData !== 'undefined'){
		console.log("updateHomeUserIcon:");
		//$('.homePageUserIcon').css('background','url("http://yatchium.com/lwi2/php/new/imageRetriever.php?userID=' + userData.id + '") 50% 50% no-repeat');
		//$('.homePageUserIcon').css('background-size','34px 34px');
		//$('.homePageUserIcon').css('height','34px');
		//$('.homePageUserIcon').css('width','34px');
	
	temp = "background: url('http://yatchium.com/lwi2/php/new/imageRetriever.php?userID=" + userData.id + "#" + new Date().getTime() + "') 50% 50% no-repeat;\
		background-size: 34px 34px;\
		height:34px;\
		width:34px;\
		padding: 0px;\
		/*border:1px solid white;*/\
		box-shadow: none;\
		-webkit-box-shadow: none;";
	
	console.log(temp);
	//if(userData.id != 100000000){
	//if(userIconReady == 1){
		$('<style> .homePageUserIcon {' + temp + ' }</style>').appendTo('head'); 
	//}
	//userIconReady = 1;
	}
 }