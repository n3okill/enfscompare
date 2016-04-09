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


### files
  - **files(path, [options], callback)**

> Compare files in a byte-to-byte form

[options]:
  * fs (Object): an alternative fs module to use (default will be [enfspatch](https://www.npmjs.com/package/enfspatch))


```js
    enfscompare.files("/home/name/file.txt", "/home/name/file.txt", function(err, result){
        console.log("File is equal");
    });
```


### filesSync
  - **filesSync(path, [options])**

> Obtain the list of items under a directory and sub-directories synchronously
Each item will be an object containing: {path: pathToItem, stat: itemStat}

[options]:
  * fs (Object): an alternative fs module to use (default will be [enfspatch](https://www.npmjs.com/package/enfspatch))

```js
    var result = enfscompare.filesSync("/home/name/file.txt","/home/name/file.txt");
    if(result===true){
        console.log("File is equal");
    }
```


License
-------

Creative Commons Attribution 4.0 International License

Copyright (c) 2016 Joao Parreira <joaofrparreira@gmail.com> [GitHub](https://github.com/n3okill)

This work is licensed under the Creative Commons Attribution 4.0 International License. 
To view a copy of this license, visit [CC-BY-4.0](http://creativecommons.org/licenses/by/4.0/).


