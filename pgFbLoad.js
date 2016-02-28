/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

//Are we running on the browser or app?
var isBrowser = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;


//function onLoad() {
//    document.addEventListener("deviceready", onDeviceReady, false);
//}


//MOVE TO init-app.js
/*function onDeviceReady() {
    console.log("\n\nTime to check statusssssss");
	//checkLoginFB();
	//loginFB();
	$("#loginCheck").text("Is this working???");
    checkLoginFB();
    //browserLogin();
    makeHome(); updateHomeUserIcon();setHomePageStatus();
}
*/

var fbasync = false;

//Logging in is asynchronous, which breaks this function.
//Need to be logged in before we do ANYTHING
//ANYTHINGGGGGGGG
//Note: If we are logged in, This function will proceed
//in the correct order. 
//If not, friendsFB() will run **BEFORE** loginFB() since
//I am guessing that it takes longer to get an access token
//than it does to just use one we have, thus finishing 
//before friendsFB() does.
//function loginFuncs(){
//	loginFB();
//	console.log("HEREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
//	//apiTestFB();	
//	friendsFB(); 
//}

var loginFB = function () {
    alert("fb log in");
                if (!window.cordova) {
                    var appId = prompt("236859373182152", "");
                    facebookConnectPlugin.browserInit(appId);
                }
                facebookConnectPlugin.login( ["email"],
                    function (response) {
						checkLoginFB();
					},
                    function (response) {
                        alert(JSON.stringify(response, null, 4));
					},
					function(){
						console.log("HEYYYYYYYYYYYYY");
					}
				);
            }

var friendsFB = function(){
    facebookConnectPlugin.api( "/me/friends", ["user_friends"],
        function (response) {
		      alert("friendsFB");
			var friends=response.data;
			var friendIDs=new Array();
				
			for (var k = 0; k < friends.length && k < 5000; k++) {
				friendIDs[k] = response.data[k].id;
			}
			console.log(userData.id);
			console.log(userData.first_name);
			console.log(friendIDs);
			
			//send all friend ids
			//get back friends who use the app
			//Will set to empty ([]) when no longer testing
			groupData.EverybodyshowPeople = [];
			groupData.EverybodyviewPeople = [];
			friendData.names = [];
			
			//NOW THAT WE DON;T GET ALL FACEBOOK FRIENDS, EDIT PHP
			jQuery.support.cors = true;
				$.ajax({
					crossDomain: true,
					url: 'http://yatchium.com/dev/php/accountCreation/populateEverybodyGroup.php',
					type: 'post',
					data: {'id': userData.id, 'friendIDs': friendIDs, 'userName': userData.first_name},
					dataType: 'json',
					async: false,
					success: function(data, status) {
						for(i=0;i<data.length;i++){
							groupData.EverybodyshowPeople.push(data[i].owner);
							groupData.EverybodyviewPeople.push(data[i].owner);
							friendData.id.push(data[i].owner);
							friendData.names.push(data[i].ownerName);
						}
						//add browser friend
						groupData.EverybodyshowPeople.push("100000000");
						groupData.EverybodyviewPeople.push("100000000");
						friendData.id.push("100000000");
						friendData.names.push('The Ultimate User');
						//add browser friend
						
						window.localStorage.setItem( 'groupData', JSON.stringify(groupData));
						alert('friendsFB success\n\ngroup data for upload: ' + JSON.stringify(groupData, null, 4));
                        
                        //final login flow
                        registerUser();
	                    uploadGroupData();
                        makeHiddenThumbnail(); 
                        makeHome();      
                        initProfilePicture();
                        setHomePageStatus();
				        $.mobile.changePage($("#home"));
						//$("#home").trigger("create");
						//$.mobile.changePage($("#home"));
					},
					error: function(xhr, desc, err) {
						alert("friendsFB Failed:\n\n" + xhr + "\nDetails: " + desc + "\nError:" + err);
					}
				}); //end ajax call
				
			//console.log('groupData: ' + JSON.stringify(groupData, null, 4));
			//console.log('friendData: ' + JSON.stringify(friendData, null, 4));
			console.log("\n\nfriendIDS:\n" + JSON.stringify(friendIDs, null, 4));	
		});
}

var showDialogFB = function () {
    facebookConnectPlugin.showDialog( { method: "feed" }, 
        function (response) { alert(JSON.stringify(response)) },
        function (response) { alert(JSON.stringify(response)) });
}

var apiTestFB = function () { 
    facebookConnectPlugin.api( "me/?fields=id,email", ["user_birthday"],
        function (response) { alert(JSON.stringify(response)) },
        function (response) { alert(JSON.stringify(response)) }); 
}

var logPurchaseFB = function () {
    facebookConnectPlugin.logPurchase(1.99, "USD",
        function (response) { alert(JSON.stringify(response)) },
        function (response) { alert(JSON.stringify(response)) });
}

var logEventFB = function () {
    // For more information on AppEvent param structure see
    // https://developers.facebook.com/docs/ios/app-events
    // https://developers.facebook.com/docs/android/app-events
    facebookConnectPlugin.logEvent("Purchased",
        {
            NumItems: 1,
            Currency: "USD",
            ContentType: "shoes",
            ContentID: "HDFU-8452"
        }, null,
        function (response) { alert(JSON.stringify(response)) },
        function (response) { alert(JSON.stringify(response)) });
}

var getAccessTokenFB = function () { 
    facebookConnectPlugin.getAccessToken( 
        function (response) { alert(JSON.stringify(response)) },
        function (response) { alert(JSON.stringify(response)) });
}

function checkLoginFB() {
    alert("checkLoginFB");
	$("#loginCheck").text("Connecting...");
    facebookConnectPlugin.getLoginStatus( 
        function (response) {
			console.log("get status FB\n\n" + JSON.stringify(response, null, 4));
			console.log("response...\n\n" + JSON.stringify(response.status, null, 4));
			
			if(response.status == "connected"){
				$("#loginCheck").text("Connected. Loading profile now...");
                accessToken = response.authResponse.accessToken;
				alert("accessToken:\n" + accessToken);
				if(window.localStorage.getItem('userData')){	//check for userData
					userData= JSON.parse(window.localStorage.getItem('userData'));
					console.log('here2');
				}
				else{ //if no userData, set to Default
					userData = {
						status: "This is my current status!",
						first_name: response.first_name,
						id: response.authResponse.userID,
						Location: {latitude: 0, longtitude: 0},
						viewFuture: false,
						showMe: true
					}; 
					console.log('here1');
					window.localStorage.setItem( 'userData', JSON.stringify(userData));
				}
				//registerUser();
				//updateHomeUserIcon(); 		
                
				//console.log('userData: ' + JSON.stringify(userData, null, 4));
				
				
				//ALWAYS CHECK SERVER FOR GROUP DATA
				//GET RID OF IF STATEMENT, KEEP ELSE
				if(window.localStorage.getItem('groupData')){ //check for groupData
					groupData= JSON.parse(window.localStorage.getItem('groupData'));
				} else { //check on server, which returns default if it does not exist
					jQuery.support.cors = true;
						$.ajax({
							crossDomain: true,
							url: 'http://yatchium.com/dev/php/groupData/getGroupData.php',
							type: 'post',
							data: {'fid': userData.id},
							async: false,
							success: function(data, status) {
								console.log(groupData);
								groupData=data;
								window.localStorage.setItem( 'groupData', JSON.stringify(groupData));				
							},
							error: function(xhr, desc, err) {
							console.log(JSON.stringify(xhr, null, 4));
							console.log("Details: " + desc + "\nError:" + err);
							}
						}); // end ajax call
				}
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
				friendsFB();
			}
			else{
				$("#loginCheck").text("Not Connected. Please log in.");
			}
		});
	}
	
        //function (response) { alert(JSON.stringify(response)) });

var logoutFB = function () {
    facebookConnectPlugin.logout(
        function (response) { 
			console.log("\nLogged Out\n" + JSON.stringify(response)); 
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
	});
}

//CHECK IF USER ALREADY HAS AN ACCOUNT.
//IF YES, DO NOTHING
//ELSE, REGISTER
//CHANGE THE PHP FUNTION
function registerUser(){
	console.log('REGISTER USER');
	jQuery.support.cors = true;
			$.ajax({
				crossDomain: true,
				url: 'http://yatchium.com/dev/php/accountCreation/registerUserInfo.php', //TO EDIT
				type: 'post',
				data: {'userName': userData.first_name, 'fid': userData.id},
				async: false,
				success: function(data, status) {
				//updateHomeUserIcon();
					console.log("Register User done!\n");
                    //makeHiddenThumbnail();
                    //makeHome();
                    //initProfilePicture();
                    //setHomePageStatus();
				},
				error: function(xhr, desc, err) {
				console.log(xhr);
				console.log("Details: " + desc + "\nError:" + err);
				}
			}); // end ajax call		
}

