const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');

jest
    .dontMock('fs');

document.documentElement.innerHTML = html;
const app = require('./script');
let unselectedProducts = document.getElementById('unselected-list').querySelector('ul');
let products = [
    {
        "id": "1",
        "name": "Ashwagandha",
        "brand": "plnt",
        "price": "15.99"
    },
    {
        "id": "2",
        "name": "Rhodiola Rosea",
        "brand": "the Vitamin Shoppe",
        "price": "24.99"
    },
    {
        "id": "3",
        "name": "Theanine",
        "brand": "Jarrow Formulas",
        "price": "15.99"
    },
    {
        "id": "4",
        "name": "NAC",
        "brand": "Jarrow Formulas",
        "price": "26.99"
    }
]

test('add item to selected list', () => {
    app.updateLocalStorage(products, [])
    app.setItem(unselectedProducts, products[0]);
    
    let item = document.getElementById('unselected-list').querySelectorAll('ul li')[0];
    item.click();
    let selectedItem = document.getElementById('selected-list').querySelectorAll('ul li')[0];
    selectedItemName = selectedItem.getAttribute('data-name');
    expect(selectedItemName).toBe(products[0].name);
});

test('remove item from selected list', () => {
    let close = document.getElementById('selected-list').querySelectorAll('ul li')[0].querySelector('i');
    close.click();

    let unselectedItem = document.getElementById('unselected-list').querySelectorAll('ul li')[0];
    unselectedItemName = unselectedItem.getAttribute('data-name');
    expect(unselectedItemName).toBe(products[0].name);
});

test('calculate total', () => {
    let total = 0.0;
    let cart_items = document.querySelectorAll("#selected-list ul li");

    for (let i = 0; i < cart_items.length; i++) {
        let cart_item = cart_items[i];
        let price = cart_item.getAttribute('data-price');
        total += parseFloat(price);
    }

    let totalPrice = document.querySelectorAll("#selected-list span.total")[0].innerHTML;
    
    expect(totalPrice).toBe(total.toFixed(2));
});