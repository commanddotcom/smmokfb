var wid;

var startCampaign = function(a) {
	if (typeof wid !== 'undefined') {
		chrome.windows.remove(wid);
	} 
	chrome.windows.create({
		'url': 'popup.html?url='+ encodeURIComponent(a.linkUrl), 
		'type': 'popup', 
		'width': 355,
		'focused': true,
		'height': 585
	}, function(chromeWindow) {
		wid = chromeWindow.id;
	});
}

chrome.contextMenus.create({
	title: "Запустить кампанию SMMOK",
	contexts: ["link"],
	onclick: startCampaign
});

setInterval(function() {
	$.getJSON( $_http + '://'+ $_host +'/api/isLoggedIn', function( json ) {
		extensionBadge(json.respond);
	});	
}, 1000 * 60);
