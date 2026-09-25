import { productService, storeService } from "./services.js";
import { Cart } from "./models.js";
import { PLACEHOLDER_IMAGE } from "./config.js";

const $ = s => document.querySelector(s);
const money = n => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n || 0);

let products = [];
let categories = [];
const cart = new Cart();

function categoryIdOf(p) { return p.categoryId == null ? "" : String(p.categoryId); }

function renderProducts() {
  const keyword = $("#searchInput").value.trim().toLowerCase();
  const cat = $("#categorySelect").value;
  const list = products.filter(p =>
    (!keyword || p.name.toLowerCase().includes(keyword)) &&
    (!cat || categoryIdOf(p) === cat)
  );
  $("#productGrid").innerHTML = list.map(p => `
    <article class="product-card">
      <div class="product-image"><img src="${p.image || PLACEHOLDER_IMAGE}" alt="${p.name}" onerror="this.src='${PLACEHOLDER_IMAGE}'"></div>
      <div class="product-info">
        <h3>${escapeHtml(p.name)}</h3>
        <p class="price">${money(p.price)}</p>
        <div class="product-actions">
          <button class="btn btn-outline" data-detail="${p.id}">Chi tiết</button>
          <button class="btn btn-primary" data-add="${p.id}">Thêm giỏ</button>
        </div>
      </div>
    </article>`).join("");
  $("#emptyState").classList.toggle("hidden", list.length !== 0);
}

function renderStores(stores) {
  $("#storeGrid").innerHTML = stores.map(s => `
    <article class="store-card">
      <div class="store-pin">⌖</div>
      <div><h3>${escapeHtml(s.name)}</h3><p>${escapeHtml(s.address || "Chưa cập nhật địa chỉ")}</p>
      <small>${escapeHtml(s.phone || "Chưa cập nhật SĐT")}${s.email ? " · " + escapeHtml(s.email) : ""}</small></div>
    </article>`).join("");
}

function renderCart() {
  $("#cartCount").textContent = cart.count();
  $("#cartTotal").textContent = money(cart.total());
  $("#cartItems").innerHTML = cart.items.length ? cart.items.map(x => `
    <div class="cart-item">
      <img src="${x.image || PLACEHOLDER_IMAGE}" alt="">
      <div class="cart-item-info"><strong>${escapeHtml(x.name)}</strong><span>${money(x.price)}</span>
        <div class="qty"><button data-dec="${x.id}">−</button><b>${x.qty}</b><button data-inc="${x.id}">+</button>
        <button class="remove" data-remove="${x.id}">Xóa</button></div>
      </div>
    </div>`).join("") : '<p class="empty">Giỏ hàng đang trống.</p>';
}

function showDetail(p) {
  $("#productDetail").innerHTML = `
    <div class="detail-grid">
      <img src="${p.image || PLACEHOLDER_IMAGE}" alt="${p.name}" onerror="this.src='${PLACEHOLDER_IMAGE}'">
      <div><p class="eyebrow">PRODUCT DETAIL</p><h2>${escapeHtml(p.name)}</h2>
      <p class="detail-price">${money(p.price)}</p><p>${escapeHtml(p.description || "Sản phẩm chất lượng cao.")}</p>
      <p class="stock">Kho: ${p.quantity}</p><button class="btn btn-primary" data-modal-add="${p.id}">Thêm vào giỏ</button></div>
    </div>`;
  $("#productModal").classList.remove("hidden");
}

function escapeHtml(v) {
  return String(v ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[c]));
}

async function init() {
  try {
    const [ps, cs, ss] = await Promise.all([
      productService.getAll(), productService.getCategories(), storeService.getAll()
    ]);
    products = ps; categories = cs;
    $("#categorySelect").innerHTML += categories.map(c => {
      const id = c.id ?? c.categoryId;
      const name = c.name ?? c.categoryName ?? `Danh mục ${id}`;
      return `<option value="${id}">${escapeHtml(name)}</option>`;
    }).join("");
    renderProducts(); renderStores(ss); renderCart();
  } catch (e) {
    $("#loading").textContent = `Không thể tải dữ liệu API: ${e.message}`;
  } finally { $("#loading").classList.add("hidden"); }
}

$("#searchInput").addEventListener("input", renderProducts);
$("#categorySelect").addEventListener("change", renderProducts);
$("#productGrid").addEventListener("click", e => {
  const add = e.target.closest("[data-add]");
  const detail = e.target.closest("[data-detail]");
  if (add) { const p = products.find(x => String(x.id) === String(add.dataset.add)); if (p) { cart.add(p); renderCart(); } }
  if (detail) { const p = products.find(x => String(x.id) === String(detail.dataset.detail)); if (p) showDetail(p); }
});
$("#cartItems").addEventListener("click", e => {
  if (e.target.dataset.inc) cart.changeQty(e.target.dataset.inc, 1);
  if (e.target.dataset.dec) cart.changeQty(e.target.dataset.dec, -1);
  if (e.target.dataset.remove) cart.remove(e.target.dataset.remove);
  renderCart();
});
$("#cartBtn").onclick = () => { $("#cartDrawer").classList.add("open"); $("#drawerBackdrop").classList.remove("hidden"); };
$("#closeCart").onclick = $("#drawerBackdrop").onclick = () => { $("#cartDrawer").classList.remove("open"); $("#drawerBackdrop").classList.add("hidden"); };
$("#checkoutBtn").onclick = () => alert(cart.items.length ? "Demo: chức năng đặt hàng có thể nối thêm API Order." : "Giỏ hàng đang trống.");
document.addEventListener("click", e => {
  if (e.target.matches("[data-close-modal]") || e.target.id === "productModal") $("#productModal").classList.add("hidden");
  const b = e.target.closest("[data-modal-add]");
  if (b) { const p = products.find(x => String(x.id) === String(b.dataset.modalAdd)); if (p) cart.add(p); renderCart(); }
});
init();
