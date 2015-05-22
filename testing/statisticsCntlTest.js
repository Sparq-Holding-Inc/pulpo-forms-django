describe("EditorCtrl Testing Pages", function() {
    
    beforeEach(angular.mock.module('dynamicFormsFramework'));
     
    
    xit("Field Types constant successfully loaded.", inject(function( _$httpBackend_,$controller,$rootScope) {
        var scope = $rootScope.$new();
        var $httpBackend = _$httpBackend_;
        var ctrl = $controller('EditorCtrl', {$scope: scope});     
        expect(ctrl.FieldTypes).not.toBe(null);
        expect(ctrl.FieldTypes).toBeDefined();
    }));
    
    xit("Adding Pages.", inject(function($controller,$rootScope) {
        var scope = $rootScope.$new();
        var ctrl = $controller('EditorCtrl', {$scope: scope});
        expect(ctrl.pages[0]).not.toBeNull();
        ctrl.addPage();
        expect(ctrl.pages[1]).toBeDefined();
        expect(ctrl.pages[1]).not.toBeNull();
        expect(ctrl.pages[1]!=ctrl.pages[0]).toBe(true);
        expect(ctrl.pages.length).toBe(2);
    }));
    
    
    xit("Delete Pages.", inject(function($controller,$rootScope) {
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
    
    
    xit("Select Page.", inject(function($controller,$rootScope) {
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
    
   beforeEach(angular.mock.module('dynamicFormsFramework'));
  
    
    xit("Add Fields to Some Page.", inject(function($controller,$rootScope) {
        var scope = $rootScope.$new();
        var ctrl = $controller('EditorCtrl', {$scope: scope});
        ctrl.addPage();
        ctrl.addPage();
        expect(ctrl.pages.length).toBe(3);    
        ctrl.selectPage(0);  
        ctrl.addField(ctrl.FieldTypes[0]);
        ctrl.addField(ctrl.FieldTypes[0]);
        ctrl.addField(ctrl.FieldTypes[0]);
        expect(ctrl.pages[0].fields[0]).not.toBe(null);
        expect(ctrl.pages[0].fields[0]).toBeDefined();
        expect(ctrl.pages[0].fields.length).toBe(3); 
    }));
    
        
    xit("Delete Fields in Some Page.", inject(function($controller,$rootScope) {
        var scope = $rootScope.$new();
        var ctrl = $controller('EditorCtrl', {$scope: scope});
        ctrl.addPage();
        ctrl.addPage();
        expect(ctrl.pages.length).toBe(3);    
        ctrl.selectPage(0);  
        ctrl.addField(ctrl.FieldTypes[0]);
        ctrl.addField(ctrl.FieldTypes[0]);
        ctrl.addField(ctrl.FieldTypes[0]);
        expect(ctrl.pages[0].fields.length).toBe(3);
        ctrl.deleteField(0,1);
        expect(ctrl.pages[0].fields.length).toBe(2);
    }));
    
    xit("Add Options to Some Field in a page.", inject(function($controller,$rootScope) {
        var scope = $rootScope.$new();
        var ctrl = $controller('EditorCtrl', {$rootScope: scope});
        ctrl.addPage();
        ctrl.addPage();
        expect(ctrl.pages.length).toBe(3);    
        ctrl.selectPage(0);  
        ctrl.addField("check_box");
        ctrl.addField("check_box");
        ctrl.addField("check_box");      
        ctrl.selectField(0,0);
        ctrl.addOption();
        alert(ctrl.pages[0].fields[0].options);
        expect(ctrl.pages[0].fields[0].options.length).toBe(1);
        ctrl.selectField(0,2);
        ctrl.addOption();
        alert(ctrl.pages[0].fields[2].options);
        expect(ctrl.pages[0].fields[2].options.length).toBe(1);
    }));
    
    xit("Delete Options to Some Field in a page.", inject(function($controller,$rootScope) {
        var scope = $rootScope.$new();
        var ctrl = $controller('EditorCtrl', {$scope: scope});
        ctrl.selectPage(0);  
        ctrl.addField("check_box");
        ctrl.addField("check_box");
        ctrl.addField("check_box");         
        ctrl.selectField(0,2);
        ctrl.addOption();
        expect(ctrl.pages[0].fields[2].options.length).toBe(1);
        ctrl.deleteOption(0);
        expect(ctrl.pages[0].fields[2].options.length).toBe(0);
    }));

    it("Delete Options to Some Field in a page.", inject(function($controller,$rootScope) {
        var scope = $rootScope.$new();
        var ctrl = $controller('VisorCtrl', {$scope: scope});
    }));

});
