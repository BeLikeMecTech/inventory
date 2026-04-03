const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Backend running'));

/* ITEMS */
app.get('/items', async (req, res) => {
  res.json(await prisma.equipmentItem.findMany());
});

app.post('/items', async (req, res) => {
  const item = await prisma.equipmentItem.create({ data: req.body });

  await prisma.log.create({
    data: {
      action: "CREATE_ITEM",
      itemId: item.id,
      user: "system"
    }
  });

  res.json(item);
});

app.put('/items/:id', async (req, res) => {
  const item = await prisma.equipmentItem.update({
    where: { id: req.params.id },
    data: req.body
  });

  await prisma.log.create({
    data: {
      action: "UPDATE_ITEM",
      itemId: item.id,
      user: "system"
    }
  });

  res.json(item);
});

app.delete('/items/:id', async (req, res) => {
  await prisma.equipmentItem.delete({
    where: { id: req.params.id }
  });

  await prisma.log.create({
    data: {
      action: "DELETE_ITEM",
      itemId: req.params.id,
      user: "system"
    }
  });

  res.sendStatus(204);
});

/* USERS */
app.get('/users', async (req, res) => {
  res.json(await prisma.user.findMany());
});

app.post('/users', async (req, res) => {
  res.json(await prisma.user.create({ data: req.body }));
});

/* VENDORS */
app.get('/vendors', async (req, res) => {
  res.json(await prisma.vendor.findMany());
});

app.post('/vendors', async (req, res) => {
  res.json(await prisma.vendor.create({ data: req.body }));
});

/* LOCATIONS */
app.get('/locations', async (req, res) => {
  res.json(await prisma.location.findMany());
});

app.post('/locations', async (req, res) => {
  res.json(await prisma.location.create({ data: req.body }));
});

/* LOGS */
app.get('/logs', async (req, res) => {
  res.json(await prisma.log.findMany({ orderBy: { timestamp: 'desc' }}));
});

app.listen(5000, () => console.log("Server running on port 5000"));