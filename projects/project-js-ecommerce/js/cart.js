let cart = JSON.parse(localStorage.getItem('cart')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
const cartList = document.getElementById('cart-list');
const favoritesList = document.getElementById('favorites-list');
const totalPriceElement = document.getElementById('total-price');
const logoutBtn = document.getElementById('logout-btn-cart');

// Display Cart Items with Quantity Controls
function displayCartItems() {
    cartList.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        // Calculate total price considering the quantity of each item
        const itemTotalPrice = item.price * (item.quantity);

        cartList.innerHTML += `
            <li class="cart-item">
                <!-- Image on the left -->
                <img src="${item.image}" alt="${item.name}" class="item-img">

                <!-- Info and actions on the right -->
                <div class="all-item-info">
                <div class="item-info">
                    <span class="item-name">Product: ${item.name}</span>
                    <span class="item-category">Category: ${item.category}</span>
                    <span class="item-price">Price: ${itemTotalPrice.toFixed(2)}$</span>
                </div>

                <div class="item-actions">
                <span class="item-quantity">${item.quantity}</span>
                    <button onclick="increaseQuantity(${index})" class="cart-plus"><i class="fa-solid fa-plus"></i></button>
                    <button onclick="decreaseQuantity(${index})" class="cart-minus"><i class="fa-solid fa-minus"></i></button>
                    <button onclick="removeFromCart(${index})" class="remove-btn">Remove</button>
                </div>
                </div>
            </li>`;
        
        // Add the price for this item (with quantity) to the total
        total += itemTotalPrice;
    });

    totalPriceElement.textContent = `${total.toFixed(2)}$`;
}


// Increase Item Quantity
function increaseQuantity(index) {
    cart[index].quantity = (cart[index].quantity || 1) + 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
}

// Decrease Item Quantity
function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
    }
}


// Remove Item from Cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
}

// Add/Remove Item to/from Favorites
function toggleFavorite(index) {
    const item = cart[index];
    const favoriteIndex = favorites.findIndex(fav => fav.id === item.id);

    if (favoriteIndex === -1) {
        favorites.push(item); // Add to favorites
    } else {
        favorites.splice(favoriteIndex, 1); // Remove from favorites
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayCartItems();
    displayFavorites();
}


// Display Favorite Items
function displayFavorites() {
    if (favorites.length <= 3) {
        favoritesList.innerHTML = favorites.map(item => `
            <div class="favorite-item">
                <img src="${item.image}" alt="${item.name}" class="item-img-fav">
                <div class="fav-icon-cart">
                    <div class="fav-icon-cart-info">
                        <span class="item-name">Product: ${item.name}</span>
                        <span class="item-cat">Category: ${item.category}</span>
                    </div>
                    <button onclick="removeFromFavorites(${item.id})" class="remove-fav-btn">
                        &#x2661;
                    </button>
                </div>
            </div>
        `).join('');
    } else {
        favoritesList.innerHTML = `
            <div class="swiper">
                <div class="swiper-wrapper">
                    ${favorites.map(item => `
                        <div class="swiper-slide favorite-item">
                            <img src="${item.image}" alt="${item.name}" class="item-img-fav">
                            <div class="fav-icon-cart">
                                <div class="fav-icon-cart-info">
                                    <span class="item-name">Product: ${item.name}</span>
                                    <span class="item-cat">Category: ${item.category}</span>
                                </div>
                                <button onclick="removeFromFavorites(${item.id})" class="remove-fav-btn">
                                    &#x2661;
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <br><br>
                <!-- Add navigation controls -->
                <div class="swiper-pagination"></div>
            </div>
        `;
        initializeSwiper(); // Initialize the Swiper instance
    }
}
function initializeSwiper() {
    new Swiper('.swiper', {
        slidesPerView: 3, // Number of items visible at once
        spaceBetween: 20, // Spacing between slides
        autoplay: {
            delay: 3000, // Delay in milliseconds between slides (3 seconds)
            disableOnInteraction: false, // Autoplay continues even after interaction
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        loop: false, // Enable looping
        speed: 800, // Speed of the slide transition (in ms)
        slidesPerGroup: 2, // Number of slides to move at once
    });
}


// Remove Item from Favorites
function removeFromFavorites(itemId) {
    favorites = favorites.filter(item => item.id !== itemId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
}

// Initial Load
displayCartItems();
displayFavorites();

// Logout Functionality
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('loggedInUser');
    alert('Logged out successfully!');
    window.location.href = 'index.html';
});