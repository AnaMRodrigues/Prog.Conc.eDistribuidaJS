const mysql2 = require("mysql2");

let con = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "catolica",
    database: "empresas",
  });

  con.connect((err) => {
    if (err){
      console.log("Conexão com o bd error!!")
    } else {
        console.log("conexão feita!!")
    }
  });

con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM empresas", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
    con.query("SHOW TABLES", function (err, result, fields){
        if(err) throw err;
        console.log(result);
    });
  });