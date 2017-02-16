/**
 * @project enfscompare
 * @filename file.js
 * @author Joao Parreira <joaofrparreira@gmail.com>
 * @copyright Copyright(c) 2016 Joao Parreira <joaofrparreira@gmail.com>
 * @licence Creative Commons Attribution 4.0 International License
 * @createdAt Created at 07-04-2016.
 * @version 0.0.1
 * @since 0.0.1
 * @description sync file comparison
 */

"use strict";

const nodePath = require("path");
const nodeCrypto = require("crypto");
const enfs = require("enfspatch");



function statCompare(file1, file2, options) {
    const stat1 = options.stat(file1);
    const stat2 = options.stat(file2);
    if (!stat1.isFile()) {
        throw new Error("file1 is not a file.");
    }
    if (!stat2.isFile()) {
        throw new Error("file2 is not a file.");
    }
    return stat1.size === stat2.size;
}

function compareFiles(file1, file2, options) {
    const fd1 = options.fs.openSync(file1, "r");
    const fd2 = options.fs.openSync(file2, "r");
    const chunkSize = options.chunkSize && !isNaN(options.chunkSize) ? options.chunkSize : 8192;
    try {
        let done1, done2, data1, data2;
        done1 = false;
        done2 = false;
        data1 = new Buffer(0);
        data2 = new Buffer(0);
        while (!done1 || !done2) {
            let buf1 = new Buffer(chunkSize);
            let buf2 = new Buffer(chunkSize);
            buf1.fill(0);
            buf2.fill(0);
            let bytesRead1 = options.fs.readSync(fd1, buf1, 0, chunkSize);
            if (bytesRead1) {
                data1 = Buffer.concat([data1, buf1]);
            }
            let bytesRead2 = options.fs.readSync(fd2, buf2, 0, chunkSize);
            if (bytesRead2) {
                data2 = Buffer.concat([data2, buf2]);
            }
            done1 = bytesRead1 === 0;
            done2 = bytesRead2 === 0;
            if (data1.length >= chunkSize && data2.length >= chunkSize) {
                let b1 = data1.slice(0, chunkSize);
                let b2 = data2.slice(0, chunkSize);
                if (!b1.equals(b2)) {
                    return false;
                }
                data1 = data1.slice(chunkSize);
                data2 = data2.slice(chunkSize);
            }
        }
        return true;
    } catch (err) {
        throw err;
    } finally {
        options.fs.closeSync(fd1);
        options.fs.closeSync(fd2);
    }
}

/**
 * Compare two files in a byte-to-byte comparison
 * @param {string} path1 - the path to the first file
 * @param {string} path2 - the path to the second file
 * @param {object} opt - various options for list module
 *              {bool} opt.dereference - defines the type of stat that will be used in files
 *              {object} opt.fs - the fs module to be used will use enfs by default
 *              {Number} opt.chunkSize - the size in bytes used to read files and verify equality default 8192
 * @return {Error|Array}
 */
function byte(path1, path2, opt) {
    let options;
    const file1 = nodePath.resolve(path1);
    const file2 = nodePath.resolve(path2);

    options = opt || {};
    options.fs = options.fs || enfs;
    options.dereference = options.dereference === true;
    options.stat = options.dereference ? options.fs.statSync : options.fs.lstatSync;

    if (!statCompare(file1, file2, options)) {
        return false;
    }
    return compareFiles(file1, file2, options);
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
 *              {Number} opt.chunkSize - the size in bytes used to read files default 8192
 * @return {Error|Array}
 */
function hash(path1, path2, opt) {
    let options;
    const file1 = nodePath.resolve(path1);
    const file2 = nodePath.resolve(path2);

    options = opt || {};
    options.fs = options.fs || enfs;
    options.dereference = options.dereference === true;
    options.stat = options.dereference ? options.fs.statSync : options.fs.lstatSync;
    options.hash = options.hash || "sha512";
    options.encoding = options.encoding || "hex";
    const chunkSize = options.chunkSize && !isNaN(options.chunkSize) ? options.chunkSize : 8192;

    if (!statCompare(file1, file2, options)) {
        return false;
    }

    const hash1 = nodeCrypto.createHash(options.hash);
    const hash2 = nodeCrypto.createHash(options.hash);
    hash1.setEncoding(options.encoding);
    hash2.setEncoding(options.encoding);
    const fd1 = options.fs.openSync(file1, "r");
    const fd2 = options.fs.openSync(file2, "r");

    try {
        let done1, done2;
        done1 = false;
        done2 = false;
        while (!done1 || !done2) {
            let buf1 = new Buffer(chunkSize);
            let buf2 = new Buffer(chunkSize);
            buf1.fill(0);
            buf2.fill(0);
            let bytesRead1 = options.fs.readSync(fd1, buf1, 0, chunkSize);
            if (bytesRead1) {
                hash1.update(buf1);
            }
            let bytesRead2 = options.fs.readSync(fd2, buf2, 0, chunkSize);
            if (bytesRead2) {
                hash2.update(buf2);
            }
            done1 = bytesRead1 === 0;
            done2 = bytesRead2 === 0;
        }
        hash1.end();
        hash2.end();
        return hash1.read() === hash2.read();
    } catch (err) {
        throw err;
    } finally {
        options.fs.closeSync(fd1);
        options.fs.closeSync(fd2);
    }
}

module.exports = {
    byte,
    hash
};


