'use strict';

var utils = require('../utils/writer.js');
var Model = require('../service/ModelService');

// eslint-disable-next-line no-unused-vars
module.exports.deleteModel = function deleteModel (req, res, next) {
  var model_id = req.swagger.params['model_id'].value;
  var session_token = req.swagger.params['session_token'].value;
  Model.deleteModel(model_id,session_token)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

// eslint-disable-next-line no-unused-vars
module.exports.getModel = function getModel (req, res, next) {
  var session_token = req.swagger.params['session_token'].value;
  Model.getModel(session_token)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

// eslint-disable-next-line no-unused-vars
module.exports.modifyModel = function modifyModel (req, res, next) {
  var model_id = req.swagger.params['model_id'].value;
  var session_token = req.swagger.params['session_token'].value;
  var name = req.swagger.params['name'].value;
  var shared = req.swagger.params['shared'].value;
  Model.modifyModel(model_id,session_token,name,shared)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
