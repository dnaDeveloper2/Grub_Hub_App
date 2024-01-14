const nextId = require('../utils/nextId');
const dishesData = require('../data/dishes-data');

function findDishById(id) {
  return dishesData.find(dish => dish.id === id);
}

function dishExists(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishesData.find(dish => dish.id === dishId);
  if (foundDish) {
    res.locals.dish = foundDish;
    return next();
  }
  next({
    status: 404,
    message: `Dish id not found: ${dishId}`,
  });
};

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
  const foundDish = res.locals.dish;
  

  if (foundDish) {
    res.json({ data: foundDish });
  } else {
    next({
      status: 404,
      message: `Dish not found with ID: ${dishId}`,
    });
  }
}

function update(req, res, next) {
  let foundDish = res.locals.dish;
  const dishId = req.params.dishId;
  const { data: { id, name, description, price, image_url } = {} } = req.body;
  

  if (!foundDish) {
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

  if (foundDish) {
    foundDish.name = name;
    foundDish.description = description;
    foundDish.price = price;
    foundDish.image_url = image_url;
  }

  res.json({ data: foundDish});
}

function list(req, res) {
  res.json({ data: dishesData });
}

module.exports = {
  create,
  read:[dishExists, read],
  update:[dishExists, update],
  list,
};

