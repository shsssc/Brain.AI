'use strict';
const utils = require('../utils/writer.js');
const con = require('../utils/dbconn.js');
const crypto = require('../utils/cryptoUtils.js');
/**
 * createUser
 * new user sign up
 *
 * email String password of user
 * password String password of user
 * no response value expected for this operation
 **/
exports.createUser = async function (email, password) {
    // eslint-disable-next-line no-unused-vars
    const [d, _] = await con.promise().query('select * from users where email = ?', [email]);
    if (d.length !== 0)
        return utils.respondWithCode(409, {'error': 'email already registered!'});
    await con.promise().query('insert into users set email = ?, password = ?', [email, crypto.hash_password(password)]);
    return utils.respondWithCode(200, {});
}


/**
 * user log out
 * authorized user log out
 *
 * session_token String session token of a user session
 * no response value expected for this operation
 **/
exports.logOut = async function (session_token) {
    // eslint-disable-next-line no-unused-vars
    const [a, b] = await con.promise().query('update sessions set valid = 0 where session_token = ?', [session_token]);
    if (a.affectedRows === 1)
        return {};
    return utils.respondWithCode(401, {
        "error": "invalid token"
    });
}


/**
 * user login
 * new user log in
 *
 * email String password of user
 * password String password of user
 * returns inline_response_200
 **/
exports.login = async function (email, password) {
    // eslint-disable-next-line no-unused-vars
    const [d, _] = await con.promise().query('select * from users where email = ? and password = ?', [email, crypto.hash_password(password)]);
    if (d.length !== 1)
        return utils.respondWithCode(401, {
            "error": "invalid credentials"
        });
    const new_token = crypto.gen_token();
    await con.promise().query('insert into sessions set user_id = ?, session_token = ?, valid = 1', [d[0].id, new_token]);
    return utils.respondWithCode(200, {
        "user_token": new_token,
        "user_id": d[0].id
    });
}

exports.token2uid = async function(session_token){
    // eslint-disable-next-line no-unused-vars
    const [d, b] = await con.promise().query('select * from sessions where session_token = ? and valid=1', [session_token]);
    if(d.length===0)
        return -1;
    return d[0].user_id;
}