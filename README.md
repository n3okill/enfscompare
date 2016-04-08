[![Build Status](https://travis-ci.org/n3okill/enfs.svg)](https://travis-ci.org/n3okill/enfs)
[![Build status](https://ci.appveyor.com/api/projects/status/4vr9led0i9onj587?svg=true)](https://ci.appveyor.com/project/n3okill/enfs)
[![Codacy Badge](https://api.codacy.com/project/badge/grade/38d87560204a4c1abbb1299394ed08c5)](https://www.codacy.com/app/n3okill/enfs)
[![Donate](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=64PYTCDH5UNZ6)

[![NPM](https://nodei.co/npm/enfs.png)](https://nodei.co/npm/enfs/)

enfs
=========
Module that add methods and patches to node fs module
 
**enfs** stands for [E]asy [N]ode [fs]

Description
-----------
This module will add many methods to node fs module.
This is just the main module that will join many 
modules of the family of enfs, making it easier to use many of
the methods present in each module.

Modules
-------
  - [enfspatch](https://www.npmjs.com/package/enfspatch)
  - [enfslist](https://www.npmjs.com/package/enfslist)
  - [enfsfind](https://www.npmjs.com/package/enfsfind)
  - [enfsmkdirp](https://www.npmjs.com/package/enfsmkdirp)
  - [enfsensure](https://www.npmjs.com/package/enfsensure)
  - [enfscopy](https://www.npmjs.com/package/enfscopy)
  - [enfsmove](https://www.npmjs.com/package/enfsmove)


Methods Added
-------------
  * emptyDir
  * emptyDirSync

  
Usage
-----
`enfs` is a drop-in replacement for native `fs` module, you just need to include
it instead of the native module.

Use this
```js
    var enfs = require("enfs");
```

instead of

```js
    var fs = require("fs"); //You don't need to do this anymore
```

and all the methods from native fs module are available

Errors
------
All the methods follows the node culture.
- Async: Every async method returns an Error in the first callback parameter
- Sync: Every sync method throws an Error.


Additional Methods
------------------
- [emptyDir](#emptydir)
- [emptyDirSync](#emptydirsync)



### emptyDir
  - **emptyDir(path, callback)**

> Remove all items from the directory this method use [rimraf](https://www.npmjs.com/package/rimraf), 
then you can pass wildcards to the path like you do in rimraf


```js
    enfs.emptyDir("/path/to/empty/*", function(err){
        if(!err) {
            console.log("Directory is empty");
        }
    });
```


### emptyDirSync
  - **emptyDirSync(path)**

> Remove all items from the directory this method use [rimraf.sync](https://www.npmjs.com/package/rimraf), 
then you can pass wildcards to the path like you do in rimraf


```js
    enfs.emptyDirSync("/path/to/empty/*");
    console.log("Directory is empty");
```



Additional mehods from modules
--------------------------
  - [enfspatch](https://www.npmjs.com/package/enfspatch)
    * [exists](https://www.npmjs.com/package/enfspatch#exists) - `enfs.exists`
    * [existsSync](https://www.npmjs.com/package/enfspatch#exists) - `enfs.existsSync`
    * [existAccess](https://www.npmjs.com/package/enfspatch#existaccess) - `enfs.existAccess`
    * [existAccessSync](https://www.npmjs.com/package/enfspatch#existaccess) - `enfs.existAccessSync`
    * [existStat](https://www.npmjs.com/package/enfspatch#existstat) - `enfs.existStat`
    * [existLStat](https://www.npmjs.com/package/enfspatch#existlstat) - `enfs.existLStat`
    * [existFStat](https://www.npmjs.com/package/enfspatch#existfstat) - `enfs.existFStat`
    * [existStatSync](https://www.npmjs.com/package/enfspatch#existstat) - `enfs.existStatSync`
    * [existLStatSync](https://www.npmjs.com/package/enfspatch#existlstat) - `enfs.existLStatSync`
    * [existFStatSync](https://www.npmjs.com/package/enfspatch#existfstat) - `enfs.existFStatSync`
  - [enfslist](https://www.npmjs.com/package/enfslist)
    * [list](https://www.npmjs.com/package/enfslist#list) - `enfs.list`
    * [listSync](https://www.npmjs.com/package/enfslist#listsync) - `enfs.listSync`
  - [enfsfind](https://www.npmjs.com/package/enfsfind)
    * [find](https://www.npmjs.com/package/enfsfind#find) - `enfs.find`
    * [findSync](https://www.npmjs.com/package/enfsfind#findsync) - `enfs.findSync`
  - [enfsmkdirp](https://www.npmjs.com/package/enfsmkdirp)
    * [mkdirp](https://www.npmjs.com/package/enfsmkdirp#mkdirp) - `enfs.mkdirp`
    * [mkdirpSync](https://www.npmjs.com/package/enfsmkdirp#mkdirpsync) - `enfs.mkdirpSync`
  - [enfsensure](https://www.npmjs.com/package/enfsensure)
    * [ensureFile](https://www.npmjs.com/package/enfsensure#ensurefile) - `enfs.ensureFile`
    * [ensureFileSync](https://www.npmjs.com/package/enfsensure#ensurefile) - `enfs.ensureFileSync`
    * [ensureDir](https://www.npmjs.com/package/enfsensure#ensuredir) - `enfs.ensureDir`
    * [ensureDirSync](https://www.npmjs.com/package/enfsensure#ensuredir) - `enfs.ensureDirSync`
    * [ensureLink](https://www.npmjs.com/package/enfsensure#ensurelink) - `enfs.ensureLink`
    * [ensureLinkSync](https://www.npmjs.com/package/enfsensure#ensurelink) - `enfs.ensureLinkSync`
    * [ensureSymlink](https://www.npmjs.com/package/enfsensure#ensuresymlink) - `enfs.ensureSymlink`
    * [ensureSymlinkSync](https://www.npmjs.com/package/enfsensure#ensuresymlink) - `enfs.ensureSymlinkSync`
  - [enfscopy](https://www.npmjs.com/package/enfscopy)
    * [copy](https://www.npmjs.com/package/enfscopy#copy) - `enfs.copy`
    * [copySync](https://www.npmjs.com/package/enfscopy#copysync) - `enfs.copySync`
  - [enfsmove](https://www.npmjs.com/package/enfsmove)
    * [move](https://www.npmjs.com/package/enfsmove#move) - `enfs.move`
    * [moveSync](https://www.npmjs.com/package/enfsmove#movesync) - `enfs.moveSync`


License
-------

Creative Commons Attribution 4.0 International License

Copyright (c) 2016 Joao Parreira <joaofrparreira@gmail.com> [GitHub](https://github.com/n3okill)

This work is licensed under the Creative Commons Attribution 4.0 International License. 
To view a copy of this license, visit [CC-BY-4.0](http://creativecommons.org/licenses/by/4.0/).


