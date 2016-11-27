define([
        'componentes/ms-utils/msUtils',
        ], 
        function(msUtils) {
	'use strict';
	try {
		msUtils.filter('msRemoverAcentuacao', function() {
			return function (palavra) {
				com_acento = "\u00e1\u00e0\u00e3\u00e2\u00e4\u00e9\u00e8\u00ea\u00eb\u00ed\u00ec\u00ee\u00ef\u00f3\u00f2\u00f5\u00f4\u00f6\u00fa\u00f9\u00fb\u00fc\u00e7\u00c1\u00c0\u00c3\u00c2\u00c4\u00c9\u00c8\u00ca\u00cb\u00cd\u00cc\u00ce\u00cf\u00d3\u00d2\u00d5\u00d6\u00d4\u00da\u00d9\u00db\u00dc\u00c7"; 
				sem_acento = "aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC"; 
				nova=""; 
				for(i=0;i<palavra.length;i++) { 
					if (com_acento.search(palavra.substr(i,1))>=0) { 
						nova += sem_acento.substr(com_acento.search(palavra.substr(i,1)),1); 
					} 
					else { 
						nova+=palavra.substr(i,1); 
					} 
				} 
				return nova; 
			};
		});
	}
	catch(e) {
		$log.error(e);
	}

	return msUtils;

});