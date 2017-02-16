/**
 * @project enfscompare
 * @filename file.js
 * @author Joao Parreira <joaofrparreira@gmail.com>
 * @copyright Copyright(c) 2016  Joao Parreira <joaofrparreira@gmail.com>
 * @licence Creative Commons Attribution 4.0 International License
 * @createdAt Created at 08-04-2016.
 * @version 0.0.1
 * @since 0.0.1
 * @description tests for file comparison
 */

/* global describe, it*/

"use strict";

const nodePath = require("path");
const comparator = require("../");
const rimraf = require("rimraf");


describe("enfscompare", function () {
    describe("> dir", function () {
        describe("> async", function () {
            describe("> hash", function () {
                it("should compare two equal directories", function (done) {
                    const path1 = nodePath.join(__dirname, "..", "lib");
                    const path2 = nodePath.join(__dirname, "..", "lib");
                    comparator.dirHash(path1, path2, (err, result) => {
                        (err === null).should.be.equal(true);
                        result.should.be.equal(true);
                        done();
                    });
                });
                it("should fail to compare two different directories", function (done) {
                    const path1 = nodePath.join(__dirname, "..", "lib");
                    const path2 = nodePath.join(__dirname, "..", "test");
                    comparator.dirHash(path1, path2, (err, result) => {
                        (err === null).should.be.equal(true);
                        result.should.be.equal(false);
                        done();
                    });
                });
            });
            describe("> byte to byte", function () {
                it("should compare two equal directories", function (done) {
                    const path1 = nodePath.join(__dirname, "..", "lib");
                    const path2 = nodePath.join(__dirname, "..", "lib");
                    comparator.dir(path1, path2, (err, result) => {
                        (err === null).should.be.equal(true);
                        result.should.be.equal(true);
                        done();
                    });
                });
                it("should fail to compare two different directories", function (done) {
                    const path1 = nodePath.join(__dirname, "..", "lib");
                    const path2 = nodePath.join(__dirname, "..", "test");
                    comparator.dir(path1, path2, (err, result) => {
                        (err === null).should.be.equal(true);
                        result.should.be.equal(false);
                        done();
                    });
                });
            });
        });
        describe("> sync", function () {
            describe("> hash", function () {
                it("should compare two equal directories", function () {
                    const path1 = nodePath.join(__dirname, "..", "lib");
                    const path2 = nodePath.join(__dirname, "..", "lib");
                    let result = comparator.dirHashSync(path1, path2);
                    result.should.be.equal(true);
                });
                it("should fail to compare two different directories", function () {
                    const path1 = nodePath.join(__dirname, "..", "lib");
                    const path2 = nodePath.join(__dirname, "..", "test");
                    let result = comparator.dirHashSync(path1, path2);
                    result.should.be.equal(false);
                });
            });
            describe("> byte to byte", function () {
                it("should compare two equal directories", function () {
                    const path1 = nodePath.join(__dirname, "..", "lib");
                    const path2 = nodePath.join(__dirname, "..", "lib");
                    let result = comparator.dirSync(path1, path2);
                    result.should.be.equal(true);
                });
                it("should fail to compare two different directories", function () {
                    const path1 = nodePath.join(__dirname, "..", "lib");
                    const path2 = nodePath.join(__dirname, "..", "test");
                    let result = comparator.dirSync(path1, path2);
                    result.should.be.equal(false);
                });
            });
        });
    });
});
