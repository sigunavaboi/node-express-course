const toCurrency = new Intl.NumberFormat('ru-RU', {
  currency: 'rub',
  style: 'currency'
}).format;

document.querySelectorAll('.price').forEach(el => {
  el.textContent = toCurrency(el.textContent);
});

const $cart = document.querySelector('#cart');
if ($cart) {
  $cart.addEventListener('click', (event) => {
    if (event.target.classList.contains('js-remove')) {
      const id = event.target.dataset.id;

      fetch('/cart/remove/' + id, {
        method: 'DELETE',
      }).then(res => res.json())
      .then(cart => {
        if (cart.courses.length) {
          const html = cart.courses.map((c) => `
          <tr>
            <td>${c.title}</td>
            <td>${c.count}</td>
            <td>
              <button class="btn btn-small js-remove" data-id="${c.id}">Remove</button>
            </td>
          </tr>
          `).join('');
          $cart.querySelector('tbody').innerHTML = html;
          $cart.querySelector('.price').innerHTML = toCurrency(cart.price);
        } else {
          $cart.innerHTML = '<p>Empty Cart<p>';
        }
      });
    }
  });
}