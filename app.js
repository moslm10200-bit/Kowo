(function () {
  "use strict";

  const whatsappNumber = "963992147669";
  const state = {
    products: [],
    cart: [],
    activeProduct: null,
    toastTimer: null
  };

  const $ = (selector) => document.querySelector(selector);
  const track = $("#productsTrack");
  const cartDrawer = $("#cartDrawer");
  const modal = $("#productModal");
  const backdrop = $("#modalBackdrop");

  function formatPrice(value, currency) {
    return new Intl.NumberFormat("ar-SY").format(Number(value) || 0) + " " + (currency || "ل.س");
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[char]));
  }

  function imageFallback(event) {
    event.currentTarget.src = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
      "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 700 700'><rect width='700' height='700' fill='#dcece2'/><circle cx='350' cy='330' r='150' fill='#0b5c4a' opacity='.12'/><text x='350' y='365' text-anchor='middle' font-family='Arial' font-size='42' fill='#0b5c4a'>السكب</text></svg>"
    );
  }
  window.imageFallback = imageFallback;

  function renderProducts() {
    if (!state.products.length) {
      track.innerHTML = "<p class='empty-cart'>لا توجد منتجات متاحة حاليًا.</p>";
      return;
    }
    track.innerHTML = state.products.map((product) => `
      <article class="product-card" data-product-id="${escapeHtml(product.id)}">
        <div class="product-visual" role="button" tabindex="0" data-open-product="${escapeHtml(product.id)}" aria-label="عرض تفاصيل ${escapeHtml(product.name)}">
          <span class="product-badge">${escapeHtml(product.tag)}</span>
          <img src="${escapeHtml(product.imageUrl)}" alt="${escapeHtml(product.name)}" loading="lazy" onerror="imageFallback(event)" />
        </div>
        <div class="product-info">
          <span class="product-category">${escapeHtml(product.category)}</span>
          <h3 class="product-name">${escapeHtml(product.name)}</h3>
          <p class="product-description">${escapeHtml(product.description)}</p>
          <div class="product-bottom">
            <strong class="product-price">${formatPrice(product.price, product.currency)}</strong>
            <button class="add-button" type="button" data-add-product="${escapeHtml(product.id)}">أضف إلى السلة <span>+</span></button>
          </div>
        </div>
      </article>
    `).join("");
    updateCarousel();
  }

  function getProduct(id) {
    return state.products.find((product) => String(product.id) === String(id));
  }

  function addToCart(id, sourceButton) {
    const product = getProduct(id);
    if (!product) return;
    if (!state.cart.some((item) => String(item.id) === String(id))) state.cart.push(product);
    updateCart();
    showToast("تمت إضافة " + product.name + " إلى السلة");
    if (sourceButton) {
      sourceButton.classList.add("is-added");
      sourceButton.innerHTML = "تمت الإضافة <span>✓</span>";
      window.setTimeout(() => {
        sourceButton.classList.remove("is-added");
        sourceButton.innerHTML = "أضف إلى السلة <span>+</span>";
      }, 1800);
    }
  }

  function updateCart() {
    $("#cartCount").textContent = state.cart.length;
    const total = state.cart.reduce((sum, item) => sum + Number(item.price || 0), 0);
    $("#cartTotal").textContent = formatPrice(total, state.cart[0]?.currency || "ل.س");
    if (!state.cart.length) {
      $("#cartItems").innerHTML = "<div class='empty-cart'><span class='empty-cart-icon'>✦</span><h3>السلة فارغة</h3><p>أضف منتجًا يعجبك ليظهر هنا.</p></div>";
      return;
    }
    $("#cartItems").innerHTML = state.cart.map((product) => `
      <div class="cart-row">
        <img src="${escapeHtml(product.imageUrl)}" alt="${escapeHtml(product.name)}" onerror="imageFallback(event)" />
        <div class="cart-row-main"><strong>${escapeHtml(product.name)}</strong><span>${formatPrice(product.price, product.currency)}</span></div>
        <button class="remove-item" type="button" data-remove-product="${escapeHtml(product.id)}" aria-label="حذف ${escapeHtml(product.name)}">×</button>
      </div>
    `).join("");
  }

  function openCart() {
    cartDrawer.classList.add("is-open");
    cartDrawer.setAttribute("aria-hidden", "false");
  }

  function closeCart() {
    cartDrawer.classList.remove("is-open");
    cartDrawer.setAttribute("aria-hidden", "true");
  }

  function openProduct(id) {
    const product = getProduct(id);
    if (!product) return;
    state.activeProduct = product;
    $("#modalProductImage").src = product.imageUrl;
    $("#modalProductImage").alt = product.name;
    $("#modalProductImage").onerror = imageFallback;
    $("#modalProductCategory").textContent = product.category;
    $("#modalProductName").textContent = product.name;
    $("#modalProductDescription").textContent = product.description;
    $("#modalProductPrice").textContent = formatPrice(product.price, product.currency);
    $("#modalProductTag").textContent = product.tag;
    modal.hidden = false;
    backdrop.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeProduct() {
    modal.hidden = true;
    backdrop.hidden = true;
    document.body.style.overflow = "";
    state.activeProduct = null;
  }

  function showToast(message) {
    $("#toastMessage").textContent = message;
    const toast = $("#toast");
    toast.classList.add("is-visible");
    window.clearTimeout(state.toastTimer);
    state.toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }

  function buildWhatsAppMessage() {
    const lines = ["مرحبًا، أريد طلب المنتجات التالية من متجر السكب:", ""];
    state.cart.forEach((product, index) => {
      lines.push(`${index + 1}. ${product.name}`);
      lines.push(`السعر: ${formatPrice(product.price, product.currency)}`);
      lines.push(`رابط الصورة: ${product.imageUrl}`);
      lines.push("");
    });
    const total = state.cart.reduce((sum, item) => sum + Number(item.price || 0), 0);
    lines.push(`الإجمالي: ${formatPrice(total, state.cart[0]?.currency || "ل.س")}`);
    lines.push("");
    lines.push("أرجو تزويدي بتفاصيل التوصيل. شكرًا.");
    return lines.join("\n");
  }

  function buyOnWhatsApp() {
    if (!state.cart.length) {
      showToast("أضف منتجًا إلى السلة أولًا");
      return;
    }
    const url = "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(buildWhatsAppMessage());
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function updateCarousel() {
    const maxScroll = track.scrollWidth - track.clientWidth;
    const ratio = maxScroll <= 0 ? 1 : Math.min(1, track.scrollLeft / maxScroll);
    const visibleIndex = Math.min(state.products.length, Math.max(1, Math.round(ratio * (state.products.length - 2)) + 1));
    $("#progressBar").style.width = Math.max(16.6, (visibleIndex / Math.max(1, state.products.length - 2)) * 100) + "%";
    $("#carouselStatus").textContent = String(visibleIndex).padStart(2, "0") + " / " + String(state.products.length).padStart(2, "0");
  }

  async function loadProducts() {
    try {
      const firebaseProducts = await window.loadProductsFromFirebase?.();
      state.products = Array.isArray(firebaseProducts) && firebaseProducts.length ? firebaseProducts : (window.DEMO_PRODUCTS || []);
    } catch (error) {
      console.warn("تعذر تحميل Firebase، تم استخدام البيانات التجريبية.", error);
      state.products = window.DEMO_PRODUCTS || [];
      showToast("تعذر تحميل البيانات، تم عرض المنتجات التجريبية");
    }
    renderProducts();
  }

  track.addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-add-product]");
    if (addButton) return addToCart(addButton.dataset.addProduct, addButton);
    const visual = event.target.closest("[data-open-product]");
    if (visual) openProduct(visual.dataset.openProduct);
  });
  track.addEventListener("keydown", (event) => {
    if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-open-product]")) {
      event.preventDefault();
      openProduct(event.target.dataset.openProduct);
    }
  });
  $("#cartButton").addEventListener("click", openCart);
  $("#closeCart").addEventListener("click", closeCart);
  $("#closeModal").addEventListener("click", closeProduct);
  backdrop.addEventListener("click", closeProduct);
  $("#modalAddButton").addEventListener("click", (event) => {
    if (state.activeProduct) addToCart(state.activeProduct.id, event.currentTarget);
  });
  $("#whatsappButton").addEventListener("click", buyOnWhatsApp);
  $("#cartItems").addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-product]");
    if (!button) return;
    state.cart = state.cart.filter((item) => String(item.id) !== String(button.dataset.removeProduct));
    updateCart();
  });
  track.addEventListener("scroll", updateCarousel, { passive: true });
  window.addEventListener("resize", updateCarousel);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeProduct();
      closeCart();
    }
  });
  $("#year").textContent = new Date().getFullYear();
  loadProducts();
}());