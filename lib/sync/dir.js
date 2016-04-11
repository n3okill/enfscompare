/**
 * @project enfscompare
 * @filename dir.js
 * @author Joao Parreira <joaofrparreira@gmail.com>
 * @copyright Copyright(c) 2016 Joao Parreira <joaofrparreira@gmail.com>
 * @licence Creative Commons Attribution 4.0 International License
 * @createdAt Created at 07-04-2016.
 * @version 0.0.1
 * @since 0.0.1
 * @description sync directory comparison
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
 *              {Number} opt.chunkSize - the size in bytes used to read files and verify equality default to 8192
 * @return {Error|Array}
 */
function byte(path1, path2, opt) {
    let options;
    options = opt || {};
    options.fs = options.fs || enfs;
    options.dereference = options.dereference === true;

    const dir1 = nodePath.resolve(path1);
    const dir2 = nodePath.resolve(path2);
    if (statCompare(dir1, dir2, options) === true) {
        return compareFiles("byte", dir1, dir2, options);
    }
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
 *              {Number} opt.chunkSize - the size in bytes used to read files default 8192
 * @return {Error|Array}
 */
function hash(path1, path2, opt) {
    let options;
    options = opt || {};
    options.fs = options.fs || enfs;
    options.dereference = options.dereference === true;

    const dir1 = nodePath.resolve(path1);
    const dir2 = nodePath.resolve(path2);
    if (statCompare(dir1, dir2, options) === true) {
        return compareFiles("hash", dir1, dir2, options);
    }
}


function statCompare(dir1, dir2, options) {
    options.stat = options.dereference ? options.fs.statSync : options.fs.lstatSync;

    const stat1 = options.stat(dir1);
    const stat2 = options.stat(dir2);
    if (!stat1.isDirectory()) {
        throw new Error("path1 is not a directory.");
    }
    if (!stat2.isDirectory()) {
        throw new Error("path2 is not a directory.");
    }
    return true;
}


function compareFiles(type, dir1, dir2, options) {
    options.list = options.fs.listSync || enfsList.listSync;

    const items1 = options.list(dir1, options);
    const items2 = options.list(dir2, options);
    if (items1.length !== items2.length) {
        return false;
    }
    const files1 = items1.filter(f=>f.stat.isFile());
    const files2 = items2.filter(f=>f.stat.isFile());
    const files2Reduced = files2.map(i=>i.path.replace(dir2, ""));
    let size = files1.length;
    while (size-- > 0) {
        const pathReduced = files1[size].path.replace(dir1, "");
        const index = files2Reduced.indexOf(pathReduced);
        if (index === -1) {
            return false;
        }
        let result = compareFile[type](files1[size].path, files2[index].path, options);
        if (result === false) {
            return false;
        }
    }
    return true;
}

module.exports = {
    byte: byte,
    hash: hash
};
