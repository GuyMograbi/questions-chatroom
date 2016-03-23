'use strict';

angular.module('chatroom').service('ChatroomService', function ($http, $log, $rootScope, $timeout) {
    this.getChatHistory = function () {
        return $http.get('/backend/chat');
    };

    /**
     *
     * @param {object} msg
     * @param {string} msg.content
     * @param {string} msg.username
     */
    this.sendQuestion = function (msg) {
        $http.post('/backend/chat', {message: msg});
    };

    this.sendAnswer = function (question, answer) {
        $http.post('/backend/chat/answer/' + question.id, {answer: answer});
    };

    $log.info('registering to events');
    var eventSource = new EventSource('/backend/chat/events');
    eventSource.onmessage = function (e) {
        $timeout(function () {
            $log.info('got event from server', e);
            if (e.data) {
                try {
                    var data = JSON.parse(e.data);
                    if (data.questionId) {
                        $rootScope.$broadcast('answer', data);
                    } else {
                        $rootScope.$broadcast('msg', data);
                    }
                } catch (e) {
                }
            }
        }, 0);
    };
});
