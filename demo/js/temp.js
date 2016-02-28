    function temp() {
    	temp1 = '<div data-role="header"> \
    				<a data-rel="back" data-icon="back">Back</a> \
    					<h1>Header</h1> \
    				<a href="#home" data-icon="home">home</a> \
    			</div>';
    	
    	temp1 +='<div data-role="footer" data-tap-toggle="false"> \
    				<h1>Footer</h1> \
    			</div>';
    			
    	$('#page2').html(temp1);		
    	$('#page2').trigger('create');
    	$.mobile.changePage($('#page2'));
    }