const { User, Order, Car, Category, Product } = require("../db");
const upload = require("../libs/storage");
const { Router } = require("express");
const router = Router();
const mercadopago = require("mercadopago");
const { DB_HOST, ACCES_TOKEN, VITE_URL_API } = process.env;

const BASE_URL2 =
  DB_HOST === "localhost"
    ? "http://localhost:5000"
    : "https://nueva-prueba-sin-variables.vercel.app/";


mercadopago.configure({
  access_token: ACCES_TOKEN
})

router.get("/:idorder", async (req, res) => {
  try {
    let mont = 0;
    const {idorder} = req.params;
    const order = await Order.findByPk(parseInt(idorder))
    console.log(order)
    const user = await User.findByPk(parseInt(order.dataValues.userId));
    let projects = await order.getProducts(); // -
    let productsClient = await Promise.all(projects.map(async (f) => {
      return {
        id: f.dataValues.id,
      };
    }
    ));

    let claves = Object.keys(productsClient);
    for (let i = 0; i < claves.length; i++) {
      let clave = claves[i];
      let nameCategor = await Category.findByPk(parseInt(clave));
      if (nameCategor) {
        array = {
          id: claves[i],
          name: nameCategor.dataValues.name
        }
      }
    }

    let productsCar = projects.map(e => {
      let mont1 = e.dataValues.price * e.dataValues.productXorder.cant;
      mont = mont + mont1

      return {
        id: e.dataValues.id,
        title: e.dataValues.name,
        quantity: e.dataValues.productXorder.cant,
        description: e.dataValues.description,
        //   category_id: array,
        unit_price: e.dataValues.price,
        currency_id: "PEN"
      };
    });
    console.log(productsCar)
    let users = {
      name: user.dataValues.name,
      dni: user.dataValues.dni,
      username: user.dataValues.username,
      email: user.dataValues.email,
      mont: mont
    }


    let preference = {
      items: productsCar,
      external_reference: `${user.dataValues.id}`,
      payer: users,
      back_urls: {
        success: `${VITE_URL_API}`,
        failure: `${VITE_URL_API}`,
        pending: `${VITE_URL_API}`,
      }
    }
    mercadopago.preferences
      .create(preference)
      .then(function (response) {
        // En esta instancia deberás asignar el valor dentro de response.body.id por el ID de preferencia solicitado en el siguiente paso
        global.id = response.body.id;
        console.log(response.body);
        res.json({ id: global.id });
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (e) {
    res.status(400).send("Error: " + e)
  }
})

router.get("/pagos", async (req, res) => {
  const mp = new mercadopago(ACCES_TOKEN);
  console.log(mp)
  console.info("EN LA RUTA PAGOS", req)
  const external_reference = req.query.external_reference
  const payment_status= req.query.payment_status
  const merchant_order_id= req.query.merchant_order_id
  console.log("EXTERNAL REFERENCE", external_reference)

  
  res.json({ status: "approved" });
})

module.exports = router;
