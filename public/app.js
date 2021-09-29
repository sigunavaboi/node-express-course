const toCurrency = new Intl.NumberFormat('ru-RU', {
  currency: 'rub',
  style: 'currency'
}).format;

const toDate = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
}).format;

document.querySelectorAll('.price').forEach(el => {
  el.textContent = toCurrency(el.textContent);
});

document.querySelectorAll('.date').forEach(el => {
  el.textContent = toDate(new Date(el.textContent));
});

const $cart = document.querySelector('#cart');
if ($cart) {
  $cart.addEventListener('click', (event) => {
    if (event.target.classList.contains('js-remove')) {
      const id = event.target.dataset.id;
      const csrf = event.target.dataset.csrf;

      fetch('/cart/remove/' + id, {
        method: 'DELETE',
        headers: {
          'X-XSRF-TOKEN': csrf,
        },
      }).then(res => res.json())
      .then(cart => {
        if (cart.courses.length) {
          const html = cart.courses.map((c) => `
          <tr>
            <td>${c.courseID.title}</td>
            <td>${c.count}</td>
            <td>
              <button class="btn btn-small js-remove" data-id="${c.courseID._id}">Remove</button>
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

M.Tabs.init(document.querySelectorAll('.tabs'));