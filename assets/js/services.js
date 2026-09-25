import { api, unwrap } from "./api.js";
import { ENDPOINTS } from "./config.js";
import { Product, Store } from "./models.js";

export class ProductService {
  async getAll() {
    const result = unwrap(await api.get(ENDPOINTS.products));
    return (Array.isArray(result) ? result : []).map(x => new Product(x));
  }
  async getCategories() {
    const result = unwrap(await api.get(ENDPOINTS.categories));
    return Array.isArray(result) ? result : [];
  }
  async create(body) { return api.post(ENDPOINTS.products, body); }
  async update(body) { return api.put(ENDPOINTS.products, body); }
  async remove(id) { return api.delete(`${ENDPOINTS.products}/${id}`); }
}

export class StoreService {
  async getAll() {
    const result = unwrap(await api.get(ENDPOINTS.stores));
    return (Array.isArray(result) ? result : []).map(x => new Store(x));
  }
  async getById(id) {
    return new Store(unwrap(await api.get(`${ENDPOINTS.storeById}?id=${encodeURIComponent(id)}`)));
  }
  async create(body) { return api.post(ENDPOINTS.store, body); }
  async update(body) { return api.put(ENDPOINTS.store, body); }
  async remove(id) { return api.delete(`${ENDPOINTS.store}/${id}`); }
}

export const productService = new ProductService();
export const storeService = new StoreService();
