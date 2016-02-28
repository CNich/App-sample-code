var cropMade = false;

$(function ($){
  //function makeCrop2($){
	console.log("MAKE CROP TEST 2");
		
    // Create variables (in this scope) to hold the API and image size
    var jcrop_api,
        boundx,
        boundy,
		xa,
		ya,
		len,

        // Grab some information about the preview pane
        $preview = $('#preview-pane'),
        $pcnt = $('#preview-pane .preview-container'),
        $pimg = $('#preview-pane .preview-container img'),		
        xsize = $pcnt.width(),
        ysize = $pcnt.height();	
		
		initJcrop();
		
	function initJcrop() {
        
        var profilePicCanvas = document.getElementById('profilePicCanvas');
	
    $('#target').Jcrop({
		onChange: PrevCoords,
		onSelect: PrevCoords,
		onRelease:  clearCoords,
		aspectRatio: xsize / ysize
    },function(){
      // Use the API to get the real image size
      var bounds = this.getBounds();
      boundx = bounds[0];
      boundy = bounds[1];
      // Store the API in the jcrop_api variable
      jcrop_api = this;

      // Move the preview into the jcrop container for css positioning
      $preview.appendTo(jcrop_api.ui.holder);
	  
		$('.jcrop-holder img').attr('src', profilePicCanvas.toDataURL('image/jpeg'));
	  
	  $tmp = $('#target');
		var width;
		var height;		
		
		width = $tmp.width();
		height = $tmp.height();
		
		
		if(width > height){
			len = height;
			xa = Math.floor((width - height)/2);
			ya = 0;
		} else if(width == height){
			len = width;
			xa = 0;
			ya = 0;
		} else{
			len = width;
			ya = Math.floor((height - width)/2);
			xa = 0;
		}
		
		jcrop_api.setSelect([xa, ya, xa + len, ya + len ]);
    }); 
	
	};
	
	
	$('#cropPictureLink').click(function(e) {
		console.log("cropPictureLink");
		if(typeof userData !== 'undefined'){
            var profilePicCanvas = document.getElementById('profilePicCanvas');
			$('#target').attr('src', profilePicCanvas.toDataURL('image/jpeg'));
			$('.jcrop-holder img').attr('src', profilePicCanvas.toDataURL('image/jpeg'));
		}
		jcrop_api.destroy();
		initJcrop();
			
    });
		
	$('#coords').on('change','input',function(e){
      var x1 = $('#x1').val(),
          x2 = $('#x2').val(),
          y1 = $('#y1').val(),
          y2 = $('#y2').val();
      jcrop_api.setSelect([x1,y1,x2,y2]);
    });

	function PrevCoords(c){
		updatePreview(c);
		showCoords(c);
	};
	
    function updatePreview(c)
    {
      if (parseInt(c.w) > 0)
      {
        var rx = xsize / c.w;
        var ry = ysize / c.h;

        $pimg.css({
          width: Math.round(rx * boundx) + 'px',
          height: Math.round(ry * boundy) + 'px',
          marginLeft: '-' + Math.round(rx * c.x) + 'px',
          marginTop: '-' + Math.round(ry * c.y) + 'px'
        });
      }
	};
	
  });
 
   // Simple event handler, called from onChange and onSelect
  // event handlers, as per the Jcrop invocation above
  function showCoords(c)
  {
	//console.log("x1: " + c.x + " y1: " + c.y + " x2: " + c.x2 + " y2: " + c.y2 + " w: " + c.w + " h: " + c.h);
	$('#x').val(c.x);
    $('#y').val(c.y),
    $('#w').val(c.x2 - c.x),
    $('#h').val(c.y2 - c.y);
  };

  function clearCoords()
  {
    $('#coords input').val('');
  };
  
	function cropTestHeight(){
	
	var $img = $('<img>');
	$img.attr('src', 'tapmodo-Jcrop-1902fbc/demos/demo_files/pool.jpg');
	
	console.log("cropTestHeight: " + $(this).width());
	return [$(this).width(), $(this).height()];
	
	}
	
	function uploadCrop(){
	var x = $('#x').val(),
        y = $('#y').val(),
        w = $('#w').val(),
        h = $('#h').val();
		
		console.log("x: " + x + " y: " + y + " w: " + w + " h: " + h);
		
		jQuery.support.cors = true;
			$.ajax({
				crossDomain: true,
				url: cropThumbURL,
				type: 'post',
				data: {'fid': userData.id, 'x': x, 'y': y, 'w': w, 'h': h},
				async: false,
				success: function(data, status) {
					console.log('Crop worked');				
				},
				error: function(xhr, desc, err) {
				console.log(xhr);
				console.log("Details: " + desc + "\nError:" + err);
				}
			}); // end ajax call
        
        //hidden thumbnail
        var canvas = document.getElementById('hiddenThumb');
        
        //original profile picture
        var profilePicCanvas = document.getElementById('profilePicCanvas');
        
        ctx = canvas.getContext('2d');
        var img=new Image();
        img.src=profilePicCanvas.toDataURL('image/jpeg');
        canvas.width = img.width;
        canvas.height = img.height;
        
        //draw new header thumbnail
        //For some reason, the header requires same dimensions as the original picture
        img.onload = function(){
            ctx.drawImage(img,x,y,w,h, 0, 0, 200, profilePicCanvas.height);       
		      $('.homePageUserIcon').css({'background-image': "url(" + canvas.toDataURL('image/jpeg') + ")" });
        };
	}