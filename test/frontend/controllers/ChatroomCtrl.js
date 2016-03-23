'use strict';

/* globals expect */

describe('Controller: ChatroomCtrl', function () {
    beforeEach(module('chatroom'));

    var $rootScope = null;
    var $scope = null;

    beforeEach(inject(function ($controller, _$rootScope_) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller('ChatroomCtrl', {
            $scope: $scope
        });
    }));

    describe('load', function () {
        it('should set messages when msg events passes an array', function () {
            expect($scope.messages.length).toBe(0, 'initialized to empty');
            $rootScope.$broadcast('msg', [1, 2, 3]);
            expect($scope.messages.length).toBe(3);
        });

        it('should add a message when event passes object', function () {
            expect($scope.messages.length).toBe(0, 'initialized to empty');
            $rootScope.$broadcast('msg', {});
            expect($scope.messages.length).toBe(1);
        });
    });
});
