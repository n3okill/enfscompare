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
 * Run this in your machine to see what is fastest, normally byte-to-byte in different files will be the fastest
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
    BIG: 1000       //1Gb
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
        rimraf.sync(tmpPath);
        throw err;
    }
}

function createDir(done) {
    enfs.mkdir(tmpPath, (err) => {
        if (err) {
            if (err.code === "EEXIST") {
                return createFiles(done);
            }
            onError(err);
        }
        createFiles(done);
    });
}


function createFiles(done) {
    createType("SMALL", () => {
        createType("MEDIUM", () => {
            createType("BIG", () => {
                done();
            });
        });
    });
}

function createType(type, done) {
    const random1 = nodeCrypto.randomBytes(SIZE);
    const random2 = nodeCrypto.randomBytes(SIZE);
    createFile("FILE", type, random1, random1, () => {
        createFile("DIFF", type, random1, random2, () => {
            done();
        });
    });
}

function createFile(name, type, random1, random2, done) {
    const stream1 = enfs.createWriteStream(FILES[type][name]);

    stream1.on("finish", () => {
        enfs.stat(FILES[type][name], (err, stat) => {
            onError(err);
            STATS[type].SIZE = stat.size;
            done();
        });
    });

    stream1.on("error", (err) => {
        onError(err);
        done(err);
    });

    let i = MBSIZE[type];
    while (i-- > 1) {
        stream1.write(random1);
    }
    stream1.write(random2);

    stream1.end();
}


function benchmarks(done) {
    console.log("Running small");
    runType("SMALL");
    console.log("Running medium");
    runType("MEDIUM");
    console.log("Running big");
    runType("BIG");
    done();
    /*runType("SMALL", ()=> {
     console.log("Running medium");
     runType("MEDIUM", ()=> {
     console.log("Running big");
     runType("BIG", ()=> {
     done();
     });
     });
     });*/
}

function runType(type) {
    runComparator("filesHashSync", type, "HASH");
    runComparator("filesSync", type, "BYTE");
    /*runComparator("filesHash", type, "HASH", ()=> {
     runComparator("files", type, "BYTE", ()=> {
     done();
     });
     });*/
}

function runComparator(fn, type, statType) {
    let start = Date.now();
    let result = comparator[fn](FILES[type].FILE, FILES[type].FILE);
    if (result !== true) {
        throw new Error(type + " - " + fn + " - returned invalid result.");
    }
    STATS[type][statType].push(start, Date.now());
    start = Date.now();
    let result2 = comparator[fn](FILES[type].FILE, FILES[type].DIFF);
    if (result2 !== false) {
        throw new Error(type + " - " + fn + " - returned invalid result.");
    }
    STATS[type][statType].push(start, Date.now());

    /*let start = Date.now();
     comparator[fn](FILES[type].FILE, FILES[type].FILE, (err, result)=> {
     onError(err);
     if (result !== true) {
     throw new Error(type + " - " + fn + " - returned invalid result.");
     }
     STATS[type][statType].push(start, Date.now());
     start = Date.now();
     comparator[fn](FILES[type].FILE, FILES[type].DIFF, (err2, result2)=> {
     if (result2 !== false) {
     throw new Error(type + " - " + fn + " - returned invalid result.");
     }
     STATS[type][statType].push(start, Date.now());
     onError(err2);
     done();
     });
     });*/
}


function showStats(done) {
    runShowStats(() => {
        console.log("Benchmark ended.");
        done();
    });
}

function runShowStats(done) {
    showType("SMALL", () => {
        showType("MEDIUM", () => {
            showType("BIG", () => {
                done();
            });
        });
    });
}

function showType(type, done) {
    showComparator(type, "HASH", () => {
        showComparator(type, "BYTE", () => {
            done();
        });
    });
}

function formatTime(millis) {
    let date = new Date(millis);
    return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "." + date.getMilliseconds();
}


function showComparator(type, statType, done) {
    let equal, diff;
    equal = STATS[type][statType][1] - STATS[type][statType][0];
    diff = STATS[type][statType][3] - STATS[type][statType][2];
    console.log(type + " - " + statType + " - equal: " + formatTime(equal));
    console.log(type + " - " + statType + " - diff: " + formatTime(diff));
    done();
}


setImmediate(() => {
    const startTime = Date.now();
    console.log("Starting files creation.");
    console.time("File Creation");
    createDir(() => {
        console.timeEnd("File Creation");
        //console.log("Files created.");
        console.log("Starting to run benchmarks.");
        console.time("Benchmarks");
        benchmarks(() => {
            console.timeEnd("Benchmarks");
            console.log("Total time: " + formatTime(Date.now() - startTime));
            showStats(() => {
                rimraf.sync(tmpPath);
            });
        });
    });
});
