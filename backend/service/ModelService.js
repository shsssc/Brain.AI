'use strict';
const con = require('../utils/dbconn.js');
const User = require('../service/UserService');
const utils = require('../utils/writer.js');
const gStorage = require('../utils/gcloud');

/**
 * remove model the user owns
 * remove model the user created
 *
 * model_id Integer id of model to delete
 * session_token String session token of a user session
 * no response value expected for this operation
 **/
exports.deleteModel = async function (model_id, session_token) {
    const uid = await User.token2uid(session_token);
    if (uid === -1) {
        return utils.respondWithCode(401, {
            "error": 'unauthorized'
        });
    }

    const [d] = await con.promise().query('select * from models where owner = ? and id = ?', [uid, model_id]);
    if (d.length === 1) {
        try {
            await gStorage.deleteFile(d[0].location);
        } catch (e) {
            console.log(e);
        }

    }

    const [d1] = await con.promise().query('delete from models where owner = ? and id = ?', [uid, model_id]);
    if (d1.affectedRows === 1) {
        return {};
    }
    return utils.respondWithCode(400, {
        "error": 'invalid model'
    });
}


/**
 * list all Models the user can see
 * list all Models the user owns or is shared
 *
 * session_token String session token of a user session
 * returns List
 **/
exports.getModel = async function (session_token) {
    const uid = await User.token2uid(session_token);
    if (uid === -1) {
        return utils.respondWithCode(401, {
            "error": 'unauthorized'
        });
    }
    // eslint-disable-next-line no-unused-vars
    const [d, _] = await con.promise().query('select * from models where owner = ? or shared = 1', [uid]);
    return d;
}


/**
 * change model the user owns
 * modify model the user created
 *
 * model_id Integer id of model to delete
 * session_token String session token of a user session
 * name String new name of model (optional)
 * shared Boolean new share status of model (optional)
 * no response value expected for this operation
 **/
exports.modifyModel = async function (model_id, session_token, name, shared) {
    const uid = await User.token2uid(session_token);
    if (uid === -1) {
        return utils.respondWithCode(401, {
            "error": 'unauthorized'
        });
    }
    if (name) {
        // eslint-disable-next-line no-unused-vars
        const [d, _] = await con.promise().query('update models set name = ? where owner = ? and id = ?', [name, uid, model_id]);
        if (d.affectedRows !== 1) {
            return utils.respondWithCode(400, {
                "error": 'invalid model'
            });
        }
    }

    if (shared !== undefined) {
        // eslint-disable-next-line no-unused-vars
        const [d, _] = await con.promise().query('update models set shared = ? where owner = ? and id = ?', [shared, uid, model_id]);
        if (d.affectedRows !== 1) {
            return utils.respondWithCode(400, {
                "error": 'invalid model'
            });
        }
    }
}

