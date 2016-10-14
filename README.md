# InstagramTools

### config.json format

~~~~
{"log_level":"debug",
"device":"<device_name>",
"followers":"followers.json",
"excludes":"excludes.json",
"messages":"messages.json",
"username":"<username>",
"password":"<password>"}
~~~~

### messages.json format

~~~~
[{"text":"<text1>","mediaId":mediaId1},{"text":"<text2>","mediaId
:mediaId2},...,{"text":"<textN>","mediaId":mediaIdN}]
~~~~

### Dependencies

* npm install --save winston
* npm install --save bluebird
* npm install --save instagram-private-api
