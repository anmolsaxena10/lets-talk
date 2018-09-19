var express = require('express');
var messageGet = require('./message.get');
var messagePost = require('./message.post');
var messageDelete = require('./message.delete');
var messageUpdate = require('./message.update');

var router = express.Router();

router.get('/:id', messageGet);
router.post('/', messagePost);
router.put('/:id', messageUpdate);
router.delete('/:id', messageDelete);

module.exports = router;
