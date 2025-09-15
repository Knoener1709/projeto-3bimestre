import express from 'express'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient()

app.use(express.json())

// --------------------- USERS ---------------------
// (Opcional: apenas se quiser CRUD de users também)
app.post('/users', async (req, res) => {
  try {
    const { email, name } = req.body
    const user = await prisma.user.create({
      data: { email, name }
    })
    res.status(201).json(user)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

// --------------------- STORES ---------------------
// POST - criar Store vinculada a um User
app.post('/stores', async (req, res) => {
  try {
    const { name, userId } = req.body
    const store = await prisma.store.create({
      data: { name, userId: Number(userId) }
    })
    res.status(201).json(store)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

// GET - trazer store + dono + produtos
app.get('/stores/:id', async (req, res) => {
  try {
    const store = await prisma.store.findUnique({
      where: { id: Number(req.params.id) },
      include: { user: true, products: true }
    })
    if (!store) return res.status(404).json({ error: 'Loja não encontrada' })
    res.json(store)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

// PUT - atualizar Store
app.put('/stores/:id', async (req, res) => {
  try {
    const { name } = req.body
    const store = await prisma.store.update({
      where: { id: Number(req.params.id) },
      data: { name }
    })
    res.json(store)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

// DELETE - remover Store
app.delete('/stores/:id', async (req, res) => {
  try {
    await prisma.store.delete({
      where: { id: Number(req.params.id) }
    })
    res.json({ message: 'Loja removida com sucesso' })
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

// --------------------- PRODUCTS ---------------------
// POST - criar Product
app.post('/products', async (req, res) => {
  try {
    const { name, price, storeId } = req.body
    const product = await prisma.product.create({
      data: { name, price: Number(price), storeId: Number(storeId) }
    })
    res.status(201).json(product)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

// GET - listar todos os Products + loja + dono da loja
app.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { store: { include: { user: true } } }
    })
    res.json(products)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

// PUT - atualizar Product
app.put('/products/:id', async (req, res) => {
  try {
    const { name, price } = req.body
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: { name, price: Number(price) }
    })
    res.json(product)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

// DELETE - remover Product
app.delete('/products/:id', async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: Number(req.params.id) }
    })
    res.json({ message: 'Produto removido com sucesso' })
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

// --------------------- SERVIDOR ---------------------
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
})
