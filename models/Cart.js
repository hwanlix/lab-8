const { getDatabase } = require("../database");

const COLLECTION_NAME = "carts";

class Cart {
  constructor() {}

  static async getCart() {
    const db = getDatabase();

    try {
      const cart = await db.collection(COLLECTION_NAME).findOne({});

      if (!cart) {
        await db.collection(COLLECTION_NAME).insertOne({ items: [] });
        return { items: [] };
      }

      return cart;
    } catch (error) {
      return { items: [] };
    }
  }

  static async add(product) {
    const db = getDatabase();

    try {
      const cart = await this.getCart();
      const existingItem = cart.items.find(
        (item) => item.product.name === product.name
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push({ product, quantity: 1 });
      }

      await db
        .collection(COLLECTION_NAME)
        .updateOne({}, { $set: { items: cart.items } });
    } catch (error) {}
  }

  static async deleteProductByName(name) {
    const db = getDatabase();

    try {
      const cart = await this.getCart();
      const updatedItems = cart.items.filter(
        (item) => item.product.name !== name
      );

      await db
        .collection(COLLECTION_NAME)
        .updateOne({}, { $set: { items: updatedItems } });
    } catch (error) {}
  }

  static async getItems() {
    try {
      const cart = await this.getCart();
      return cart.items;
    } catch (error) {
      return [];
    }
  }

  static async getProductsQuantity() {
    try {
      const cart = await this.getCart();
      const productsQuantity = cart.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      return productsQuantity;
    } catch (error) {
      return 0;
    }
  }

  static async getTotalPrice() {
    try {
      const cart = await this.getCart();
      const totalPrice = cart.items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );
      return totalPrice;
    } catch (error) {
      return 0;
    }
  }

  static async clearCart() {
    const db = getDatabase();

    try {
      await db
        .collection(COLLECTION_NAME)
        .updateOne({}, { $set: { items: [] } });
    } catch (error) {}
  }
}

module.exports = Cart;
