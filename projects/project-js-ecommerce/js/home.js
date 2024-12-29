const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
const userInfo = document.getElementById('user-info');
const usernameSpan = document.getElementById('username');
const logoutBtn = document.getElementById('logout-btn');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const cartContainer = document.getElementById('cart-icons');
const cartArrow = document.getElementById('cart-arrow');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const productList = document.getElementById('product-list');
const searchBar = document.getElementById('search-bar');
const searchType = document.getElementById('search-type');
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let products = [];

// Update User Info
if (loggedInUser) {
    userInfo.classList.remove('hidden');
    usernameSpan.textContent = loggedInUser.username;
    logoutBtn.classList.remove('hidden');
    loginBtn.classList.add('hidden');
    registerBtn.classList.add('hidden');
    cartContainer.classList.remove('hidden'); // Show cart if logged in
    console.log("logoud in")
} else {
    cartContainer.classList.add('hidden');
    console.log("logoud out") // Hide cart if not logged in
}

// Logout Functionality
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('loggedInUser');
    alert('Logged out successfully!');
    location.reload(); // Reload the page to reset UI and hide cart
});

// Fetch and Display Products
fetch('assets/products.json')
    .then(response => response.json())
    .then(data => {
        products = data; // Store fetched products for search functionality
        displayProducts(data);
    });
//favourite icon still red 
function applyFavoritesHighlight() {
    const favoriteButtons = document.querySelectorAll('.add-to-favorites');
    favoriteButtons.forEach(button => {
        const productId = button.getAttribute('data-id');
        const isFavorite = favorites.some(product => product.id == productId);

        if (isFavorite) {
            button.style.color = 'red'; // Set color to red if already in favorites
        }
    });
}
//when reload cartcount dont change
document.addEventListener('DOMContentLoaded', () => {
    const favoriteButtons = document.querySelectorAll('.add-to-favorites');
    favoriteButtons.forEach(button => {
        const productId = button.getAttribute('data-id');
        const isFavorite = favorites.some(product => product.id == productId);

        if (isFavorite) {
            button.style.color = 'red'; // Set color to red if already in favorites
        }
    });

    // Update Cart Count on Page Load
    updateCartCount();
});


function displayProducts(products) {
    productList.innerHTML = '';
    products.forEach(product => {
        const isInCart = cart.some(p => p.id === product.id);
        const buttonText = isInCart ? 'Remove from Cart' : 'Add to Cart';
        const buttonClass = isInCart ? 'remove-from-cart' : 'add-to-cart';

        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <div class="product-info">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <p>${product.category}</p>
                <div class="cart-btn">
                    <button class="${buttonClass}" data-id="${product.id}">${buttonText}</button>
                    <button class="add-to-favorites" data-id="${product.id}">&#x2661;</button>
                </div>
            </div>
        `;
        productList.appendChild(productCard);

    });
        // Apply favorite state after rendering
        applyFavoritesHighlight();

}

// Real-Time Search
searchBar.addEventListener('input', () => {
    const query = searchBar.value.trim().toLowerCase();
    const filteredProducts = products.filter(product => {
        if (searchType.value === 'item') {
            return product.name.toLowerCase().includes(query);
        } else if (searchType.value === 'category') {
            return product.category.toLowerCase().includes(query);
        }
    });
    displayProducts(filteredProducts);
});

productList.addEventListener('click', (event) => {
    const target = event.target;
    const productId = target.getAttribute('data-id');
    if (!loggedInUser) {
        alert('Please login to add items to cart or favorites.');
        window.location.href = 'login.html';
        return;
    }

    if (target.classList.contains('add-to-cart')) {
        const product = products.find(p => p.id == productId);

        // Check if the item is already in the cart
        const existingItem = cart.find(p => p.id == product.id);
        if (existingItem) {
            // If the item is already in the cart, update quantity
            existingItem.quantity += 1;
        } else {
            // If the item is not in the cart, add it with quantity 1
            product.quantity = 1;
            cart.push(product);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        target.textContent = 'Remove from Cart';
        target.classList.add('remove-from-cart');
        target.classList.remove('add-to-cart');
    } else if (target.classList.contains('remove-from-cart')) {
        const product = products.find(p => p.id == productId);
        cart = cart.filter(p => p.id !== product.id);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        target.textContent = 'Add to Cart';
        target.classList.add('add-to-cart');
        target.classList.remove('remove-from-cart');
    } else if (target.classList.contains('add-to-favorites')) {
        const product = products.find(p => p.id == productId);

        // Check if product is already in favorites
        const existingIndex = favorites.findIndex(fav => fav.id == product.id);

        if (existingIndex !== -1) {
            // If in favorites, remove it
            favorites.splice(existingIndex, 1);
            target.style.color = '#485824'; // Reset to default color
        } else {
            // If not in favorites, add it
            favorites.push(product);
            target.style.color = 'red'; // Set to red when added
        }

        // Update localStorage
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
});
// Highlight Favorite Icons on Page Load
document.addEventListener('DOMContentLoaded', () => {
    const favoriteButtons = document.querySelectorAll('.add-to-favorites');
    favoriteButtons.forEach(button => {
        const productId = button.getAttribute('data-id');
        const isFavorite = favorites.some(product => product.id == productId);

        if (isFavorite) {
            button.style.color = 'red'; // Set color to red if already in favorites
        }
    });
});



// Update Cart Count
function updateCartCount() {
    cartCount.textContent = cart.length;
}

// Cart Dropdown
cartArrow.addEventListener('click', () => {
    // Populate the cart items list
    cartItems.innerHTML = cart.map((item, index) => `
        <li>
            <div class="buttons">
                <span>${item.name}</span> 
                <div class="cart-btns">
                    <span class="item-quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-index="${index}"><i class="fa-solid fa-plus"></i></button>
                    <button class="quantity-btn minus" data-index="${index}"><i class="fa-solid fa-minus"></i></button>
                </div>
            </div>
        </li>
    `).join('');

    // Add "View All Products" option at the end
    cartItems.innerHTML += `
        <li>
            <a href="cart.html">View All Products</a>
        </li>
    `;

    // Toggle visibility of cart items
    cartItems.classList.toggle('hidden');
});

// Event listener for handling plus and minus buttons
cartItems.addEventListener('click', (event) => {
    const button = event.target.closest('.quantity-btn');
    
    if (!button) return;

    const index = button.dataset.index;
    const item = cart[index];

    if (button.classList.contains('plus')) {
        item.quantity = (item.quantity) + 1;
        localStorage.setItem('cart', JSON.stringify(cart));

    } else if (button.classList.contains('minus') && item.quantity > 1) {
        item.quantity -= 1;
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Update the cart items list after changing quantity
    cartItems.innerHTML = cart.map((item, index) => `
        <li>
            <div class="buttons">
                <span>${item.name}</span> 
                <div class="cart-btns">
                    <span class="item-quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-index="${index}"><i class="fa-solid fa-plus"></i></button>
                    <button class="quantity-btn minus" data-index="${index}"><i class="fa-solid fa-minus"></i></button>
                </div>
            </div>
        </li>
    `).join('');
        // Add "View All Products" option at the end
        cartItems.innerHTML += `
        <li>
            <a href="cart.html">View All Products</a>
        </li>
    `;
});
