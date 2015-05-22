describe("EditorCtrl Testing Pages", function() {
    
    beforeEach(angular.mock.module('dynamicFormsFrameworkAdmin'));
    
    it("Field Types constant successfully loaded.", inject(function( _$httpBackend_,$controller,$rootScope) {
        var scope = $rootScope.$new();
        var $httpBackend = _$httpBackend_;
        var ctrl = $controller('EditorCtrl', {$scope: scope});     
        expect(ctrl.FieldTypes).not.toBe(null);
        expect(ctrl.FieldTypes).toBeDefined();
    }));
    
    it("Adding Pages.", inject(function($controller,$rootScope) {
        var scope = $rootScope.$new();
        var ctrl = $controller('EditorCtrl', {$scope: scope});
        expect(ctrl.pages[0]).not.toBeNull();
        ctrl.addPage();
        expect(ctrl.pages[1]).toBeDefined();
        expect(ctrl.pages[1]).not.toBeNull();
        expect(ctrl.pages[1]!=ctrl.pages[0]).toBe(true);
        expect(ctrl.pages.length).toBe(2);
    }));

    it("Delete Pages.", inject(function($controller,$rootScope) {
        var scope = $rootScope.$new();
        var ctrl = $controller('EditorCtrl', {$scope: scope});     
        ctrl.addPage();
        ctrl.addPage();
        ctrl.addPage();
        ctrl.addPage();
        ctrl.addPage();
        ctrl.addPage();
        expect(ctrl.pages.length).toBe(7); /*Page already added from last it*/
        ctrl.deletePage(0);
        expect(ctrl.pages.length).toBe(6);     
    }));

    it("Select Page.", inject(function($controller,$rootScope) {
        var scope = $rootScope.$new();
        var ctrl = $controller('EditorCtrl', {$scope: scope});     
        ctrl.addPage();
        ctrl.addPage();
        ctrl.addPage();
        ctrl.addPage();
        ctrl.addPage();
        ctrl.addPage();
        ctrl.selectPage(4);     
        expect(ctrl.selectedPage).toBe(ctrl.pages[4]);
    }));
    
});

describe("EditorCtrl Testing Fields", function() {
    
    beforeEach(angular.mock.module('dynamicFormsFrameworkAdmin'));
    
    it("Add Fields to Some Page.", inject(function($controller,$rootScope) {
        var scope = $rootScope.$new();
        var ctrl = $controller('EditorCtrl', {$scope: scope});
        ctrl.addPage();
        ctrl.addPage();
        expect(ctrl.pages.length).toBe(3);    
        ctrl.selectPage(0);  
        ctrl.addField("NumberField");
        ctrl.addField("NumberField");
        ctrl.addField("NumberField");
        expect(ctrl.pages[0].fields[0]).not.toBe(null);
        expect(ctrl.pages[0].fields[0]).toBeDefined();
        expect(ctrl.pages[0].fields.length).toBe(3);
    }));
    
    it("Delete Fields in Some Page.", inject(function($controller,$rootScope) {
        var scope = $rootScope.$new();
        var ctrl = $controller('EditorCtrl', {$scope: scope});
        ctrl.addPage();
        ctrl.addPage();
        expect(ctrl.pages.length).toBe(3);
        ctrl.selectPage(0);  
        ctrl.addField("NumberField");
        ctrl.addField("NumberField");
        ctrl.addField("NumberField");
        expect(ctrl.pages[0].fields.length).toBe(3);
        ctrl.deleteField(0,1);
        expect(ctrl.pages[0].fields.length).toBe(2);      
    }));
    
    it("Add Options to Some Field in a page.", inject(function($controller,$rootScope) {
        var scope = $rootScope.$new();
        var ctrl = $controller('EditorCtrl', {$scope: scope});
        ctrl.addPage();
        ctrl.addPage();
        expect(ctrl.pages.length).toBe(3);
        ctrl.selectPage(0);  
        ctrl.addField("CheckboxField");
        ctrl.addField("CheckboxField");
        ctrl.addField("CheckboxField");      
        ctrl.selectField(0,0);
        ctrl.addOption();
        alert(ctrl.pages[0].fields[0].options);
        expect(ctrl.pages[0].fields[0].options.length).toBe(1);
        ctrl.selectField(0,2);
        ctrl.addOption();
        alert(ctrl.pages[0].fields[2].options);
        expect(ctrl.pages[0].fields[2].options.length).toBe(1);    
    }));
    
    it("Delete Options to Some Field in a page.", inject(function($controller,$rootScope) {
        var scope = $rootScope.$new();
        var ctrl = $controller('EditorCtrl', {$scope: scope});
        ctrl.selectPage(0);  
        ctrl.addField("CheckboxField");
        ctrl.addField("CheckboxField");
        ctrl.addField("CheckboxField");      
        ctrl.selectField(0,2);
        ctrl.addOption();
        expect(ctrl.pages[0].fields[2].options.length).toBe(1);
        ctrl.deleteOption(0);
        expect(ctrl.pages[0].fields[2].options.length).toBe(0);
    }));

});

describe("EditorCtrl testing logic", function() {
    
    beforeEach(angular.mock.module('dynamicFormsFrameworkAdmin'));
    beforeEach(inject(function ($rootScope, $controller, _$location_, _$httpBackend_) {
        $location = _$location_;
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
        createController = function() {
            return $controller('EditorCtrl', {
                '$scope': scope
            });
        };
    }));

    it("Adding and removing logic conditions to a field", inject(function($controller,$rootScope) {
        var ctrl = createController();
        var form = getFakeForm();
        scope.pages = form.pages;
        scope.logic = form.logic;
        ctrl.configLogicField(1);
        expect(ctrl.logicField.conditions.length).toBe(0);
        ctrl.addNewLogicCondition();
        expect(ctrl.logicField.conditions.length).toBe(1);
        ctrl.removeLogicCondition(0);
        expect(ctrl.logicField.conditions.length).toBe(0);
    }));

    it("Removing a logic condition to a page", inject(function($controller, $rootScope) {
        var ctrl = createController();
        var form = getFakeForm();
        scope.pages = form.pages;
        scope.logic = form.logic;
        ctrl.configLogicPage(0);
        expect(ctrl.logicField.conditions.length).toBe(0);
        ctrl.addNewLogicCondition();
        expect(ctrl.logicField.conditions.length).toBe(1);
        ctrl.removeLogicCondition(0);
        expect(ctrl.logicField.conditions.length).toBe(0);
    }));

    it("Applying dependencies", inject(function($controller, $rootScope) {
        var ctrl = createController();
        var form = getFakeForm();
        ctrl.pages = form.pages;
        ctrl.logic = form.logic;
        ctrl.configLogicField(4);
        ctrl.logicField = {"operation":"Show","action":"All","conditions":[{"field":3,"comparator":"greater_than","value":"10","operatorsList":["greater_than","greater_than_or_equal","equal","not_equal","less_than_or_equal","less_than"],"field_type":"NumberField","operandKind":"input"}]};
        ctrl.applyDependencies(4);

    }));
    
    it("Applying page dependencies", inject(function($controller, $rootScope) {
        var ctrl = createController();
        var form = getFakeForm();
        ctrl.pages = form.pages;
        ctrl.logic = form.logic;
        ctrl.configLogicPage(2);
        ctrl.logicField = {"operation":"Hide","action":"Any","conditions":[{"field":3,"comparator":"equal","value":"1","operatorsList":["greater_than","greater_than_or_equal","equal","not_equal","less_than_or_equal","less_than"],"field_type":"NumberField","operandKind":"input"}]};
        ctrl.applyDependencies(2);

    }));    

    it("Getting operators for field", inject(function($controller, $rootScope) {
        var ctrl = createController();
        var form = getFakeForm();
        scope.pages = form.pages;
        scope.logic = form.logic;

        var numOperators = ctrl.getOperatorsForField('NumberField');
        expect(numOperators).toContain("greater_than");
        expect(numOperators).toContain("greater_than_or_equal");
        expect(numOperators).toContain("equal");
        expect(numOperators).toContain("not_equal");
        expect(numOperators).toContain("less_than_or_equal");
        expect(numOperators).toContain("less_than");
        expect(numOperators.length).toBe(6);

        var listOperators = ctrl.getOperatorsForField('SelectField');
        expect(listOperators).toContain("equal");
        expect(listOperators).toContain("not_equal");
        expect(listOperators.length).toBe(2);

        var checkOperators = ctrl.getOperatorsForField('CheckboxField');
        expect(checkOperators).toContain("equal");
        expect(checkOperators).toContain("not_equal");
        expect(checkOperators).toContain("contains");
        expect(checkOperators).toContain("not_contains");
        expect(checkOperators.length).toBe(4);
    }));
  
    getFakeForm = function(){
        var pages = [
            {"subTitle": "", "fields": [{"text": "text", "field_id": 1, "required": false, "dependencies": {"fields": [], "pages": []}, "validations": {"max_len_text": 255}, "answer": [], "field_type": "TextField", "tooltip": ""}]}, 
            {"subTitle": "", "fields": [{"text": "number", "field_id": 3, "required": false, "dependencies": {"fields": [], "pages": []}, "validations": {"min_number": null, "max_number": null}, "answer": [], "field_type": "NumberField", "tooltip": ""}]},
            {"subTitle": "", "fields": [{"text": "text area", "field_id": 4, "required": false, "dependencies": {"fields": [], "pages": []}, "validations": {"max_len_text": 400}, "answer": [], "field_type": "TextAreaField", "tooltip": ""}]}
        ];

        var logic = {
            "fields": {},
            "pages": {}
        };

        var form = {};
        form.pages = pages;
        form.logic = logic;

        return form;
    }; 
});
