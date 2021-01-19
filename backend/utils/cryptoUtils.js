'use strict';
const crypto1=require('crypto');
const salt = 'ajojwe;f iugfigbvldblibfaeirubilewubfiug2938yrp 99p8r32gh9g53r4dxfui';
module.exports.hash_password = (msg) => {
    const sha256 = crypto1.createHash('sha256');
    sha256.update(msg + salt);
    return sha256.digest('hex');
};

module.exports.gen_token = () => {
    let str = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    str = str + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const sha256 = crypto1.createHash('sha256');
    sha256.update(str);
    return sha256.digest('hex');
};