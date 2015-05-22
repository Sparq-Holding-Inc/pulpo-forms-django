var instance = '';
var base_url = '';

describe("VisorCtrl Testing", function() {
    
    beforeEach(angular.mock.module('dynamicFormsFramework'));
    beforeEach(inject(function ($rootScope, $controller, _$location_, _$httpBackend_) {
        $location = _$location_;
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
        scope.slug = "testing";
        $httpBackend.expectGET('visor/publishVersion/'+scope.slug).respond(getFakeForm());
        createController = function() {
            return $controller('VisorCtrl', {
                '$scope': scope
            });
        };
    }));
    
    it("Testing visor modes.", inject(function($controller,$rootScope) {
        var ctrl = createController();
        scope.slug = 'slug';
        expect(scope.isVisorMode()).toBe(true);
        expect(scope.isPreviewMode()).toBe(false);
        scope.slug = undefined;
        scope.formIdParam = 1;
        scope.versionIdParam = 1;
        expect(scope.isVisorMode()).toBe(false);
        expect(scope.isPreviewMode()).toBe(true);
    }));

    it("Testing visor pagination", inject(function($controller,$rootScope) {
        var ctrl = createController();
        scope.pages = getFakeForm().pages;
        scope.logic = getFakeForm().logic;
        scope.initialiceConditions();
        var page = 0;
        scope.changePage(page);
        scope.selectPage(page);
        expect(scope.selectedPageNum).toBe(page);
        expect(scope.selectedPage).toBe(scope.pages[page]);
        expect(scope.canNext()).toBe(true);
        expect(scope.getNext()).toBe(page+1);
        expect(scope.canPrevious()).toBe(false);
        expect(scope.getPrevious()).toBe(-1);
        page = 1;
        scope.changePage(page);
        scope.selectPage(page);
        expect(scope.selectedPageNum).toBe(page);
        expect(scope.selectedPage).toBe(scope.pages[page]);
        expect(scope.canNext()).toBe(true);
        expect(scope.getNext()).toBe(page+1);
        expect(scope.canPrevious()).toBe(true);
        expect(scope.getPrevious()).toBe(page-1);
        page = 2;
        scope.changePage(page);
        scope.selectPage(page);
        expect(scope.selectedPageNum).toBe(page);
        expect(scope.selectedPage).toBe(scope.pages[page]);
        expect(scope.canNext()).toBe(false);
        expect(scope.getNext()).toBe(-1);
        expect(scope.canPrevious()).toBe(true);
        expect(scope.getPrevious()).toBe(page-1);
    }));
    
    it("Testing visor auxiliar functions", inject(function($controller,$rootScope) {
        var ctrl = createController();
        scope.pages = getFakeForm().pages;
        scope.logic = getFakeForm().logic;
        scope.initialiceConditions();
        var page = 0;
        scope.changePage(page);
        scope.selectPage(page);
        expect(scope.getFieldById(1)).toBe(scope.pages[0].fields[0]);
        expect(scope.getFieldById(3)).toBe(scope.pages[1].fields[0]);
        expect(scope.getFieldById(4)).toBe(scope.pages[2].fields[0]);
        expect(scope.getPageNumByFieldId(1)).toBe(0);
        expect(scope.getPageNumByFieldId(3)).toBe(1);
        expect(scope.getPageNumByFieldId(4)).toBe(2);
    }));

    it("Testing visor logic functions", inject(function($controller,$rootScope) {
        var ctrl = createController();
        scope.pages = getFakeFormWithLogic().pages;
        scope.logic = getFakeFormWithLogic().logic;
        
        scope.initialiceConditions();
        expect(scope.showValues[1]).toBeTruthy();
        expect(scope.showValues[3]).toBeTruthy();
        expect(scope.showValues[4]).toBeFalsy();
        expect(scope.showPageValues[0]).toBeTruthy();
        expect(scope.showPageValues[1]).toBeTruthy();
        expect(scope.showPageValues[2]).toBeTruthy();

        scope.pages[1].fields[0].answer[0] = 1;
        scope.updateDependencies(3);
        expect(scope.showValues[4]).toBeTruthy();
        expect(scope.showPageValues[2]).toBeFalsy();
        
        scope.pages[1].fields[0].answer[0] = 8;
        scope.updateDependencies(3);
        expect(scope.showValues[4]).toBeFalsy();
        expect(scope.showPageValues[2]).toBeTruthy();

        scope.pages[1].fields[0].answer[0] = 2;
        scope.updateDependencies(3);
        expect(scope.showValues[4]).toBeTruthy();
        expect(scope.showPageValues[2]).toBeTruthy();        
    }));

    getFakeForm = function(){
        var pages = [
            {"fields":[{"dependencies":{"fields":[],"pages":[]},"text":"text","field_type":"TextField","tooltip":"","answer":[],"field_id":1,"required":false,"validations":{"max_len_text":255}}],"subTitle":""},
            {"fields":[{"dependencies":{"fields":[],"pages":[]},"text":"number","field_type":"NumberField","tooltip":"","answer":[],"field_id":3,"required":false,"validations":{"max_number":null,"min_number":null}}],"subTitle":""},
            {"fields":[{"dependencies":{"fields":[],"pages":[]},"text":"textArea","field_type":"TextAreaField","tooltip":"","answer":[],"field_id":4,"required":false,"validations":{"max_len_text":400}}],"subTitle":""}];

        var logic = {
            "fields": {},
            "pages": {}
        };
        var form = {};
        form.pages = pages;
        form.logic = logic;
        return form;
    };

    getFakeFormWithLogic = function(){
        var pages = [
            {"fields":[{"dependencies":{"fields":[],"pages":[]},"text":"text","field_type":"TextField","tooltip":"","answer":[],"field_id":1,"required":false,"validations":{"max_len_text":255}}],"subTitle":""},
            {"fields":[{"dependencies":{"fields":["4"],"pages":["2"]},"text":"number","field_type":"NumberField","tooltip":"","answer":[],"field_id":3,"required":false,"validations":{"max_number":null,"min_number":null}}],"subTitle":""},
            {"fields":[{"dependencies":{"fields":[],"pages":[]},"text":"textArea","field_type":"TextAreaField","tooltip":"","answer":[],"field_id":4,"required":false,"validations":{"max_len_text":400}}],"subTitle":""}];

        var logic = {
            "fields":{"4":{"operation":"Show","action":"All","conditions":[{"field":3,"comparator":"less_than","value":"5","operatorsList":["greater_than","greater_than_or_equal","equal","not_equal","less_than_or_equal","less_than"],"field_type":"NumberField","operandKind":"input"}]}},
            "pages":{"2":{"operation":"Hide","action":"Any","conditions":[{"field":3,"comparator":"equal","value":"1","operatorsList":["greater_than","greater_than_or_equal","equal","not_equal","less_than_or_equal","less_than"],"field_type":"NumberField","operandKind":"input"}]}}
        };

        var form = {};
        form.pages = pages;
        form.logic = logic;
        return form;
    };

});