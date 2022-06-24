const fs = require('fs');
// const path = require('path');
// const coolPath = path.join(__dirname, 'empresas_bahia.csv');
// const stream = fs.createReadStream(coolPath);
// stream.pipe(process.stdout);

const mysql2 = require("mysql2");
//const fs = require("fs");
const fastcsv = require("fast-csv");
const csvtojson = require('csvtojson');
const { stdout } = require('process');
// var path = require('path');
// var coolPath = path.join(__dirname, 'empresas_bahia.csv');
// var stream = fs.createReadStream(coolPath);
let csvData = [];
let csvStream = fastcsv
  .parse()
  .on("data", function (data) {
    csvData.push(data);
  })
  .on("end", function () {
    // remove the first line: header
    csvData.shift();
    // connect to the MySQL database
    // save csvData
  });

let con = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: "catolica",
  database: "empresas",
});

con.connect((err) => {
  if (err) {
    console.log("Conexão com o bd error!!")
    console.error('error: ' + err.message);
  } else {
    console.log("Conexão Feita!!!")
    //não consegui fazer pois não consegui conectar com o banco para testagem. esperava tentar resolver com vc 
    //no dia da aula mas vc precisava das notas :/

    con.query("SHOW TABLES", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });

    con.query("DROP TABLE empresas", function (err, drop) {
      if (err)
        console.log(err)
    });

    var createStatament = 'CREATE TABLE empresas (`id` INT NOT NULL AUTO_INCREMENT,`nome_fantasia` VARCHAR(200) NULL,`data_inicio_atividades` VARCHAR(45) NULL,`cnae_fiscal` DOUBLE NULL,`cep` DOUBLE NULL,`municipio` INT NULL,`porte` INT NULL,PRIMARY KEY (`id`));'
    // con.query(query,[csvData], (error, response) => {
    //   console.log(error || response);
    // });

    con.query(createStatament, (err, drop) => {
      if (err)
        console.log("Criação da tabela ERROR: ", err);
    });

    const path = require('path');
    const coolPath = path.join(__dirname, 'empresas_bahia.csv');
    const coolpath2 = path.join(__dirname, 'cidade_siafi.csv');
    const coolpath3 = path.join(__dirname, 'cidade_siafi.csv');
    // const stream = fs.createReadStream(coolPath);
    // stream.pipe(csvStream);
    // console.log("!!!!!!!!!!!")

    //stream.pipe(process.stdout);

    var nome_fantasia,
      data_inicio_atividades,
      cnae_fiscal,
      cep,
      municipio,
      porte,
      dist_1,
      dist_2 = 0,
      dist_3 = 0,
      dist_4 = 0,
      salvador,
      feira,
      vitoria,
      camaçari;
    csvtojson().fromFile(coolpath2).then(source2 => {
      for (var y = 0; y < source2.length; y++) {
        //Está entrando todas as vezes
        //mas não entra nenhuma vez nos if's específicos
        if (source2[y]["siafi_id"] == "3849") {
          salvador = y;
          // console.log(salvador);
        } else if (source2[y]["siafi_id"] == '3515') {
          feira = y;
          // console.log(feira);
        } else if (source2[y]["siafi_id"] == '3965') {
          vitoria = y;
          // console.log(vitoria);
        } else if (source2[y]["siafi_id"] == '3413') {
          camaçari = y;
          // console.log(camaçari);
        }
      }
    })
    csvtojson().fromFile(coolPath).then(source => {
      for (var i = 0; i < source.length; i++) {
        nome_fantasia = source[i]["nome_fantasia"],
          data_inicio_atividades = source[i]["data_inicio_atividades"],
          cnae_fiscal = source[i]["cnae_fiscal"],
          cep = source[i]["cep"],
          municipio = source[i]["municipio"],
          porte = source[i]["porte"]


        for (var x = 0; x < coolpath3.length; x++) {
          if (source[i]["municipio"] == coolpath3[x]["siafi_id"]) {
            dist_1 = (coolpath3[x]["latitude"] + coolpath3[x]["longitude"]) - (coolpath3[salvador]["latitude"] + coolpath3[salvador]["longitude"]);
            console.log(dist_1);
          }
        }
        console.log(dist_1);

        for (var x = 0; x < coolpath3.length; x++) {
          if (source[i]["municipio"] == coolpath3[x]["siafi_id"]) {
            dist_2 = (coolpath3[x]["latitude"] + coolpath3[x]["longitude"]) - (coolpath3[feira]["latitude"] + coolpath3[feira]["longitude"]);
            console.log(dist_2);
          }
        }
        console.log(dist_2);

        for (var x = 0; x < coolpath3.length; x++) {
          if (source[i]["municipio"] == coolpath3[x]["siafi_id"]) {
            dist_3 = (coolpath3[x]["latitude"] + coolpath3[x]["longitude"]) - (coolpath3[vitoria]["latitude"] + coolpath3[vitoria]["longitude"]);
            console.log(dist_3);
          }
        }
        console.log(dist_3);

        for (var x = 0; x < coolpath3.length; x++) {
          if (source[i]["municipio"] == coolpath3[x]["siafi_id"]) {
            dist_4 = (coolpath3[x]["latitude"] + coolpath3[x]["longitude"]) - (coolpath3[camaçari]["latitude"] + coolpath3[camaçari]["longitude"]);
            console.log(dist_4);
          }
        }
        console.log(dist_4);

        //dist_1 - 2927408,Salvador,-12.9718,-38.5011,29,3849 - 4334
        //dist_2 - 2910800,Feira de Santana,-12.2664,-38.9663,29,3515 - 1760
        //dist_3 - 2933307,Vitória da Conquista,-14.8615,-40.8442,29,3965 - 5537
        //dist_4 - 2905701,Camaçari,-12.6996,-38.3263,29,3413 - 917

        console.log(nome_fantasia)

        let query = `INSERT INTO empresas (nome_fantasia, data_inicio_atividades, cnae_fiscal,
                  cep, municipio, porte, dist_1, dist_2, dist_3, dist_4) values (?)`;
        csvData = [nome_fantasia, data_inicio_atividades, cnae_fiscal, cep, municipio, porte, dist_1, dist_2, dist_3, dist_4];



        con.query(query, [csvData], (error, response) => {
          if (error) {
            // console.log("Erro no insert!!")
            // console.log(error || response);
          } else {
            console.log("All items stored into database successfully");
          }

        });

        query = `SELECT nome_fantasia, data_inicio_atividades, cnae_fiscal,
        cep, municipio, porte, dist_1, dist_2, dist_3, dist_4 FROM
        empresas INTO OUTFILE 'C:\Users\anaclara.rodrigues\Downloads\05\novo.csv' FIELDS ENCLOSED BY ',' 
        TERMINATED BY ';' LINES TERMINATED BY ';'`;
      }
    });


  }

});