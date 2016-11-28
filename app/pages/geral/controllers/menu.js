define([], function() {
	var _menu = [
	             {
	            	 "module": "home",
	            	 "view": "home",
	            	 "text": "In\u00EDcio",
	            	 "roles" : ["ROLE_LOGADO"]
	             }];

	var obterMenu = function(){
		return _menu;
	};

	return {
		obterMenu : obterMenu
	};
});


