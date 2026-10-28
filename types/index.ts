export type UserRole = "admin" | "user" | "staff";

export interface User {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  role: UserRole;
  profile_image_url: string;
  total_orders: number;
  total_spent: number;
  total_reviews: number;
}

export interface UserWithRelations extends User {
  cart: Cart | null;
  orders: Order[];
  reviews: Review[];
}

export interface UserFetchProps {
  page_size?: number;
  page?: number;
  name?: string;
  email?: string;
  role?: UserRole;
}

export interface Cart {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  items: CartItem[];
  user: User;
  total_products: number;
  total_price: number;
}

export interface CartItem {
  id: string;
  created_at: string;
  updated_at: string;
  cart_id: string;
  cart: Cart;
  product_id: string;
  product_variant_id?: string | null;
  product_sub_variant_id?: string | null;
  product: Product;
  quantity: number;
  total_price: number;
}

export type CartItemCreate = Omit<
  CartItem,
  | "id"
  | "created_at"
  | "updated_at"
  | "cart"
  | "cart_id"
  | "product"
  | "total_price"
>;

type CartItemEditableFields = Pick<CartItem, "quantity">;

export type CartItemUpdate = Partial<CartItemEditableFields> & {
  id: string;
};

export interface CartFetchProps {
  page_size?: number;
  page?: number;
}
export type OrderStatus =
  | "pending"
  | "processing"
  | "confirmed"
  | "cancelled"
  | "failed"
  | "refund_pending"
  | "refunded"
  | "completed";

export type PaymentStatus =
  | "initialized"
  | "pending"
  | "success"
  | "failed"
  | "abandoned"
  | "refund_pending"
  | "refunded";

export interface Order {
  id: string;
  public_id: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
  total_products: number;
  total_price: number;
  user_id: string;
  user: User;
  status: OrderStatus;
  confirmed_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  refunded_at: string | null;
}

export interface Payment {
  id: string;
  order_id: string;
  reference: string;
  amount_kobo: number;
  currency: string;
  status: PaymentStatus;
  authorization_url: string | null;
  paid_at: string | null;
}

export interface Checkout {
  order: Order;
  payment: Payment;
}

export type OrderCreate = Omit<
  Order,
  | "id"
  | "public_id"
  | "created_at"
  | "updated_at"
  | "order_items"
  | "total_products"
  | "total_price"
  | "user_id"
  | "user"
  | "status"
  | "confirmed_at"
  | "completed_at"
  | "cancelled_at"
  | "refunded_at"
>;

export interface OrderItem {
  id: string;
  created_at: string;
  updated_at: string;
  order_id: string;
  order: Order;
  product_id: string;
  product: Product;
  quantity: number;
  price_at_purchase: number;
}

export interface OrderFetchProps {
  page_size?: number;
  page?: number;
  status?: OrderStatus;
  name?: string;
}

export interface Review {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  user: User;
  product_id: string;
  product: Product;
  rating: number;
  comment: string;
}

export type ReviewCreate = Omit<
  Review,
  "id" | "created_at" | "updated_at" | "user_id" | "product" | "user"
>;

type ReviewEditableFields = Pick<Review, "rating" | "comment">;

export type ReviewUpdate = Partial<ReviewEditableFields> & {
  id: string;
};

export interface ReviewFetchProps {
  page_size?: number;
  page?: number;
  product_id?: string;
  user_id?: string;
}

export type ProductStatus = "draft" | "published" | "archived";

export interface ProductSubVariant {
  id: string;
  size: string;
  quantity: number;
}

export type ProductSubVariantInput = Pick<
  ProductSubVariant,
  "size" | "quantity"
>;

export interface ProductVariant {
  id: string;
  color: string;
  name: string;
  image_url: string;
  quantity: number;
  product_id: string;
  sub_variants?: ProductSubVariant[];
}

export type ProductVariantInput = Pick<
  ProductVariant,
  "name" | "image_url" | "color" | "quantity"
> & {
  sub_variants?: ProductSubVariantInput[];
};

export interface Product {
  id: string;
  slug: string;
  created_at: string;
  updated_at: string;
  name: string;
  image_url: string;
  price: number;
  category: string;
  description: string;
  variants?: ProductVariant[];
  reviews: Review[];
  total_reviews: number;
  average_rating: number;
  status: ProductStatus;
  quantity: number;
}

export type ProductCreate = Omit<
  Product,
  | "id"
  | "slug"
  | "created_at"
  | "updated_at"
  | "reviews"
  | "total_reviews"
  | "average_rating"
  | "variants"
> & {
  variants?: ProductVariantInput[];
};

type ProductEditableFields = Pick<
  Product,
  | "name"
  | "image_url"
  | "price"
  | "category"
  | "description"
  | "status"
  | "quantity"
  | "variants"
>;

export type ProductUpdate = Omit<Partial<ProductEditableFields>, "variants"> & {
  id: string;
  variants?: ProductVariantInput[];
};

export type ProductEditFormData = Partial<
  Pick<
    Product,
    | "name"
    | "image_url"
    | "price"
    | "category"
    | "description"
    | "status"
    | "quantity"
    | "variants"
  >
> & {
  id: string;
};

export interface ProductFetchProps {
  page_size?: number;
  page?: number;
  name?: string;
  category?: string;
  status?: ProductStatus;
}

export interface ProductCategoriesSummary {
  category: string;
  product_count: number;
}

export interface ProductCategoriesSummaryFetchProps {
  status?: ProductStatus;
}

export interface BundleItem {
  id: string;
  created_at: string;
  updated_at: string;
  bundle_id: string;
  bundle: Bundle;
  product_id: string;
  product_variant_id?: string | null;
  product_sub_variant_id?: string | null;
  product?: Product | null;
  product_variant?: ProductVariant | null;
  product_sub_variant?: ProductSubVariant | null;
  quantity: number;
}

export type BundleItemCreate = Omit<
  BundleItem,
  | "id"
  | "created_at"
  | "updated_at"
  | "bundle"
  | "bundle_id"
  | "product"
  | "product_variant"
  | "product_sub_variant"
>;

export interface Bundle {
  id: string;
  created_at: string;
  updated_at: string;
  status: ProductStatus;
  name: string;
  image_url: string;
  items: BundleItem[];
  order_items: OrderItem[];
  price: number;
  category: string;
  description: string;
}

export type BundleCreate = Omit<
  Bundle,
  "id" | "created_at" | "updated_at" | "order_items" | "items"
> & {
  items: BundleItemCreate[];
};

type BundleEditableFields = Pick<
  Bundle,
  "name" | "image_url" | "price" | "category" | "description" | "status"
> & {
  items?: BundleItemCreate[];
};

export type BundleUpdate = Partial<BundleEditableFields> & {
  id: string;
};

export type BundleEditFormData = Partial<
  Pick<
    Bundle,
    | "name"
    | "image_url"
    | "price"
    | "category"
    | "description"
    | "status"
    | "items"
  >
> & {
  id: string;
};

export interface BundleFetchProps {
  page_size?: number;
  page?: number;
  name?: string;
  category?: string;
  status_filter?: ProductStatus;
}

export interface Catalog {
  id: string;
  slug: string;
  name: string;
  image_url: string;
  price: number;
  category: string;
  description: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  status: ProductStatus;
  item_type: "product" | "bundle";
  variants?: ProductVariant[];
  items?: Bundle[];
}

export interface CatalogFetchProps {
  page_size?: number;
  page?: number;
  name?: string;
  category?: string;
  status_filter?: ProductStatus;
  item_type?: "product" | "bundle";
}

export interface DashboardSummary {
  total_revenue: number;
  revenue_change_percent: number;
  total_orders: number;
  orders_change_percent: number;
  total_customers: number;
  customers_change_percent: number;
  total_products: number;
}

export interface TopProducts {
  product: Product;
  quantity_sold: number;
  revenue: number;
}

export interface TopProductsFetchProps {
  limit?: number;
}

export interface DateRange {
  start_date?: string;
  end_date?: string;
}

export interface Pagination {
  pageIndex: number;
  pageSize: number;
}
