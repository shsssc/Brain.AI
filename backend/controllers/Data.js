'use strict';

var utils = require('../utils/writer.js');
var Data = require('../service/DataService');

// eslint-disable-next-line no-unused-vars
module.exports.deleteData = function deleteData (req, res, next) {
  var data_id = req.swagger.params['data_id'].value;
  var session_token = req.swagger.params['session_token'].value;
  Data.deleteData(data_id,session_token)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

// eslint-disable-next-line no-unused-vars
module.exports.getData = function getData (req, res, next) {
  var session_token = req.swagger.params['session_token'].value;
  Data.getData(session_token)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

// eslint-disable-next-line no-unused-vars
module.exports.modifyData = function modifyData (req, res, next) {
  var name = req.swagger.params['name'].value;
  var data_id = req.swagger.params['data_id'].value;
  var session_token = req.swagger.params['session_token'].value;
  Data.modifyData(name,data_id,session_token)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

// eslint-disable-next-line no-unused-vars
module.exports.uploadData = function uploadData (req, res, next) {
  var name = req.swagger.params['name'].value;
  var session_token = req.swagger.params['session_token'].value;
  Data.uploadData(name,session_token)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
