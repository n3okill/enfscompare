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


function byte(path1, path2) {
    const dir1 = nodePath.resolve(path1);
    const dir2 = nodePath.resolve(path2);
    if (statCompare(dir1, dir2) === true) {
        return compareFiles("byte", dir1, dir2);
    }
}


function hash(path1, path2) {
    const dir1 = nodePath.resolve(path1);
    const dir2 = nodePath.resolve(path2);
    if (statCompare(dir1, dir2) === true) {
        return compareFiles("hash", dir1, dir2);
    }
}


function statCompare(dir1, dir2) {
    const stat1 = enfs.statSync(dir1);
    const stat2 = enfs.statSync(dir2);
    if (!stat1.isDirectory()) {
        throw new Error("path1 is not a directory.");
    }
    if (!stat2.isDirectory()) {
        throw new Error("path2 is not a directory.");
    }
    return true;
}


function compareFiles(type, dir1, dir2) {
    //todo update list options to return only isFile and size when enfslist is updated
    const items1 = enfsList.listSync(dir1);
    const items2 = enfsList.listSync(dir2);
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
        let result = compareFile[type](files1[size].path, files2[index].path);
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
