/* Open/Close Cart Sidebar */
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

/* Fetch Products */
const fetchProducts = () => {
    const groupRootEl = document.querySelector('#groups-root')      
    fetch('http://127.0.0.1:5500/products.json')
    .then(response => response.json())
    .then(body => {   
        groupRootEl.innerHTML = ''     
        body.groups.forEach(group => {
            let groupHtml = `<section><h2>${group.name}</h2><div class="products-grid">`
            group.products.forEach(product => {
                const description = product.description != null ? `<p>${product.description}</p>` : ''
                groupHtml += `<article class="card">
                                <div class="card-content">
                                    <img src="${product.image}" alt="${product.name}" width="196" height="120" />
                                    <h3>${product.name}</h3>
                                    <p class="price">R$ ${product.price.toLocaleString('pt-br', { minimumFractionDigits: 2})}</p>
                                    ${description}
                                    <button data-id="${product.id}" class="btn btn-main btn-block btn-add-cart">Adicionar</button>
                                </div>
                            </article>`
                })
                groupHtml += '</div></section>'                
                groupRootEl.innerHTML += groupHtml
        }) 
        setupAddToCart()                       
    })
    .catch(err => {
        groupRootEl.innerHTML = '<p class="alert-error">Falha ao carregar os produtos. Recarregue a página novamente'
    })
}
fetchProducts()

/* Add Products in Cart */
const productsCart = []
const addToCart = (event) => {
    console.log(event.target.dataset)
}

const setupAddToCart = () => {
    const btnAddCartEls = document.querySelectorAll('.btn-add-cart')
    btnAddCartEls.forEach(btn => {
        btn.addEventListener('click', addToCart)
    })
    console.log(btnAddCartEls)
}


