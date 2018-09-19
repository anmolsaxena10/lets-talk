var express = require('express');
var chatGet = require('./chat.get');
var chatPost = require('./chat.post');
var chatDelete = require('./chat.delete');
var chatUpdate = require('./chat.update');

var router = express.Router();

router.get('/*?', chatGet);
router.post('/', chatPost);
router.put('/:id', chatUpdate);
router.delete('/:id', chatDelete);

module.exports = router;
