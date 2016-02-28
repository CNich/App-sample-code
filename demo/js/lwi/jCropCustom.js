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
	
	console.log("initJcrop");
	
    $('#target').Jcrop({
		onChange: PrevCoords,
		onSelect: PrevCoords,
		onRelease:  clearCoords,
		//boxHeight: 400,
		//setSelect: [ xa, ya, xa + len, ya + len ],
		//setSelect: [ 0, 0, 200, 200 ],
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
	  
	if(typeof userData !== 'undefined'){
		$('.jcrop-holder img').attr('src', "http://yatchium.com/lwi2/php/new/imageRetriever.php?userID=" + userData.id + "Original");
		console.log('typeof: ' +  userData.id);
	} else{
		$('.jcrop-holder img').attr('src', "http://yatchium.com/lwi2/php/new/imageRetriever.php?userID=100000000Original");
		console.log('typeof: undefined');
	}
	  
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
		
		
		
		//jcrop_api.setOptions({ boxWidth: 450, boxHeight: 400 });
		//$('#target').Jcrop({ boxWidth: 450, boxHeight: 400 });
    }); 
	
	};
	
	
	$('#cropPictureLink').click(function(e) {
		console.log("cropPictureLink");
		if(typeof userData !== 'undefined'){
			$('#target').attr('src', "http://yatchium.com/lwi2/php/new/imageRetriever.php?userID=" + userData.id + "Original");
			$('.jcrop-holder img').attr('src', "http://yatchium.com/lwi2/php/new/imageRetriever.php?userID=" + userData.id + "Original");
		}
		jcrop_api.destroy();
		initJcrop();
		
		//$('.jcrop-holder img').attr('src', "http://yatchium.com/lwi2/php/new/imageRetriever.php?userID=" + userData.id + "Original");
        //
		//jcrop_api.setImage("http://yatchium.com/lwi2/php/new/imageRetriever.php?userID=" + userData.id + "Original");
		//jcrop_api.setSelect([xa, ya, xa + len, ya + len ]);
			
    });
	
	//$('#cropPictureLink').active(function(e) {
	//	//jcrop_api.setOptions("http://yatchium.com/lwi2/php/new/imageRetriever.php?userID=" + userData.id);
	//	//$('.jcrop-holder img').attr('src', "http://yatchium.com/lwi2/php/new/imageRetriever.php?userID=" + userData.id);
	//	$('#target').Jcrop({ boxWidth: 450, boxHeight: 400 });
	//});
		
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
	
	function CLog(){
		console.log("weiwoefhwoihfoiwehf");
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
	
	function makeCrop2() {
	//console.log("ID: " + userData.id);
	if(typeof userData == 'undefined'){
	console.log("ID: " + 100000000);
		var tmp = 100000000;
	} else{
		tmp = userData.id;
		console.log("ID: " + userData.id);
	}
	console.log("makeCropTest");
	var temp;
	temp += '<div class="container">																									\
			<div class="row">         																									\
			<div class="span12">      																									\
			<div class="jc-demo-box"> 																									\
			<div class="page-header">                                                													\
				<ul class="breadcrumb first">                                            													\
					<li><a href="../index.html">Jcrop</a> <span class="divider">/</span></li>													\
					<li><a href="../index.html">Demos</a> <span class="divider">/</span></li>													\
					<li class="active">Aspect Ratio with Preview Pane</li>																		\
				</ul>																														\
			<h1>Aspect Ratio with Preview Pane</h1>																						\
			</div>																														\
			<img id="target" src="http://yatchium.com/lwi2/php/new/imageRetriever.php?userID=100000000" alt="[Jcrop Example]" />								\
			<div id="preview-pane" style="position:relative; right:-110%;">																\
				<div class="preview-container" style="height:200px; width:200px; overflow: hidden;">                                      \
					<img id="jCropImage" src="tapmodo-Jcrop-1902fbc/demos/demo_files/sago.jpg" class="jcrop-preview" alt="Preview"/>      \
				</div>                                                                                                                    \
				<div style="height:200px; width:200px; top:200px; overflow:hidden;">                                                      \
					<img id="currentThumbnail" src="tapmodo-Jcrop-1902fbc/demos/demo_files/sago.jpg" alt="Current"/>                      \
				</div>                                                                                                                    \
			</div>	                                                                                                                      \
			<form action="cropTest.php" method="post" onsubmit="return checkCoords();">													\
				<input type="hidden" id="x" name="x" />																					\
				<input type="hidden" id="y" name="y" />																					\
				<input type="hidden" id="w" name="w" />																					\
				<input type="hidden" id="h" name="h" />																					\
				<input type="submit" value="Crop Image" class="btn btn-large btn-inverse" />											\
			</form>																														\
			<input type="button" onClick="changePicture()">																				\
		<div class="description">																										\
		<p>																																\
			<b>An example implementing a preview pane.</b>																				\
			Obviously the most visual demo, the preview pane is accomplished                  											\
			entirely outside of Jcrop with a simple jQuery-flavored callback.                 											\
			This type of interface could be useful for creating a thumbnail                   											\
			or avatar. The onChange event handler is used to update the                       											\
			view in the preview pane.																									\
		</p>                                                                                  											\
		</div>                                                                                											\
																																		\
		<div class="tapmodo-footer">                                                          											\
			<a href="http://tapmodo.com" class="tapmodo-logo segment">tapmodo.com</a>             											\
			<div class="segment"><b>&copy; 2008-2013 Tapmodo Interactive LLC</b><br />            											\
				Jcrop is free software released under <a href="../MIT-LICENSE.txt">MIT License</a>											\
			</div>																															\
		</div>																															\
		<div class="clearfix"></div> \
		</div>							\
		</div>							\
		</div>							\
		</div>';
    
		$('#cropTest').html(temp);		
		$('#cropTest').trigger('create');
		//$.mobile.changePage($('#cropTest'));
	}
	
	function changePicture() {
		//console.log("changePicture");
		//$('.jcrop-holder img').attr('src', "http://yatchium.com/lwi2/php/new/imageRetriever.php?userID=" + userData.id + 'Original');
		//$('.jcrop-holder img').attr('width', "500");
		////$('.jjcrop-tracker').Jcrop({ boxWidth: 450, boxHeight: 400 });
		////$("#target").attr('src',"http://yatchium.com/lwi2/php/new/imageRetriever.php?userID=" + userData.id);
		//$("#jCropImage").attr('src',"http://yatchium.com/lwi2/php/new/imageRetriever.php?userID=" + userData.id + 'Original');
		//$("#currentThumbnail").attr('src',"http://yatchium.com/lwi2/php/new/imageRetriever.php?userID=" + userData.id + "Original");
		
		//$('#target').Jcrop({ trueSize: [500,370] });
		
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
				url: 'http://yatchium.com/lwi2/php/new/cropThumb.php',
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
		updateHomeUserIcon();
	}