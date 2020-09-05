const express = require('express');
const router = express.Router();
const destinationsModel = require('../models/destinations');
const { authenticate } = require('../utils/security');

router.get('/', async (req, res) => {
  try {
    const destinations = await destinationsModel.getAll();
    res.json({ destinations }); // Status 200
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/show', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const destination = await destinationsModel.getById(id);
    res.json({ destination });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// Guarda la información del formulario
router.post('/create', authenticate, async (req, res) => {
  try {
    const destination = req.body;
    if(req.files) {
      let image = req.files.image;
      await image.mv('./public/images/' + image.name);
      destination.image = '/images/' + image.name;
    }
    await destinationsModel.create(destination);
    res.status(201).json({ sucess: true });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualiza la información de un destino
router.put('/:id/save', authenticate, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const destination = req.body;
    await destinationsModel.update(id, destination);
    res.sendStatus(204);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// Elimina un registro de destinos de la base de datos
router.delete('/:id/delete', authenticate, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await destinationsModel.destroy(id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})


module.exports = router;