const nextId = require('../utils/nextId');
const dishesData = require('../data/dishes-data');

function findDishById(id) {
  return dishesData.find(dish => dish.id === id);
}

function create(req, res, next) {
  const { data: { name, description, price, image_url } = {} } = req.body;

  if (!name || name === "") {
    return next({
      status: 400,
      message: 'Dish must include a name',
    });
  }

  if (!description || description === "") {
    return next({
      status: 400,
      message: 'Dish must include a description',
    });
  }

  if (!price || price <= 0 || !Number.isInteger(price)) {
    return next({
      status: 400,
      message: 'Dish must have a price that is an integer greater than 0',
    });
  }

  if (!image_url || image_url === "") {
    return next({
      status: 400,
      message: 'Dish must include an image_url',
    });
  }

  const newDish = {
    id: nextId(),
    name,
    description,
    price,
    image_url,
  };

  dishesData.push(newDish);
  res.status(201).json({ data: newDish });
}

function read(req, res, next) {
  const dishId = req.params.dishId;
  const dish = findDishById(dishId);

  if (dish) {
    res.json({ data: dish });
  } else {
    next({
      status: 404,
      message: `Dish not found with ID: ${dishId}`,
    });
  }
}

function update(req, res, next) {
  const { data: { id, name, description, price, image_url } = {} } = req.body;
  const dishId = req.params.dishId;
  const dish = findDishById(dishId);

  if (!dish) {
    return next({
      status: 404,
      message: `Dish not found with ID: ${dishId}`,
    });
  }

  if (id && id !== dishId) {
    return next({
      status: 400,
      message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
    });
  }

if (!name || name === "") {
  return next({
    status: 400,
    message: 'Invalid name provided for updating the dish',
  });
}

if (!description || description === "") {
  return next({
    status: 400,
    message: 'Invalid description provided for updating the dish',
  });
}

if (!price || isNaN(price) || price <= 0 || !Number.isInteger(price)) {
  return next({
    status: 400,
    message: 'Invalid price provided for updating the dish',
  });
}

if (!image_url || image_url === "") {
  return next({
    status: 400,
    message: 'Invalid image_url provided for updating the dish',
  });
}

  if (dish) {
    dish.name = name;
    dish.description = description;
    dish.price = price;
    dish.image_url = image_url;
  }

  res.json({ data: dish });
}

function list(req, res) {
  res.json({ data: dishesData });
}

module.exports = {
  create,
  read,
  update,
  list,
};
