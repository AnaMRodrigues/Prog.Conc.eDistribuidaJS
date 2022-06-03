const csvtojson = require('csvtojson');
const mysql = require("mysql2");

const hostname = "localhost",
  username = "root",
  password = "catolica",
  databsename = "csvmysql"

let con = mysql.createConnection({
  host: hostname,
  user: username,
  password: password,
  database: databsename,
});

con.connect((err) => {
  if (err) return console.error(
    'error: ' + err.message);

  con.query("DROP TABLE empresas",
    (err, drop) => {

      var createStatament = 'CREATE TABLE empresas (id INT NOT NULL AUTO_INCREMENT,nome VARCHAR(45) NULL,PRIMARY KEY (id))'

      con.query(createStatament, (err, drop) => {
        if (err)
          console.log("ERROR: ", err);
      });
    });
});

const empresas = "empresas_bahia.csv";

csvtojson().fromFile(empresas).then(source => {

  for (var i = 0; i < source.length; i++) {
    var nome = source[i]["nome_fantasia"],

    insertStatement = `INSERT INTO empresas values(?)`;
    items = [nome];

    con.query(insertStatement, items,
      (err, results, fields) => {
        if (err) {
          console.log(
            "Unable to insert item at row ", i + 1);
          return console.log(err);
        } else {
          console.log(
            "All items stored into database successfully");
        }
      });
  }
});

//para aprox aula
//streamming
//https://www.bezkoder.com/node-js-csv-mysql/

/*const fs = require("fs");
const mysql = require("mysql");
const fastcsv = require("fast-csv");
let stream = fs.createReadStream("bezkoder.csv");
let csvData = [];
let csvStream = fastcsv
  .parse()
  .on("data", function(data) {
    csvData.push(data);
  })
  .on("end", function() {
    // remove the first line: header
    csvData.shift();
    // create a new connection to the database
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "123456",
      database: "testdb"
    });
    // open the connection
    connection.connect(error => {
      if (error) {
        console.error(error);
      } else {
        let query =
          "INSERT INTO category (id, name, description, created_at) VALUES ?";
        connection.query(query, [csvData], (error, response) => {
          console.log(error || response);
        });
      }
    });
  });
stream.pipe(csvStream);*/

//https://laratutorials.com/node-js-upload-import-csv-to-mysql/
//https://www.npmjs.com/package/csv-to-mysql