'use strict';

var expect = require('expect.js');
var services = require('services');
var logger = require('log4js').getLogger('test_bot.spec');

beforeEach(() => {
    services.chat.remove();
});

describe('ChatService', () => {
    describe('#ask', () => {
        var question = 'why do dogs bark?';

        it('should emit a msg event', (done) => {
            services.chat.once('msg', (data) => {
                expect(data.content).to.be(question);
                done();
            });
            services.chat.ask({content: question, username: 'test'});
        });

        it('should trigger an automated response if similar question exists', (done) => {
            var firstAnswer = null;
            services.chat.on('msg', (data) => {
                logger.info('got data', data);
                if (data.id && firstAnswer === null) {
                    logger.info('got question');
                    services.chat.answer({questionId: data.id, answer: {content: 'because they cannot speak', username: 'test'}});
                }

                if (data.questionId) {
                    if (firstAnswer === null) {
                        logger.info('got first answer');
                        firstAnswer = data;
                        setTimeout(() => { // need to use timeout. otherwise will find second answer as similar to first question..
                            services.chat.ask({content: question, username: 'test1'});
                        }, 100);
                    } else {
                        done();
                    }
                }
            });

            services.chat.ask({content: question, username: 'test'});
        });
    });
});
