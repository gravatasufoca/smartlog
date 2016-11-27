function ucFirst(text) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

function resolve(names) {
    return {
        load: ['$q', '$rootScope', function ($q, $rootScope) {
            var defer = $q.defer();
            require(names, function () {
                defer.resolve();
                $rootScope.$apply();
            });
            return defer.promise;
        }]
    }
};

function retira_acentos(palavra) { 
    com_acento = "\u00E1\u00E0\u00E3\u00E2\u00E4\u00E9\u00E8\u00EA\u00EB\u00ED\u00EC\u00EE\u00EF\u00F3\u00F2\u00F5\u00F4\u00F6\u00FA\u00F9\u00FB\u00FC\u00E7\u00C1\u00C0\u00C3\u00C2\u00C4\u00C9\u00C8\u00CA\u00CB\u00CD\u00CC\u00CE\u00CF\u00D3\u00D2\u00D5\u00D6\u00D4\u00DA\u00D9\u00DB\u00DC\u00C7"; 
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
}

