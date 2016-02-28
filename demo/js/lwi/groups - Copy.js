function makeNewGroupPage(showView){
	temp = ''
	temp += '<div data-role="header">\
		<a data-rel="back" data-icon="back">Back</a> \
			<h1>New group</h1> \
		<a href="#home" data-icon="home">home</a>\
	</div>\
	<form>\
		New group name: <input type="text" name="newGroupName"><br>\
		<input type="button" value="Add Group" onClick="addGroupLocalStorage(this.form, \''+ showView + '\')">\
	</form>';
	$('#addUserLocalStorage').html(temp);		
	$('#addUserLocalStorage').trigger('create');
	$.mobile.changePage($("#addUserLocalStorage"));
}

function showTest(){
$("#showing").trigger("create");
}

function viewTest(){
$("#viewing").trigger("create");
}

// Make new group
// #addUserLocalStorage
function addGroupLocalStorage(form, showView){
	var newGroup = form.newGroupName.value;
	console.log('add group local storage');
    
	if(isIn(newGroup, groupData[showView + 'Names'])[0] != true){
		groupData[showView + 'Names'].push(newGroup);
		groupData[showView + 'Status'].push(false);
		groupData[newGroup + showView + 'People']=new Array();
		writeGroupnames();
		uploadGroupData();
		window.localStorage.setItem('groupData', JSON.stringify(groupData));
		$("#showing").trigger("create");
		$("#viewing").trigger("create");
		showGroupSettingsFunction(showView);
		//window.history.back();
		
		makeshowingGroupPage(newGroup + showView + 'People', showView);
	} else{
		alert('Group already exists');
	}
}
	
//show group settings page
function showGroupSettingsFunction(showView){
	var temp="";
	console.log('MADE SHOWING GROUP SETTINGS');
	//temp += '<div data-role="page" id="groupsShowPage"> 
	temp +=		'<div data-role="header"> \
					<a data-rel="back" data-icon="back">Back</a> \
						<h1>Edit ' + showView + 'ing groups</h1> \
					<a href="#home" data-icon="home">home</a>	 \
				</div>';
	//temp += "<a href=\"#addUserLocalStorage\" data-role=\"button\" data-icon=\"plus\" \">New Group</a>";
	temp += "<a onClick='makeNewGroupPage(\"" + showView + "\")' data-role=\"button\" data-icon=\"plus\" \">New Group</a>";
	
	if(showView == 'show'){
		for (var i=groupData.showNames.length-1; i>=0;i--){
			temp += "<a  data-role=\"button\" onClick=\"makeshowingGroupPage('" + groupData.showNames[i]+showView+'People' + "', '" + showView + "')\" \">"+groupData.showNames[i]+"</a>";
			var tempName=groupData.showNames[i]+showView+'People';
		}
	}
	else if(showView == 'view'){
		for (var i=groupData.viewNames.length-1; i>=0;i--){
			temp += "<a  data-role=\"button\" onClick=\"makeshowingGroupPage('" + groupData.viewNames[i]+showView+'People' + "', '" + showView + "')\" \">"+groupData.viewNames[i]+"</a>";
			var tempName=groupData.viewNames[i]+showView+'People';
		}
	} else{
		alert('showView is neither show nor view how this happen?');
	}
	
	$('#' + showView + 'ingGroupSettings').html(temp);		
	$('#' + showView + 'ingGroupSettings').trigger('create');
	$.mobile.changePage($('#' + showView + 'ingGroupSettings'));
}

function OnImageLoad(evt) {

    var img = evt.currentTarget;

    // what's the size of this image and it's parent
    var w = $(img).width();
    var h = $(img).height();
    var tw = $(img).parent().width();
    var th = $(img).parent().height();
	//var tw = 80;
	//var th = 80;
	
	
	console.log("w: " + w + ", h: " + h + ", tw: " + tw + ", th: " + tw);

    // compute the new size and offsets
    var result = ScaleImage(w, h, tw, th, false);

    // adjust the image coordinates and size
    img.width = result.width;
    img.height = result.height;
    $(img).css("left", result.targetleft);
    $(img).css("top", result.targettop);
}

function ScaleImage(srcwidth, srcheight, targetwidth, targetheight, fLetterBox) {

    var result = { width: 0, height: 0, fScaleToTargetWidth: false };

    if ((srcwidth <= 0) || (srcheight <= 0) || (targetwidth <= 0) || (targetheight <= 0)) {
        return result;
    }

    // scale to the target width
    var scaleX1 = targetwidth;
    var scaleY1 = (srcheight * targetwidth) / srcwidth;

    // scale to the target height
    var scaleX2 = (srcwidth * targetheight) / srcheight;
    var scaleY2 = targetheight;

    // now figure out which one we should use
    var fScaleOnWidth = (scaleX2 > targetwidth);
    if (fScaleOnWidth) {
        fScaleOnWidth = fLetterBox;
    }
    else {
       fScaleOnWidth = !fLetterBox;
    }

    if (fScaleOnWidth) {
        result.width = Math.floor(scaleX1);
        result.height = Math.floor(scaleY1);
        result.fScaleToTargetWidth = true;
    }
    else {
        result.width = Math.floor(scaleX2);
        result.height = Math.floor(scaleY2);
        result.fScaleToTargetWidth = false;
    }
    result.targetleft = Math.floor((targetwidth - result.width) / 2);
    result.targettop = Math.floor((targetheight - result.height) / 2);

    return result;
}

function makeshowingGroupPage(groupName, showView){
	//var tempFriends = [];
	//var tempIndex = [];
	var temp;
	var temp2 = '';
	
	//header
	groupNameNoSpace = groupName.replace(/\s+/g, '');

	//$('#' + showView + 'ingPages').html('');	
	
	//populate table with users in this showing group
	if(groupName == 'Everybody' + showView + 'People'){
		//temp = '<div data-role="page" id="' + groupNameNoSpace + showView + 'Page"> 
		temp = '<div id="' + groupNameNoSpace + showView + 'Page" padding-bottom="3em"> \
					<div data-role="header" data-position="fixed" data-tap-toggle="false"> \
						<a data-rel="back" data-icon="back">Back</a> \
							<h1>' + groupName.replace(showView + 'People','') + '</h1> \
						<a href="#home" data-icon="home">home</a>	 \
					</div>';					
				
		temp += "<div data-role=\"main\" class=\"ui-content\">";				
		temp += "<h3>Search Friends</h3>";
		temp +=     '<form class="ui-filterable"> \
						<input id="Everybody' + showView + 'People" data-type="search"> \
					</form>';
		//temp += '<ul data-role="listview" data-filter="true" data-split-icon="arrow-r" data-inset="true" data-input="#' + groupNameNoSpace + 'Search" id="Everybody' + showView + 'People">';
		temp += '<ul data-role="listview" data-inset="true" data-split-icon="arrow-r" data-filter="true" data-input="#Everybody' + showView + 'People">';
		for (var j=0; j<groupData.EverybodyshowPeople.length;j++){
			temp += "<li data-filtertext=\"" + friendData['names'][j] + "\">";
			temp += "<a onclick=\"openProfile2("+groupData.EverybodyshowPeople[j]+")\">"

			temp += "<image width=\"80px\" height=\"80px\" src=\"http://yatchium.com/lwi2/php/new/imageRetriever.php?userID=" + groupData.EverybodyshowPeople[j] + "\">";
			temp += "<h2>" + friendData['names'][j] + "</h2>";
			temp += "<p>Will get their status</p>";
			temp += "</a>";
			//temp += "<a href=\"#\" data-icon=\"arrow-r\" data-theme=\"a\"></a>";
			temp += '</li>';
		}
		temp += "</ul>";
		temp += "</div>";
	} else {
		//temp = '<div data-role="page" id="' + groupNameNoSpace + showView + 'Page">
		temp = '<div id="' + groupNameNoSpace + showView + 'Page" padding-bottom="3em"> \
				<div data-role="header" data-position="fixed" data-tap-toggle="false"> \
					<a data-rel="back" data-icon="back">Back</a> \
						<h1>Edit ' + groupName.replace(showView + "People",'') + '</h1> \
					<a href="#home" data-icon="home">home</a>	 \
				</div>';			
		
		temp+='<div class="ui-grid-a">\
				<div class="ui-block-a">';
		temp+= 		"<a><button onClick=\"renameGroupPop('" + groupName + "','" + showView + "')\"><FONT COLOR=\"black\">Rename Group</FONT></button></a>";
		temp+=	'</div>';
		temp+=	'<div class="ui-block-b">';
		temp += 	"<a><button class=\"deleteRed\" onClick=\"deleteGroupPop('" + groupName + "','" + showView + "')\"><FONT COLOR=\"black\">Delete Group</FONT></button></a>";
		temp+=	'</div>';			
		temp+='</div>';
		
		//temp += "<h3>Search Friends</h3>";
		temp +=     '<form class="ui-filterable"> \
						<input placeholder="Search Friends" id="' + groupNameNoSpace + 'Search" data-type="search"> \
					</form>';
		
		temp += "<h3>Friends in " + groupName.replace(showView + "People",'') + "</h3>";		
		
		temp += '<ul data-role="listview" data-inset="true" data-filter="true" data-input="#' + groupNameNoSpace + 'Search">';
	for (var j=0; j<groupData.EverybodyshowPeople.length;j++){
		// see if the i'th member of Everybody is in the group in question
		g = isIn(groupData.EverybodyshowPeople[j], groupData[groupName]);
		//if no, add at the end, else, the person is a member and add at the beginning
		if(g[0] == true){
			temp += "<li data-filtertext=\"" + friendData['names'][j] + "\">";
			temp += "<a class='selectedPerson' id=\"a" + groupNameNoSpace + j + "\" onClick=\"switchGroup('" + groupNameNoSpace + "'," + groupData.EverybodyshowPeople[j] + "," + j +")\">"

				temp += "<image width=\"80px\" height=\"80px\" src=\"http://yatchium.com/lwi2/php/new/imageRetriever.php?userID=" + groupData.EverybodyshowPeople[j] + "\">";
				temp += "<h2><font color=\"black\">" + friendData['names'][j] + "</font></h2>";
				temp += "<div id=\"" + groupNameNoSpace + j + "\" onClick=\"switchGroup('" + groupNameNoSpace + "'," + groupData.EverybodyshowPeople[j] + "," + j +")\">";
					temp += "<h3 id=\"Button" + groupNameNoSpace + j + "\" onClick=\"switchGroup('" + groupNameNoSpace + "'," + groupData.EverybodyshowPeople[j] + "," + j +")\" value = \"temp\"><font color=\"black\">Member</font></h3>"
				temp += "</div>";
			temp += "</a>";
			temp += "<a class='selectedPerson' id=\"sideButton" + groupNameNoSpace + j + "\" href=\"#\" data-theme=\"a\" value=\"removedU\" onclick=\"openProfile2("+groupData.EverybodyshowPeople[j]+")\"></a>";
			temp += '</li>';
		} else {
			temp2 += "<li data-filtertext=\"" + friendData['names'][j] + "\">";
			temp2 += "<a class='unselectedPerson' id=\"a" + groupNameNoSpace + j + "\" onClick=\"switchGroup('" + groupNameNoSpace + "'," + groupData.EverybodyshowPeople[j] + "," + j +")\">"
				temp2 += "<image width=\"80px\" height=\"80px\" src=\"http://yatchium.com/lwi2/php/new/imageRetriever.php?userID=" + groupData.EverybodyshowPeople[j] + "\">";
				temp2 += "<h2><font color=\"black\">" + friendData['names'][j] + "</font></h2>";
				temp2 += "<div id=\"" + groupNameNoSpace + j + "\" onClick=\"switchGroup('" + groupNameNoSpace + "'," + groupData.EverybodyshowPeople[j] + "," + j +")\">";
					temp2 += "<h3 data-filtertext='' id=\"Button" + groupNameNoSpace + j + "\" onClick=\"switchGroup('" + groupNameNoSpace + "'," + groupData.EverybodyshowPeople[j] + "," + j +")\" value = \"temp\"><font color=\"black\">Add to group</font></h3>"
				temp2 += "</div>";
			temp2 += "</a>";
			temp2 += "<a class='unselectedPerson' id=\"sideButton" + groupNameNoSpace + j + "\" href=\"#\" data-theme=\"a\" value=\"removedU\" onclick=\"openProfile2("+groupData.EverybodyshowPeople[j]+")\"></a>";
			temp2 += '</li>';
}
	}
	temp += "</ul>";
	
	temp += '<div class="ui-grid-solo"><h3>Add these people</h3></div>';
	
	temp += '<ul id="listView" data-role="listview" data-inset="true" data-filter="true" data-input="#' + groupNameNoSpace + 'Search">';
	temp += temp2;
	temp += "</ul>";
	
	temp += "<button onClick=\"showGroupSubmit('" + groupName + "','" + showView + "')\">Submit Changes</button>";
	if(showView == 'view'){
			temp += "<a><button onClick=\"copyGroupToView('" + groupName + "','" + showView + "')\"><FONT COLOR=\"white\">Copy Group to Showing</FONT></button></a>";
		} else if (showView == 'show'){
			temp += "<a><button onClick=\"copyGroupToView('" + groupName + "','" + showView + "')\"><FONT COLOR=\"white\">Copy Group to Viewing</FONT></button></a>";
		} else{
			alert('something is wrong with copy group...');
		}
	}
		//temp += "<a><button onClick=\"deleteGroupPop('" + groupName + "','" + showView + "')\"><FONT COLOR=\"red\">Delete Group</FONT></button></a>";
		//temp += "<a><button onClick=\"renameGroupPop('" + groupName + "','" + showView + "')\"><FONT COLOR=\"blue\">Rename Group</FONT></button></a>";

	
	temp += '<div data-role="popup" data-transition="slideup" id="pop' + groupNameNoSpace + '" class="popupClass" data-position-to="window">\
			</div>';
	temp += '<div data-role="popup" data-transition="slideup" id="popRename' + groupNameNoSpace + '" class="popupClass" data-position-to="window">\
			</div>';	
	
	temp += "</div>";
	
	//temp += '<div data-role="footer" data-position="fixed" data-tap-toggle="false"> \
	//			<h1>Footer</h1> \
	//		</div>';	
	
	$('#' + showView + 'ingPages').html(temp);		
	$('#' + showView + 'ingPages').trigger('create');
	$.mobile.changePage($('#' + showView + 'ingPages'));
}

$('li').hover( 
  function() {
    $(this)
      .css('color','blue')
      .animate({'color': 'red'}, 400);
  },
  function() {
    $(this)
      .animate({'color': 'blue'}, 400);
  }
);

function switchGroup(groupName, userID, j){

	groupNameNoSpace = groupName.replace(/\s+/g, '');
	test = document.getElementById("Button" + groupNameNoSpace + j).innerHTML;
	if(test == '<font color=\"white\">Member</font>'){
		document.getElementById("Button" + groupNameNoSpace + j).innerHTML ="<font color=\"white\">Add to group</font>";
		$("#a" + groupNameNoSpace + j).removeClass('selectedPerson').addClass('unselectedPerson');
		$("#sideButton" + groupNameNoSpace + j).removeClass('selectedPerson').addClass('unselectedPerson');
	} else{
		document.getElementById("Button" + groupNameNoSpace + j).innerHTML ="<font color=\"white\">Member</font>";
		$("#a" + groupNameNoSpace + j).removeClass('unselectedPerson').addClass('selectedPerson');
		$("#sideButton" + groupNameNoSpace + j).removeClass('unselectedPerson').addClass('selectedPerson');
	}

	$('#' + groupNameNoSpace + 'showPage').trigger('create');
}

function showGroupSubmit(groupName, showView){
	groupNameNoSpace = groupName.replace(/\s+/g, '');
	groupData[groupName] = [];
	for(i=0;i<groupData.EverybodyshowPeople.length;i++){
		if(document.getElementById("Button" + groupNameNoSpace + i).innerHTML == '<font color=\"white\">Member</font>'){
			groupData[groupName].push(groupData.EverybodyshowPeople[i]);
		}
	}	
	uploadGroupData();
	window.localStorage.setItem( 'groupData', JSON.stringify(groupData));
	$('#showingPages').trigger('create');
	$.mobile.changePage($("#" + showView + "ingGroupSettings"));
}

function deleteGroupPop(groupName, showView){
	groupNameNoSpace = groupName.replace(/\s+/g, '');
	temp = '<p>Are you sure you want to delete ' + groupName.replace(showView + 'People','') + '?</p><br>';
	temp += '<ul data-role=\"listview\"><li><button type="button" data-theme="c" onclick="deleteGroup(\'' +  groupName + '\',\'' + showView + '\')" class="custom">Yes</button></li></ul>\
			<ul data-role=\"listview\"><li><button type="button" data-theme="c" onClick="window.history.back()" class="custom">No</button></li></ul>';
	
	document.getElementById('pop' + groupNameNoSpace).innerHTML =  temp;
	$('#pop' + groupNameNoSpace).trigger('create');
	$('#pop' + groupNameNoSpace).popup("open");
}

function deleteGroup(groupName, showView){
	console.log('delete ' + groupName);
	delete groupData[groupName];
	groupName = groupName.replace(showView + 'People','');
	
	for(i=0;i<groupData[showView + "Names"].length;i++){
		if(groupData[showView + "Names"][i] == groupName){
			groupData[showView + "Names"].splice(i, 1);
			groupData[showView + "Status"].splice(i, 1);
		}
	}
	writeGroupnames();
	uploadGroupData();
	//$("#" + showView + "ing").trigger("create");
	$("#showing").trigger("create");
	$("#viewing").trigger("create");
	window.localStorage.setItem('groupData', JSON.stringify(groupData));
	showGroupSettingsFunction(showView);
	$.mobile.changePage($("#showingGroupSettings"));
}

function renameGroupPop(groupName, showView){
	groupNameNoSpace = groupName.replace(/\s+/g, '');
	
		temp = 	'<form> \
					Rename group: <input type="text" name="renameGroupForm"><br> \
					<input type="button" value="Rename group" onClick="renameGroup(this.form,\'' + groupName + '\',\'' + showView + '\')"> \
				</form>';
		
	document.getElementById('popRename' + groupNameNoSpace).innerHTML =  temp;
	$('#popRename' + groupNameNoSpace).trigger('create');
	$('#popRename' + groupNameNoSpace).popup("open");
}

//////////////////////////////////////////////////////////////
function renameGroup(form, groupName, showView){
	var renameGroupForm = form.renameGroupForm.value;
	if(isIn(renameGroupForm, groupData[showView + 'Names'])[0] != true){
	
		// push new group names
		groupData[showView + 'Names'].push(renameGroupForm);
		
		// push new group show/view people
		groupData[renameGroupForm + showView + 'People'] = new Array();
		
		// copy from old to new array
		groupData[renameGroupForm + showView + 'People'] = groupData[groupName];
		
		// push status
		groupData[showView + 'Status'].push(groupData[showView + 'Status'][isIn(groupName.replace(showView + 'People', ''), groupData[showView + 'Names'])[1]]);

		// delete old group
		delete groupData[groupName];		
		groupData[showView + 'Status'].splice(isIn(groupName.replace(showView + 'People', ''), groupData[showView + 'Names'])[1], 1);
		groupData[showView + 'Names'].splice(isIn(groupName.replace(showView + 'People', ''), groupData[showView + 'Names'])[1], 1);
		
		/////////////////////////////////////////////////////////
		//change to options page since last page is now deleted//
		//will figure out how to delete last page history later//
		/////////////////////////////////////////////////////////
		//$.mobile.changePage($("#options"));
		/////////////////////////////////////////////////////////
		
		showGroupSettingsFunction(showView);
		makeshowingGroupPage(renameGroupForm + showView + 'People', showView);
		writeGroupnames();
		uploadGroupData();
		$("#showing").trigger("create");
		$("#viewing").trigger("create");
		window.localStorage.setItem('groupData', JSON.stringify(groupData));
	} else{
		alert('Group already exists');
	}
}

function copyGroupToView(groupName, showView){
	if(showView == 'view'){
		tempShowView = 'show';
	} else if (showView == 'show'){
		tempShowView = 'view';
	}
	tempGroupName = groupName.replace(showView + 'People', '');
	if(isIn(tempGroupName, groupData[tempShowView + 'Names'])[0] != true){
		groupData[tempShowView + 'Names'].push(tempGroupName);
		groupData[tempGroupName + tempShowView + 'People'] = new Array();
		groupData[tempGroupName + tempShowView + 'People'] = groupData[groupName];
		groupData[tempShowView + 'Status'].push(groupData[showView + 'Status'][isIn(groupName.replace(showView + 'People', ''), groupData[showView + 'Names'])[1]]);
		
		/////////////////////////////////////////////////////////
		//change to options page since last page is now deleted//
		//will figure out how to delete last page history later//
		/////////////////////////////////////////////////////////
		//$.mobile.changePage($("#options"));
		/////////////////////////////////////////////////////////
		
		showGroupSettingsFunction(tempShowView);
		makeshowingGroupPage(tempGroupName + tempShowView + 'People', tempShowView);
		writeGroupnames();
		uploadGroupData();
		$("#showing").trigger("create");
		$("#viewing").trigger("create");
		window.localStorage.setItem('groupData', JSON.stringify(groupData));
	} else{
		alert('Group already exists');
	}
}

// is a in b?
function isIn(a,b){
	var isInT;
	var c;
	for(i=0;i<b.length;i++){
		if(a == b[i]){
			isInT = true;
			c = i;
			i = b.length;
		}
	}
	return [isInT, c];
}