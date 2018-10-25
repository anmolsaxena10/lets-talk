"use strict";

var redis = require('redis');
var promise = require('bluebird');
var db_config = require('../config/database');

const REDIS_URL = db_config.redis || 'redis://127.0.0.1:6379';

promise.promisifyAll(redis.RedisClient.prototype);
promise.promisifyAll(redis.Multi.prototype);

module.exports = function(){
	return new Promise((resolve, reject) => {
		let connector = redis.createClient(REDIS_URL);

		connector.on("error", () => {
			reject("Redis Connection failed");
		});

		connector.on("connect", () => {
			resolve(connector);
		});
	});
};
