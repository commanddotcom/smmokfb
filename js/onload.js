function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
	function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}
		
window.onload = function() {

	$u = new App;
	
	showAjax();
	
	if (typeof getUrlVars()["url"] === 'string') {
	
		$("#templates").load("tpl.html",function(){
			$u.initChromeModule($(this), {
				tpl: '#tpl_addCampaign', 
				callback: $u.initCampaignForm
			});
		});
		
		$('#page').on('click', '#btn-action_url', function() {
			chrome.tabs.create({url: $('input[name="action_url"]').val() });
		});	
		
		$('#page').on('click', 'a[role="submit"]', function() {
			$u.submitAddCampaign();
		});	
		
	} else {
	
		$("#templates").load("tpl.html",function(){
			$u.initChromeModule($(this), {
				tpl: '#tpl_accountPage', 
				callback: $u.initCard
			});
		});
		
		$('#page').on('click', '#btn-deposit', function() {
			chrome.tabs.create({url: 'http://'+ $_host +'/deposit/index'});
		});
		
		$('#page').on('click', '#btn-account', function() {
			chrome.tabs.create({url: 'http://'+ $_host +'/person/index'});
		});
		
		$('#page').on('click', '#btn-logout', function() {
			showAjax();
			var url = 'http://'+ $_host +'/welcome/logout';
			$.get( url, function( data ) {
				$u.initChromeModule($("#templates"), {
					tpl: '#tpl_accountPage', 
					callback: $u.initCard
				});
			});		
		});
	}
	
	
	$('#error').on('click', '#btn-close', function() {
		closeError();
	});
	
	$('#success').on('click', '#btn-remove', function() {
		window.close();
	});
	
	$('#page').on('click', '#btn-close', function() {
		window.close();
	});
	
	$('#page').on('click', '#btn-help', function() {
		chrome.tabs.create({url: 'http://'+ $_host +'/blog/smm_chrome_extension'});
	});
	
	$('#page').on('click', '#btn-login', function() {
		chrome.tabs.create({url: 'http://'+ $_host +'/welcome/email_login'});
		window.close();
	});

}