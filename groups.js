//	<script>
function displayOverlay(text) {
   $("<table id='overlay'><tbody><tr><td>" + text + "</td></tr></tbody></table>").css({
       "position": "fixed",
       "top": "46px",
       "left": 0,
       "width": "100px",
       "height": "40px",
       "background-color": "rgba(0,0,0,.5)",
       "z-index": 10000,
       "vertical-align": "middle",
       "text-align": "center",
       "color": "#fff",
       "font-size": "20px",
       "font-weight": "bold",
       "cursor": "wait"
   }).appendTo("body");

setTimeout(function (){
	removeOverlay();
}, 1000); 

}

function removeOverlay() {
	$("#overlay").remove();
}
//	</script>

function makeNewGroupPage(showView){
	temp = ''
	temp += '<div data-role="header">\
		<a data-rel="back" data-icon="back"></a> \
			<h1>New group</h1> \
		<a href="#home" data-icon="home"></a>\
	</div>\
	<form style="color:white">\
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
		//add new name to showView Names, Status, and People array
		groupData[showView + 'Names'].push(newGroup);
		groupData[showView + 'Status'].push(false);
		groupData[newGroup + showView + 'People']=new Array();
		
		//write and upload to server
		writeGroupnames();
		uploadGroupData();
		
		//put in local storage
		window.localStorage.setItem('groupData', JSON.stringify(groupData));
		
		//render side panels in homepage
		$("#showing").trigger("create");
		$("#viewing").trigger("create");
		
		//update Groups (plural) page
		showGroupSettingsFunction(showView);
		
		//update and go to the newly made group page
		makeshowingGroupPage(newGroup + showView + 'People', showView);
	} else{
		alert('Group already exists');
	}
}
	
//show group settings page
function showGroupSettingsFunction(showView){
	var temp="";
	var temp2 = "";
	console.log('MADE SHOWING GROUP SETTINGS');
	//temp += '<div data-role="page" id="groupsShowPage"> 
	
	//Whyyyyyyyyyyyyyyyyyy
	temp+=	'<header data-role="header">\
		<h1 class="ui-title" role="heading"> Edit'  + showView + 'ing groups</h1>\
		<div class="ui-btn-left" data-role="controlgroup" data-type="horizontal">\
			<a data-iconpos="notext" style="height:12px;" data-role="button" data-rel="back" data-icon="back"></a>\
		</div>\
		<div class="ui-btn-right" data-role="controlgroup" data-type="horizontal">\
			<a data-iconpos="notext" style="height:12px;" data-role="button" href="#home" data-icon="home"></a>\
			<a data-role="button" class="homePageUserIcon" data-role="button" href="#profile"></a>	\
		</div>\
	</header>';
	
	//temp = makeHeader('Edit'  + showView + 'ing groups');
	
	temp += "<a onClick='makeNewGroupPage(\"" + showView + "\")' data-role=\"button\" data-icon=\"plus\" \">New Group</a>";
	
	for (var i=groupData[showView + "Names"].length-1; i>=0;i--){
		temp += "<a  data-role=\"button\" onClick=\"makeshowingGroupPage('" + groupData[showView + "Names"][i]+showView+'People' + "', '" + showView + "')\" \">"+groupData[showView + "Names"][i]+"</a>";
		var tempName=groupData[showView + "Names"][i]+showView+'People';
	}
	
	$('#' + showView + 'ingGroupSettings').html(temp);		
	$('#' + showView + 'ingGroupSettings').trigger('create');
	$.mobile.changePage($('#' + showView + 'ingGroupSettings'));
}

function makeshowingGroupPage(groupName, showView){
	var temp = ' ';
	var temp2 = '';
	
	//header
	groupNameNoSpace = groupName.replace(/\s+/g, '');	
	
	//populate table with users in this showing group
	if(groupName == 'Everybody' + showView + 'People'){
		//temp = '<div data-role="page" id="' + groupNameNoSpace + showView + 'Page"> 
		
		
		//WHY CAN'T I GET RID OF THESE BOTTOM LINESSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS
		temp = '<div id="' + groupNameNoSpace + showView + 'Page" padding-bottom="3em">';
		temp +=  '<header data-role="header">\
		<h1 class="ui-title" role="heading">' + groupName.replace(showView + "People",'') + '</h1>\
		<div class="ui-btn-left" data-role="controlgroup" data-type="horizontal">\
			<a data-iconpos="notext" style="height:12px;" data-role="button" data-rel="back" data-icon="back"></a>\
		</div>\
		<div class="ui-btn-right" data-role="controlgroup" data-type="horizontal">\
			<a data-iconpos="notext" style="height:12px;" data-role="button" href="#home" data-icon="home"></a>\
			<a data-role="button" class="homePageUserIcon" data-role="button" href="#profile"></a>	\
		</div>\
		</header>';
		
//<<<<<<< HEAD
//		//console.log(temp);
//		temp = '<div id="' + groupNameNoSpace + showView + 'Page" padding-bottom="3em">';
//		temp += makeHeader(groupName.replace(showView + "People",''));
//		
//		temp += '<div data-role=\"main\" class=\"ui-content\">\
//					<h3>Search Friends</h3>\
//						<form class="ui-filterable">\
//							<input id="Everybody' + showView + 'People" data-type="search"> \
//						</form>\
//					<ul data-role="listview" data-inset="true" data-split-icon="arrow-r" data-filter="true" data-input="#Everybody' + showView + 'People">';
//		
//		
//		for (var j=0; j<groupData.EverybodyshowPeople.length;j++){			
//			temp += "<li data-filtertext=\"" + friendData['names'][j] + "\">\
//						<a class='everythingOrBody' onclick=\"openProfile2("+groupData.EverybodyshowPeople[j]+")\">\
//						<image width=\"80px\" height=\"80px\" src=\"" +imageRetrieverURL + groupData.EverybodyshowPeople[j] + "\">\
//						<h2>" + friendData['names'][j] + "</h2>\
//						<p>Will get their status</p>\
//						</a>\
//					</li>";
//=======
		//temp = '<div id="' + groupNameNoSpace + showView + 'Page" padding-bottom="3em"> \
		//			<div data-role="header" data-position="fixed" data-tap-toggle="false"> \
		//				<a data-rel="back" data-icon="back">Back</a> \
		//					<h1>' + groupName.replace(showView + 'People','') + '</h1> \
		//				<a href="#home" data-icon="home">home</a>	 \
		//			</div>';					
				
		temp += "<div data-role=\"main\" class=\"ui-content\">";				
		temp += "<h3>Search Friends</h3>";
		temp +=     '<form class="ui-filterable"> \
						<input id="Everybody' + showView + 'People" data-type="search"> \
					</form>';
		//temp += '<ul data-role="listview" data-filter="true" data-split-icon="arrow-r" data-inset="true" data-input="#' + groupNameNoSpace + 'Search" id="Everybody' + showView + 'People">';
		temp += '<ul data-role="listview" data-inset="true" data-split-icon="arrow-r" data-filter="true" data-input="#Everybody' + showView + 'People">';
		for (var j=0; j<groupData.EverybodyshowPeople.length;j++){
			temp += "<li data-filtertext=\"" + groupData.EverybodyshowPeopleName[j] + "\">";
			temp += "<a class='everythingOrBody' onclick=\"openProfile2("+groupData.EverybodyshowPeople[j]+")\">"

			temp += "<image width=\"80px\" height=\"80px\" src=\"" +imageRetrieverURL + groupData.EverybodyshowPeople[j] + "\">";
			temp += "<h2>" + groupData.EverybodyshowPeopleName[j] + "</h2>";
			temp += "<p>Will get their status</p>";
			temp += "</a>";
			//temp += "<a href=\"#\" data-icon=\"arrow-r\" data-theme=\"a\"></a>";
			temp += '</li>';
//>>>>>>> ed60caad2e98c19ffc6dd74213d1a890548c8a6f
		}
		temp += "</ul>";
		temp += "</div>";
	} else {
		//temp = '<div data-role="page" id="' + groupNameNoSpace + showView + 'Page">
		
		//UGHHH
		temp=	'<div id="' + groupNameNoSpace + showView + 'Page" padding-bottom="3em"> \
		<header data-role="header">\
		<h1 class="ui-title" role="heading">Edit ' + groupName.replace(showView + "People",'') + '</h1>\
		<div class="ui-btn-left" data-role="controlgroup" data-type="horizontal">\
			<a data-iconpos="notext" style="height:12px;" data-role="button" data-rel="back" data-icon="back"></a>\
		</div>\
		<div class="ui-btn-right" data-role="controlgroup" data-type="horizontal">\
			<a data-iconpos="notext" style="height:12px;" data-role="button" href="#home" data-icon="home"></a>\
			<a data-role="button" class="homePageUserIcon" data-role="button" href="#profile"></a>	\
		</div>\
		</header>';
		
		temp = '<div id="' + groupNameNoSpace + showView + 'Page" padding-bottom="3em">';
		temp += makeHeader(groupName.replace(showView + "People",''));
		
		
		temp+=	'<div class="ui-grid-a">\
					<div class="ui-block-a">\
						<a><button onClick="renameGroupPop(\'' + groupName + '\',\'' + showView + '\')"><FONT COLOR="">Rename Group</FONT></button></a>\
					</div>\
					<div class="ui-block-b">\
						<a><button class="deleteRed" onClick="deleteGroupPop(\'' + groupName + '\',\'' + showView + '\')"><FONT COLOR="">Delete Group</FONT></button></a>\
					</div>\
				</div>';
		
		//temp += "<h3>Search Friends</h3>";
		temp +=     '<form class="ui-filterable"> \
						<input placeholder="Search Friends" id="' + groupNameNoSpace + 'Search" data-type="search"> \
					</form>';
		temp += "<h3>Friends in " + groupName.replace(showView + "People",'') + "</h3>";		
		temp += '<ul data-role="listview" data-inset="true" data-filter="true" data-input="#' + groupNameNoSpace + 'Search">';
//<<<<<<< HEAD
//		
//		for (var j=0; j<groupData.EverybodyshowPeople.length;j++){
//			// see if the i'th member of Everybody is in the group in question
//			g = isIn(groupData.EverybodyshowPeople[j], groupData[groupName]);
//			
//			//if not, add at the end, else, the person is a member and add at the beginning
//			if(g[0] == true){
//				temp += makeFriendLi(j,true);	
//			} else {
//				temp2 += makeFriendLi(j,false); 
//			}
//		}
//		temp += "</ul>";
//		
//		temp += '<div class="ui-grid-solo"><h3>Add these people</h3></div>';
//		
//		temp += '<ul id="listView" data-role="listview" data-inset="true" data-filter="true" data-input="#' + groupNameNoSpace + 'Search">';
//		temp += temp2;
//		temp += "</ul>";
//		
//		temp += "<button onClick=\"showGroupSubmit('" + groupName + "','" + showView + "')\">Submit Changes</button>";
//		if(showView == 'view'){
//=======
	for (var j=0; j<groupData.EverybodyshowPeople.length;j++){
		// see if the i'th member of Everybody is in the group in question
		g = isIn(groupData.EverybodyshowPeople[j], groupData[groupName]);
		//if no, add at the end, else, the person is a member and add at the beginning
		if(g[0] == true){
			temp += "<li data-filtertext=\"" + groupData.EverybodyshowPeopleName[j] + "\">";
			temp += "<a class='selectedPerson' id=\"a" + groupNameNoSpace + j + "\" onClick=\"switchGroup('" + groupNameNoSpace + "'," + groupData.EverybodyshowPeople[j] + "," + j +")\">"

				temp += "<image width=\"80px\" height=\"80px\" src=\"" + imageRetrieverURL+ groupData.EverybodyshowPeople[j] + "\">";
				temp += "<h2><font color=\"\">" + groupData.EverybodyshowPeopleName[j] + "</font></h2>";
				temp += "<div id=\"" + groupNameNoSpace + j + "\" onClick=\"switchGroup('" + groupNameNoSpace + "'," + groupData.EverybodyshowPeople[j] + "," + j +")\">";
					temp += "<h3 id=\"Button" + groupNameNoSpace + j + "\" onClick=\"switchGroup('" + groupNameNoSpace + "'," + groupData.EverybodyshowPeople[j] + "," + j +")\" value = \"temp\"><font color=\"\">Member</font></h3>"
				temp += "</div>";
			temp += "</a>";
			temp += "<a class='selectedPerson' id=\"sideButton" + groupNameNoSpace + j + "\" href=\"#\" data-theme=\"a\" value=\"removedU\" onclick=\"openProfile2("+groupData.EverybodyshowPeople[j]+")\"></a>";
			temp += '</li>';
		} else {
			temp2 += "<li data-filtertext=\"" + groupData.EverybodyshowPeopleName[j] + "\">";
			temp2 += "<a class='unselectedPerson' id=\"a" + groupNameNoSpace + j + "\" onClick=\"switchGroup('" + groupNameNoSpace + "'," + groupData.EverybodyshowPeople[j] + "," + j +")\">"
				temp2 += "<image width=\"80px\" height=\"80px\" src=\"" + imageRetrieverURL + groupData.EverybodyshowPeople[j] + "\">";
				temp2 += "<h2><font color=\"\">" + groupData.EverybodyshowPeopleName[j] + "</font></h2>";
				temp2 += "<div id=\"" + groupNameNoSpace + j + "\" onClick=\"switchGroup('" + groupNameNoSpace + "'," + groupData.EverybodyshowPeople[j] + "," + j +")\">";
					temp2 += "<h3 data-filtertext='' id=\"Button" + groupNameNoSpace + j + "\" onClick=\"switchGroup('" + groupNameNoSpace + "'," + groupData.EverybodyshowPeople[j] + "," + j +")\" value = \"temp\"><font color=\"\">Add to group</font></h3>"
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
//>>>>>>> ed60caad2e98c19ffc6dd74213d1a890548c8a6f
			temp += "<a><button onClick=\"copyGroupToView('" + groupName + "','" + showView + "')\"><FONT COLOR=\"\">Copy Group to Showing</FONT></button></a>";
		} else if (showView == 'show'){
			temp += "<a><button onClick=\"copyGroupToView('" + groupName + "','" + showView + "')\"><FONT COLOR=\"\">Copy Group to Viewing</FONT></button></a>";
		} else{
			alert('something is wrong with copy group...');
		}
	}

	temp += '<div data-role="popup" data-transition="slideup" id="pop' + groupNameNoSpace + '" class="popupClass" data-position-to="window">\
			</div>';
	temp += '<div data-role="popup" data-transition="slideup" id="popRename' + groupNameNoSpace + '" class="popupClass" data-position-to="window">\
			</div>';	
	
	temp += "</div>";
	
	$('#' + showView + 'ingPages').html(temp);		
	$('#' + showView + 'ingPages').trigger('create');
	$.mobile.changePage($('#' + showView + 'ingPages'));
}

function makeFriendLi(j, tf){
	console.log('makeFriendLi');
	if(tf == true){
		cl = 'selectedPerson';
		gm = 'Member';
	} else{
		cl = 'unselectedPerson';
		gm = 'Add to group';
	}
	temp = "";
	temp += "<li data-filtertext=\"" + friendData['names'][j] + "\">";
			temp += "<a class='" + cl + "' id=\"a" + groupNameNoSpace + j + "\" onClick=\"switchGroup('" + groupNameNoSpace + "'," + groupData.EverybodyshowPeople[j] + "," + j +")\">"

				temp += "<image width=\"80px\" height=\"80px\" src=\"" + imageRetrieverURL+ groupData.EverybodyshowPeople[j] + "\">";
				temp += "<h2><font color=\"\">" + friendData['names'][j] + "</font></h2>";
				temp += "<div id=\"" + groupNameNoSpace + j + "\" onClick=\"switchGroup('" + groupNameNoSpace + "'," + groupData.EverybodyshowPeople[j] + "," + j +")\">";
					temp += "<h3 id=\"Button" + groupNameNoSpace + j + "\" onClick=\"switchGroup('" + groupNameNoSpace + "'," + groupData.EverybodyshowPeople[j] + "," + j +")\" value = \"temp\"><font color=\"\">" + gm + "</font></h3>"
				temp += "</div>";
			temp += "</a>";
			temp += "<a class='" + cl + "' id=\"sideButton" + groupNameNoSpace + j + "\" href=\"#\" data-theme=\"a\" value=\"removedU\" onclick=\"openProfile2("+groupData.EverybodyshowPeople[j]+")\"></a>";
			temp += '</li>';
	
	return temp;
}

function switchGroup(groupName, userID, j){

	groupNameNoSpace = groupName.replace(/\s+/g, '');
	
	$("#sideButton" + groupNameNoSpace + j).toggleClass('selectedPerson').toggleClass('unselectedPerson');
	$("#a" + groupNameNoSpace + j).toggleClass('selectedPerson').toggleClass('unselectedPerson');
	test = document.getElementById("Button" + groupNameNoSpace + j).innerHTML;
	
	if(test == '<font color=\"\">Member</font>'){
		document.getElementById("Button" + groupNameNoSpace + j).innerHTML ="<font color=\"\">Add to group</font>";
	} else{
		document.getElementById("Button" + groupNameNoSpace + j).innerHTML ="<font color=\"\">Member</font>";
	}

	$('#' + groupNameNoSpace + 'showPage').trigger('create');
}

function showGroupSubmit(groupName, showView){
	groupNameNoSpace = groupName.replace(/\s+/g, '');
	groupData[groupName] = [];
	for(i=0;i<groupData.EverybodyshowPeople.length;i++){
		if(document.getElementById("Button" + groupNameNoSpace + i).innerHTML == '<font color=\"\">Member</font>'){
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

function changeTag(newTag, indexOf){
	groupData.hashtagsNames[indexOf]=newTag;
	
	generateHashPage();
}

function makeHashPage(sortedHashtags, indexOf){
	var temp="All of Friends Tags \
					<div data-role=\"content\"> \
					<form class=\"ui-filterable\"> \
					<input id=\"myFilter\" data-type=\"search\" placeholder=\"Search for tags..\"> \
					</form> \
					<ul data-role=\"listview\" data-inset=\"true\"  data-filter=\"true\" data-input=\"#myFilter\"> "
  
	for(var i=0;i<sortedHashtags.tags.length;i++){
		var tempName= sortedHashtags.tags[i];
		temp+="<div>";
		temp+="<li> <a onclick=\"changeTag(\'"+tempName+"\', "+indexOf+")\" class=\"ui-btn ui-corner-all ui-shadow\">"+sortedHashtags.tags[i]+"</a> </li>";
		temp+="</div>";	
	}
	
	temp+="</ul> \
				</div>";
				
	$('#allHashTagsDiv').html(temp);
}

function generateAllHashPage(indexOf){
	var temp=groupData.viewStatus.slice();
	for(var i=0;i<temp.length;i++){
		temp[i]=false;
	}
	temp[0]=true;
							
	jQuery.support.cors = true;
	$.ajax({
		crossDomain: true,
		type: 'POST',
		url: getFriendsLocationURL,
		data: {'fid': userData.id, 'groupStatus': temp, 'AT': accessToken['accessToken']},
		dataType: 'json',
		success: function(data, status) {
			everybodyFriendsData=data;
			sortedHashtags=hashtagHistogram(everybodyFriendsData);
			
			makeHashPage(sortedHashtags, indexOf);
	
			$("#allHashtags").trigger("create");
			$.mobile.changePage($("#allHashtags"));
		},
		error: function(xhr, desc, err) {
		console.log(xhr);
		console.log("Details: " + desc + "\nError:" + err);
		}
	}); // end ajax call
}

function generateHashPage(){
	var temp="Hashtag List \
					<div data-role=\"content\"> \
					<ul data-role=\"listview\" data-inset=\"true\" id=\"sortable\">";
  
	for(var i=0;i<groupData.hashtagsNames.length;i++){
		temp+="<div>";
		temp+="<li> <a onclick=\"generateAllHashPage("+i+")\" class=\"ui-btn ui-corner-all ui-shadow\">"+groupData.hashtagsNames[i]+"</a> </li>";
		temp+="</div>";	
	}
	
	temp+="</ul> \
				</div>";
  
	$('#hashTagsDiv').html(temp);

$("#sortable").on("sortstart", function( event, ui ){
    var start_pos = ui.item.index();
    ui.item.data('start_pos', start_pos);
});

$("#sortable").on( "sortupdate", function( event, ui ){
	var start_pos = ui.item.data('start_pos');
    var end_pos = ui.item.index();
	
	var tempData=groupData.hashtagsNames[end_pos];
	groupData.hashtagsNames[end_pos]=groupData.hashtagsNames[start_pos];
	groupData.hashtagsNames[start_pos]=tempData;

	tempData=groupData.hashtagsStatus[end_pos];
	groupData.hashtagsStatus[end_pos]=groupData.hashtagsStatus[start_pos];
	groupData.hashtagsStatus[start_pos]=tempData;	
});
	
	$("#setHashtags").trigger("create");
	$.mobile.changePage($("#setHashtags"));
}

function addToStatus(index){
	var left = 140 - $('#statusBox').val().length;
	
	if(groupData.hashtagsNames[index].length+2<left)
		$('#statusBox').val($('#statusBox').val() + ' '+groupData.hashtagsNames[index]+' ');
	
	$('#statusBox').keyup();
}

function generateSetStatusPage(){
	
	console.log("making Status page");
  
	var temp="Hashtag List";
	for(var i=0;i<groupData.hashtagsNames.length;i++){
		temp+="<div>";
		temp+="<li> <a onclick=\"addToStatus("+i+")\" class=\"ui-btn ui-corner-all ui-shadow\">"+groupData.hashtagsNames[i]+"</a> </li>";
		temp+="</div>";	
	}
				
	$('#statusHashtagList').html(temp);
	
	$.mobile.changePage($("#setStatus"));
}

$('#statusBox').keyup(function () {
    var left = 140 - $(this).val().length;

    $('#text_counter').text('Characters left: ' + left);
});