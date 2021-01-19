'use strict';

var utils = require('../utils/writer.js');
var User = require('../service/UserService');

// eslint-disable-next-line no-unused-vars
module.exports.createUser = function createUser (req, res, next) {
  var email = req.swagger.params['email'].value;
  var password = req.swagger.params['password'].value;
  User.createUser(email,password)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

// eslint-disable-next-line no-unused-vars
module.exports.logOut = function logOut (req, res, next) {
  var session_token = req.swagger.params['session_token'].value;
  User.logOut(session_token)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

// eslint-disable-next-line no-unused-vars
module.exports.login = function login (req, res, next) {
  var email = req.swagger.params['email'].value;
  var password = req.swagger.params['password'].value;
  User.login(email,password)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
