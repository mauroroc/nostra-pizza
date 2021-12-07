/* Open/Close Cart Sidebar */
var cartSidebar = document.querySelector('.cart-sidebar')
function openSidebar(event) {
    event.stopPropagation()
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

document.addEventListener('click', closeSidebar)
cartSidebar.addEventListener('click', event => event.stopPropagation())

const keyCart = 'productsCart'

/* Fetch Products */
const groupRootEl = document.querySelector('#groups-root')      
const fetchProducts = () => {  
    fetch('/products.json')
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
                                    <button 
                                    data-id="${product.id}" 
                                    data-name="${product.name}" 
                                    data-image="${product.image}" 
                                    data-price="${product.price}"                                     
                                    class="btn btn-main btn-block btn-add-cart"
                                    >Adicionar</button>
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
if(groupRootEl) 
    fetchProducts()

/* Add Products in Cart */
let productsCart = []
const addToCart = (event) => {
    const product = event.target.dataset
    const index = productsCart.findIndex(item => item.id == product.id)
    if (index == -1) {
        productsCart.push({
            ...product, 
            price: Number(product.price),
            qty: 1 })    
    } else {
        productsCart[index].qty++
    }    
    handleCartUpdate()        
}

const setupAddToCart = () => {
    const btnAddCartEls = document.querySelectorAll('.btn-add-cart')
    btnAddCartEls.forEach(btn => {
        btn.addEventListener('click', addToCart)
    })
}

const handleKeydown = event => {
    if (event.key == '-' || event.key == '.')
        event.preventDefault()    
}

const handleUpdateQty = event => {
    const { id } = event.target.dataset
    const qty = parseInt(event.target.value)
    if(qty > 0) {
        const index = productsCart.findIndex(item => item.id == id)
        productsCart[index].qty = qty
        handleCartUpdate(false)
    } else {
        productsCart = productsCart.filter(product => product.id != id)
        handleCartUpdate()
    }    
}

const setupCartEvents = () => {
    const btnRemoveCartEls = document.querySelectorAll('.btn-remove-cart')    
    btnRemoveCartEls.forEach(btn => {
        btn.addEventListener('click', removeOfCart)
    })        
    const inputQtyEls = document.querySelectorAll('.input-qty-cart')    
    inputQtyEls.forEach(input => {
        input.addEventListener('keydown', handleKeydown)
        input.addEventListener('keyup', handleUpdateQty)
        input.addEventListener('change', handleUpdateQty)
    })
}

//const removeOfCart = (). Para o this funcionar não pode ser arrow function       
function removeOfCart() {
    const { id } = this.dataset   
    productsCart = productsCart.filter(product => product.id != id)
    handleCartUpdate()
}

const handleCartUpdate = (renderItems = true) => {    
    localStorage.setItem(keyCart, JSON.stringify(productsCart))
    const badgeEl = document.querySelector('#btn-cart .badge')
    const emptyCartEl = document.querySelector('#empty-cart')
    const cartWithProducts = document.querySelector('#cart-with-products')
    const cartItensParent = cartWithProducts.querySelector('ul')
    const cartTotalValueEl = document.querySelector('#cart-total-value')
    const totalCart = productsCart.reduce((total, item) => {
        return total + item.qty
    }, 0)    
    if (totalCart > 0) {
        badgeEl.classList.add('badge-show')
        badgeEl.innerHTML = totalCart
        cartWithProducts.classList.add('cart-with-products-show')
        emptyCartEl.classList.remove('empty-cart-show')
        if (renderItems) {
            cartItensParent.innerHTML = ''        
            productsCart.forEach(product => {
            cartItensParent.innerHTML += `
                <li class="cart-item">
                    <img src="${product.image}" alt="${product.name}" width="70" height="70">
                    <div>
                        <p class="h3">${product.name}</p>
                        <p class="price">R$ ${product.price.toLocaleString('pt-br', { minimumFractionDigits: 2})}</p>
                    </div>
                    <input class="form-input input-qty-cart" type="number" min="0" max="5" value="${product.qty}" data-id="${product.id}"/>
                    <button class="btn-remove-cart" data-id="${product.id}" >
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </li>`
            }) 
            setupCartEvents()  
        }               
        const totalPrice = productsCart.reduce((total, item) => total + item.qty * item.price, 0)         
        cartTotalValueEl.innerHTML = `R$ ${totalPrice.toLocaleString('pt-br', { minimumFractionDigits: 2})}`       
    } else {
        badgeEl.classList.remove('badge-show')
        emptyCartEl.classList.add('empty-cart-show')
        cartWithProducts.classList.remove('cart-with-products-show')
    }
}

//Chamar no inicio
const iniCart = () => {
    const savedProducts = localStorage.getItem(keyCart)
    if (savedProducts)
        productsCart = JSON.parse(savedProducts)   
    handleCartUpdate()  
}
iniCart()

//Form Checkout
const handleCheckoutSubmit = event => {
    event.preventDefault()
    let text = "Confira o pedido\n------------------\n\n"
    if(productsCart.length == 0) {
        alert('Nenhum produto no carrinho')
        return
    }
    productsCart.forEach(product => {
        text += `*${product.qty}x ${product.name}* - R$ ${product.price.toLocaleString('pt-br', { minimumFractionDigits: 2})}\n\n`
        text += `*Taxa de entrega:* A combinar\n\n`
        const totalPrice = productsCart.reduce((total, item) => total + item.qty * item.price, 0)
        text += `*Total: R$ ${totalPrice.toLocaleString('pt-br', { minimumFractionDigits: 2})}*\n\n--------------------\n\n`
        text += event.target.elements['input-name'].value + '\n'
        text += event.target.elements['input-phone'].value + '\n'
        text += event.target.elements['input-cep'].value + '\n'
        text += event.target.elements['input-address'].value + '\n'
        text += event.target.elements['input-number'].value + '\n'
        text += event.target.elements['input-complement'].value + '\n'
        text += event.target.elements['input-neighborhood'].value + '\n'
        text += event.target.elements['input-city'].value + '\n'
    })        
    text = encodeURI(text)    
    window.open(`https://web.whatsapp.com/send/?phone=5571991541122&text=${text}`, '_blank')
}

const formCheckoutEl = document.querySelector('.form-checkout')
if(formCheckoutEl) formCheckoutEl.addEventListener('submit', handleCheckoutSubmit)

//iMask
const inputPhoneEl = document.querySelector('#input-phone')
if (inputPhoneEl) {
    IMask(inputPhoneEl, {
        mask: '(00) 00000-0000'
    })
}


const inputCepEl = document.querySelector('#input-cep')
if (inputCepEl) {
    IMask(inputCepEl, {
        mask: '00000-000'
    })
}

//API de CEP
function changeCEP() { 
    const cep = inputCepEl.value.replace('-','')
    const urlApi = `https://brasilapi.com.br/api/cep/v2/${cep}`    
    fetchAddress(urlApi)
}

const fetchAddress = (urlApi) => {  
    fetch(urlApi)
    .then(response => response.json())
    .then(body => { 
        const inputAddressEl = document.querySelector('#input-address')
        inputAddressEl.value = body.street
        const inputNeighborhoodEl = document.querySelector('#input-neighborhood')
        inputNeighborhoodEl.value = body.neighborhood
        const inputCityhoodEl = document.querySelector('#input-city')
        inputCityhoodEl.value = body.city   
        const inputNumberEl = document.querySelector('#input-number') 
        inputNumberEl.focus()
    })
}