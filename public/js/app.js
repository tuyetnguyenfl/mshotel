
const API_URL = '/api/items';

const productGrid = document.getElementById('product-grid');
const emptyState = document.getElementById('empty-state');
const resultsSummary = document.getElementById('results-summary');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const managementTableBody = document.getElementById('management-table-body');

const productDialog = document.getElementById('product-dialog');
const cartDialog = document.getElementById('cart-dialog');
const productFormDialog = document.getElementById('product-form-dialog');

const productForm = document.getElementById('product-form');
const productFormTitle = document.getElementById('product-form-title');
const productFormError = document.getElementById('product-form-error');
const managementMessage = document.getElementById('management-message');
const toast = document.getElementById('toast');

let products = [];
let cart = [];
let toastTimeout;

// Send a request and parse its JSON response
async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }

  return data;
}

function formatPrice(price) {
  const amount = Number(price);

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(Number.isFinite(amount) ? amount : 0);
}

function safeImageUrl(value) {
  if (typeof value !== 'string' || !value.trim()) {
    return 'https://placehold.co/600x400?text=HOTEL+Product';
  }

  try {
    const url = new URL(value, window.location.origin);

    if (url.protocol === 'https:' || url.protocol === 'http:') {
      return url.href;
    }
  } catch {
    // Use a placeholder for malformed image URLs.
  }

  return 'https://placehold.co/600x400?text=HOTEL+Product';
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.remove('visible');
  }, 2800);
}

function showManagementMessage(message) {
  managementMessage.textContent = message;
  managementMessage.classList.remove('hidden');
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text !== undefined) {
    element.textContent = text;
  }

  return element;
}

function makeButton(text, className, action, id) {
  const button = makeElement('button', className, text);

  button.type = 'button';
  button.dataset.action = action;
  button.dataset.id = id;

  return button;
}

// Load products from MongoDB through the Express API
async function loadProducts() {
  productGrid.replaceChildren(
    makeElement('p', 'loading-message', 'Loading your collection...')
  );

  emptyState.classList.add('hidden');
  resultsSummary.textContent = 'Loading products...';

  const params = new URLSearchParams();
  const search = searchInput.value.trim();
  const category = categoryFilter.value;

  if (search) {
    params.set('search', search);
  }

  if (category && category !== 'all') {
    params.set('category', category);
  }

  try {
    const query = params.toString();
    const url = query ? `${API_URL}?${query}` : API_URL;

    products = await apiRequest(url);

    updateCategoryOptions();
    renderProducts();
    renderManagementTable();
    syncCartWithProducts();
  } catch (error) {
    products = [];

    productGrid.replaceChildren(
      makeElement('p', 'loading-message', error.message)
    );

    resultsSummary.textContent = 'Unable to load products.';
    managementTableBody.replaceChildren();

    showToast('Could not load products. Check the server connection.');
    console.error(error);
  }
}

// Fill the category dropdown using available products
function updateCategoryOptions() {
  const selected = categoryFilter.value;

  const categories = [
    ...new Set(
      products
        .map(product => product.category)
        .filter(category => typeof category === 'string' && category.trim())
    )
  ].sort((a, b) => a.localeCompare(b));

  categoryFilter.replaceChildren();

  const allOption = makeElement('option', '', 'All products');
  allOption.value = 'all';
  categoryFilter.append(allOption);

  categories.forEach(category => {
    const option = makeElement('option', '', category);
    option.value = category;
    categoryFilter.append(option);
  });

  const selectionExists = [...categoryFilter.options].some(
    option => option.value === selected
  );

  categoryFilter.value = selectionExists ? selected : 'all';
}

// Create and render product cards safely
function renderProducts() {
  productGrid.replaceChildren();

  resultsSummary.textContent =
    `${products.length} product${products.length === 1 ? '' : 's'} found`;

  emptyState.classList.toggle('hidden', products.length !== 0);

  if (products.length === 0) {
    return;
  }

  products.forEach(product => {
    const card = makeElement('article', 'product-card');

    const imageWrap = makeElement('div', 'product-image-wrap');
    const image = makeElement('img', 'product-image');

    image.src = safeImageUrl(product.imageUrl);
    image.alt = product.name || 'HOTEL product';
    image.loading = 'lazy';
    image.addEventListener('error', () => {
      image.src = 'https://placehold.co/600x400?text=HOTEL+Product';
    }, { once: true });

    imageWrap.append(image);

    const content = makeElement('div', 'product-card-content');
    const category = makeElement(
      'span',
      'product-category',
      product.category || 'Other'
    );
    const name = makeElement('h3', '', product.name || 'Unnamed product');
    const description = makeElement(
      'p',
      'product-description',
      product.description || 'A useful everyday essential.'
    );

    const footer = makeElement('div', 'product-card-footer');
    const price = makeElement(
      'span',
      'product-price',
      formatPrice(product.price)
    );

    const addButton = makeButton(
      'Add to cart +',
      'button button-dark',
      'add-cart',
      product._id
    );

    footer.append(price, addButton);

    const actions = makeElement('div', 'product-card-actions');

    actions.append(
      makeButton('View details', 'small-button', 'details', product._id)
    );

    content.append(category, name, description, footer, actions);
    card.append(imageWrap, content);
    productGrid.append(card);
  });
}

// Display all products in the management table
function renderManagementTable() {
  managementTableBody.replaceChildren();

  if (products.length === 0) {
    const row = makeElement('tr');
    const cell = makeElement('td', '', 'No products to display.');

    cell.colSpan = 4;
    row.append(cell);
    managementTableBody.append(row);
    return;
  }

  products.forEach(product => {
    const row = makeElement('tr');

    const nameCell = makeElement('td');
    const name = makeElement('strong', '', product.name || 'Unnamed product');
    nameCell.append(name);

    const categoryCell = makeElement(
      'td',
      '',
      product.category || 'Other'
    );

    const priceCell = makeElement(
      'td',
      '',
      formatPrice(product.price)
    );

    const actionsCell = makeElement('td');
    const actions = makeElement('div', 'table-actions');

    actions.append(
      makeButton('Edit', 'small-button', 'edit', product._id),
      makeButton('Delete', 'small-button delete-button', 'delete', product._id)
    );

    actionsCell.append(actions);
    row.append(nameCell, categoryCell, priceCell, actionsCell);
    managementTableBody.append(row);
  });
}

// GET a single product before displaying details
async function showProductDetails(id) {
  try {
    const product = await apiRequest(`${API_URL}/${encodeURIComponent(id)}`);

    const content = document.getElementById('product-details-content');
    content.replaceChildren();

    const image = makeElement('img', 'detail-image');
    image.src = safeImageUrl(product.imageUrl);
    image.alt = product.name || 'HOTEL product';
    image.addEventListener('error', () => {
      image.src = 'https://placehold.co/600x400?text=HOTEL+Product';
    }, { once: true });

    const category = makeElement(
      'span',
      'product-category',
      product.category || 'Other'
    );

    const name = makeElement('h2', '', product.name || 'Unnamed product');
    const description = makeElement(
      'p',
      'detail-description',
      product.description || 'A useful everyday essential.'
    );

    const footer = makeElement('div', 'detail-footer');

    footer.append(
      makeElement('strong', 'product-price', formatPrice(product.price)),
      makeButton('Add to cart +', 'button button-dark', 'add-cart', product._id)
    );

    content.append(image, category, name, description, footer);
    productDialog.showModal();
  } catch (error) {
    showToast(error.message);
  }
}

// Open the form to create a product
function openCreateForm() {
  productForm.reset();

  document.getElementById('product-id').value = '';
  productFormTitle.textContent = 'Add a product';
  productFormError.classList.add('hidden');

  productFormDialog.showModal();
}

// Open the form to edit a product
async function openEditForm(id) {
  try {
    const product = await apiRequest(`${API_URL}/${encodeURIComponent(id)}`);

    productForm.reset();

    document.getElementById('product-id').value = product._id;
    document.getElementById('product-name').value = product.name || '';
    document.getElementById('product-category').value = product.category || '';
    document.getElementById('product-price').value = Number(product.price || 0);
    document.getElementById('product-image').value = product.imageUrl || '';
    document.getElementById('product-description').value =
      product.description || '';

    productFormTitle.textContent = 'Edit product';
    productFormError.classList.add('hidden');

    productFormDialog.showModal();
  } catch (error) {
    showToast(error.message);
  }
}

// Create or update a product
productForm.addEventListener('submit', async event => {
  event.preventDefault();

  productFormError.classList.add('hidden');

  const id = document.getElementById('product-id').value;
  const priceInput = document.getElementById('product-price').value;

  const payload = {
    name: document.getElementById('product-name').value.trim(),
    category: document.getElementById('product-category').value.trim(),
    price: Number(priceInput),
    imageUrl: document.getElementById('product-image').value.trim(),
    description: document.getElementById('product-description').value.trim()
  };

  if (
    !payload.name ||
    !payload.category ||
    priceInput === '' ||
    !Number.isFinite(payload.price) ||
    payload.price < 0
  ) {
    productFormError.textContent =
      'Enter a name, category, and valid non-negative price.';
    productFormError.classList.remove('hidden');
    return;
  }

  const submitButton = productForm.querySelector('[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = 'Saving...';

  try {
    if (id) {
      await apiRequest(`${API_URL}/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });

      showToast('Product updated successfully.');
      showManagementMessage('Your product changes have been saved.');
    } else {
      await apiRequest(API_URL, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      showToast('Product created successfully.');
      showManagementMessage('Your new product has been added.');
    }

    productFormDialog.close();
    await loadProducts();
  } catch (error) {
    productFormError.textContent = error.message;
    productFormError.classList.remove('hidden');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Save product';
  }
});

// Delete a product after confirmation
async function deleteProduct(id) {
  const product = products.find(item => item._id === id);

  const confirmed = window.confirm(
    `Delete "${product?.name || 'this product'}"? This cannot be undone.`
  );

  if (!confirmed) {
    return;
  }

  try {
    await apiRequest(`${API_URL}/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });

    cart = cart.filter(item => item.id !== id);

    showToast('Product deleted successfully.');
    showManagementMessage('The product was deleted.');
    await loadProducts();
    renderCart();
  } catch (error) {
    showToast(error.message);
  }
}

// Cart functions: this cart is kept in browser memory only
function addToCart(id) {
  const product = products.find(item => item._id === id);

  if (!product) {
    showToast('Product not found. Refresh the collection.');
    return;
  }

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id,
      name: product.name,
      price: Number(product.price || 0),
      quantity: 1
    });
  }

  renderCart();
  showToast(`${product.name} added to cart.`);
}

function syncCartWithProducts() {
  cart = cart.filter(cartItem =>
    products.some(product => product._id === cartItem.id)
  );

  cart.forEach(cartItem => {
    const product = products.find(item => item._id === cartItem.id);

    if (product) {
      cartItem.name = product.name;
      cartItem.price = Number(product.price || 0);
    }
  });

  renderCart();
}

function renderCart() {
  const content = document.getElementById('cart-content');
  content.replaceChildren();

  const itemCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  document.getElementById('cart-count').textContent = itemCount;

  if (cart.length === 0) {
    content.append(
      makeElement('p', 'loading-message', 'Your cart is empty.')
    );
  }

  cart.forEach(item => {
    const row = makeElement('div', 'cart-item');
    const info = makeElement('div');
    const name = makeElement('strong', '', item.name);
    const price = makeElement(
      'p',
      '',
      `${formatPrice(item.price)} each`
    );

    info.append(name, price);

    const controls = makeElement('div', 'quantity-control');

    const decrease = makeElement('button', '', '−');
    decrease.type = 'button';
    decrease.setAttribute('aria-label', `Remove one ${item.name}`);
    decrease.addEventListener('click', () => changeQuantity(item.id, -1));

    const quantity = makeElement('span', '', item.quantity);

    const increase = makeElement('button', '', '+');
    increase.type = 'button';
    increase.setAttribute('aria-label', `Add one ${item.name}`);
    increase.addEventListener('click', () => changeQuantity(item.id, 1));

    controls.append(decrease, quantity, increase);
    row.append(info, controls);
    content.append(row);
  });

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  document.getElementById('cart-total').textContent = formatPrice(total);
}

function changeQuantity(id, amount) {
  const item = cart.find(cartItem => cartItem.id === id);

  if (!item) {
    return;
  }

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(cartItem => cartItem.id !== id);
  }

  renderCart();
}

// Product card and management table actions
document.addEventListener('click', event => {
  const button = event.target.closest('[data-action]');

  if (!button) {
    return;
  }

  const { action, id } = button.dataset;

  if (action === 'details') {
    showProductDetails(id);
  } else if (action === 'add-cart') {
    addToCart(id);
  } else if (action === 'edit') {
    openEditForm(id);
  } else if (action === 'delete') {
    deleteProduct(id);
  }
});

// Search and category filter
let searchTimeout;

searchInput.addEventListener('input', () => {
  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {
    loadProducts();
  }, 250);
});

categoryFilter.addEventListener('change', loadProducts);

document.getElementById('reset-filters').addEventListener('click', () => {
  searchInput.value = '';
  categoryFilter.value = 'all';
  loadProducts();
});

// Open the cart
document.getElementById('cart-button').addEventListener('click', () => {
  renderCart();
  cartDialog.showModal();
});

// Clear the cart
document.getElementById('clear-cart-button').addEventListener('click', () => {
  cart = [];
  renderCart();
  showToast('Cart cleared.');
});

// Open create form
document.getElementById('add-product-button').addEventListener('click', () => {
  openCreateForm();
});

// Close dialogs
document.querySelectorAll('[data-close-dialog]').forEach(button => {
  button.addEventListener('click', () => {
    const dialog = document.getElementById(button.dataset.closeDialog);

    if (dialog) {
      dialog.close();
    }
  });
});

// Close a dialog by clicking outside its content
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
});

// Initial page setup
document.getElementById('current-year').textContent =
  new Date().getFullYear();

renderCart();
loadProducts();
