interface User {
  id: string;
  name: string;
  email: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface Order {
  id: string;
  user: User;
  products: Product[];
  status: string;
  totalPrice: number;
  createdAt: string;
}

interface Query {
  products: Product[];
  orders: Order[];
  order: Order | undefined;
  userOrders: Order[];
}

interface ProductInput {
  name: string;
  description: string;
  price: number;
  image: string;
}

interface UpdateProductInput {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  image?: string;
}

interface CreateOrderInput {
  userId: string;
  productIds: string[];
  status: string;
}

interface UpdateOrderStatusInput {
  id: string;
  status: string;
}

interface Mutation {
  createProduct: (input: ProductInput) => Product;
  updateProduct: (input: UpdateProductInput) => Product;
  deleteProduct: (id: string) => boolean;
  createOrder: (input: CreateOrderInput) => Order;
  updateOrderStatus: (input: UpdateOrderStatusInput) => Order;
  signUp: (name: string, email: string, password: string) => string;
  signIn: (email: string, password: string) => string;
  signOut: () => boolean;
}

const typeDefs = `
    type User {
      id: ID!
      name: String!
      email: String!
      password: String!
      isAdmin: Boolean!
    }
    
    type Product {
      id: ID!
      name: String!
      description: String!
      price: Float!
      image: String!
    }
    
    type Order {
      id: ID!
      user: User
      products: [Product]
      status: String
      totalPrice: Float
      createdAt: String
    }
    
    type Query {
      products: [Product!]!
      getProduct(id: ID!): Product
      orders: [Order!]!
      order(id: ID!): Order
      userOrders(userId: ID!): [Order!]!
    }
    
    type Status {
      id: String
      message: String
      token: String
    }
  
    input ProductInput {
      name: String!
      description: String!
      price: Float!
      image: String!
    }
    
    input UpdateProductInput {
      id: ID!
      name: String
      description: String
      price: Float
      image: String
    }
    
    input CreateOrderInput {
      userId: ID!
      productIds: [ID!]!
      status: String!
    }
    
    input UpdateOrderStatusInput {
      id: ID!
      status: String!
    }
  
    type Mutation {
      createProduct(input: ProductInput!): Product!
      updateProduct(input: UpdateProductInput!): Product!
      deleteProduct(id: ID!): Status
      createOrder(input: CreateOrderInput!): Order
      updateOrderStatus(input: UpdateOrderStatusInput!): Order
      deleteOrder(id: ID!): Status
      signUp( name:String!, email: String!, password: String!): Status
      signIn(email: String!, password: String!): Status
      signOut: Boolean!
    }`;
export { typeDefs };
export {
  CreateOrderInput,
  ProductInput,
  UpdateProductInput,
  UpdateOrderStatusInput,
};
