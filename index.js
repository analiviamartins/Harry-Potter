const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 4000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'harrypotter',
  password: 'ds564',
  port: '7007'
});

app.use(express.json());

//Rotas para os bruxos

app.post('/bruxos', async (req, res) => {
    const { nome, idade, casa, habilidade, status_sangue } = req.body;
    const query = 'INSERT INTO bruxos (nome, idade, casa, habilidade, status_sangue) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [nome, idade, casa, habilidade, status_sangue];
  
    try {
      const tipo_sangue = [
        'Trouxa',
        'Mestiço',
        'Puro'
      ];

      const casas = [
        'Grifinória',
        'Corvinal',
        'Lufa-lufa',
        'Sonserina'
      ];

      if (!tipo_sangue.includes(status_sangue)) {
        res.status(500).send('Tente Trouxa, Mestiço ou puro!😁')
      };
      if (!casas.includes(casa)){
        res.status(500).send('Só existem Grifinória, Sonserina, Corvinal e Lufa-lufa!😚')
      };
      const resultado = await pool.query(query, values);
      res.status(201).json(resultado.rows[0]);
    } catch (err) {
      console.error('Erro ao criar bruxo:', err);
      res.status(500).send('Erro ao criar bruxo');
    }
  });

  app.get('/bruxos', async (req, res)=>{
    try {
        const resultado = await pool.query('SELECT * FROM bruxos');
        res.json(resultado.rows);
    } catch (error) {
        console.error('Erro ao obter bruxos:', error);
        res.status(500).send('Erro ao obter bruxos');
    }
  });

  app.put('/bruxos/:id', async (req, res)=>{
    const id = req.params.id;
    const {nome, idade, casa, habilidade, status_sangue} = req.body;
    const query = 'UPDATE bruxos SET nome=$1, idade=$2, casa=$3, habilidade=$4, status_sangue=$5 WHERE id=$6';
    const values = [nome, idade, casa, habilidade, status_sangue, id];

    try {
      const tipo_sangue = [
        'Trouxa',
        'Mestiço',
        'Puro'
      ];

      const casas = [
        'Grifinória',
        'Corvinal',
        'Lufa-lufa',
        'Sonserina'
      ];

      if (!tipo_sangue.includes(status_sangue)) {
        res.status(500).send('Tente Trouxa, Mestiço ou puro!😁')
      }
      if (!casas.includes(casa)){
        res.status(500).send('Só existem Grifinória, Sonserina, Corvinal e Lufa-lufa!😚')
      };
        await pool.query(query, values);
        res.send('Bruxo atualizado com sucesso9');
    } catch (error) {
        console.error('Erro ao atualizar bruxo', error);
        res.status(500).send('Erro ao atualizar bruxo')
    }
});

app.delete('/bruxos/:id', async (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM bruxos WHERE id=$1';
  
    try {
      await pool.query(query, [id]);
      res.send('Bruxo deletado com sucesso');
    } catch (err) {
      console.error('Erro ao deletar bruxo:', err);
      res.status(500).send('Erro ao deletar bruxo');
    }
  });

  //Rotas para as varinhas 
  
  app.post('/varinhas', async (req, res) => {
    try {
      const { material, comprimento, nucleo, data_fabricacao } = req.body;
      await pool.query('INSERT INTO varinhas (material, comprimento, nucleo, data_fabricacao) VALUES ($1, $2, $3, $4) RETURNING *', [material, comprimento, nucleo, data_fabricacao]);
      res.status(201).send({ mensagem: 'Varinha adicionada com sucesso'});
    } catch (err) {
      console.error('Erro ao criar varinha:', err);
      res.status(500).send('Erro ao criar varinha');
    }
  });


  app.get('/varinhas', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM varinhas');
      res.json(result.rows);
    } catch (err) {
      console.error('Erro ao obter varinhas:', err);
      res.status(500).send('Erro ao obter varinhas');
    }
  });

  app.put('/varinhas/:id', async (req, res) => {
    const id = req.params.id;
    const { material, comprimento, nucleo, data_fabricacao } = req.body;
    const query = 'UPDATE varinhas SET material=$1, comprimento=$2, nucleo=$3, data_fabricacao=$4 WHERE id=$5';
    const values = [material, comprimento, nucleo, data_fabricacao, id];
  
    try {
      await pool.query(query, values);
      res.send('Varinha atualizada com sucesso');
    } catch (err) {
      console.error('Erro ao atualizar varinha:', err);
      res.status(500).send('Erro ao atualizar varinha');
    }
  });
  
  app.delete('/varinhas/:id', async (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM varinhas WHERE id=$1';
  
    try {
      await pool.query(query, [id]);
      res.send('Varinha deletada com sucesso');
    } catch (err) {
      console.error('Erro ao deletar varinha:', err);
      res.status(500).send('Erro ao deletar varinha');
    }
  });

  app.get('/',(req, res) =>{
    res.send('Servidor funcionando')
})

app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`)
})