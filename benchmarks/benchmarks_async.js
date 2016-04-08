/**
 * @project enfscompare
 * @filename benchmarks_async.js
 * @author Joao Parreira <joaofrparreira@gmail.com>
 * @copyright Copyright(c) 2016  Joao Parreira <joaofrparreira@gmail.com>
 * @licence Creative Commons Attribution 4.0 International License
 * @createdAt Created at 08-04-2016.
 * @version 0.0.1
 * @since 0.0.1
 * @description display the different times taken to compare files of different sizes with the 2 methods available
 * (hash and byte-to-byte)
 */

"use strict";

const nodePath = require("path");
const nodeOs = require("os");
const nodeCrypto = require("crypto");
const rimraf = require("rimraf");
const enfs = require("enfspatch");
const comparator = require("../");

const tmpPath = nodePath.join(nodeOs.tmpdir(), "enfscomparebenchmarks");
const FILES = {
    SMALL: {
        FILE: nodePath.join(tmpPath, "small_file"),
        DIFF: nodePath.join(tmpPath, "small_diff")
    },
    MEDIUM: {
        FILE: nodePath.join(tmpPath, "medium_file"),
        DIFF: nodePath.join(tmpPath, "medium_diff")
    },
    BIG: {
        FILE: nodePath.join(tmpPath, "big_file"),
        DIFF: nodePath.join(tmpPath, "big_diff")
    }
};
const SIZE = 1024 * 1024; //Mb
const MBSIZE = {
    SMALL: 1,       //1Mb
    MEDIUM: 100,    //100Mb
    BIG: 1024       //1Gb
};

const STATS = {
    SMALL: {
        SIZE: 0,
        HASH: [],
        BYTE: []
    },
    MEDIUM: {
        SIZE: 0,
        HASH: [],
        BYTE: []
    },
    BIG: {
        SIZE: 0,
        HASH: [],
        BYTE: []
    }
};

function onError(err) {
    if (err) {
        rimraf(tmpPath, (err2)=> {
            throw err2 || err;
        });
    }
}

function createDir(done) {
    enfs.mkdir(tmpPath, (err)=> {
        if (err) {
            if (err.code === "EEXIST") {
                return createFiles(done);
            }
            onError(err);
        }
        createFiles(done);
    });
}

function createFile(path, random1, random2, size) {
    const fd = enfs.openSync(path, "w");
    size--;
    while (size-- > 1) {
        enfs.writeSync(fd, random1);
    }
    enfs.writeSync(fd, random2);
    enfs.closeSync(fd);
}

function createFiles(done) {
    const random1 = nodeCrypto.randomBytes(SIZE);
    const random2 = nodeCrypto.randomBytes(SIZE);

    createFile(FILES.SMALL.FILE, random1, random1, MBSIZE.SMALL);
    createFile(FILES.SMALL.DIFF, random1, random2, MBSIZE.SMALL);
    STATS.SMALL.SIZE = enfs.statSync(FILES.SMALL.FILE).size;

    createFile(FILES.MEDIUM.FILE, random1, random1, MBSIZE.MEDIUM);
    createFile(FILES.MEDIUM.DIFF, random1, random2, MBSIZE.MEDIUM);
    STATS.MEDIUM.SIZE = enfs.statSync(FILES.MEDIUM.FILE).size;

    createFile(FILES.BIG.FILE, random1, random1, MBSIZE.BIG);
    createFile(FILES.BIG.DIFF, random1, random2, MBSIZE.BIG);
    STATS.BIG.SIZE = enfs.statSync(FILES.BIG.FILE).size;

    done();
}

function benchmarks(done) {
    runType("SMALL", ()=> {
        runType("MEDIUM", ()=> {
            runType("BIG", ()=> {
                done();
            });
        });
    });
}

function runType(type, done) {
    runComparator("filesHash", type, "HASH", ()=> {
        runComparator("files", type, "BYTE", ()=> {
            done();
        });
    });
}

function runComparator(fn, type, statType, done) {
    let start = Date.now();
    comparator[fn](FILES[type].FILE, FILES[type].FILE, (err)=> {
        onError(err);
        STATS[type][statType].push(start, Date.now());
        start = Date.now();
        comparator[fn](FILES[type].FILE, FILES[type].DIFF, (err2)=> {
            STATS[type][statType].push(start, Date.now());
            onError(err2);
            done();
        });
    });
}

let START_TIME;
let STOP_TIME;
console.log("Starting files creation.");
setImmediate(()=> {
    createDir(()=> {
        console.log("Files created.");
        console.log("Starting to run benchmarks.");
        START_TIME = Date.now();
        benchmarks(()=> {
            STOP_TIME = Date.now();
            console.log("Benchmarks runned.");
            showStats();
        });
    });
});


function showStats() {
    runShowStats(()=> {
        console.log("Benchmark ended.")
    });
}

function runShowStats(done) {
    showType("SMALL", ()=> {
        showType("MEDIUM", ()=> {
            showType("BIG", ()=> {
                done();
            });
        });
    });
}

function showType(type, done) {
    showComparator(type, "HASH", ()=> {
        showComparator(type, "BYTE", ()=> {
            done();
        });
    });
}

function showComparator(type, statType, done) {
    let equal, diff;
    equal = STATS[type][statType][1] - STATS[type][statType][0];
    diff = STATS[type][statType][3] - STATS[type][statType][2];
    console.log(type + " - " + statType + " - equal: "+ equal);
    console.log(type + " - " + statType + " - diff: "+ diff);
    done();

    //let start = Date.now();
    /*comparator[fn](FILES[type].FILE, FILES[type].FILE, (err)=> {
     onError(err);
     STATS[type][statType].push(start, Date.now());
     start = Date.now();
     comparator[fn](FILES[type].FILE, FILES[type].DIFF, (err2)=> {
     STATS[type][statType].push(start, Date.now());
     onError(err2);
     done();
     });
     });*/
}
