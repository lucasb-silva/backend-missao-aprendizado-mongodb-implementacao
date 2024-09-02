const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')

const dbUser = 'lucasbeserrasilva18'
const dbPassword = '051Q7uODoTFUC886'

const dbUrl = 'mongodb+srv://' + dbUser + ':' + dbPassword +'@cluster0.zaxp3ht.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const dbName = 'mongodb-intro-e-implementacao'

// Declaramos a funcão main()
async function main() {
  // Realizamos a conexão com o banco de dados
  const client = new MongoClient(dbUrl)
  console.log('Conectando ao banco de dados...')
  await client.connect()
  console.log('Banco de dados conectado com sucesso!')

  const db = client.db(dbName)
  const collection = db.collection('personagem')

  const app = express()

  app.get('/', function (req, res) {
    res.send('Hello World!')
  })

  const lista = ['Java', 'Kotlin', 'Android']

  // Endpoint Read All (GET) /personagem
  app.get('/personagem', async function (req, res) {
    // Acessamos a lista de itens no collection do MongoDB
    const itens = await collection.find().toArray()

    // Enviamos a lista de itens como resultado
    res.send(itens)
  })

  // Endpoint Read by ID (GET) /personagem/:id
  app.get('/personagem/:id', async function (req, res) {
    // Acessamos o parâmetro de rota ID
    const id = req.params.id

    // Acessa o item na collection usando o ID
    const item = await collection.findOne({ _id: new ObjectId(id) })

    // Checamos se o item existe
    if (!item) {
      return res.status(404).send('Item não encontrado.')
    }

    // Enviamos o item como resposta
    res.send(item)
  })

  // Sinalizo para o Express que estamos usando JSON no Body
  app.use(express.json())

  // Endpoint Create [POST] /personagem
  app.post('/personagem', async function (req, res) {
    // Acessamos o Body da Requisição
    const novoItem = req.body

    // Checar se o `nome` está presente na lista
    if (!novoItem || !novoItem.nome) {
      return res.status(400).send('Corpo da requisição deve conter a propriedade `nome`.')
    }

    // Checa se o novoItem está na lista
    // if (lista.includes(novoItem)) {
    //   return res.status(409).send('Esse item já existe na lista.')
    // }

    // Adicionamos na collection
    await collection.insertOne(novoItem)

    // Exibimos uma mensagem de sucesso    
    res.status(201).send(novoItem)
  })

  // Endpoint Update [PUT] /personagem/:id
  app.put("/personagem/:id", async function (req, res) {
    // Acessamos o ID dos parâmetros de rota
    const id = req.params.id

    // Checamos se o item com ID - 1 está na lista
    // if (!lista[id - 1]) {
    //   return res.status(404).send('Item não encontrado.')
    // }

    // Acessamos o Body da requisição
    const novoItem = req.body

    // Checar se o `nome` está presente na lista
    if (!novoItem || !novoItem.nome) {
      return res.status(400).send('Corpo da requisição deve conter a propriedade `nome`.')
    }

    // Checa se o novoItem está na lista
    // if (lista.includes(novoItem)) {
    //   return res.status(409).send('Esse item já existe na lista.')
    // }

    // Atualizamos na collection o novoItem pelo ID
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: novoItem }
    )

    // Enviamos uma mensagem de sucesso
    res.send(novoItem)
  })

  // Endpoint Delete [DELETE] /personagem/:id
  app.delete('/personagem/:id', async function (req, res) {
    // Acessamos o parâmetro de rota
    const id = req.params.id

    // Checamos se o item com ID - 1 está na lista
    // if (!lista[id - 1]) {
    //   return res.status(404).send('Item não encontrado.')
    // }

    // Remover o item da collection usando o ID
    await collection.deleteOne({ _id: new ObjectId(id) })

    // Enviamos uma mensagem de sucesso
    res.send('Item removido com sucesso: ' + id)
  })

  app.listen(3000)

}

// Executamos a função main()
main()