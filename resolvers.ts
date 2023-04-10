import { User, Product, Order } from "./models";
import JWT from "jsonwebtoken";
import {
  CreateOrderInput,
  ProductInput,
  UpdateProductInput,
  UpdateOrderStatusInput,
} from "./schema";
const JWT_SECRET = "secret";

const resolvers = {
  Query: {
    products: async () => {
      const products = await Product.find();
      return products;
    },
    getProduct: async (_: unknown, { id }: { id: string }) => {
      console.log(id);
      const getProduct = await Product.findById(id);
      return getProduct;
    },
    orders: async () => {
      const orders = await Order.find().populate("user products");
      return orders;
    },
    order: async (_: unknown, { id }: { id: string }) => {
      const order = await Order.findById(id).populate("user products");
      return order;
    },
    userOrders: async (_: unknown, { userId }: { userId: string }) => {
      const orders = await Order.find({ user: userId }).populate(
        "user products"
      );
      return orders;
    },
  },
  Mutation: {
    createProduct: async (_: unknown, { input }: { input: ProductInput }) => {
      const { name, description, price, image } = input;
      const product = new Product({ name, description, price, image });
      await product.save();
      return product;
    },
    updateProduct: async (
      _: unknown,
      { input }: { input: UpdateProductInput }
    ) => {
      const { id, name, description, price, image } = input;
      const product = await Product.findByIdAndUpdate(
        id,
        { name, description, price, image },
        { new: true }
      );
      return product;
    },
    deleteProduct: async (_: unknown, { id }: { id: string }) => {
      const deleteProduct = await Product.findByIdAndDelete(id);
      if (!deleteProduct) {
        return {
          message: "Product already deleted",
        };
      }
      return {
        message: "Product deleted",
      };
    },

    createOrder: async (_: unknown, { input }: { input: CreateOrderInput }) => {
      const { userId, productIds, status } = input;
      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");

      const products = await Product.find({ _id: { $in: productIds } });
      if (products.length !== productIds.length) {
        throw new Error(`One or more products not found`);
      }

      const totalPrice = products.reduce((acc, product) => {
        if (!product.price) {
          throw new Error(`Product price is undefined or null`);
        }
        console.log(acc + product.price);
        return acc + product.price;
      }, 0);
      // create the new order
      const order = new Order({
        user: userId,
        products: productIds,
        status,
        totalPrice,
        createdAt: new Date().toISOString(),
      });
      console.log(order);
      // save the order in the database
      await order.save();
      return order.populate("user products");
    },
    updateOrderStatus: async (
      _: unknown,
      { input }: { input: UpdateOrderStatusInput }
    ) => {
      const { id, status } = input;
      const order = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      ).populate("user products");
      if (!order) {
        throw new Error(`Order with id ${id} not found`);
      }
      return {
        order,
        message: "updated sucessfully",
      };
    },
    deleteOrder: async (_: unknown, { id }: { id: string }) => {
      const deleteOrder = await Order.findByIdAndDelete(id);
      if (!deleteOrder) {
        return {
          message: "Order already deleted",
        };
      }
      return {
        message: "Order Deleted",
      };
    },
    signUp: async (
      _: unknown,
      {
        name,
        email,
        password,
      }: { name: string; email: string; password: string }
    ) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("User already exists");
      }
      const user = new User({ name, email, password });
      await user.save();
      const token = JWT.sign({ userId: user.id }, JWT_SECRET);
      return {
        token,
        id: user.id,
        message: "User Created",
      };
    },
    signIn: async (
      _: unknown,
      { email, password }: { email: string; password: string }
    ) => {
      const user = await User.findOne({ email });
      if (!user || user.password !== password) {
        throw new Error("Invalid email or password");
      }
      // Generate and return a JWT token here
      const token = JWT.sign({ userId: user.id }, JWT_SECRET);
      console.log(token);
      return {
        token,
        id: user.id,
        message: "User Created",
      };
    },
    signOut: async () => {
      // Destroy JWT token here
      return true;
    },
  },
};

export { resolvers };
