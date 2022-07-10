const { Product, Category, Review, Order } = require("../db");
const upload = require('../libs/storage');
const { Router } = require('express');
const router = Router();


router.post('/', upload.array('image'), async (req, res, next) => {
  try {
    const { name, description, price, stock, category } = req.body;
    const image = req.files || req.file;
    if (!image) return res.status(400).send("Faltan datos necesarios (image).");
    if (!name) return res.status(400).send("Faltan datos necesarios (name)." + name);
    if (!description) return res.status(400).send("Faltan datos necesarios (description).");
    if (!price) return res.status(400).send("Faltan datos necesarios (price).");
    if (!stock) return res.status(400).send("Faltan datos necesarios (stock).");
    if (!category) return res.status(400).send("Faltan datos necesarios (category).");
    if (isNaN(parseInt(stock))) return res.status(400).send("Formato de datos invalido (stock) debe ser un numero.");
    if (isNaN(parseInt(price))) return res.status(400).send("Formato de datos invalido (price) debe ser un numero.");
    if (!isNaN(parseInt(name))) return res.status(400).send("Formato de datos invalido (name) debe ser una cadena texto.");
    if (!isNaN(parseInt(description))) return res.status(400).send("Formato de datos invalido (description) debe ser una cadena de texto.");

    let imagenes = image.map(i => i.path);
    let product = await Product.create({
      name,
      description,
      price,
      stock,
      image: imagenes ? imagenes : ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj69dz8tM7tixlt4hTLPnGwVPavHB1QYeGtA&usqp=CAU"],
    });

    const cat = category.split(",");
    await Promise.all(cat.map(async c => {
      await product.addCategories(c);
    }));

    const catego = await product.getCategories();

    return res.status(201).json({...product.dataValues, category: catego});
  }
  catch (e) {
    return res.status(400).send("Error: " + e);
  }
});


module.exports = router