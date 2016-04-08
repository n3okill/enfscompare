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


function compare(path1, path2, callback) {
    const file1 = nodePath.resolve(path1);
    const file2 = nodePath.resolve(path2);
    statCompare(file1, file2, (err, result)=> {
        if (err || result === false) {
            return callback(err || null, false);
        }
        compareFiles(file1, file2, callback);
    });
}

function compareFiles(file1, file2, callback) {
    let ended1, ended2;
    ended1 = false;
    ended2 = false;
    let data1 = new Buffer(0);
    let data2 = new Buffer(0);
    const stream1 = enfs.createReadStream(file1);
    const stream2 = enfs.createReadStream(file2);

    const chunkSize = stream1._readableState.highWaterMark;

    function compare() {
        if (data1.length > chunkSize && data2.length > chunkSize) {
            let buf1 = data1.slice(0, chunkSize);
            let buf2 = data2.slice(0, chunkSize);
            if (!buf1.equals(buf2)) {
                stream1.destroy();
                stream2.destroy();
                return callback(null, false);
            }
            data1 = data1.slice(chunkSize);
            data2 = data2.slice(chunkSize);
            stream1.resume();
            stream2.resume();
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

    stream1.on("error", (err)=> {
        stream2.destroy();
        return callback(err);
    });
    stream2.on("error", (err)=> {
        stream1.destroy();
        return callback(err);
    });

    stream1.on("data", (chunk)=> {
        data1 = Buffer.concat([data1, chunk]);
        if (data1.length > chunkSize) {
            stream1.pause();
        }
        compare();
    });
    stream2.on("data", (chunk)=> {
        data2 = Buffer.concat([data2, chunk]);
        if (data2.length > chunkSize) {
            stream2.pause();
        }
        compare();
    });
    stream1.on("end", ()=> {
        ended1 = true;
        compareFinal();
    });
    stream2.on("end", ()=> {
        ended2 = true;
        compareFinal();
    });
    stream1.resume();
    stream2.resume();
}

function statCompare(path1, path2, callback) {
    enfs.stat(path1, (err, stat1)=> {
        if (err || !stat1.isFile()) {
            return callback(err || new Error("file1 is not a file."));
        }
        enfs.stat(path2, (err2, stat2)=> {
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


function hashCompare(path1, path2, callback) {
    const file1 = nodePath.resolve(path1);
    const file2 = nodePath.resolve(path2);
    statCompare(file1, file2, (err, result)=> {
        if (err || result === false) {
            return callback(err || null, false);
        }
        let done1, done2;
        done1 = false;
        done2 = false;
        const stream1 = enfs.createReadStream(file1);
        const stream2 = enfs.createReadStream(file2);
        const hash1 = nodeCrypto.createHash("sha512");
        const hash2 = nodeCrypto.createHash("sha512");
        hash1.setEncoding("hex");
        hash2.setEncoding("hex");
        function compare() {
            if (done1 === true && done2 === true) {
                return callback(null, hash1.read() === hash2.read(), hash1.read(), hash2.read());
            }
        }

        stream1.on("error", (err)=> {
            stream2.destroy();
            return callback(err);
        });
        stream2.on("error", (err)=> {
            stream1.destroy();
            return callback(err);
        });

        stream1.on("end", ()=> {
            hash1.end();
            done1 = true;
            compare();
        });
        stream2.on("end", ()=> {
            hash2.end();
            done2 = true;
            compare();
        });
        stream1.pipe(hash1);
        stream2.pipe(hash2);
    });
}


module.exports = {
    compare: compare,
    hashCompare: hashCompare
};
