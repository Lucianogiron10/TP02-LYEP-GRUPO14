const Item = require('../models/item.model');

// 1. OBTENER TODOS (GET)
exports.getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los elementos' });
  }
};

// 2. CREAR (POST)
exports.createItem = async (req, res) => {
  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el elemento', details: error.message });
  }
};

// 3. ACTUALIZAR (PUT)
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItem = await Item.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedItem) {
      return res.status(404).json({ error: 'Elemento no encontrado' });
    }
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar el elemento' });
  }
};

// 4. ELIMINAR (DELETE)
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ error: 'Elemento no encontrado' });
    }
    res.status(200).json({ message: 'Elemento eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el elemento' });
  }
};