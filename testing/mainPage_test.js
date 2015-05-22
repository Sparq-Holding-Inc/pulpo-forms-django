describe("MainPage Testing", function() {
    
    beforeEach(angular.mock.module('dynamicFormsFrameworkAdmin'));
    beforeEach(inject(function ($rootScope, $controller, _$location_, _$httpBackend_) {
        $location = _$location_;
        $location.url('/id/asc/');
        scope = $rootScope.$new();
        createController = function() {
            return $controller('MainPageCtrl', {
                '$scope': scope,
                '$location' : $location,
            });
        };
    }));
    
    it("Testing main modes.", inject(function($controller,$rootScope) {
        var ctrl = createController();
        var order = [
            {name: "Id", value: "id"},
            {name: "Owner", value: "owner"},
            {name: "Title", value: "title"},
        ];
        expect(ctrl.orders).toEqual(order);
        var param = 'asc';
        ctrl.selectascdsc(param);
        expect(ctrl.ascdsc).toEqual(param);
        param = 'dsc';
        ctrl.selectascdsc(param);
        expect(ctrl.ascdsc).toEqual(param);
        expect(ctrl.actualOrder()).toEqual(order[0]);
        $location.url('/owner/asc/');
        expect(ctrl.actualOrder()).toEqual(order[1]);
        $location.url('/title/asc/');
        expect(ctrl.actualOrder()).toEqual(order[2]);
    }));

});