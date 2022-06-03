const fs = require('fs');
// const path = require('path');
// const coolPath = path.join(__dirname, 'empresas_bahia.csv');
// const stream = fs.createReadStream(coolPath);
// stream.pipe(process.stdout);

const mysql2 = require("mysql2");
//const fs = require("fs");
const fastcsv = require("fast-csv");
const csvtojson = require('csvtojson');
// var path = require('path');
// var coolPath = path.join(__dirname, 'empresas_bahia.csv');
// var stream = fs.createReadStream(coolPath);
let csvData = [];
let csvStream = fastcsv
.parse()
  .on("data", function(data) {
    csvData.push(data);
  })
  .on("end", function() {
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
  if (err){
    console.log("Conexão com o bd error!!")
    console.error('error: ' + err.message);
  } else {
    console.log("Conexão Feita!!!")
    
    con.query("SHOW TABLES", function (err, result, fields){
      if(err) throw err;
      console.log(result);
    });

    con.query("DROP TABLE empresas", function(err, drop){
      if(err)
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
      // const stream = fs.createReadStream(coolPath);
      // stream.pipe(csvStream);
      // console.log("!!!!!!!!!!!")

      //stream.pipe(process.stdout);

      var nome_fantasia,
data_inicio_atividades,
cnae_fiscal,
cep,
municipio,
porte;

          csvtojson().fromFile(coolPath).then(source => {
          for(var i=0; i<2; i++){
                nome_fantasia = source[i]["nome_fantasia"],
                data_inicio_atividades = source[i]["data_inicio_atividades"],
                cnae_fiscal = source[i]["cnae_fiscal"],
                cep = source[i]["cep"],
                municipio = source[i]["municipio"],
                porte = source[i]["porte"]

                console.log(nome_fantasia)

                let query = `INSERT INTO empresas (nome_fantasia, data_inicio_atividades, cnae_fiscal, cep, municipio, porte) values (?)`;
                csvData = [nome_fantasia, data_inicio_atividades, cnae_fiscal, cep, municipio, porte];
        
        

        con.query(query, [csvData], (error, response) => {
          if(error){
            console.log("Erro no insert!!")
            console.log(error || response);
          } else {
            console.log("All items stored into database successfully");
          }
          
        });
        }
        });

        // con.query(insertStatement, items,
        //   (err, results, fields) => {
        //     if (err) {
        //       console.log(
        //         "Unable to insert item at row ", i + 1);
        //       return console.log(err);
        //     } else {
        //       console.log(
        //         "All items stored into database successfully");
        //     }
        //   });

        
  }
  
});



//streamming
//https://www.bezkoder.com/node-js-csv-mysql/

//https://laratutorials.com/node-js-upload-import-csv-to-mysql/
//https://www.npmjs.com/package/csv-to-mysql

/*- Deverá ser aplicado o conceito de streams e ser utilizado 
o novo arquivo de entrada empresas_bahia_lista_3.csv (com mais
   registros que o exemplo anterior empresas_bahia.csv)

- Calcule a distância entre a cidade em que a empresa está 
instalada e as 4 maiores cidades do estado, para isso utilize
 a latitude e longitude da cidade onde a empresa está instalada
  e as coordenadas das 4 cidades abaixo:

1 Salvador
2 Feira de Santana
3 Vitória da Conquista
4 Camaçari

- Na tabela empresa adicione 4 colunas (dist_1,dist_2,dist_3,
  dist_4), sendo 1 Salvador, 2 Feira de Santana, 3 Vitória da
   Conquista e 4 Camaçari.
- Adicione os mesmos 4 novos campos (dist_1,dist_2,dist_3,
  dist_4) no arquivo .csv de saída.
- A distância poderá ser armazenada e apresentada no arquivo
 de saída .csv em Km ou metros.

Sugestões:

- Utilize a seguinte solução para o cálculo entre as cidades
/coordenadas: https://pt.stackoverflow.com/questions/251479/dist%C3%A2ncia-em-metros-entre-duas-coordenadas-usando-javascript

- https://nodejs.org/api/stream.html
- https://imasters.com.br/back-end/streams-no-node-js-o-que-sao-streams-afinal-parte-01
- https://www.youtube.com/watch?v=pB5-QzabL2I (Quem tem medo
 de Node.js Streams? - conheça a incrível e poderosa 
 funcionalidade do Node.js)*/
 //https://github.com/mysqljs/mysql/issues/1923
