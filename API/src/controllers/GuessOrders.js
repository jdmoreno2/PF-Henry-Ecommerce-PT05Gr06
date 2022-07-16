const { Order, Product, User } = require("../db");
const upload = require("../libs/storage");
const { Router } = require("express");
const router = Router();
const mercadopago = require("mercadopago");


mercadopago.configure({
    access_token: "TEST-5234286386169714-071521-eec79942f3b545900ffd49238398d759-1161619687",
  });


// ..sacar items de mi carrito, en caso que decida no quererlos.
router.delete("/:idorder/product/:id", async (req, res) => {
  try {
    const { idorder, id } = req.params;
    const order = await Order.findByPk(parseInt(idorder));
    const prod1 = await Product.findByPk(parseInt(id));
    const projects = await order.getProducts();
    const p1 = projects[0];
    const x = p1.productXorder.cant;

    let mountProd = prod1.dataValues.price;
    let priceA = parseInt(mountProd) * parseInt(x);
    let montOrder = order.dataValues.mont;
    montOrder = parseInt(montOrder) - parseInt(priceA);
    const newPrice = await Order.update(
      { mont: montOrder },
      { where: { id: order.dataValues.id } }
    );
    await order.removeProducts(prod1);
    res.status(200).send("borradooo");
  } catch (e) {
    res.status(400).send("Error: " + e);
  }
});

// ..editar cantidades de los items de mi carrito, en caso que quiera mas o menos
// cantidad de un item en particular.

router.put("/:idorder/product/:id", async (req, res) => {
  try {
    const { idorder, id } = req.params;
    const { cant } = req.body;
    if (!cant)
      return res.status(400).send("Faltan datos necesarios (cantidad).");
    const order = await Order.findByPk(parseInt(idorder));
    const prod = await Product.findByPk(parseInt(id));
    let montT = order.dataValues.mont; //monto sin actualizar
    let priceProd = prod.dataValues.price; //precio producto
    let projects = await order.getProducts(); // -
    const p1 = projects[0]; //                    |---- tomar la cantidad del producto y de la orden sin actualizar
    const x = p1.productXorder.cant; //           -
    let priceB = priceProd * x; // precio que va cambiar
    let montT1 = montT - priceB;
    let priceA = cant * priceProd; // cantidad actualizada por el precio del producto
    let montTF = montT1 + priceA;
    await Order.update(
      { mont: montTF },
      { where: { id: order.dataValues.id } }
    );

    await order.addProducts(prod, { through: { cant: cant } });
    res.status(200).send("actualizado");
  } catch (e) {
    res.status(400).send("Error: " + e);
  }
});

  //.poder comprar todos los items de un mi carrito. (checkout) 
  router.put("/:idorder/checkout", async (req, res) => {
    try{
      const {idorder} = req.params;
      const {
        name,
        dni,
        address,
      } = req.body
      const order = await Order.findByPk(parseInt(idorder));
      if (!name) return res.status(400).send("Faltan datos necesarios (name).");
    if (!dni) return res.status(400).send("Faltan datos necesarios (dni).");
    if (!address) return res.status(400).send("Faltan datos necesarios (address).");

    let userNew = await User.create({
      name,
      dni,
      orderId: order.dataValues.id
    });

    let addresNew = await Order.update(
      {address},
      {where: { id: order.dataValues.id }}
    );
    let projects = await order.getProducts(); // -
      let categoryNew = projects.map((e) => {
        return e.dataValues.name;
      });
      console.log(categoryNew)
    // Crea un objeto de preferencia
// let preference = {
//   items: [
//     {
//       title: "Mi producto",
//       unit_price: 100,
//       quantity: 1,
//     },
//   ],
// };

// mercadopago.preferences
//   .create(preference)
//   .then(function (response) {
//     // En esta instancia deberás asignar el valor dentro de response.body.id por el ID de preferencia solicitado en el siguiente paso
//   })
//   .catch(function (error) {
//     console.log(error);
//   });
res.status(200).send("actualizado");
    }catch (e) {
    res.status(400).send("Error: " + e)
}
})

  module.exports = router
