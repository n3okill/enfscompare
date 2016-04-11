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


function byte(path1, path2) {
    const file1 = nodePath.resolve(path1);
    const file2 = nodePath.resolve(path2);
    if (!statCompare(file1, file2)) {
        return false;
    }
    return compareFiles(file1, file2);
}

function statCompare(file1, file2) {
    const stat1 = enfs.statSync(file1);
    const stat2 = enfs.statSync(file2);
    if (!stat1.isFile()) {
        throw new Error("file1 is not a file.");
    }
    if (!stat2.isFile()) {
        throw new Error("file2 is not a file.");
    }
    return stat1.size === stat2.size;
}

function compareFiles(file1, file2) {
    const fd1 = enfs.openSync(file1, "r");
    const fd2 = enfs.openSync(file2, "r");
    try {
        let done1, done2, data1, data2;
        done1 = false;
        done2 = false;
        data1 = new Buffer(0);
        data2 = new Buffer(0);
        while (!done1 || !done2) {
            let buf1 = new Buffer(8192);
            let buf2 = new Buffer(8192);
            buf1.fill(0);
            buf2.fill(0);
            let bytesRead1 = enfs.readSync(fd1, buf1, 0, 8192);
            if (bytesRead1) {
                data1 = Buffer.concat([data1, buf1]);
            }
            let bytesRead2 = enfs.readSync(fd2, buf2, 0, 8192);
            if (bytesRead2) {
                data2 = Buffer.concat([data2, buf2]);
            }
            done1 = bytesRead1 === 0;
            done2 = bytesRead2 === 0;
            if (data1.length >= 8192 && data2.length >= 8192) {
                let b1 = data1.slice(0, 8192);
                let b2 = data2.slice(0, 8192);
                if (!b1.equals(b2)) {
                    return false;
                }
                data1 = data1.slice(8192);
                data2 = data2.slice(8192);
            }
        }
        return true;
    } catch (err) {
        throw err;
    } finally {
        enfs.closeSync(fd1);
        enfs.closeSync(fd2);
    }
}

function hash(path1, path2) {
    const file1 = nodePath.resolve(path1);
    const file2 = nodePath.resolve(path2);
    if (!statCompare(file1, file2)) {
        return false;
    }

    const hash1 = nodeCrypto.createHash("sha512");
    const hash2 = nodeCrypto.createHash("sha512");
    hash1.setEncoding("hex");
    hash2.setEncoding("hex");
    const fd1 = enfs.openSync(file1, "r");
    const fd2 = enfs.openSync(file2, "r");

    try {
        let done1, done2, data1, data2;
        done1 = false;
        done2 = false;
        while (!done1 || !done2) {
            let buf1 = new Buffer(8192);
            let buf2 = new Buffer(8192);
            buf1.fill(0);
            buf2.fill(0);
            let bytesRead1 = enfs.readSync(fd1, buf1, 0, 8192);
            if (bytesRead1) {
                hash1.update(buf1);
            }
            let bytesRead2 = enfs.readSync(fd2, buf2, 0, 8192);
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
        enfs.closeSync(fd1);
        enfs.closeSync(fd2);
    }
}

module.exports = {
    byte: byte,
    hash: hash
};


