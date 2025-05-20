const Product = require("../models/Product");
const cartController = require("./cartController");

const { MENU_LINKS } = require("../constants/navigation");
const { STATUS_CODE } = require("../constants/statusCode");

exports.getProductsView = async (request, response) => {
  const cartCount = cartController.getProductsCount();
  const products = await Product.getAll();

  response.render("products.ejs", {
    headTitle: "Shop - Products",
    path: "/",
    menuLinks: MENU_LINKS,
    activeLinkPath: "/products",
    products,
    cartCount,
  });
};

exports.getAddProductView = async (request, response) => {
  const cartCount = cartController.getProductsCount();

  response.render("add-product.ejs", {
    headTitle: "Shop - Add product",
    path: "/add",
    menuLinks: MENU_LINKS,
    activeLinkPath: "/products/add",
    cartCount,
  });
};

exports.getNewProductView = async (request, response) => {
  const cartCount = cartController.getProductsCount();
  const newestProduct = await Product.getLast();

  response.render("new-product.ejs", {
    headTitle: "Shop - New product",
    path: "/new",
    activeLinkPath: "/products/new",
    menuLinks: MENU_LINKS,
    newestProduct,
    cartCount,
  });
};

exports.getProductView = async (request, response) => {
  const cartCount = cartController.getProductsCount();
  const name = request.params.name;

  const product = await Product.findByName(name);

  response.render("product.ejs", {
    headTitle: "Shop - Product",
    path: `/products/${name}`,
    activeLinkPath: `/products/${name}`,
    menuLinks: MENU_LINKS,
    product,
    cartCount,
  });
};

exports.deleteProduct = async (request, response) => {
  const name = request.params.name;
  await Product.deleteByName(name);

  response.status(STATUS_CODE.OK).json({ success: true });
};

// ✅ Новый метод
exports.addProduct = async (request, response) => {
  const { name, description, price } = request.body;

  if (!name || !description || !price) {
    return response.status(400).json({ success: false, message: "Missing data" });
  }

  await Product.add({ name, description, price: parseFloat(price) });

  response.redirect(302, "/products/new");
};
