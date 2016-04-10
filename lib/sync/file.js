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


function compare(path1, path2) {
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

}

function compareHash(path1, path2) {

}

module.exports = {
    compare: compare,
    compareHash: compareHash
};

