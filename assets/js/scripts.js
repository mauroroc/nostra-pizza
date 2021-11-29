var cartSidebar = document.querySelector('.cart-sidebar')

function openSidebar() {
    cartSidebar.classList.add('cart-sidebar-open')
}

function closeSidebar() {
    cartSidebar.classList.remove('cart-sidebar-open')
}

const btnCart = document.getElementById('btn-cart')
btnCart.addEventListener('click', openSidebar)
const btnCloseCart = document.getElementById('btn-close-cart')
btnCloseCart.addEventListener('click', closeSidebar)
const btnAddMore = document.getElementById('btn-add-more')
btnAddMore.addEventListener('click', closeSidebar)
