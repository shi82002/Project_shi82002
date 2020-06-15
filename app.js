const express = require("express");

const bodyparser = require("body-parser");
let jwt = require('jsonwebtoken');
let config = require('./config');
let middleware = require('./middleware');

const orders = [];
//Middle ware

class HandlerGenerator {

  login (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    // For the given username fetch user from DB
    let mockedUsername = 'admin';
    let mockedPassword = 'password';

    if (username && password) {
      if (username === mockedUsername && password === mockedPassword) {
        let token = jwt.sign({username: username},
          config.secret,
          { expiresIn: '24h' // expires in 24 hours
          }
        );
        // return the JWT token for the future API calls
        res.json({
          success: true,
          message: 'Authentication successful!',
          token: token
        });
      } else {
        res.send(403).json({
          success: false,
          message: 'Incorrect username or password'
        });
      }
    } else {
      res.send(400).json({
        success: false,
        message: 'Authentication failed! Please check the request'
      });
    }
  }

  index (req, res) {
    res.json({
      success: true,
      message: 'Index page'
    });
  }

  newOrder (req, res) {
      const order = req.body;

      if (order.food_name || order.customer_name || order.food_qty) {
        orders.push({
          ...order,
          id: orders.length + 1,
          date: Date.now().toString()
        });
        console.log();
        res.status(200).json({
          message: "Order created successfully"
        });
      } else {
        res.status(401).json({
          message: "Invalid Order creation"
        });
      }
  }

  getOrders (req, res) {
    res.status(200).send(orders);
  }

  updateOrder (req, res) {
     const order_id = req.params.id;
      const order_update = req.body;
      for (let order of orders) {
        if (order.id == order_id) {
          if (order_update.food_name != null || undefined)
            order.food_name = order_update.food_name;
          if (order_update.food_qty != null || undefined)
            order.food_qty = order_update.food_qty;
          if (order_update.customer_name != null || undefined)
            order.customer_name = order_update.customer_name;

          return res
            .status(200)
            .json({ message: "Updated Succesfully", data: order });
        }
      }

      res.status(404).json({ message: "Invalid Order Id" });
  }

  deleteOrder (req, res) {
    const order_id = req.params.id;

    for (let order of orders) {
      if (order.id == order_id) {
        orders.splice(orders.indexOf(order), 1);

        return res.status(200).json({
          message: "Deleted Successfully"
        });
      }
    }

  }



}



// Starting point of the server
function main () {

  let app = express(); // Export app for other routes to use
  let port = process.env.PORT || 3200;
  app.use(bodyparser.json());
  app.use(bodyparser.urlencoded({ extended: false }));
  let handlers = new HandlerGenerator();

  // Routes & Handlers
  app.post('/login', handlers.login);

  app.get('/', middleware.checkToken, handlers.index);

  app.post("/new_order",middleware.checkToken, handlers.newOrder);

  app.get("/get_orders",middleware.checkToken, handlers.getOrders);

  app.patch("/order/:id",middleware.checkToken, handlers.updateOrder);

  app.delete("/order/:id",middleware.checkToken, handlers.deleteOrder);

  app.listen(port, () => console.log(`Server is listening on port: ${port}`));
    /**
     * creating a New order
     */

    /*app.post("/new_order", (req, res) => {
      const order = req.body;

      if (order.food_name || order.customer_name || order.food_qty) {
        orders.push({
          ...order,
          id: orders.length + 1,
          date: Date.now().toString()
        });
        console.log();
        res.status(200).json({
          message: "Order created successfully"
        });
      } else {
        res.status(401).json({
          message: "Invalid Order creation"
        });
      }
    });*/

    /**
     *  Getting All orders
     */



    /**
     * Update order
     */
/*    app.patch("/order/:id", (req, res) => {
      const order_id = req.params.id;
      const order_update = req.body;
      for (let order of orders) {
        if (order.id == order_id) {
          if (order_update.food_name != null || undefined)
            order.food_name = order_update.food_name;
          if (order_update.food_qty != null || undefined)
            order.food_qty = order_update.food_qty;
          if (order_update.customer_name != null || undefined)
            order.customer_name = order_update.customer_name;

          return res
            .status(200)
            .json({ message: "Updated Succesfully", data: order });
        }
      }

      res.status(404).json({ message: "Invalid Order Id" });
    });*/

    /**
     * Delete Order
     */
    /*app.delete("/order/:id", (req, res) => {
      const order_id = req.params.id;

      for (let order of orders) {
        if (order.id == order_id) {
          orders.splice(orders.indexOf(order), 1);

          return res.status(200).json({
            message: "Deleted Successfully"
          });
        }
      }

      res.status(404).json({ message: "Invalid Order Id" });
    });*/



}

main();
