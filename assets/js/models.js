export class Product {
  constructor(data = {}) {
    Object.assign(this, data);
    this.id = data.id ?? data.productId;
    this.name = data.name ?? data.productName ?? "Sản phẩm";
    this.price = Number(data.price ?? 0);
    this.image = data.image ?? data.img ?? data.imageUrl ?? "";
    this.description = data.description ?? data.desc ?? "";
    this.categoryId = data.categoryId ?? data.categoryID;
    this.quantity = Number(data.quantity ?? data.stock ?? 0);
  }
}

export class Store {
  constructor(data = {}) {
    Object.assign(this, data);
    this.id = data.id ?? data.storeId;
    this.name = data.name ?? data.storeName ?? "Cửa hàng";
    this.address = data.address ?? data.location ?? "";
    this.phone = data.phone ?? data.phoneNumber ?? "";
    this.email = data.email ?? "";
  }
}

export class Cart {
  constructor(key = "trung_store_cart") {
    this.key = key;
    this.items = JSON.parse(localStorage.getItem(this.key) || "[]");
  }
  save() { localStorage.setItem(this.key, JSON.stringify(this.items)); }
  add(product) {
    const found = this.items.find(x => String(x.id) === String(product.id));
    if (found) found.qty += 1;
    else this.items.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty: 1 });
    this.save();
  }
  remove(id) { this.items = this.items.filter(x => String(x.id) !== String(id)); this.save(); }
  changeQty(id, delta) {
    const item = this.items.find(x => String(x.id) === String(id));
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) this.remove(id); else this.save();
  }
  total() { return this.items.reduce((s, x) => s + x.price * x.qty, 0); }
  count() { return this.items.reduce((s, x) => s + x.qty, 0); }
}
