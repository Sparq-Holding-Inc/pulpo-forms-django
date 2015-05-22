var app = angular.module('dynamicFormsFramework');

app.factory('VersionService', function($resource){
    var version_api_url = '/pulpo/visor/publishVersion/'

    return $resource( version_api_url +':form/', 
        {form:'@form'},
        {'query': {method: 'GET', isArray: true }});
});
