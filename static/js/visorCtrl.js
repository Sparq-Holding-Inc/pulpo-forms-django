'use strict';

(function () {
	
    var app = angular.module('dynamicFormsFramework');
    
        /*
         * The VisorCtrl holds the logic to display, validate and submit the form.
         */
        app.controller('VisorCtrl', ['$scope','$http','$location','$window','$rootScope', '$captcha',
                function ($scope, $http, $location, $window, $rootScope, $captcha) {

        var visor = $scope;
        
        // visor.loadmaps = [];        
            
        // visor.disableSubmit = true;
        
        // visor.enviarCaptcha = function(resultado){
        //     if($captcha.checkResult(resultado) === true){
        //         visor.disableSubmit =false;
        //     } else {
        //         visor.disableSubmit= true;
        //     }
        // };
                    
        // visor.loadmap = function(field){
        //     var map;
        //     if (visor.loadmaps[field.field_id]==undefined){
        //         if (field.answer[0] == undefined){
        //             var lat = field.mapXY.latitude;
        //             field.answer[0] = lat;
        //         } else {
        //             var lat = field.answer[0];
        //         }
        //         if (field.answer[1] == undefined){
        //             var lon = field.mapXY.longitude;
        //             field.answer[1] = lon;
        //         } else {
        //             var lon = field.answer[1];
        //         }
        //         var options = {
        //             zoom: 8,
        //             center: new google.maps.LatLng(lat, lon)
        //         };
        //         map = new google.maps.Map(document.getElementById(field.field_id),
        //         options);
        //         var oneLatLng = new google.maps.LatLng(lat, lon);
        //         var one = new google.maps.Marker({
        //         position: oneLatLng,
        //         map: map,
        //         draggable: true
        //     });
        //     visor.loadmaps[field.field_id]= true;
        //     google.maps.event.addListener(one, 'dragend', function(evento) {
        //         var la = evento.latLng.lat();
        //         var lo = evento.latLng.lng();
        //         field.answer=[la,lo];
        //         });
        //     }
        // };            	
		
        // var separator = '_';

        // visor.plugin_mode = false;
        // if (instance){
        //     visor.plugin_mode = true;
        // }

        // visor.base_url = base_url;
        // if (!visor.base_url){
        //     visor.base_url = '';
        // }

        // // Visor url params
        // visor.slug = $location.hash().split(separator)[0];

        // if (instance){
        //     visor.slug = instance;
        // }

        // // Preview url params
        // visor.formIdParam = ($location.search()).form;
        // visor.versionIdParam = ($location.search()).ver;

        // visor.isVisorMode = function(){
        //     if (visor.slug){
        //         return true;
        //     } else {
        //         return false;
        //     }
        // };

        // visor.isPreviewMode = function(){
        //     if (visor.formIdParam && visor.versionIdParam){
        //         return true;
        //     } else {
        //         return false;
        //     }
        // };
        
        // // Load last published Version
        // visor.load = function(){
        //     if (visor.isVisorMode()){
        //         $http.get(visor.base_url+'visor/publishVersion/'+visor.slug)
        //             .success(function(data){
        //                 visor.setFormValues(data);
        //             })
        //             .error(function(data, status, headers, config){
        //                 alert('error loading form: ' + status);
        //                 visor.errLoading = true;
        //             });
        //     } else {
        //         // Load form
        //         $http.get(visor.base_url+'forms/'+visor.formIdParam)
        //             .success(function(data){
        //                 visor.title = data.title;
        //                 // Load version
        //                 $http.get('version/'+visor.formIdParam+'/'+visor.versionIdParam)
        //                 .success(function(data){
        //                     visor.setFormValues(data);
        //                 })
        //                 .error(function(data, status, headers, config){
        //                     alert('error loading version: ' + status);
        //                 });
        //             })
        //             .error(function(data, status, headers, config){
        //                 alert('error loding form: ' + status);
        //             });
        //     }
        // };

        // // Invoque load function
        // visor.load();

        // visor.setFormValues = function(data){
        //     visor.version = data;
        //     visor.disableSubmit = visor.version.captcha;
        //     visor.pages = JSON.parse(data.json).pages;
        //     visor.logic = JSON.parse(data.json).logic;
        //     visor.after_submit = JSON.parse(data.json).after_submit;
        //     visor.initialiceConditions();
        //     visor.changePage(0);
        //     visor.selectPage(0);
        // };

        // visor.pre_save = function(){
	       //  visor.submitting = true;
        //     visor.questions = [];
        //     for (var i = 0; i< visor.pages.length; i++) {
        //         visor.questions = visor.questions.concat(angular.copy(visor.pages[i].fields));
        //     }
        //     for ( var i = 0; i < visor.questions.length; i++) { 
        //         if (visor.questions[i].field_type == 'CheckboxField'){
        //             var respuesta = '';
        //              for ( var x = 0; x < visor.questions[i].options.length-1; x++){
        //                 respuesta += visor.questions[i].options[x].id + '#';
        //              }
        //             respuesta += visor.questions[i].options[visor.questions[i].options.length-1].id;
        //             visor.questions[i].options = respuesta;
        //         }else if (visor.questions[i].field_type == 'SelectField'){
        //             visor.questions[i].options = visor.questions[i].options.join('#');
        //         }
        //         if(visor.questions[i].field_type != 'FileField'){
        //             visor.questions[i].answer = visor.questions[i].answer.join('#');
        //         } else if(visor.questions[i].field_type=='FileField' && visor.questions[i].answer.length==0){
        //             visor.questions[i].answer = '';
        //         }
        //     }
        //     for (var j = 0; j < visor.questions.length; j++) {
        //         var pageNum = visor.getPageNumByFieldId(visor.questions[j].field_id);
        //         visor.questions[j].shown = Boolean(visor.showValues[visor.questions[j].field_id]
        //                                     && visor.showPageValues[pageNum]);
        //         delete visor.questions[j].tooltip;
        //         if (visor.questions[j].options){
        //             delete visor.questions[j].options;
        //         }
        //         if (visor.questions[j].dependencies){
        //             delete visor.questions[j].dependencies;
        //         }
        //     }
        // };

        // visor.dataMedia = new FormData();

        // // Persist form
        // visor.save = function(){
        //     if (visor.isVisorMode()){
        //         visor.pre_save();              
        //         $http({
        //             method: 'POST',
        //             url: visor.base_url+'visor/submit/'+visor.slug+'/',
        //             headers: { 'Content-Type': undefined},
        //             transformRequest:function (data) {                          
        //                 data.append('data', angular.toJson(visor.questions));
        //                 return data; 
        //             },
        //             data:visor.dataMedia
        //         }).success( function(data, status, headers, config){
        //             if(visor.after_submit.action == 'Redirect To'){
        //                 $window.location.href = visor.after_submit.redirect;
        //             } else {
        //                 $window.location.href = 'visor/form/submitted/'+visor.slug+'/';
        //             }
        //         })
        //         .error(function(data, status, headers, config) {
        //             alert('Error saving data: ' + data.error);
        //             visor.submitting = false;
        //         });
        //     } else {
        //         alert('Form was completed correctly. \nThis is a preview, the data wont be saved.');
        //     }
        // };

        
        // // Page navegation

        // // The page selection is fired by the change of the url
        // visor.changePage = function(page){
        //     if (visor.plugin_mode){
        //         $location.hash(page);
        //     } else if (visor.isVisorMode()) {
        //         $location.hash(visor.slug + separator + page);
        //     } else { 
        //         $location.search('page',page);
        //     }
        // };
        
        // // This function watches any change in the url and updates the selected page.
        // visor.$on('$locationChangeSuccess', function(event) {
        //     var changePage;
        //     visor.loadmaps = [];
        //     if (visor.plugin_mode){
        //         changePage = $location.hash() || 0;
        //     } else if (visor.isVisorMode()) {
        //         changePage = $location.hash().split(separator)[1] || 0;
        //     } else {
        //         changePage = ($location.search()).page || 0;
        //     }
        //     changePage = parseInt(changePage);
        //     if (changePage.isNaN){
        //         changePage = 0;
        //     }
        //     if (visor.pages){
        //         if (changePage > visor.pages.size || changePage < 0){
        //             changePage = 0;   
        //         }
        //         visor.selectPage(changePage);
        //     }
        // });

        // visor.selectPage = function(page){
        //     visor.selectedPage = visor.pages[page];
        //     visor.selectedPageNum = page;
        // };

        // visor.getNext = function(){
        //     var next = visor.selectedPageNum + 1;
        //     while (next < visor.pages.length && !visor.showPageValues[next]){
        //         next++;
        //     }
        //     if (next == visor.pages.length){
        //         return -1;
        //     } else {
        //         return next;
        //     }
        // };

        // visor.getPrevious = function(){
        //     var prev = visor.selectedPageNum - 1;
        //     while (prev >= 0 && !visor.showPageValues[prev]){
        //         prev--;
        //     }
        //     return prev;
        // };
       
        // visor.canNext = function(){
        //     var canNext = false;
        //     if (visor.pages){
        //         var next = visor.getNext();
        //         canNext = (next != -1);
        //     }
        //     return canNext;
        // };

        // visor.next = function(){
        //     var next = visor.getNext();
        //     if (next != -1){
        //         visor.changePage(next);
        //     }
        // };

        // visor.canPrevious = function(){
        //     var canPrevious = false;
        //     if (visor.pages){
        //         var prev = visor.getPrevious();
        //         canPrevious = (prev != -1);
        //     }
        //     return canPrevious;
        // };

        // visor.previous = function(){
        //     var prev = visor.getPrevious();
        //     if (prev != -1){
        //         visor.changePage(prev);
        //     }
        // };            


        // Logic evaluation
        
        // visor.showValues = [];
        // visor.showPageValues = [];

        // visor.initialiceConditions = function(){
        //     visor.questions = [];
        //     for (var i = 0; i < visor.pages.length; i++) {
        //         visor.questions = visor.questions.concat(angular.copy(visor.pages[i].fields));
        //         visor.evaluatePageCondition(i);
        //     }
        //     for (var j = 0; j < visor.questions.length; j++){
        //         var field = visor.questions[j];
        //         visor.evaluateCondition(field.field_id);
        //     }
        // };

        // visor.updateDependencies = function(field_id){
        //     var field_org = visor.getFieldById(field_id);
        //     var field_dst;
        //     for (var k = 0; k < field_org.dependencies.fields.length; k++){
        //         field_dst = visor.getFieldById(field_org.dependencies.fields[k]);
        //         visor.evaluateCondition(field_dst.field_id);
        //     }
        //     for (var j = 0; j < field_org.dependencies.pages.length; j++){
        //         visor.evaluatePageCondition(field_org.dependencies.pages[j]);
        //     }
        // };

        // visor.evaluateCondition = function(field_id){
        //     var logic = visor.logic.fields[field_id];
        //     if (logic){
        //         var value = true;
        //         if (logic.action == 'All'){
        //             value = true;
        //             for (var condAll in logic.conditions){
        //                 var condition = logic.conditions[condAll];
        //                 var field_org = visor.getFieldById(condition.field);
        //                 var data = field_org.answer;
        //                 var operator = eval('operatorFactory.getOperator("'+condition.field_type+'")');
        //                 var funcStr = 'operator.'+ condition.comparator +'("'+data+'","'+ condition.value+'")';
        //                 value &= eval(funcStr);
        //             }
                    
        //         }
        //         if (logic.action == 'Any'){
        //             value = false;
        //             for (var condAny in logic.conditions){
        //                 var condition = logic.conditions[condAny];
        //                 var field_org = visor.getFieldById(condition.field);
        //                 var data = field_org.answer;
        //                 var operator = eval('operatorFactory.getOperator("'+condition.field_type+'")');
        //                 var funcStr = 'operator.'+ condition.comparator +'("'+data+'","'+ condition.value+'")';
        //                 value |= eval(funcStr);
        //             }
                    
        //         }
        //         if (logic.operation == 'Show'){
        //             visor.showValues[field_id] = value;
        //         } else {
        //             visor.showValues[field_id] = !value;
        //         }
        //     } else {
        //         visor.showValues[field_id] = 1;
        //     }
        // };

        // visor.evaluatePageCondition = function(pageNum){
        //     var logic = visor.logic.pages[pageNum];
        //     if (logic){
        //         var value = true;
        //         if (logic.action == 'All'){
        //             value = true;
        //             for (var condAll in logic.conditions){
        //                 var condition = logic.conditions[condAll];
        //                 var field_org = visor.getFieldById(condition.field);
        //                 var data = field_org.answer; 
        //                 var operator = eval('operatorFactory.getOperator("'+condition.field_type+'")');
        //                 var funcStr = 'operator.'+ condition.comparator +'("'+data+'","'+ condition.value+'")';
        //                 value &= eval(funcStr);
        //             }
                    
        //         }
        //         if (logic.action == 'Any'){
        //             value = false;
        //             for (var condAny in logic.conditions){
        //                 var condition = logic.conditions[condAny];
        //                 var field_org = visor.getFieldById(condition.field);
        //                 var data = field_org.answer;
        //                 var operator = eval('operatorFactory.getOperator("'+condition.field_type+'")');
        //                 var funcStr = 'operator.'+ condition.comparator +'("'+data+'","'+ condition.value+'")';
        //                 value |= eval(funcStr);
        //             }
                    
        //         }
        //         if (logic.operation == 'Show'){
        //             visor.showPageValues[pageNum] = value;
        //         } else {
        //             visor.showPageValues[pageNum] = !value;
        //         }
        //     } else {
        //         visor.showPageValues[pageNum] = 1;
        //     }
        // };
        
        
        // // Auxiliar functions
        
        //  visor.onFileSelect = function($files,fileModel) {
        //     // $files: an array of files selected, each file has name, size, and type.
        //     var file = $files[0]; 
        //     var file_id = file.name;
        //     visor.dataMedia.append(file_id,file);
        //     fileModel.answer = file_id;
        // };
        
        // visor.fileName = function(name){
        //     if(JSON.stringify(name) == "[]")
        //         return ""
        //     return name;
        // }
        
        // // Precondition: Field with field_id == id exists
        // visor.getFieldById = function(id){
        //     for(var i = 0; i < visor.pages.length; i++){
        //         var page = visor.pages[i];
        //         for(var j = 0; j < page.fields.length; j++){
        //             var field = page.fields[j];
        //             if(field.field_id == id){
        //                 return field;
        //             }
        //         }
        //     }
        // };

        // // Precondition: Field with field_id == id exists
        // visor.getPageNumByFieldId = function(id){
        //     for(var i = 0; i < visor.pages.length; i++){
        //         var page = visor.pages[i];
        //         for(var j = 0; j < page.fields.length; j++){
        //             var field = page.fields[j];
        //             if(field.field_id == id){
        //                 return i;
        //             }
        //         }
        //     }
        // };

    }]);
})();
