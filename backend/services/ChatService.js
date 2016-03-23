'use strict';

var EventEmitter = require('events');
var path = require('path');
var fs = require('fs-extra');
var uuid = require('node-uuid');
var _ = require('lodash');
var logger = require('log4js').getLogger('ChatService');
var cosine = require('cosine');

var FILE_PATH = path.resolve('./dev/db.json');
logger.info('db to be kept at', FILE_PATH);
fs.ensureFileSync(FILE_PATH);

var SIMILARITY_LEVEL = 0.75;

class ChatDb extends EventEmitter {

    constructor() {
        super();

        this.memory = [];
        try {
            this.memory = require(FILE_PATH);
        } catch (e) { /* ignore failure as it is not important for task */
        }
    }

    save() {
        fs.writeJsonSync(FILE_PATH, this.memory);
    }

    keep(data) {
        var item = _.merge({
            id: uuid.v4(),
            answers: [],
            timestamp: new Date().getTime()
        }, data);

        this.memory.push(item);
        return item;
    }

    /**
     *
     * @param {object} data
     * @param {string} data.content
     * @param {string} data.username
     */
    ask(data) {
        logger.info('service got', data);
        data = this.keep(data);
        this.emit('msg', data);
        this.save();
        try { // find most similar (! - bad performance but more quality results) question with answers and let bot post an automatic answer
            var bestSimilarity = 0;
            var similarQuestion = null;
            _.each(this.memory, (q) => {
                if (_.size(q.answers) > 0) {
                    var similarity = cosine(q.content.toLowerCase().split(/\s/), data.content.toLowerCase().split(/\s/));
                    if (similarity > SIMILARITY_LEVEL && similarity > bestSimilarity) { // set a lower boundary on similarity
                        bestSimilarity = similarity;
                        similarQuestion = q;
                    }
                }
            });
            if (similarQuestion) {
                this.answer({
                    questionId: data.id,
                    answer: {
                        content: _.first(similarQuestion.answers).content,
                        username: 'bot'
                    }
                });
            }
        } catch (e) {

        }
    }

    remove() {
        logger.info('removing db');
        fs.removeSync(FILE_PATH);
        this.memory = [];
    }

    getQuestion(questionId) {
        return _.find(this.memory, {id: questionId});
    }

    /**
     *
     * @param {object} data
     * @param {string} data.questionId
     * @param {object} data.answer
     * @param {string} data.answer.content
     * @param {string} data.answer.username
     */
    answer(data) {
        var q = this.getQuestion(data.questionId);
        data.answer.timestamp = new Date().getTime();
        q.answers.push(data.answer);
        this.emit('msg', data);
        this.save();
    }

}

module.exports = new ChatDb();

