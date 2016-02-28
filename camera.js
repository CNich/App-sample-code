// Called when a photo is successfully retrieved
    //
    function onPhotoDataSuccess(imageData) {
      // Uncomment to view the base64-encoded image data
      // console.log(imageData);

      // Get image handle
      //
      var smallImage = document.getElementById('smallImage');

      // Unhide image elements
      //
      smallImage.style.display = 'block';

      // Show the captured photo
      // The in-line CSS rules are used to resize the image
      //
      smallImage.src = "data:image/jpeg;base64," + imageData;
    }

    // Called when a photo is successfully retrieved
    //
    function onPhotoURISuccess(imageURI) {
      // Uncomment to view the image file URI
      // console.log(imageURI);

      // Get image handle
      //
      var largeImage = document.getElementById('largeImage');

      // Unhide image elements
      //
      largeImage.style.display = 'block';

      // Show the captured photo
      // The in-line CSS rules are used to resize the image
      //
      largeImage.src = imageURI;
    }

    // A button will call this function
    //
    function capturePhoto() {
      // Take picture using device camera and retrieve image as base64-encoded string
      navigator.camera.getPicture(changeProfilePic, onFail, { quality: 20,
        destinationType: destinationType.DATA_URL });
    }

    // A button will call this function
    //
    function getPhoto(source) {
      // Retrieve image file location from specified source
      navigator.camera.getPicture(changeProfilePicGallery, onFail, { quality: 20,
        destinationType: destinationType.FILE_URI,
        sourceType: source });
    }

    // Called if something bad happens.
    //
    function onFail(message) {
      alert('Failed because: ' + message);
    }
	
	function changeProfilePic(imageData){
		var c=document.getElementById("profilePicCanvas");
        var ctx=c.getContext("2d");
        var img=new Image();
        var tmpData = "data:image/jpeg;base64," + imageData;
        img.src=tmpData;
        var height = img.height * 200 / img.width;
        c.width = 200;
        c.height = height;
        ctx.drawImage(img,0,0, 200, height);
        //img.onload = function(){
        //      ctx.drawImage(img,0,0);
        //};
        resizeImageForUpload(tmpData);    
	}

    /////////////////////////////////////////////////////
    //resize photo on users end to save data
    function resizeImageForUpload(imgString){
        var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');
    
        // draw source image into the off-screen canvas:
        var img=new Image();
        img.src=imgString;
        //alert(img.width + "x" + img.height);
        var height = img.height * 200 / img.width;
        canvas.width = 200;
        canvas.height = height;
        ctx.drawImage(img,0,0, 200, height);
          
        var dataUrl = canvas.toDataURL('image/jpeg');
        
        //c.remove();
        
        jQuery.support.cors = true;
			$.ajax({
				crossDomain: true,
				url: uploadCameraPhoto,
				type: 'post',
				data: {tmpdata : dataUrl, id: userData.id},
				async: false,
				success: function(data, status) {
					alert(data);				
				},
				error: function(xhr, desc, err) {
				console.log(xhr);
				alert("Details: " + desc + "\nError:" + err);
				}
			}); // end ajax call
        updateHomeUserIcon();
    }
	
	function changeProfilePicGallery(imageURI){
		var c=document.getElementById("profilePicCanvas");
        var ctx=c.getContext("2d");
        var img=new Image();
        img.src=imageURI;
        window.setTimeout(function(){
            var height = img.height * 200 / img.width;
            c.width = 200;
            c.height = height;
            ctx.drawImage(img,0,0, 200, height);
            resizeImageForUpload(c.toDataURL('image/jpeg'));
        },1000);
		//uploadPhoto(imageURI);
	}
	
	//PROFILE PAGE
$(document).on("pagebeforecreate","#profile",function(){
	var c = $("#profilePicCanvas").get(0);
	var ctx = c.getContext("2d");
	
	//c.width = window.innerWidth;
	ctx.shadowBlur=20;
	ctx.shadowColor="black";

	var img = new Image();
	img.src = imageRetrieverURL+userData.id+'Original';
	
	img.onload = function(){
		ctx.drawImage(img,0,0); // Or at whatever offset you like
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
	ft.upload(imageURI, uploadPictureURL+userData.id+"Original", uploadSuccess, uploadFail, options);
	console.log(imageURI);
}

function uploadSuccess(r) {
	console.log("Code = " + r.responseCode);
	console.log("Response = " + r.response);
	console.log("Sent = " + r.bytesSent);
	
	alert("Picture Uploaded");
	ctx.clearRect(0,0);
	ctx.shadowBlur=20;
	ctx.shadowColor="black";
	
	var img = new Image();
	img.src = imageRetrieverURL+userData.id;
	
	img.onload = function(){
		ctx.drawImage(0,0); // Or at whatever offset you like
		ctx.strokeText("Click to Change",100,180);
	};
}

function uploadFail(error) {
alert("An error has occurred: Code = " + error.code);
}

