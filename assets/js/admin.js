import { productService, storeService } from "./services.js";

const $ = s => document.querySelector(s);
const money = n => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(n) || 0);
let products = [], stores = [], categories = [];
let editing = { entity: null, id: null };

const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[c]));

async function load() {
  try {
    [products, stores, categories] = await Promise.all([
      productService.getAll(), storeService.getAll(), productService.getCategories()
    ]);
    renderProducts(); renderStores(); fillCategories();
  } catch (e) { toast("Lỗi tải API: " + e.message, true); }
}

function renderProducts() {
  $("#productTable").innerHTML = products.map(p => `
    <tr><td>${esc(p.id)}</td><td><div class="table-product"><img src="${esc(p.image)}" onerror="this.style.display='none'"><span>${esc(p.name)}</span></div></td>
    <td>${money(p.price)}</td><td>${esc(p.categoryId ?? "-")}</td>
    <td><button class="action edit" data-edit-product="${p.id}">Sửa</button><button class="action delete" data-delete-product="${p.id}">Xóa</button></td></tr>`).join("");
}

function renderStores() {
  $("#storeTable").innerHTML = stores.map(s => `
    <tr><td>${esc(s.id)}</td><td>${esc(s.name)}</td><td>${esc(s.address)}</td><td>${esc(s.phone)}</td>
    <td><button class="action edit" data-edit-store="${s.id}">Sửa</button><button class="action delete" data-delete-store="${s.id}">Xóa</button></td></tr>`).join("");
}

function fillCategories() {
  $("#formCategory").innerHTML = categories.map(c => `<option value="${c.id ?? c.categoryId}">${esc(c.name ?? c.categoryName)}</option>`).join("");
}

function openForm(entity, item = null) {
  editing = { entity, id: item?.id ?? null };
  $("#adminModal").classList.remove("hidden");
  $("#formTitle").textContent = `${item ? "Sửa" : "Thêm"} ${entity === "product" ? "sản phẩm" : "cửa hàng"}`;
  $("#productFields").classList.toggle("hidden", entity !== "product");
  $("#storeFields").classList.toggle("hidden", entity !== "store");
  const f = $("#adminForm"); f.reset();
  f.entity.value = entity; f.id.value = item?.id ?? "";
  if (entity === "product" && item) {
    f.name.value = item.name; f.price.value = item.price; f.quantity.value = item.quantity;
    f.image.value = item.image; f.description.value = item.description; f.categoryId.value = item.categoryId ?? "";
  }
  if (entity === "store" && item) {
    f.storeName.value = item.name; f.address.value = item.address; f.phone.value = item.phone; f.email.value = item.email;
  }
}

$("#adminForm").addEventListener("submit", async e => {
  e.preventDefault();
  const f = new FormData(e.currentTarget);
  const entity = f.get("entity"), id = f.get("id");
  try {
    if (entity === "product") {
      const body = {
        id: id ? Number(id) : 0,
        name: f.get("name"), price: Number(f.get("price")),
        quantity: Number(f.get("quantity") || 0), image: f.get("image"),
        categoryId: Number(f.get("categoryId")), description: f.get("description")
      };
      if (id) await productService.update(body); else await productService.create(body);
    } else {
      const body = { id: id ? Number(id) : 0, name: f.get("storeName"), address: f.get("address"), phone: f.get("phone"), email: f.get("email") };
      if (id) await storeService.update(body); else await storeService.create(body);
    }
    closeModal(); toast("Lưu dữ liệu thành công."); await load();
  } catch (err) { $("#formMessage").textContent = "API báo lỗi: " + err.message; }
});

$("#productTable").addEventListener("click", async e => {
  const edit = e.target.closest("[data-edit-product]"), del = e.target.closest("[data-delete-product]");
  if (edit) openForm("product", products.find(p => String(p.id) === edit.dataset.editProduct));
  if (del && confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
    try { await productService.remove(del.dataset.deleteProduct); toast("Đã xóa sản phẩm."); await load(); }
    catch (err) { toast("Xóa thất bại: " + err.message, true); }
  }
});

$("#storeTable").addEventListener("click", async e => {
  const edit = e.target.closest("[data-edit-store]"), del = e.target.closest("[data-delete-store]");
  if (edit) openForm("store", stores.find(s => String(s.id) === edit.dataset.editStore));
  if (del && confirm("Bạn có chắc muốn xóa cửa hàng này?")) {
    try { await storeService.remove(del.dataset.deleteStore); toast("Đã xóa cửa hàng."); await load(); }
    catch (err) { toast("Xóa thất bại: " + err.message, true); }
  }
});

$("#addProductBtn").onclick = () => openForm("product");
$("#addStoreBtn").onclick = () => openForm("store");
$("#closeAdminModal").onclick = closeModal;
$("#adminModal").addEventListener("click", e => { if (e.target.id === "adminModal") closeModal(); });
$("#reloadAll").onclick = load;
document.querySelectorAll(".tab").forEach(t => t.onclick = () => {
  document.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach(x => x.classList.remove("active"));
  t.classList.add("active"); $("#" + t.dataset.tab).classList.add("active");
});

function closeModal() { $("#adminModal").classList.add("hidden"); $("#formMessage").textContent = ""; }
function toast(msg, error = false) {
  const el = $("#toast"); el.textContent = msg; el.className = "toast show" + (error ? " error" : "");
  setTimeout(() => el.className = "toast", 2500);
}
load();
