define([], function() {
	var routes = [ 
	              {
	            	  module: 'home', 
	            	  view: 'home', 
	            	  text: 'In\u00edcio',
	            	  state: {
	            		  name : "home",
	            		  url: "inicio"
	            	  },
	            	  roles: ['*']
	              }
	              ];

	return routes;
});	