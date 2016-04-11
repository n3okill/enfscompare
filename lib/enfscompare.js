/**
 * @project enfscompare
 * @filename enfscompare.js
 * @author Joao Parreira <joaofrparreira@gmail.com>
 * @copyright Copyright(c) 2016 Joao Parreira <joaofrparreira@gmail.com>
 * @licence Creative Commons Attribution 4.0 International License
 * @createdAt Created at 07-04-2016.
 * @version 0.0.1
 * @since 0.0.1
 * @description enfscompare entry point
 */

"use strict";

const async = {
    files: require("./async/file"),
    dir: require("./async/dir")
};
const sync = {
    files: require("./sync/file"),
    dir: require("./sync/dir")
};

module.exports = {
    files: async.files.byte,
    filesHash: async.files.hash,
    filesSync: sync.files.byte,
    filesHashSync: sync.files.hash,
    dir: async.dir.byte,
    dirHash: async.dir.hash,
    dirSync: sync.dir.byte,
    dirHashSync: sync.dir.hash
};
