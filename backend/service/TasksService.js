'use strict';
const con = require('../utils/dbconn.js');
const User = require('../service/UserService');
const utils = require('../utils/writer.js');

/**
 * create new task
 * generate new task for training/prediction
 *
 * session_token String session token of a user session
 * data Integer data id for the task
 * type String the type of the task (optional)
 * model Integer model id for the prediction task (optional)
 * no response value expected for this operation
 **/
exports.createTask = async function (session_token, data, type, model) {
    const uid = await User.token2uid(session_token);
    if (uid === -1) {
        return utils.respondWithCode(401, {
            "error": 'unauthorized'
        });
    }
    if (type !== 'training' && type !== 'prediction' && type !== 'preview') {
        return utils.respondWithCode(400, {
            "error": 'invalid type'
        });
    }
    if (type === 'prediction' && model === undefined) {
        return utils.respondWithCode(400, {
            "error": 'invalid model'
        });
    }
    const [d] = await con.promise().query('select id from data where id = ? and owner = ?', [data, uid]);
    if (d.length !== 1) {
        return utils.respondWithCode(400, {
            "error": 'invalid data'
        });
    }
    if (model) {
        const [d] = await con.promise().query('select id from models where id = ? and (owner = ? or shared = 1)', [model, uid]);
        if (d.length !== 1) {
            return utils.respondWithCode(400, {
                "error": 'invalid model'
            });
        }
    }
    await con.promise().query('insert into tasks set owner = ?, model = ?, data = ?, type = ? ', [uid, model, data, type]);
    return utils.respondWithCode(200, {});
};


/**
 * remove task from tasklist
 * remove task the user created. The task must **not** be running.
 *
 * task_id Integer id of task to delete
 * session_token String session token of a user session
 * no response value expected for this operation
 **/
exports.deleteTask = async function (task_id, session_token) {
    const uid = await User.token2uid(session_token);
    if (uid === -1) {
        return utils.respondWithCode(401, {
            "error": 'unauthorized'
        });
    }
    // eslint-disable-next-line no-unused-vars
    const [d, _] = await con.promise().query('delete from tasks where owner = ? and id = ? and (status = \'success\' or status = \'failed\' or status = \'stopped\')', [uid, task_id]);
    if (d.affectedRows === 0) {
        return utils.respondWithCode(400, {
            "error": 'invalid task id'
        });
    }
    return utils.respondWithCode(200, {});
};


/**
 * list all tasks the user owns
 * list all tasks the user owns
 *
 * session_token String session token of a user session
 * returns List
 **/
exports.getTask = async function (session_token) {
    const uid = await User.token2uid(session_token);
    if (uid === -1) {
        return utils.respondWithCode(401, {
            "error": 'unauthorized'
        });
    }
    // eslint-disable-next-line no-unused-vars
    const [d, _] = await con.promise().query('select * from tasks where owner = ?', [uid]);
    return utils.respondWithCode(200, d);
};


/**
 * stop a task that is pending or running
 * stop task the user created. The task must be pending or running.
 *
 * task_id Integer id of task to stop
 * session_token String session token of a user session
 * no response value expected for this operation
 **/
exports.stopTask = async function (task_id, session_token) {
    const uid = await User.token2uid(session_token);
    if (uid === -1) {
        return utils.respondWithCode(401, {
            "error": 'unauthorized'
        });
    }
    // eslint-disable-next-line no-unused-vars
    const [d, _] = await con.promise().query('update tasks set status = \'stopped\' where owner = ? and id = ?', [uid, task_id]);
    if (d.affectedRows === 0) {
        return utils.respondWithCode(400, {
            "error": 'invalid task id'
        });
    }
    return utils.respondWithCode(200, {});
};

