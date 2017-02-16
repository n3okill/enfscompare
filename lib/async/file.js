/**
 * @project enfscompare
 * @filename file.js
 * @author Joao Parreira <joaofrparreira@gmail.com>
 * @copyright Copyright(c) 2016 Joao Parreira <joaofrparreira@gmail.com>
 * @licence Creative Commons Attribution 4.0 International License
 * @createdAt Created at 07-04-2016.
 * @version 0.0.1
 * @since 0.0.1
 * @description async file comparison
 */

"use strict";

const nodePath = require("path");
const nodeCrypto = require("crypto");
const enfs = require("enfspatch");


const kindOf = (arg) => arg === null ? "null" : typeof arg === "undefined" ? "undefined" : /^\[object (.*)\]$/.exec(Object.prototype.toString.call(arg))[1].toLowerCase();
const isFunction = (arg) => kindOf(arg) === "function";

function compareFiles(file1, file2, options, callback) {
    let ended1, ended2, calledBack;
    calledBack = false;
    ended1 = false;
    ended2 = false;
    const stream1 = options.fs.createReadStream(file1);
    const stream2 = options.fs.createReadStream(file2);
    const chunkSize = options.chunkSize && !isNaN(options.chunkSize) ? options.chunkSize : stream1._readableState.highWaterMark;
    let data1 = new Buffer(0);
    let data2 = new Buffer(0);

    function compare() {
        if (data1.length >= chunkSize && data2.length >= chunkSize && !calledBack) {
            let buf1 = data1.slice(0, chunkSize);
            let buf2 = data2.slice(0, chunkSize);
            if (!buf1.equals(buf2)) {
                stream1.destroy();
                stream2.destroy();
                calledBack = true;
                return callback(null, false);
            }
            data1 = data1.slice(chunkSize);
            data2 = data2.slice(chunkSize);
        }
    }

    function compareFinal() {
        if (ended1 === true && ended2 === true) {
            if (data1.equals(data2)) {
                return callback(null, true);
            }
            callback(null, false);
        }
    }

    stream1.on("error", (err) => {
        stream2.destroy();
        return callback(err);
    });
    stream2.on("error", (err) => {
        stream1.destroy();
        return callback(err);
    });

    stream1.on("data", (chunk) => {
        data1 = Buffer.concat([data1, chunk]);
        compare();
    });
    stream2.on("data", (chunk) => {
        data2 = Buffer.concat([data2, chunk]);
        compare();
    });
    stream1.on("end", () => {
        ended1 = true;
        compareFinal();
    });
    stream2.on("end", () => {
        ended2 = true;
        compareFinal();
    });
}

function statCompare(path1, path2, options, callback) {
    options.stat(path1, (err, stat1) => {
        if (err || !stat1.isFile()) {
            return callback(err || new Error("file1 is not a file."));
        }
        options.stat(path2, (err2, stat2) => {
            if (err2 || !stat2.isFile()) {
                return callback(err2 || new Error("file2 is not a file."));
            }
            if (stat1.size === stat2.size) {
                return callback(null, true);
            }
            return callback(null, false);
        });
    });
}


/**
 * Compare two files in a byte-to-byte comparison
 * @param {string} path1 - the path to the first file
 * @param {string} path2 - the path to the second file
 * @param {object} opt - various options for list module
 *              {bool} opt.dereference - defines the type of stat that will be used in files
 *              {object} opt.fs - the fs module to be used will use enfs by default
 *              {Number} opt.chunkSize - the size in bytes used to verify equality default to ReadStream._readableState.highWaterMark
 * @param {function} callback - the callback function that will be called after the comparison is done
 * @return {Error|Array}
 */
function byte(path1, path2, opt, callback) {
    let options;
    if (isFunction(opt)) {
        callback = opt;
        opt = {};
    }
    options = opt || {};
    options.fs = options.fs || enfs;
    options.dereference = options.dereference === true;
    options.stat = options.dereference ? options.fs.stat : options.fs.lstat;

    const file1 = nodePath.resolve(path1);
    const file2 = nodePath.resolve(path2);
    statCompare(file1, file2, options, (err, result) => {
        if (err || result === false) {
            return callback(err || null, false);
        }
        compareFiles(file1, file2, options, callback);
    });
}

/**
 * Compare two files in a hash comparison
 * @param {string} path1 - the path to the first file
 * @param {string} path2 - the path to the second file
 * @param {object} opt - various options for list module
 *              {bool} opt.dereference - defines the type of stat that will be used in files
 *              {object} opt.fs - the fs module to be used will use enfs by default
 *              {string} opt.hash - the type of hash to use in comparison, default to 'sha512'
 *              {string} opt.encoding - the type of hash encoding used to compare the files, default to 'hex'
 * @param {function} callback - the callback function that will be called after the comparison is done
 * @return {Error|Array}
 */
function hash(path1, path2, opt, callback) {
    let options;
    if (isFunction(opt)) {
        callback = opt;
        opt = {};
    }

    options = opt || {};
    options.fs = options.fs || enfs;
    options.dereference = options.dereference === true;
    options.stat = options.dereference ? options.fs.stat : options.fs.lstat;
    options.hash = options.hash || "sha512";
    options.encoding = options.encoding || "hex";

    const file1 = nodePath.resolve(path1);
    const file2 = nodePath.resolve(path2);
    statCompare(file1, file2, options, (err, result) => {
        if (err || result === false) {
            return callback(err || null, false);
        }
        let done1, done2;
        done1 = false;
        done2 = false;
        const stream1 = options.fs.createReadStream(file1);
        const stream2 = options.fs.createReadStream(file2);
        const hash1 = nodeCrypto.createHash(options.hash);
        const hash2 = nodeCrypto.createHash(options.hash);
        hash1.setEncoding(options.encoding);
        hash2.setEncoding(options.encoding);
        function compare() {
            if (done1 === true && done2 === true) {
                return callback(null, hash1.read() === hash2.read(), hash1.read(), hash2.read());
            }
        }

        stream1.on("error", (err) => {
            stream2.destroy();
            return callback(err);
        });
        stream2.on("error", (err) => {
            stream1.destroy();
            return callback(err);
        });

        stream1.on("end", () => {
            hash1.end();
            done1 = true;
            compare();
        });
        stream2.on("end", () => {
            hash2.end();
            done2 = true;
            compare();
        });
        stream1.pipe(hash1);
        stream2.pipe(hash2);
    });
}


module.exports = {
    byte,
    hash
};


