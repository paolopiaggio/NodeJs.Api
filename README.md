# Sample NodeJs Api

## commands:
```javascript
// install dependencies
npm install

// start app
gulp

// run tests
gulp tests
```

# References
## Sequelize:
http://docs.sequelizejs.com/en/v3/

## MySql DB:
```javascript
// spins up a machine containing MySql DB
vagrant up
```

## Get Sqlite DB from MySql DB
https://github.com/dumblob/mysql2sqlite
```javascript
mysqldump --skip-extended-insert --password  nodejsApiDB > dump_mysql.sql
./mysql2sqlite dump_mysql.sql | sqlite3 mysqlite3.db
```
