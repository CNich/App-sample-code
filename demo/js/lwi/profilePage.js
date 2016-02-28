function getStatuses(){
	temp = '';
	showTrue = false;
	
	temp += '<ul data-role="listview" data-inset="true">';
	temp += '<li><h3>Groups you are viewing:</h3></li>';
	for(i=0; i< groupData.viewStatus.length; i++){
		if(groupData.viewStatus[i] == true){
			temp += '<li>' + groupData.viewNames[i] + '</li>';
			showTrue = true;
		}	
	}	
	temp += '</ul>';
	console.log('HIIIIIIIIII 1');
	//$.mobile.activePage.find('#friendsStatuses').panel("open"); 
	
	if(showTrue == true){
		jQuery.support.cors = true;
		$.ajax({
			crossDomain: true,
			//url: 'http://yatchium.com/lwi/Site/php/new/getStatuses.php',
			url: 'http://yatchium.com/lwi2/php/new/getStatuses.php',
			type: 'post',
			data: {'userName': userData.id, 'everybodyGroup': groupData.EverybodyshowPeople, 'friendNames': friendData.names, 'groupStatus': groupData.viewStatus},
			dataType: 'json',
			success: function(data, status) {
				temp += "<h3>Search Friends</h3>";
				temp +=     '<form class="ui-filterable"> \
								<input id="statusSearch" data-type="search"> \
							</form>';
				temp += '<ul data-role="listview" data-inset="true" data-filter="true" data-input="#statusSearch">';
				
				for(i=0;i<data['status'].length;i++){
				
					temp += "<li>";
					temp += "<a onclick=\"openProfile2("+data.id[i]+")\">"
						//temp += "<image src=\"http://yatchium.com/lwi/Site/php/new/imageRetriever.php?userID=" + data.id[i] + "\">";
						temp += "<image width=\"80px\" height=\"80px\" src=\"http://yatchium.com/lwi2/php/new/imageRetriever.php?userID=" + data.id[i] + "\">";
						temp += "<p>" + data['friend'][i] + ": " + data['status'][i] + "</p>";
						temp += "<p>Last seen: " + data['timeStamp'][i] + "</p>"
					temp += "</a>";
					temp += '</li>';
		
					//tempDiv += '<div style="border:1px solid blue;">';
					//tempDiv += '<div class="ui-grid-a">';
					//tempDiv += '<div class="ui-block-a">' + data['friend'][i] +'</div>';
					//tempDiv += '<div class="ui-block-b">' + data['status'][i] +'</div>';
					//tempDiv += '</div>';
					//tempDiv += '<div>Last seen: ' + data['timeStamp'][i] +'<p></p></div>';
					//tempDiv += '</div>';
				}
				console.log('HIIIIIIIIII');
				temp += '</ul>';
				document.getElementById('friendsStatuses').innerHTML =	temp;
				$("#friendsStatuses").trigger("create");
				$.mobile.activePage.find('#friendsStatuses').panel("open"); 
		
			},
			error: function(xhr, desc, err) {
			console.log(xhr);
			console.log("Details: " + desc + "\nError:" + err);
			}
		}); // end ajax call	
	} else{
		temp = '<h3>You are not viewing groups</h3>';
		document.getElementById('friendsStatuses').innerHTML =	temp;
		$.mobile.activePage.find('#friendsStatuses').panel("open"); 
	}
}





//PROFILE PAGE
$(document).on("pagebeforecreate","#profile",function(){
	var c = $("#profilePicCanvas").get(0);
	var ctx = c.getContext("2d");
	
	//c.width = window.innerWidth;
	ctx.shadowBlur=20;
	ctx.shadowColor="black";

	var img = new Image();
	//img.src = 'http://yatchium.com/lwi/Site/php/new/imageRetriever.php?userID='+userData.id;
	img.src = 'http://yatchium.com/lwi2/php/new/imageRetriever.php?userID='+userData.id;
	
	img.onload = function(){
		ctx.drawImage(img,5,5, 190, 190); // Or at whatever offset you like
		ctx.strokeText("Click to Change",100,180);
	};
			
	c.addEventListener('click', function() {

		var options = {
			quality: 20, //50
			targetWidth: 100,	//1000
			targetHeight:100,  //1000
			destinationType: Camera.DestinationType.FILE_URI,
			encodingType: Camera.EncodingType.JPEG,
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY
		};
	    
		navigator.camera.getPicture(uploadPhoto, function(message) {
			alert('get picture failed');
		},options);
	  
	}, false);
});

function uploadPhoto(imageURI) {
	var options = new FileUploadOptions();
	options.fileKey="file";
	options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
	options.mimeType="image/jpeg";
	var params = new Object();
	params.value1 = "test";
	params.value2 = "param";
	options.params = params;
	options.chunkedMode = false;
	var ft = new FileTransfer();
	//ft.upload(imageURI, 'http://yatchium.com/lwi/Site/php/new/uploadPicture.php?userID='+userData.id, uploadSuccess, uploadFail, options);
	ft.upload(imageURI, 'http://yatchium.com/lwi2/php/new/uploadPicture.php?userID='+userData.id, uploadSuccess, uploadFail, options);
	console.log(imageURI);
}

function uploadSuccess(r) {
	console.log("Code = " + r.responseCode);
	console.log("Response = " + r.response);
	console.log("Sent = " + r.bytesSent);
	
	alert("Picture Uploaded");
	ctx.clearRect(0,0,200,200);
	ctx.shadowBlur=20;
	ctx.shadowColor="black";
	
	var img = new Image();
	//img.src = 'http://yatchium.com/lwi/Site/php/new/imageRetriever.php?userID='+userData.id;
	img.src = 'http://yatchium.com/lwi2/php/new/imageRetriever.php?userID='+userData.id;
	
	img.onload = function(){
		ctx.drawImage(img,5,5, 190, 190); // Or at whatever offset you like
		ctx.strokeText("Click to Change",100,180);
	};
}

function uploadFail(error) {
alert("An error has occurred: Code = " + error.code);
}