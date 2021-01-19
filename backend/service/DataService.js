'use strict';
const con = require('../utils/dbconn.js');
const User = require('../service/UserService');
const utils = require('../utils/writer.js');
const gStorage = require('../utils/gcloud');
const crypto = require('../utils/cryptoUtils.js');


const bucket = 'cs130skullstrip';

/**
 * remove data the user uploaded
 * remove data the user uploaded
 *
 * data_id Integer data id of data to delete
 * session_token String session token of a user session
 * no response value expected for this operation
 **/
exports.deleteData = async function (data_id, session_token) {
    const uid = await User.token2uid(session_token);
    if (uid === -1) {
        return utils.respondWithCode(401, {
            "error": 'unauthorized'
        });
    }

    const [d] = await con.promise().query('select * from data where owner = ? and id = ?', [uid, data_id]);
    if(d.length===1){
        try {
            await gStorage.deleteFile(d[0].location);
        } catch (e) {
            console.log(e);
        }
    }

    const [d1] = await con.promise().query('delete from data where owner = ? and id = ?', [uid, data_id]);
    if (d1.affectedRows === 1) {
        return {};
    }
    return utils.respondWithCode(400, {
        "error": 'invalid data'
    });
};


/**
 * list all data the user owns
 * list all data the user owns
 *
 * session_token String session token of a user session
 * returns List
 **/
exports.getData = async function (session_token) {
    const uid = await User.token2uid(session_token);
    if (uid === -1) {
        return utils.respondWithCode(401, {
            "error": 'unauthorized'
        });
    }
    const [d] = await con.promise().query('select * from data where owner = ? and type is not null', [uid]);

    return d.map(data=>({...data,location:`https://storage.googleapis.com/${bucket}/`+data.location}));
};


/**
 * rename data
 * rename the uploaded data
 *
 * name String name of the dataset
 * data_id Integer data id of data to rename
 * session_token String session token of a user session
 * no response value expected for this operation
 **/
exports.modifyData = async function (name, data_id, session_token) {
    const uid = await User.token2uid(session_token);
    if (uid === -1) {
        return utils.respondWithCode(401, {
            "error": 'unauthorized'
        });
    }
    const [d] = await con.promise().query('update data set name = ?  where owner = ? and id = ?', [name, uid, data_id]);
    if (d.affectedRows === 1) {
        return {};
    }
    return utils.respondWithCode(400, {
        "error": 'invalid data'
    });
};


/**
 * upload new data
 * upload data
 *
 * name String name of the dataset
 * file byte[] content of the zip file
 * session_token String session token of a user session
 * returns inline_response_200_2
 **/
// eslint-disable-next-line no-unused-vars
exports.uploadData = async function (name, session_token) {
    const uid = await User.token2uid(session_token);
    if (uid === -1) {
        return utils.respondWithCode(401, {
            "error": 'unauthorized'
        });
    }
    const location = 'data/' + name + '_' + crypto.gen_token() + '.zip';
    const [d] = await con.promise().query('insert into data set name = ? , owner = ?, location = ?', [name, uid, location]);
    if (d.affectedRows !== 1) {
        return utils.respondWithCode(500, {
            "error": 'failed to add new file'
        });
    }
    const upload_url = await gStorage.generateV4UploadSignedUrl(180, location);
    return utils.respondWithCode(200, {
        data_id: d.insertId,
        upload_url: upload_url
    });
};

