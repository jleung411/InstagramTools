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
[{"text":"<text1>","mediaId":1234},{"text":"<text2>","mediaId
:5678},...,{"text":"<textN>","mediaId":9876}]
~~~~

### Dependencies

* npm install --save winston
* npm install --save bluebird
* npm install --save instagram-private-api
