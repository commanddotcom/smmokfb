/*
chrome-extension://ihodndohmjhemnekpjehhdebcldfcmcp
*/	
function extensionBadge(status) {
	if (status) {
		chrome.browserAction.setBadgeText({text: 'online'});
		chrome.browserAction.setBadgeBackgroundColor({color: [12, 127, 0, 255]});
	} else {
		chrome.browserAction.setBadgeText({text: 'X'});
		chrome.browserAction.setBadgeBackgroundColor({color: [221, 15, 1, 255]});
	}
}

function showAjax() {
	$('#ajax').show();
}

function hideAjax() {
	$('#ajax').hide();
}

function showError(errorText) {
	$('#error .error-body').html(errorText);
	$('#error').show();
}
	
function closeError() {
	$('#error .error-body').html('');
	$('#error').hide();
}

function showSuccess(successText) {
	$('#success .success-body').html(successText);
	$('#success').show();
}

var App = function() {

	var _tpl;
	
	var validationUrl = function(link){
		
	}
	
	var CampaignForm = {
		actionUrl: null,
		fnInit: function() {
			CampaignForm.actionUrl = decodeURIComponent(getUrlVars()["url"]);
			var $actionUrl = $('input[name="action_url"]');
			$actionUrl.val(CampaignForm.actionUrl);
			$actionUrl.get(0).scrollLeft = $actionUrl.get(0).scrollWidth;
			
			$('#page').on('change', '#title_as_url', function() {
				CampaignForm.triggerTitleCheckbox();
			});
			CampaignForm.triggerTitleCheckbox();
	
			CampaignForm.getActionTypes();
			CampaignForm.getFilters();
			setTimeout(hideAjax, 1000);
		},
		triggerTitleCheckbox: function() {
			var chBox = $('#title_as_url');
			var input = $('input[name="campaing_title"]');
			if (chBox.is(':checked')) {
				input.val($('input[name="action_url"]').val());
				$('#row-title').hide();
			} else {
				$('#row-title').show();
				input.val('');
			}
		},
		getFilters: function() {
			$.getJSON( $_http + '://'+ $_host +'/api/getFilters', function( json ) {
				$.each(json.respond, function (i, filter) {
					$('select[fid="'+i+'"] option').remove();
					for(key in filter) {
						$('select[fid="'+i+'"]').append($('<option>', { 
							value: key,
							text : filter[key] 
						}));
					}
				});
			});	
		},
		submit: function() {
			showAjax();
			$.ajax({
				method: "POST",
				url: $_http + '://'+ $_host +'/api/addCampaign',
				data: $('#page form').serialize(),
				dataType: 'json',
				success: function(json) {
					if (json.status == 400) {
						showError(json.error);
					}
					if (json.status == 200) {
						showSuccess('Кампания успешно создана. У Вас на балансе осталось '+json.respond.user_balance +' RUB');
					}
					setTimeout(hideAjax, 500);
				},
				error: function(error) {
					console.log(error);
					hideAjax();
				}
			});
		},
		getActionTypes: function() {
			$.getJSON( $_http + '://'+ $_host +'/api/getActionTypes', function( json ) {
				$('select[name="action_type"] option').remove();
				$.each(json.respond, function (i, item) {
					$('select[name="action_type"]').append($('<option>', { 
						value: item.value,
						text : item.name 
					}));
				});
				contentType = CampaignForm.defineContentType(CampaignForm.actionUrl);
				if (contentType == 'post') {
					$('select[name="action_type"]').val('post_like');
				}
				if (contentType == 'comment') {
					$('select[name="action_type"]').val('n_comment_like');
				}
				if (contentType == 'user') {
					$('select[name="action_type"]').val('n_add_friends');
				}
			});	
		},
		
		defineContentType: function(link) {
			if (link.indexOf('comment_id=') !== -1) {
				return 'comment';
			}
			if (link.indexOf('/permalink/') !== -1) {
				return 'post';
			}
			if (link.indexOf('/posts/') !== -1) {
				return 'post';
			}
			if (link.indexOf('/videos/') !== -1) {
				return 'post';
			}
			if (link.indexOf('/permalink.php') !== -1) {
				return 'post';
			}
			if (link.indexOf('/photo.php') !== -1) {
				return 'post';
			}
			if (link.indexOf('story_fbid=') !== -1) {
				return 'post';
			}
			if (link.indexOf('fbid=') !== -1) {
				return 'post';
			}
			if (link.indexOf('/profile.php?id=') !== -1) {
				return 'user';
			}
		}
	}
		
	var fnCard = function() {
		showAjax();
		$.ajax({
			method: "POST",
			url: $_http + '://'+ $_host +'/api/getAccountDetails',
			dataType: 'json',
			success: function(json) {
				if (json.status == 200) {
					json.respond.name = '<a href="#" id="btn-account">'+json.respond.name+'</a>';
					json.respond.discount += ' %';
					json.respond.customer_balance += ' RUB <a id="btn-deposit" href="#" class="btn btn-default btn-xs pull-right">Пополнить</a>';
					
					for(key in json.respond) {
						if ($('#'+key).length > 0) {
							$('#'+key).html(json.respond[key]);
						}
					}
				}
				setTimeout(hideAjax, 500);
			},
			error: function(error) {
				console.log(error);
				hideAjax();
			}
		});
	};
	
	var fnIsLogged = function(callback_true, callback_false) {
		showAjax();
		$.getJSON( $_http + '://'+ $_host +'/api/isLoggedIn', function( json ) {
			json.respond ? callback_true() : callback_false();
			extensionBadge(json.respond);
		});	
	}
	
	var _loadTpl = function(params) {
		$("#page").html(Mustache.render(_tpl.find(params.selector).html()));
	}
	
	var fnInit = function(templates, params) {
		_tpl = templates;
		fnIsLogged(
			function() {
				_loadTpl({selector: params.tpl});
				params.callback();
			}, 
			function() {
				_loadTpl({selector:'#tpl_loginPage'});
				hideAjax();
			}
		);
	}
	
	return {
		initChromeModule: fnInit,
		initCampaignForm: CampaignForm.fnInit,
		initCard: fnCard,
		submitAddCampaign: CampaignForm.submit
	}
}