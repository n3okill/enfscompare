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
    const chunkSize = 4096;
    let ended1, ended2;
    ended1 = false;
    ended2 = false;
    let data1 = new Buffer(0);
    let data2 = new Buffer(0);
    data1.fill(0);
    data2.fill(0);
    const stream1 = enfs.createReadStream(file1);
    const stream2 = enfs.createReadStream(file2);

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

/*
 function compareFiles(file1, file2, callback) {
 enfs.open(file1, "r", (err, fd1)=> {
 if (err) {
 return callback(err);
 }
 enfs.open(file2, "r", (err2, fd2)=> {
 if (err2) {
 return callback(err2);
 }
 let buffer1, buffer2, pos1, pos2;
 buffer1 = new Buffer(4096);
 buffer2 = new Buffer(4096);
 pos1 = 0;
 pos2 = 0;

 });
 });
 }*/

/*
 var step = 1024;
 var file = function (path) {
 var fd = fs.openSync(path, 'r');
 var b = new Buffer(4096);
 return {fd: fd, b: b, pos: 0, size: fs.statSync(path).size};
 }
 exports.file = file

 var h1 = function (err, bytesRead, buffer) {
 if (bytesRead > 0) {
 this.f1.pos += bytesRead;
 var that = {f1: this.f1, f2: this.f2, cb: this.cb};
 fs.read(this.f2.fd, this.f2.b, 0, step, this.f2.pos, h2.bind(that));
 }
 };

 var h2 = function (err, bytesRead, buffer) {
 if (bytesRead > 0) {
 this.f2.pos += bytesRead;
 var diff = this.f1.pos - this.f2.pos;
 if (diff < 0) {
 fs.readSync(this.f1.fd, this.f1.b, 0, Math.abs(diff), this.f1.pos);
 this.f1.pos += Math.abs(diff);
 } else if (diff > 0) {
 fs.readSync(this.f2.fd, this.f2.b, 0, diff, this.f2.pos);
 this.f2.pos += diff;
 bytesRead += diff;
 }
 var s1 = this.f1.b.slice(0, bytesRead);
 var s2 = this.f2.b.slice(0, bytesRead);
 var isEqual = s1.equals(s2);
 if (isEqual === false) {
 fs.closeSync(this.f1.fd)
 fs.closeSync(this.f2.fd)
 this.cb(false);
 return
 }
 if (this.f2.pos < this.f2.size) {
 var that = {f1: this.f1, f2: this.f2, cb: this.cb};
 fs.read(this.f1.fd, this.f1.b, 0, step, this.f1.pos, h1.bind(that));
 } else {
 fs.closeSync(this.f1.fd)
 fs.closeSync(this.f2.fd)
 this.cb(true);
 }
 }
 };

 exports.compare = function (f1, f2, cb) {
 if (f1.size !== f2.size) {
 cb(false);
 }
 var isEqual = true;
 var that = {f1: f1, f2: f2, cb: cb};
 fs.read(f1.fd, f1.b, 0, step, f1.pos, h1.bind(that));
 }
 */

//const kindOf = (arg) => arg === null ? "null" : arg === undefined ? "undefined" : /^\[object (.*)\]$/.exec(Object.prototype.toString.call(arg))[1].toLowerCase();
//const isFunction = (arg) => kindOf(arg) === "function";


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
                return callback(null, hash1.read() === hash2.read());
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
