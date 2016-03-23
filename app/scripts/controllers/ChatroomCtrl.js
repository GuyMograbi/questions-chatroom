'use strict';

angular.module('chatroom').controller('ChatroomCtrl', function ($scope, $log, ChatroomService) {
    var username = localStorage.getItem('username');
    if (!username) {
        username = 'User_' + Math.floor((Math.random() * 100) + 1); // assume random enough for exercise..
        localStorage.setItem('username', username);
    }
    $scope.username = username;

    $scope.sendQuestion = function () {
        $log.info('sending message', $scope.myMessage);
        ChatroomService.sendQuestion({content: $scope.myMessage, username: username});
        $scope.myMessage = null;
    };

    $scope.sendAnswer = function (q) {
        $log.info('sending answer to question', q);
        ChatroomService.sendAnswer(q, {content: q.answer, username: username});
        q.answer = null;
    };

    $scope.$on('answer', function (e, data) {
        var question = _.find($scope.messages, {id: data.questionId});
        question.answers.push(data.answer);
    });

    $scope.$on('msg', function (e, data) {
        $log.info('scope got msg', e, data);
        if (angular.isArray(data)) {
            $scope.messages = data;
        } else {
            $scope.messages.push(data);
        }
    });

    $scope.messages = [];
});
