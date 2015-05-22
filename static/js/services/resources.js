var app = angular.module('dynamicFormsFrameworkAdmin');

app.factory('ConstantService', function($resource){
    var constants_api_url = '/pulpo/constants/'

    return $resource( constants_api_url, {},
        {'query': {method: 'GET', isArray: true }});
});

app.factory('FieldEditService', function($resource){
    var field_edit_api_url = '/pulpo/field_edit/'

    return $resource( field_edit_api_url + ':field/', {},
        {'query': {method: 'GET', isArray: true }});
});

app.factory('FormService', function($resource){
    var form_api_url = '/pulpo/forms/'

    return $resource( form_api_url + ':id/', {},
        {'query': {method: 'GET', isArray: true },
        'create': {method: 'POST'},
        'update': {method: 'PUT'}});
});

app.factory('VersionService', function($resource){
    var version_api_url = '/pulpo/version/'

    return $resource( version_api_url + ':formId/'+ ':versionId/', 
        {formId: '@formId', versionId:'@versionId'},
        {'query': {method: 'GET', isArray: true },
        'create': {method: 'POST'},
        'update': {method: 'PUT'}});
});


app.factory('ResponsesService', function($resource){
    var responses_api_url = '/pulpo/responses/'

    return $resource( responses_api_url + ':formId/'+ ':versionId/' +
        ':field/' + ':type/' + ':value/',
        {formId: '@formId', versionId:'@versionId',
        field: '@field', type:'@type', value: '@value'},
        {'query': {method: 'GET', isArray: true}});
});

app.factory('StatisticsService', function($resource){
    var statistics_api_url = '/pulpo/statistics/'

    return $resource( statistics_api_url + ':formId/'+ ':versionId/',
        {formId: '@formId', versionId:'@versionId'},
        {'query': {method: 'GET', isArray: true}});
});