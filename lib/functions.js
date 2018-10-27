"use strict";

var client = require("../lib/redis");
var Message = require('../api/models/message');


exports.fetchMessages = (user) => {
	return new Promise((resolve, reject) => {
		client().then(
			res => {
				res.lrangeAsync(user.profile._id + ":messages", 0, -1).then(
					messages => {
						// console.log(messages);
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
						// console.log(messages);
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
					.rpush(message.to._id + ":messages", JSON.stringify(message))
					.execAsync()
					.then(
						res => {
							resolve(res);
						},
						err => {
							reject(err);
						}
					);
				res
					.multi()
					.rpush(message.from._id + ":messages", JSON.stringify(message))
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
					.rpush(message.to._id + ":offMessages", JSON.stringify(message))
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
					.sadd("users", user.profile._id)
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
			this.fetchActiveUsers().then(users => {
				// users = u;
				if (users.indexOf(message.to._id) !== -1) {
					client.publish(message.to._id + ":channel", JSON.stringify(message));
				}
				else {
					this.addOfflineMessage(message).then(
						() => {
							console.log('Added offline message');
						},
						err => {
							console.log(err);
						}
					);
				}
				this.addMessage(message).then(
					() => {
						console.log('Added message into list');
					},
					err => {
						console.log(err);
					}
				);
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
			this.fetchMessages(user).then(messages => {
				// messages.forEaach
			},
			err => {
				console.log(err);
			}
		);
	});
}