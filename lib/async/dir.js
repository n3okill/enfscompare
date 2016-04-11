/**
 * @project enfscompare
 * @filename dir.js
 * @author Joao Parreira <joaofrparreira@gmail.com>
 * @copyright Copyright(c) 2016 Joao Parreira <joaofrparreira@gmail.com>
 * @licence Creative Commons Attribution 4.0 International License
 * @createdAt Created at 07-04-2016.
 * @version 0.0.1
 * @since 0.0.1
 * @description async directory comparison
 */

"use strict";

const nodePath = require("path");
const enfs = require("enfspatch");
const enfsList = require("enfslist");
const compareFile = require("./file");

/**
 * Compare two directories in a byte-to-byte file comparison
 * Note: This method will compare all sub-folder's
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

    const dir1 = nodePath.resolve(path1);
    const dir2 = nodePath.resolve(path2);

    options = opt || {};
    options.fs = options.fs || enfs;
    options.dereference = options.dereference === true;

    statCompare(dir1, dir2, options, (err, result)=> {
        if (err || result === false) {
            return callback(err || null, false);
        }
        compareFiles("byte", dir1, dir2, options, callback);
    });
}


/**
 * Compare two directories with a hash file comparison
 * Note: This method will compare all sub-folder's
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

    const dir1 = nodePath.resolve(path1);
    const dir2 = nodePath.resolve(path2);
    statCompare(dir1, dir2, options, (err, result)=> {
        if (err || result === false) {
            return callback(err || null, false);
        }
        compareFiles("hash", dir1, dir2, options, callback);
    });
}


function compareFiles(type, dir1, dir2, options, callback) {
    options.list = options.fs.list || enfsList.list;

    options.list(dir1, options, (err, items1)=> {
        if (err) {
            return callback(err);
        }
        options.list(dir2, options, (err2, items2)=> {
            if (err2) {
                return callback(err2);
            }
            if (items1.length !== items2.length) {
                return callback(null, false);
            }
            let calledBack = false;
            const files1 = items1.filter(f=>f.stat.isFile());
            const files2 = items2.filter(f=>f.stat.isFile());
            const files2Reduce = files2.map(i=>i.path.replace(dir2, ""));
            let size = files1.length;
            files1.some(item=> {
                if (calledBack) {
                    return true;
                }
                const pathReduced = item.path.replace(dir1, "");
                //file in first path is not present in second
                const index = files2Reduce.indexOf(pathReduced);
                if (index === -1) {
                    calledBack = true;
                    return callback(null, false);
                }
                compareFile[type](item.path, files2[index].path, options, (err, result)=> {
                    if (err || result === false) {
                        calledBack = true;
                        return callback(err || null, false);
                    }
                    if (--size === 0) {
                        calledBack = true;
                        return callback(null, true);
                    }
                });
            });
        });
    });
}

function statCompare(path1, path2, options, callback) {
    options.stat = options.dereference ? options.fs.stat : options.fs.lstat;

    options.stat(path1, (err, stat1)=> {
        if (err || !stat1.isDirectory()) {
            return callback(err || new Error("path1 is not a directory."));
        }
        options.stat(path2, (err2, stat2)=> {
            if (err2 || !stat2.isDirectory()) {
                return callback(err2 || new Error("path2 is not a directory."));
            }
            return callback(null, true);
        });
    });
}


module.exports = {
    byte: byte,
    hash: hash
};



const kindOf = (arg) => arg === null ? "null" : arg === undefined ? "undefined" : /^\[object (.*)\]$/.exec(Object.prototype.toString.call(arg))[1].toLowerCase();
const isFunction = (arg) => kindOf(arg) === "function";
