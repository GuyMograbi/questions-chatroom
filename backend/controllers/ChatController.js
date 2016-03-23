'use strict';

var express = require('express');
var router = new express.Router();
var sse = require('turbo-pancake');
var logger = require('log4js').getLogger('ChatController');
var services = require('../services');

router.get('/', (req, res) => { // get all history without registering to events..
    res.send(services.chat.memory);
});

router.post('/', (req, res) => {
    logger.info('posting message', req.body);
    services.chat.ask(req.body.message);
    res.send();
});

router.post('/answer/:question_id', (req, res) => {
    try {
        logger.info('answering question', req.params.question_id);
        services.chat.answer({questionId: req.params.question_id, answer: req.body.answer});
        res.send();
    } catch (e) {
        logger.error('unable to answer question', e);
        res.status(500).send(e.toString());
    }
});

router.get('/events', sse, function (req, res) {
    logger.info('registering new listener');

    var listener = (e) => {
        logger.info('posting msg to clients', e);
        res.sse(e);
    };

    services.chat.on('msg', listener);

    res.on('close', () => {
        logger.info('response closed');
        services.chat.removeListener('msg', listener);
    });

    res.sse(services.chat.memory); // get all history.. or use GET from above
});

module.exports = router;
