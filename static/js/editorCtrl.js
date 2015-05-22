'use strict';

(function () {

    var app = angular.module('dynamicFormsFrameworkAdmin');

    /*
     * This controller handles the logic to create, edit and save a form.
     */
    app.controller('EditorCtrl', ['$scope','$location', '$window', '$rootScope', '$templateCache',
                'ConstantService', 'FieldEditService', 'FormService', 'VersionService',
                function ($scope, $location, $window, $rootScope, $templateCache,
                            ConstantService, FieldEditService, FormService, VersionService) {

        var editor = this;
        editor.loadmaps = [];
        editor.urlBase = $rootScope.urlBase;
        editor.FieldTypes = [];
        editor.max_id = 0;
        editor.newPage = {'fields':[], 'subTitle':''};
        editor.pages = [angular.copy(editor.newPage)];
        editor.questions = [];
        editor.optionsAdded = [];

	    editor.loadmap = function(field){
            var map;
            if (editor.loadmaps[field.field_id] == undefined){
                var lat = 0;
                var lon = 0;
                if (field.mapXY == undefined){
                    lat = -34.806777135903424;
                    lon = -56.164398487890594; 
                } else {
                    lat = field.mapXY.latitude;
                    lon = field.mapXY.longitude;
                }
                var options = {
                    zoom: 8,
                    center: new google.maps.LatLng(lat, lon)
                };
                map = new google.maps.Map(document.getElementById(field.field_id), options);
                var oneLatLng = new google.maps.LatLng(lat, lon);
                var one = new google.maps.Marker({
                    position: oneLatLng,
                    map: map,
                    draggable: true
                });
                editor.loadmaps[field.field_id] = true;
                google.maps.event.addListener(one, 'dragend', function(evento) {
                    var la = evento.latLng.lat();
                    var lo = evento.latLng.lng();
                    field.mapXY.latitude = la;
                    field.mapXY.longitude = lo;
                });
            }
        };

        ConstantService.get(function (constants){
            delete constants.$promise;
            delete constants.$resolved;
            editor.FieldTypes = constants;
            var fields = Object.keys(editor.FieldTypes);
            for(var i = 0;i<fields.length; i++){
                FieldEditService.get({field:fields[i]});
            }
        });

        var option = {
            label : 'new option',
            id : 0
        };

        // selectedPage' holds the current page that's being edited
        editor.selectedPage = editor.pages[0];
        
        editor.selectPage = function(index) {
            editor.selectedPage = editor.pages[index];
        };
        editor.addPage = function() {
            var newPage = angular.copy(editor.newPage);
            editor.pages.push(newPage);
        };
        editor.deletePage = function(index){
            editor.pages.splice(index,1);

        };

        // 'selectedField' holds the current field that is being edited.
        editor.selectedField = '';

        editor.getSelectedField = function(){
            if (editor.selectedField){
                return editor.selectedField.field_type || 'default';
            } else {
                return 'default';
            }
        };

        editor.selectField = function(page, index) {
            editor.selectedPage = editor.pages[page];
            editor.selectedField = editor.selectedPage.fields[index];
            // Select properties tab as active
            $('#myTab li:eq(1) a').tab('show');
        };

        editor.addOption = function() {
            var option1 = angular.copy(option);
            editor.selectedField.options.push(option1);
            option1.id =  ++editor.selectedField.max_id;
        };

        editor.deleteOption = function (index){
            editor.selectedField.options.splice(index,1);
        };

        editor.deleteField = function(page, index){
             editor.questions.splice(editor.questions.indexOf(editor.pages[page].fields[index]));  
             editor.pages[page].fields.splice(index,1);
        };

        editor.applyOptions = function(){
            editor.optionsAdded = editor.optionsAdded.map(function(o){
                return { label:o.toString(), id: 0   };
            });
            for(var i = 0;i < editor.optionsAdded.length; i++){
                editor.optionsAdded[i].id = ++editor.selectedField.max_id;
            }            
            editor.selectedField.options = editor.selectedField.options.concat(angular.copy(editor.optionsAdded));
            editor.optionsAdded = [];
        };

        editor.createField = function(type){
            return fieldFactory.getField(type).buildField();
        };

        editor.addField = function(type) {
            var newField = editor.createField(type);
            if (!editor.max_id){
                editor.max_id = 0;
            }
            newField.field_id = ++editor.max_id;
            newField.field_type = type || 1;
            editor.selectedPage.fields.push(newField);
            editor.selectedField = editor.selectedPage.fields[editor.selectedPage.fields.length];
        };


        /*
        * This controller expects a query params to edit an existing form's version (e.g. path#?form=1&ver=1),
        * if the param is empty then it creats a new form.
        */
        editor.formIdParam = ($location.search()).form;
        editor.versionIdParam = ($location.search()).ver;

        editor.isNewForm = function(){
            return !(Boolean(editor.formIdParam) && Boolean(editor.versionIdParam));
        };

        editor.checkValidations = function(field){
            var val = field.validations;
            if (val.min_number && val.max_number){
                if (val.min_number > val.max_number) {
                    $rootScope.add('Minimum can\'t exceed maximum');
                    val.min_number = val.max_number;
                }
            }
            if (val.max_len_text < 0){
                $rootScope.add('Maximum length can\'t be less than 0');
                val.max_len_text = 0;
            }
        };

        var tmpList = [];
        for (var i = 1; i <= 6; i++){
           	tmpList.push({
           		text: 'Item ' + i,
        		value: i
           	});
        }

        $scope.list = tmpList;

        // Load or create a new Form
        editor.loadForm = function(){
            if (editor.isNewForm()){
                // New Form Case
                editor.form = {
                    'title' : '',
                    'slug' : '',
                };
                editor.version = {
                    'json' : '',
                    'status' :0 ,
                    'number' : 0,
                    'owner' : '',
                    'form' : '',
                    'captcha':false,
                };
            } else {
                FormService.get({id:editor.formIdParam}, function(form){
                    delete form.$promise;
                    delete form.$resolved;
                    editor.form = form;
                    // Load version
                    VersionService.get({formId: editor.formIdParam, versionId: editor.versionIdParam},
                        function(version){
                            delete version.$promise;
                            delete version.$resolved;
                            editor.version = version;
                            editor.pages = JSON.parse(version.json).pages;
                            editor.logic = JSON.parse(version.json).logic;
                            editor.after_submit = JSON.parse(version.json).after_submit;
                            editor.questions = [];
                            for (var i = 0; i < editor.pages.length; i++) {
                                editor.questions = editor.questions.concat(editor.pages[i].fields);
                            }
                            editor.max_id = Math.max.apply(Math,editor.questions.map(function(o){
                                return o.field_id;
                            }));
                            if (!editor.max_id || isNaN(editor.max_id) || !isFinite(editor.max_id)){
                                editor.max_id = 0;
                            }
                        }, function(error){
                            if (error.data.error) {
                                $rootScope.add('Error loading version: ' + error.data.error);
                            } else {
                                $rootScope.add('Error loading version: ' + error.data);
                            };
                        })
                }, function(error){
                    if (error.data.detail) {
                        $rootScope.add('Error loading survey: ' + error.data.detail);
                    } else {
                        $rootScope.add('Error loading survey: ' + error.data);
                    };
                });
            }
        };

        // Call to loadForm function on control initialization
        editor.loadForm(); 
        
        // Save and publish form
        editor.saveForm = function(){
            if (editor.validateForm()){
                editor.persistForm(0);
            }
        };
        editor.submitForm = function(){
            if (editor.validateForm()){
                editor.persistForm(1);
            }
        };
    
        editor.validateForm = function(){
            for (var pageNum in editor.pages){
                var page = editor.pages[pageNum];
                for (var fieldIndex in page.fields){
                    var field = page.fields[fieldIndex];
                    if (field.text == null || field.text == ''){
                        $rootScope.add('Field labels can\'t be empty.');
                        return false;
                    }
                    if (field.field_type == 'SelectField' || field.field_type == 'CheckboxField'){
                        if (!field.options.length){
                            $rootScope.add(field.text + ': Field options can\'t be empty.');
                            return false;
                        }
                    }
                }
            }
            return true;
        };
        
        editor.cleanJson = function(){
            for (var fieldId in editor.logic.fields){
                var field = editor.logic.fields[fieldId];
                for (var conditionId in field.conditions){
                    var condition = field.conditions[conditionId];
                }
            }
        };

        editor.persistForm = function(formStatus){
            editor.version.status = formStatus;
            editor.cleanJson();
            if (editor.isNewForm()){
                FormService.create(editor.form, function(form){
                    delete form.$promise;
                    delete form.$resolved;
                    editor.form = form;
                    editor.formIdParam = form.id;
                    editor.version.form = form.id;
                    editor.version.json = angular.toJson({'pages':editor.pages,'logic':editor.logic, 'after_submit':editor.after_submit});
                    VersionService.create({formId: editor.formIdParam}, editor.version,
                        function(version){
                            delete version.$promise;
                            delete version.$resolved;
                            editor.versionIdParam = version.number;
                            editor.version = version;
                            if (formStatus == 1){
                                $window.location.href = 'main';
                            } else {
                                // Update the url parameters
                                $location.search({form:editor.formIdParam, ver:editor.versionIdParam});
                            }
                        }, function(error){
                            if (error.data.error) {
                                $rootScope.add('Error saving version: ' + error.data.error);    
                            } else {
                                $rootScope.add('Error saving version: ' + error.data);
                            };
                        })
                }, function(error){
                    if (error.data.error) {
                        $rootScope.add('Error saving survey: ' + error.data.error);
                    } else {
                        $rootScope.add('Error saving survey: ' + error.data);
                    };
                });
            } else {
                editor.version.form = editor.formIdParam;
                FormService.update({id: editor.formIdParam}, editor.form, function(form){
                    delete form.$promise;
                    delete form.$resolved;
                    editor.form = form;
                    editor.version.json = angular.toJson({'pages':editor.pages,'logic':editor.logic,'after_submit':editor.after_submit});
                    VersionService.update({formId: editor.formIdParam, versionId: editor.versionIdParam}, editor.version,
                        function(version){
                            delete version.$promise;
                            delete version.$resolved;
                            editor.version = version;
                            if (formStatus == 1){
                                $window.location.href = 'main';
                            }
                        }, function(error){
                            if (error.data.error) {
                                $rootScope.add('Error saving version: ' + error.data.error);    
                            } else {
                                $rootScope.add('Error saving version: ' + error.data);
                            };
                        })
                }, function(error){
                    if (error.data.error) {
                        $rootScope.add('Error saving survey: ' + error.data.error);
                    } else {
                        $rootScope.add('Error saving survey: ' + error.data);
                    };
                });
            }
        };

        editor.getFieldById = function(id){
            // Precondition: Field with field_id == id exists
            for(var i = 0; i < editor.pages.length; i++){
                var page = editor.pages[i];
                for(var j = 0; j < page.fields.length; j++){
                    var field = page.fields[j];
                    if(field.field_id == id){
                        return field;
                    }
                }
            }
        };

        editor.getPageNum = function(page){
            for (var i = 0; i < editor.pages.length; i++){
                if (editor.pages[i] == page){
                    return i;
                }
            }
        };


        // Logic methods
        editor.newLogicField = {
            operation : 'Show',
            action : 'All',
            conditions: [],
        };

        editor.newCondition = {
            field:'',
            comparator:'',
            value:'',
            operatorsList:[],
        };

        editor.logic = {
            fields: {},
            pages: {},
        };
        
        editor.configLogicField = function (fieldId){
            editor.questions = [];
            for (var i = 0; i < editor.pages.length; i++) {
                editor.questions = editor.questions.concat(editor.pages[i].fields);
            }
            if(editor.logic.fields[fieldId]==undefined){
                editor.logicField = angular.copy(editor.newLogicField);

            }else{
                editor.logicField = angular.copy(editor.logic.fields[fieldId]);
                for (var cond_index in editor.logicField.conditions){
                    var cond = editor.logicField.conditions[cond_index];
                    editor.selectFieldOnCondition(cond);
                }
            }
        };

        editor.configLogicPage = function (page){
            editor.questions = [];
            for (var i = 0; i < editor.pages.length; i++) {
                editor.questions = editor.questions.concat(editor.pages[i].fields);
            }
            var pageNum = editor.getPageNum(page);
            if(editor.logic.pages[pageNum] == undefined){
                editor.logicField = angular.copy(editor.newLogicField);
            }else{
                editor.logicField = angular.copy(editor.logic.pages[pageNum]);
                for (var cond_index in editor.logicField.conditions){
                    var cond = editor.logicField.conditions[cond_index];
                    editor.selectFieldOnCondition(cond);
                }
            }
        };

        editor.addNewLogicCondition = function (){
            var newLogicCondition = angular.copy(editor.newCondition);
            editor.logicField.conditions.push(newLogicCondition);
        };

        editor.removeLogicCondition = function(indexCond){
            editor.logicField.conditions.splice(indexCond);
        };

        editor.applyDependencies = function(fieldId){
            
            editor.logic.fields[fieldId] = angular.copy(editor.logicField);

            // Clean field dependecies of every field
            for(var i = 0; i < editor.pages.length; i++){
                var page = editor.pages[i];
                for(var j = 0; j < page.fields.length; j++){
                    var field = page.fields[j];
                    field.dependencies.fields = [];
                }
            }
            // Add dependencies
            for (var dest_id in editor.logic.fields){
                var dest_field = editor.logic.fields[dest_id];
                for (var k = 0; k < dest_field.conditions.length; k++){
                    var origin_id = dest_field.conditions[k].field;
                    var origin = editor.getFieldById(origin_id);
                    origin.dependencies.fields.push(dest_id);
                }
            }
        };

        editor.applyPageDependencies = function(page){
            var pageNum = editor.getPageNum(page);
            editor.logic.pages[pageNum] = angular.copy(editor.logicField);
            // Clean page dependecies of every field
            for(var i = 0; i < editor.pages.length; i++){
                var pageTemp = editor.pages[i];
                for(var j = 0; j < pageTemp.fields.length; j++){
                    var field = pageTemp.fields[j];
                    field.dependencies.pages = [];
                }
            }
            // Add dependencies
            for (var dest_page_num in editor.logic.pages){
                var dest_page = editor.logic.pages[dest_page_num];
                for (var k = 0; k < dest_page.conditions.length; k++){
                    var origin_id = dest_page.conditions[k].field;
                    var origin = editor.getFieldById(origin_id);
                    origin.dependencies.pages.push(dest_page_num);
                }
            }
        };

        editor.selectFieldOnCondition = function(condition){
            condition.field_type = angular.copy(editor.getFieldType(condition.field));
            condition.operatorsList = editor.getOperatorsForField(condition.field_type);
            condition.operandKind = editor.getFieldOperandKind(condition.field_type);
            if (editor.isOptionsType(condition.operandKind)){
                var field = editor.getFieldById(condition.field);
                condition.options = field.options;
            }
            if (editor.isInputType(condition.operandKind)){
                if (condition.options){
                    delete condition.options;
                }
            }
            if (!editor.operatorsList){
                editor.operatorsList = [];
            }
        };

        editor.getFieldType = function(field_id){
            var fieldType = '';
            for (var i = 0; i < editor.questions.length; i++){
                if (field_id == editor.questions[i].field_id){
                    fieldType = editor.questions[i].field_type;
                }
            }
            return fieldType;
        };

        editor.getOperatorsForField = function(field_type){
            return operatorFactory.getOperatorMethods(field_type);
        };

        editor.getFieldOperandKind = function(field_type){
            var operator = operatorFactory.getOperator(field_type);
            return operator.operandKind();
        };

        editor.isInputType = function (operandKind){
            return operandKind == 'input';
        };

        editor.isOptionsType = function (operandKind){
            return operandKind == 'options';
        };

        editor.new_after_submit = {
            sendMail: false,
            mailSubject: '',
            mailText: '',
            mailSender: '',
            mailRecipient: '',
            // Can be 'Show Message' or 'Redirect To'
            action: 'Show Message',
            message: 'Thank you. You successfully filled the form!',
            redirect: 'http://'
        };

        editor.after_submit = angular.copy(editor.new_after_submit);
                    
        editor.configAfterSubmit = function(){
            editor.actual_after_submit = angular.copy(editor.after_submit);
        };

        editor.applyAfterSubmit = function(){
            editor.after_submit = editor.actual_after_submit;
        };
    }]);
})();
