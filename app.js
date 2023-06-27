const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("./mysql");



const app = express();
app.use(cors())
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 

//Páginas livres de autenticação
app.get("/", (req, res, next)=>{
    mysql.getConnection((error, conn) => {
        try {
          conn.query(`SELECT id_reserva, 
                            mesas.numero mesa, 
                            nome_funcionario, 
                            telefone_funcionario, 
                            nome_cliente, 
                            telefone_cliente, 
                            email_cliente, 
                            data, hora, cadeiras
                        FROM reservas
                        INNER JOIN clientes ON cliente_id = id_cliente
                        INNER JOIN mesas ON mesa_id = id_mesa
                        INNER JOIN funcionarios ON fincionario_id = id_funcionario
                        ORDER BY id_reserva
      `, (erro, result, field) => {
            conn.release();
            if (erro || !result[0]) {
              return res.status(500).send({
                message: "nada encontrado",
              });
            }
            res.status(200).send(result);
          });
        } catch (error) {
          res.status(500).send({
            message: "algo deu errado",
          });
        }
      });
})

module.exports = app;
