function addEvent(element, event, delegate) {
    if (typeof (window.event) != 'undefined' && element.attachEvent)
        element.attachEvent('on' + event, delegate);
    else
        element.addEventListener(event, delegate, false);
}

addEvent(document, 'readystatechange', function () {
    if (document.readyState !== "complete") return true;

    let unselectedProducts = document.getElementById('unselected-list').querySelector('ul');
    let selectedProducts = document.getElementById('selected-list').querySelector('ul');

    addEvent(selectedProducts, 'drop', onDrop);
    addEvent(selectedProducts, 'dragover', onDragOver);

    function updateCart() {
        let total = 0.0;
        let cart_items = document.querySelectorAll("#selected-list ul li");
        for (let i = 0; i < cart_items.length; i++) {
            let cart_item = cart_items[i];
            let price = cart_item.getAttribute('data-price');
            total += parseFloat(price);
        }
        document.querySelectorAll("#selected-list span.total")[0].innerHTML = total.toFixed(2);
    }
    
    function addItem(item, id) {
        let fragment = document.createElement('i');
        fragment.setAttribute('class', 'fa fa-close');
        addEvent(fragment, 'click', onCloseClick);
        item.appendChild(fragment); 
        item.onclick = '';

        selectedProducts.appendChild(item);

        let localStorage = window.localStorage.getItem('product-lists');
        let unselectedList = JSON.parse(localStorage).unselectedProducts;
        let selectedList = JSON.parse(localStorage).selectedProducts;
        unselectedList = unselectedList.filter(el => el.id != id);

        let product = {
            id,
            name: item.getAttribute('data-name'),
            brand: item.getAttribute("data-brand"),
            price: item.getAttribute("data-price")
          }
        selectedList.push(product);

        updateLocalStorage(unselectedList, selectedList);
    }

    function removeItem(item, id) {
        let fragment = item.querySelector('i');
        item.removeChild(fragment); 
        item.onclick = function () {
            addItem(item, id);
        };

        unselectedProducts.appendChild(item);

        let localStorage = window.localStorage.getItem('product-lists');
        let unselectedList = JSON.parse(localStorage).unselectedProducts;
        let selectedList = JSON.parse(localStorage).selectedProducts;
        selectedList = selectedList.filter(el => el.id != id);
        let product = {
            id,
            name: item.getAttribute('data-name'),
            brand: item.getAttribute("data-brand"),
            price: item.getAttribute("data-price")
          }
        unselectedList.push(product);

        updateLocalStorage(unselectedList, selectedList);
    }

    function onDrop(event) {
        if (event.preventDefault) event.preventDefault();
        if (event.stopPropagation) event.stopPropagation();
        else event.cancelBubble = true;

        let id = event.dataTransfer.getData("Text");
        let item = document.getElementById(id);
        let exists = document.querySelectorAll("#selected-list ul li[id='" + id + "']");
        if (exists.length <= 0) {
            addItem(item, id);
        }

        return false;
    }

    function onCloseClick(event) {
        if (event.preventDefault) event.preventDefault();
        if (event.stopPropagation) event.stopPropagation();
        else event.cancelBubble = true;

        let id = event.currentTarget.parentNode.getAttribute("id");
        let item = document.getElementById(id);

        removeItem(item, id);

        return false;
    }

    function onDragOver(event) {
        if (event.preventDefault) event.preventDefault();
        if (event.stopPropagation) event.stopPropagation();
        else event.cancelBubble = true;
        return false;
    }

    function onDrag(event) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.dropEffect = "move";
        let target = event.target || event.srcElement;
        let success = event.dataTransfer.setData('Text', target.id);
    }

    function updateLocalStorage(unselected, selected) {
        return new Promise(function(resolve, reject) {
            let lists = {
                unselectedProducts: unselected,
                selectedProducts: selected
            }
            window.localStorage.setItem('product-lists', JSON.stringify(lists));
            updateCart();
            resolve(window.localStorage.getItem('product-lists'));
        });
    }

    function setItem(list, lineObject, addFragment = false) {
        let product = document.createElement('li');
        product.setAttribute("id", lineObject.id);
        product.setAttribute("data-name", lineObject.name);
        product.setAttribute("data-price", lineObject.price);
        product.setAttribute("data-brand", lineObject.brand);
        product.setAttribute("draggable", "true");
        
        let productContent = document.createElement('span');
        
        productContent.innerHTML = lineObject.name + " by " + lineObject.brand + " - " + lineObject.price;
        product.appendChild(productContent);

        if (addFragment) {
            let fragment = document.createElement('i');
            fragment.setAttribute('class', 'fa fa-close');
            addEvent(fragment, 'click', onCloseClick);
            product.appendChild(fragment);
        } else {
            product.onclick = function () {
                addItem(product, lineObject.id);
            };
        }

        list.appendChild(product);
        addEvent(product, 'dragstart', onDrag);
    }

    function setItems(localStorage) {
        JSON.parse(localStorage).unselectedProducts.forEach(function (lineObject) {
            setItem(unselectedProducts, lineObject);
        });
        JSON.parse(localStorage).selectedProducts.forEach(function (lineObject) {
            setItem(selectedProducts, lineObject, true);
        });
    }

    fetch('http://kate-l-macbook.local:8000/items.json')
    .then(function (response) {
        return response.json();
    })
    .then(function (myJson) {
        let response = myJson;
        let localStorage = window.localStorage.getItem('product-lists');
        if (!localStorage) {
            updateLocalStorage(response, []).then( (localStorage) => setItems(localStorage));
        } else {
            setItems(localStorage);
            updateCart();
        }
    });

});