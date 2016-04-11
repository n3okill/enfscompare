[![Build Status](https://travis-ci.org/n3okill/enfscompare.svg)](https://travis-ci.org/n3okill/enfscompare)
[![Build status](https://ci.appveyor.com/api/projects/status/hbrhk12g7gmse48t?svg=true)](https://ci.appveyor.com/project/n3okill/enfscompare)
[![Codacy Badge](https://api.codacy.com/project/badge/grade/459632289dfe4dcfab15a69f625ec291)](https://www.codacy.com/app/n3okill/enfscompare)
[![Donate](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=64PYTCDH5UNZ6)

[![NPM](https://nodei.co/npm/enfscompare.png)](https://nodei.co/npm/enfscompare/)

enfscompare
=========
Module that add compare functionality to to node fs module
 
This module is intended to work as a sub-module of [enfs](https://www.npmjs.com/package/enfs)

Description
-----------
This module will add a method that allows the comparison of files and
folders.

- This module will add following methods to node fs module:
  * files
  * filesHash
  * filesSync
  * filesHashSync
  * dir
  * dirHash
  * dirSync
  * dirHashSync

Usage
-----
`enfscompare`

```js
    var enfscompare = require("enfscompare");
```

Errors
------
All the methods follows the node culture.
- Async: Every async method returns an Error in the first callback parameter
- Sync: Every sync method throws an Error.


Additional Methods
------------------
- [files](#files)
- [filesSync](#filessync)
- [filesHash](#filesHash)
- [filesHashSync](#filesHashSync)
- [dir](#dir)
- [dirSync](#dirSync)
- [dirHash](#dirHash)
- [dirHashSync](#dirHashSync)


### files
### filesSync
  - **files(path1, path2, [options], callback)**
  - **filesSync(path1, path2, [options])**

> Compare files in a byte-to-byte form

[options]:
  * fs (Object): an alternative fs module to use (default will be [enfspatch](https://www.npmjs.com/package/enfspatch))
  * dereference (Boolean): if true will dereference symlinks listing the items to where it points (default: false)
  * chunkSize (Number) - the size in bytes used to read files and verify equality default to 
  (async: ReadStream._readableState.highWaterMark, sync: 8192)
  
```js
    enfscompare.files("/home/name/file.txt", "/home/name/file.txt", function(err, result){
        if(result===true){
            console.log("File is equal");
        }
    });
```


### dir
### dirSync
  - **dir(path1, path2, [options], callback)**
  - **dirSync(path1, path2, [options])**

> Compare files in a byte-to-byte form

[options]:
  * fs (Object): an alternative fs module to use (default will be [enfspatch](https://www.npmjs.com/package/enfspatch))
  * dereference (Boolean): if true will dereference symlinks listing the items to where it points (default: false)
  * chunkSize (Number) - the size in bytes used to read files and verify equality default to 
  (async: ReadStream._readableState.highWaterMark, sync: 8192)

```js
    enfscompare.dir("/home/name", "/home/another_folder_name", function(err, result){
        if(result===true){
            console.log("Directories are equal");
        }
    });
```


### filesHash
### filesHashSync
  - **filesHash(path1, path2, [options], callback)**
  - **filesHashSync(path1, path2, [options])**

> Compare files with an hash
NOTE: This method can't correctly tell you that the files are equal, but can tell you if they are different

[options]:
  * fs (Object): an alternative fs module to use (default will be [enfspatch](https://www.npmjs.com/package/enfspatch))
  * dereference (Boolean): if true will dereference symlinks listing the items to where it points (default: false)
  * hash (String) - the type of hash to use in comparison, default to 'sha512'
  * encoding (String) - the type of hash encoding used to compare the files, default to 'hex'
  * chunkSize (String) - the size in bytes used to read files default 8192 (Only in sync method)

```js
    var result = enfscompare.filesHashSync("/home/name/file.txt","/home/name/file.txt");
    if(result===true){
        console.log("File is equal");
    }
```



### dirHash
### dirHashSync
  - **dirHash(path1, path2, [options], callback)**
  - **dirHashSync(path1, path2, [options])**

> Compare files with an hash
NOTE: This method can't correctly tell you that the files are equal, but can tell you if they are different

[options]:
  * fs (Object): an alternative fs module to use (default will be [enfspatch](https://www.npmjs.com/package/enfspatch))
  * dereference (Boolean): if true will dereference symlinks listing the items to where it points (default: false)
  * hash (String) - the type of hash to use in comparison, default to 'sha512'
  * encoding (String) - the type of hash encoding used to compare the files, default to 'hex'
  * chunkSize (String) - the size in bytes used to read files default 8192 (Only in sync method)

```js
    var result = enfscompare.filesHashSync("/home/name","/home/another_folder_name");
    if(result===true){
        console.log("Folders are equal");
    }
```


Benchmarks
----------
Run the files in benchmarks folder to check which algorithm is fastest in your machine with different file sizes


License
-------

Creative Commons Attribution 4.0 International License

Copyright (c) 2016 Joao Parreira <joaofrparreira@gmail.com> [GitHub](https://github.com/n3okill)

This work is licensed under the Creative Commons Attribution 4.0 International License. 
To view a copy of this license, visit [CC-BY-4.0](http://creativecommons.org/licenses/by/4.0/).


