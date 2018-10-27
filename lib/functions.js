"use strict";

var client = require("../lib/redis");
var Message = require('../api/models/message');


exports.fetchMessages = (user) => {
	return new Promise((resolve, reject) => {
		client().then(
			res => {
				res.lrangeAsync(user.profile._id + ":messages", 0, -1).then(
					messages => {
						console.log(messages);
						resolve(messages);
					},
					err => {
						reject(err);
					}
				);
			},
			err => {
				reject("Redis connection failed: " + err);
			}
		);
	});
};

exports.fetchOfflineMessages = (user) => {
	return new Promise((resolve, reject) => {
		client().then(
			res => {
				res.lrangeAsync(user.profile._id + ":offMessages", 0, -1).then(
					messages => {
						console.log(messages);
						resolve(messages);
					},
					err => {
						reject(err);
					}
				);
			},
			err => {
				reject("Redis connection failed: " + err);
			}
		);
	});
};

exports.addMessage = message => {
	return new Promise((resolve, reject) => {
		client().then(
			res => {
				res
					.multi()
					.rpush(message.to.profile._id + ":messages", JSON.stringify(message))
					.execAsync()
					.then(
						res => {
							resolve(res);
						},
						err => {
							reject(err);
						}
					);
			},
			err => {
				reject("Redis connection failed: " + err);
			}
		);
	});
};

exports.addOfflineMessage = (message) => {
	return new Promise((resolve, reject) => {
		client().then(
			res => {
				res
					.multi()
					.rpush(message.to.profile._id + ":offMessages", JSON.stringify(message))
					.execAsync()
					.then(
						res => {
							resolve(res);
						},
						err => {
							reject(err);
						}
					);
			},
			err => {
				reject("Redis connection failed: " + err);
			}
		);
	});
};

exports.fetchActiveUsers = () => {
	return new Promise((resolve, reject) => {
		client().then(
			res => {
				res.smembersAsync("users").then(
					users => {
						resolve(users);
					},
					err => {
						reject(err);
					}
				);
			},
			err => {
				reject("Redis connection failed: " + err);
			}
		);
	});
};

exports.addActiveUser = user => {
	return new Promise((resolve, reject) => {
		client().then(
			res => {
				res
					.multi()
					.sadd("users", JSON.stringify(user))
					.execAsync()
					.then(
						res => {
							if (res[0] === 1) {
								resolve("User added");
							}

							reject("User already in list");
						},
						err => {
							reject(err);
						}
					);
			},
			err => {
				reject("Redis connection failed: " + err);
			}
		);
	});
};

exports.removeActiveUser = user => {
	return new Promise((resolve, reject) => {
		client().then(
			res => {
				res
					.multi()
					.srem("users", JSON.stringify(user))
					.execAsync()
					.then(
						res => {
							if (res === 1) {
								resolve("User removed");
							}
							reject("User is not in list");
						},
						err => {
							reject(err);
						}
					);
			},
			err => {
				reject("Redis connection failed: " + err);
			}
		);
	});
};

exports.publishMessage = message => {
	client().then(
		client => {
			fetchActiveUsers().then(u => {
				users = u;
				if (users.indexOf(JSON.stringify(message.to)) !== -1) {
					client.publish(message.to.profile._id + ":channel", JSON.stringify(message));

					addMessage(message).then(
						() => {
							res.send({
								status: 200,
								message: "Message sent"
							});
						},
						err => {
							console.log(err);
						}
					);
				}
				else {
					addOfflineMessage(message).then(
						() => {
							res.send({
								status: 200,
								message: "Message sent, User offline"
							});
						},
						err => {
							console.log(err);
						}
					);
				}
			},
			err => {
				console.log(err);
			}
		);
	});
}

exports.persistMessages = user => {
	client().then(
		client => {
			fetchMessages(user).then(messages => {
				// messages.forEaach
			},
			err => {
				console.log(err);
			}
		);
	});
}