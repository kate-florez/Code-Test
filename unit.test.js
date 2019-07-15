const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');

jest
    .dontMock('fs');
    

function addEvent(element, event, delegate) {
    if (typeof (window.event) != 'undefined' && element.attachEvent)
        element.attachEvent('on' + event, delegate);
    else
        element.addEventListener(event, delegate, false);
}

const sum = require('./script');

document.documentElement.innerHTML = html;

it('menu wrapper exists', function () {
    console.log(document.getElementById('wrapper'));
    expect(document.getElementById('wrapper')).toBeTruthy();
});

test('adds 1 + 2 to equal 3', () => {
    // document.documentElement.innerHTML = html;
    addEvent(document, 'readystatechange', function () {
        document.getElementById('selected-list').querySelector('ul').innerHTML =
        '<li id="1" data-name="Ashwagandha" data-price="15.99" data-brand="plnt" draggable="true" on-click="console.log(`red`);"><span>Ashwagandha by plnt - 15.99</span></li>';
        console.log('update cart');
        updateCart().toHaveBeenCalled;

        let total = document.querySelectorAll("#selected-list span.total")[0].text();
        console.log('total is', total);
        expect(sum(1, 2)).toBe(10);
    });
});