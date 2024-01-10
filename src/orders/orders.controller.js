const nextId = require('../utils/nextId');
const ordersData = require('../data/orders-data');

function findOrderById(id) {
  return ordersData.find(order => order.id === id);
}

function create(req, res, next) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;

  if (!deliverTo || deliverTo === "") {
    return next({
      status: 400,
      message: 'Order must include a deliverTo',
    });
  }

  if (!mobileNumber || mobileNumber === "") {
    return next({
      status: 400,
      message: 'Order must include a mobileNumber',
    });
  }

  if (!dishes || !Array.isArray(dishes) || dishes.length === 0) {
    return next({
      status: 400,
      message: 'Order must include at least one dish',
    });
  }

  for (let index = 0; index < dishes.length; index++) {
    const dish = dishes[index];
    if (!dish.quantity || dish.quantity <= 0 || !Number.isInteger(dish.quantity)) {
      return next({
        status: 400,
        message: `Dish ${index} must have a quantity that is an integer greater than 0`,
      });
    }
  }

  const newOrder = {
    id: nextId(),
    deliverTo,
    mobileNumber,
    status,
    dishes,
  };

  ordersData.push(newOrder);
  res.status(201).json({ data: newOrder });
}

function read(req, res, next) {
  const orderId = req.params.orderId;
  const order = findOrderById(orderId);

  if (order) {
    res.json({ data: order });
  } else {
    next({
      status: 404,
      message: `Order not found with ID: ${orderId}`,
    });
  }
}


function update(req, res, next) {
  const { data: { id, deliverTo, mobileNumber, dishes, status } = {} } = req.body;
  const orderId = req.params.orderId;
  const order = findOrderById(orderId);

  if (!order) {
    return next({
      status: 404,
      message: `Order not found with ID: ${orderId}`,
    });
  }

  if (id && id !== orderId) {
    return next({
      status: 400,
      message: `Order id does not match route id. Order: ${id}, Route: ${orderId}`,
    });
  }

  if (!deliverTo || deliverTo === "") {
    return next({
      status: 400,
      message: 'Invalid deliverTo provided for updating the order',
    });
  }

  if (!mobileNumber || mobileNumber === "") {
    return next({
      status: 400,
      message: 'Invalid mobileNumber provided for updating the order',
    });
  }

  if (!dishes || !Array.isArray(dishes) || dishes.length === 0) {
    return next({
      status: 400,
      message: 'Invalid dishes provided for updating the order',
    });
  }

  for (const [index, dish] of dishes.entries()) {
    if (!dish || !dish.quantity || dish.quantity <= 0 || !Number.isInteger(dish.quantity)) {
      return next({
        status: 400,
        message: `Invalid dish quantity for dish at index ${index} provided for updating the order`,
      });
    }
  }

  if (order.status === "delivered") {
    return next({
      status: 400,
      message: 'A delivered order cannot be changed',
    });
  }

  if (!status || status === "" || !["pending", "preparing", "out-for-delivery", "delivered"].includes(status)) {
    return next({
      status: 400,
      message: 'Order must have a status of pending, preparing, out-for-delivery, delivered',
    });
  }

  order.deliverTo = deliverTo;
  order.mobileNumber = mobileNumber;
  order.dishes = dishes;
  order.status = status;

  res.json({ data: order });
}


function remove(req, res, next) {
  const orderId = req.params.orderId;
  const orderIndex = ordersData.findIndex((order) => order.id === orderId);

  if (orderIndex === -1) {
    return next({
      status: 404,
      message: `Order not found with ID: ${orderId}`,
    });
  }

  const order = ordersData[orderIndex];

  if (order.status !== 'pending') {
    return next({
      status: 400,
      message: `An order cannot be deleted unless it is pending`,
    });
  }

  ordersData.splice(orderIndex, 1);
  res.sendStatus(204);
}

function list(req, res) {
  res.json({ data: ordersData });
}

module.exports = {
  create,
  read,
  update,
  delete: remove,
  list,
};
