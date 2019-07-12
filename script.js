// todo update var to let


function addEvent(element, event, delegate) {
    if (typeof (window.event) != 'undefined' && element.attachEvent)
        element.attachEvent('on' + event, delegate);
    else
        element.addEventListener(event, delegate, false);
}

addEvent(document, 'readystatechange', function () {
    if (document.readyState !== "complete")
        return true;
    let unselectedProducts = document.getElementById('unselected-list').querySelector('ul');
    let products = document.getElementById('unselected-list').querySelectorAll('ul li');
    let selectedProducts = document.getElementById('selected-list').querySelector('ul');
    // let removeSelectedProducts = document.getElementById('selected-list').querySelectorAll('div span');
    // console.log('products', products);
    // console.log('removeSelectedProducts', removeSelectedProducts);

    products.forEach(function (element) {
        // console.log(element);
        element.onclick = function () {
            selectedProducts.appendChild(element);
        };
    });

    function updateCart(){
        var total = 0.0;
        var cart_items = document.querySelectorAll("#selected-list ul li");
        for (var i = 0; i < cart_items.length; i++) {
            var cart_item = cart_items[i];
            var price = cart_item.getAttribute('data-price');
            total += parseFloat(price);
        }
        document.querySelectorAll("#selected-list span.total")[0].innerHTML = total.toFixed(2);
    }
    
    function addCartItem(item) {
        console.log('item', item);
        let fragment = document.createElement('i');
        fragment.setAttribute('class', 'fa fa-close');
        addEvent(fragment, 'click', onClick);
        item.appendChild(fragment); 

        selectedProducts.appendChild(item);
    }

    function removeCartItem(item) {
        console.log('item', item);
        console.log('selectedProducts', selectedProducts);
        console.log('unselectedProducts', unselectedProducts);
        let fragment = item.querySelector('i');
        item.removeChild(fragment); 
        unselectedProducts.appendChild(item);
        // selectedProducts.removeChild(item);
        
    }

    function onDrop(event) {
        if (event.preventDefault) event.preventDefault();
        if (event.stopPropagation) event.stopPropagation();
        else event.cancelBubble = true;

        console.log('event', event);
        var id = event.dataTransfer.getData("Text");
        console.log('id', id);
        var item = document.getElementById(id);

        // var exists = document.querySelectorAll("#selectedProducts ul li[data-id='" + id + "']");

        // if (exists.length > 0) {
        //     updateCartItem(exists[0]);
        // } else {
            addCartItem(item, id);
            // selectedProducts.appendChild(item);
        // }

        updateCart();

        return false;
    }

    function onClick(event) {
        if (event.preventDefault) event.preventDefault();
        if (event.stopPropagation) event.stopPropagation();
        else event.cancelBubble = true;

        console.log('event', event);
        console.log('event.currentTarget.parentNode', event.currentTarget.parentNode);
        var id = event.currentTarget.parentNode.getAttribute("id");
        var item = document.getElementById(id);

        // var exists = document.querySelectorAll("#selectedProducts ul li[data-id='" + id + "']");

        // if (exists.length > 0) {
        //     updateCartItem(exists[0]);
        // } else {
            removeCartItem(item, id);
            // selectedProducts.appendChild(item);
        // }

        updateCart();

        return false;
    }

    function onDragOver(event) {
        if (event.preventDefault) event.preventDefault();
        if (event.stopPropagation) event.stopPropagation();
        else event.cancelBubble = true;
        return false;
    }

    addEvent(selectedProducts, 'drop', onDrop);
    addEvent(selectedProducts, 'dragover', onDragOver);

    function onDrag(event) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.dropEffect = "move";
        var target = event.target || event.srcElement;
        var success = event.dataTransfer.setData('Text', target.id);
    }

    for (var i = 0; i < products.length; i++) {
        // console.log('products', products);
        var item = products[i];
        item.setAttribute("draggable", "true");
        addEvent(item, 'dragstart', onDrag);
    };
   

});

fetch('items.json')
        .then(function (response) {
            console.log('response', response);
            return response.json();
        })
        .then(function (data) {
            appendData(data);
        })
        .catch(function (err) {
            console.log('error: ' + err);
        });
    function appendData(data) {
        var mainContainer = document.getElementById("unselected-list");
        for (var i = 0; i < data.length; i++) {
            var div = document.createElement("div");
            div.innerHTML = 'Name: ' + data[i].name + ' ' + data[i].brand;
            mainContainer.appendChild(div);
        }
    }
