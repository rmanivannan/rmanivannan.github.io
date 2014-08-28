rmanivannan.github.io
=====================

ManiZ demo page


#To start work with MongoDB


```
C:\MongoDB\bin
==> mongo.exe
==> to switch/create table ==> use <db name>
==> db.newDB.insert({'mani':'vannan'})
==> db.newDB.find()
==> show tables
```

#Install mongodb and Start MongoDB services

http://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/

```
make sure ur mongodb installation folder place outside programe files folder so that access issues will not be there or restart the mongodb wit "mongod --repair"

start ==> cmd ==> right click ==> run as admin
```

Create directories.
------------------
```
comments
--------
mkdir c:\data\db
mkdir c:\data\log

Manual Creation
---------------
create folder "data" under "c:"
create folders "db" and "log" under "c:\data"
```

Create a configuration file.
----------------------------
```
comments
--------
echo logpath=c:\data\log\mongod.log> "C:\MongoDB\mongod.cfg"
echo dbpath=c:\data\db>> "C:\MongoDB\mongod.cfg"

Manual Creation
---------------
Create file "mongod.cfg" under "C:\MongoDB\"
add following text into that
logpath=c:\data\log\mongod.log
dbpath=c:\data\db
```


Create the MongoDB service.
---------------------------
```
sc.exe create MongoDB binPath= "\"C:\MongoDB\bin\mongod.exe\" --service --config=\"C:\MongoDB\mongod.cfg\"" DisplayName= "MongoDB" start= "auto"
```

MongoDB service.
--------------------------
```
start  ==> net start MongoDB
stop   ==> net stop MongoDB
delete ==> sc.exe delete MongoDB
```


If there is any service issue 
------------------------------
```
"C:\MongoDB\bin\mongod.exe" --repair
```


observations
------------
```
instead of using global variables like "var express = require('express');" we can use formate like define(['expressUrl'],function(express){});
```

