var express = require('express');
var profileGet = require('./profile.get');
var profilePost = require('./profile.post');
var profileDelete = require('./profile.delete');
var profileUpdate = require('./profile.update');

var router = express.Router();

router.get('/:id', profileGet);
router.post('/', profilePost);
router.put('/:id', profileUpdate);
router.delete('/:id', profileDelete);

module.exports = router;
