//importar a biblioteca do node modules chamada "EXPRESS" para criar nosso servidor de backend
const express = require("express");

//importar a biblioteca do MYSQL
const mysql = require("mysql2");

//importar a biblioteca do cors
const cors = require("cors");

//importar a biblioteca do bcrypt
//para a criptografia de senha
const bcrypt = require("bcrypt");


//estabelecer a conexão com o banco de dados mysql
const con = mysql.createConnection({
    host:"127.0.0.1",
    port:3306   ,
    user:"root",
    password:"",
    database:"mrk"
});

//carregar e instanciar o EXPRESS para utilizar as rotas:
//GET -> Para obter dados do banco de dados -> R
//POST -> Para enviar dados ao servidor e gravar dados no banco de dados -> C
//PUT -> Para atualizar os dados no banco -> U
//DELETE -> Para apagar dados em banco -> D
const app = express();

//carregar a função que manipula dados em formato JSON, ou seja, permite ler, gravar, atualizar,
//deletar, enviar e receber dados em formato JSON
app.use(express.json());

app.use(express.urlencoded({ extended: true }));


//ativar o modolo do cors
app.use(cors());

//primeira rota para listar os dados do banco
app.get("/clientes/listar",(req,res)=>{          //req=requisitar  res=responder
    //usar o comando Select para listar todos os clientes
    con.query("Select * from cliente",(error,result)=>{
        if(error){
            return res.status(500).send({erro:`Erro ao tentar listar os dados ${error}`})
        }
        res.status(200).send({msg:result});     //usar crase, pois aspas dá erro
    })
});

//segunda rota para receber os dados enviados pelo usuário
app.post("/cadastrar",(req,res)=>{


    let sh = req.body.senha;
    bcrypt.hash(sh,10,(erro,criptografada)=>{
        if(erro){
            return res.status(500).send({msg:`erro ao `})
        }
        //devolver a senha para o body
        //porém com a devida criptografia
        req.body.senha = criptografada;
        con.query("insert into cliente set ?", req.body,(error, result)=>{
        if (error) {
            return res.status(500).send({erro:`Erro ao tentar cadastrar ${error}`})
        }
        res.status(201).send({msg:`Cliente cadastrado`,payload:result});
    })
})

});

//terceira rota para receber os dados e atualizar
app.put("/atualizar/:id",(req,res)=>{

    con.query("update cliente set ? where id=?",[req.body, req.params.id],(error,result)=>{ //[] porque são 2 parâmetros
        if(error){
            return res.status(500).send({erro:`Erro ao tentar atualizar ${error}`})
        }
        res.status(200).send({msg:`Dados atualizados`,payload:result});
    });

});

//quarta rota para receber um id e apagar um dado
app.delete("/apagar/:id",(req,res)=>{

    con.query("delete from cliente where id=?",req.params.id,(error,result)=>{
        if(error){
            return res.status(500).send({erro:`Erro ao tentar deletar ${error}`})
        }
        res.status(200).send({msg:`Dados apagados`,payload:result});
    });
});

app.post("/login", (req, res) => {
    const { usuario, senha } = req.body;
    console.log(usuario)
    const sql = "SELECT id_cliente, email, usuario, senha FROM cliente WHERE usuario = ?";
    con.query(sql, usuario, (err, results) => {
        if (err) {
            console.log("Erro no SELECT:", err);
            return res.status(500).json({ msg: "Erro no servidor." });
        }

        if (results.length === 0) {
            return res.status(401).json({ msg: "Usuário ou senha inválidos.usuario" });
        }

        const user = results[0];
        console.log(senha)
        bcrypt.compare(senha, user.senha, (err, same) => {
            if (err) {
                console.log("Erro no bcrypt.compare:", err);
                return res.status(500).json({ msg: "Erro ao verificar a senha." });
            }

            if (!same) {
                return res.status(401).json({ msg: "Usuário ou senha inválidos.senha" });
            }

            return res.status(200).json({ msg: "Login realizado com sucesso!", usuario: user.usuario });
        });
    });
});



// produtos -------------------------------

app.get("/produto/listar",(req,res)=>{          //req=requisitar  res=responder
    //usar o comando Select para listar todos os clientes
    con.query("Select * from produto",(error,result)=>{
        if(error){
            return res.status(500).send({erro:`Erro ao tentar encontrar o produto ${error}`})
        }
        res.status(200).send({msg:result});     //usar crase, pois aspas dá erro
    })
});


app.get("/produto/pesquisar/:nome",(req,res)=>{          //req=requisitar  res=responder
    //usar o comando Select para listar todos os clientes
    let par = `%${req.params.nome}%`
    con.query(`Select * from produto where nome like ?`,par,(error,result)=>{
        if(error){
            return res.status(500).send({erro:`Erro ao tentar encontrar o produto ${error}`})
        }
        res.status(200).send({msg:result});     //usar crase, pois aspas dá erro
    })
});


app.get("/produto/detalhes/:id",(req,res)=>{          //req=requisitar  res=responder
    //usar o comando Select para listar todos os clientes
    
    con.query(`Select * from produto where id_produto = ?`,req.params.id,(error,result)=>{
        if(error){
            return res.status(500).send({erro:`Erro ao tentar encontrar o produto ${error}`})
        }
        res.status(200).send({msg:result});     //usar crase, pois aspas dá erro
    })
});

//segunda rota para receber os dados enviados pelo usuário
app.post("/produto/cadastrar",(req,res)=>{
    
        con.query("insert into produto set ?", req.body,(error, result)=>{
        if (error) {
            return res.status(500).send({erro:`Erro ao tentar cadastrar ${error}`})
        }
        res.status(201).send({msg:`Produto cadastrado`,payload:result});
    })

});

//terceira rota para receber os dados e atualizar
app.put("/produto/atualizar/:id",(req,res)=>{

    con.query("update produto set ? where id=?",[req.body, req.params.id],(error,result)=>{ //[] porque são 2 parâmetros
        if(error){
            return res.status(500).send({erro:`Erro ao tentar atualizar ${error}`})
        }
        res.status(200).send({msg:`Dados atualizados`,payload:result});
    });

});

//quarta rota para receber um id e apagar um dado
app.delete("/produto/apagar/:id",(req,res)=>{

    con.query("delete from produto where id=?",req.params.id,(error,result)=>{
        if(error){
            return res.status(500).send({erro:`Erro ao tentar deletar ${error}`})
        }
        res.status(200).send({msg:`Dados apagados`,payload:result});
    });
});



// comprar -------------------------------

app.get("/compra/listar",(req,res)=>{          //req=requisitar  res=responder
    //usar o comando Select para listar todos os clientes
    con.query("Select * from compra",(error,result)=>{
        if(error){
            return res.status(500).send({erro:`Erro ao tentar comprar o produto ${error}`})
        }
        res.status(200).send({msg:result});     //usar crase, pois aspas dá erro
    })
});

//segunda rota para receber os dados enviados pelo usuário
app.post("/compra/cadastrar",(req,res)=>{
    
        con.query("insert into compra set ?", req.body,(error, result)=>{
        if (error) {
            return res.status(500).send({erro:`Erro ao tentar cadastrar ${error}`})
        }
        res.status(201).send({msg:`compra cadastrado`,payload:result});
    })

});

//terceira rota para receber os dados e atualizar
app.put("/compra/atualizar/:id",(req,res)=>{

    con.query("update compra set ? where id=?",[req.body, req.params.id],(error,result)=>{ //[] porque são 2 parâmetros
        if(error){
            return res.status(500).send({erro:`Erro ao tentar atualizar ${error}`})
        }
        res.status(200).send({msg:`Dados atualizados`,payload:result});
    });

});

//quarta rota para receber um id e apagar um dado
app.delete("/compra/apagar/:id",(req,res)=>{

    con.query("delete from compra where id=?",req.params.id,(error,result)=>{
        if(error){
            return res.status(500).send({erro:`Erro ao tentar deletar ${error}`})
        }
        res.status(200).send({msg:`Dados apagados`,payload:result});
    });
});




//determinando a porta de comunicação
app.listen(3000,()=>console.log("Servidor online http://127.0.0.1:3000"));