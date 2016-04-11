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


function byte(path1, path2, callback) {
    const dir1 = nodePath.resolve(path1);
    const dir2 = nodePath.resolve(path2);
    statCompare(dir1, dir2, (err, result)=> {
        if (err || result === false) {
            return callback(err || null, false);
        }
        compareFiles("byte", dir1, dir2, callback);
    });
}


function compareFiles(type, dir1, dir2, callback) {
    //todo update list options to return only isFile and size when enfslist is updated
    enfsList.list(dir1, (err, items1)=> {
        if (err) {
            return callback(err);
        }
        enfsList.list(dir2, (err2, items2)=> {
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
                compareFile[type](item.path, files2[index].path, (err, result)=> {
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


function hash(path1, path2, callback) {
    const dir1 = nodePath.resolve(path1);
    const dir2 = nodePath.resolve(path2);
    statCompare(dir1, dir2, (err, result)=> {
        if (err || result === false) {
            return callback(err || null, false);
        }
        compareFiles("hash", dir1, dir2, callback);
    });
}

function statCompare(path1, path2, callback) {
    enfs.stat(path1, (err, stat1)=> {
        if (err || !stat1.isDirectory()) {
            return callback(err || new Error("path1 is not a directory."));
        }
        enfs.stat(path2, (err2, stat2)=> {
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
