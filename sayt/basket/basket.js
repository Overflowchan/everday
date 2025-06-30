let cart = JSON.parse(localStorage.getItem("cart")) || [];
console.log(cart);

// Обновление отображения корзины
function updateCartDisplay() {
  const cartContainer = document.querySelector(".cart-items");
  const totalPriceElement = document.querySelector(".total-price");
  const checkoutBtn = document.querySelector(".checkout-btn");

  cartContainer.innerHTML = "";
  let totalPrice = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Корзина пуста</p>";
    checkoutBtn.style.display = "none";
  } else {
    cart.forEach((product) => {
      totalPrice += product.price * product.quantity;
      cartContainer.innerHTML += `
                

                  <div class="product_main_box">
                    <div class="left_img"><img src="${product.image}" alt="${product.name}"></div>

                    <div class="right_blocks">
                        <h1>${product.name}</h1>
                        <p class="desription">${product.description}</p>
                        <div class="quantity-controls">
                            <button class="decrease" data-id="${product.id}">−</button>
                            <span class="quantity">${product.quantity}</span>
                            <button class="increase" data-id="${product.id}">+</button>
                        </div>
                        <div class="price_deletBlock">
                            <p><b>Сума:</b> 10$</p>
                            <button class="remove-item" data-id="${product.id}">Удалить</button>
                        </div>
                    </div>

                </div>
            `;
    });
    checkoutBtn.style.display = "block";
  }
  totalPriceElement.textContent = totalPrice;
  attachCartEventListeners();
}

// Добавление обработчиков событий для кнопок управления корзиной
function attachCartEventListeners() {
  document.querySelectorAll(".increase").forEach((button) => {
    button.onclick = () => updateQuantity(button.dataset.id, 1);
  });
  document.querySelectorAll(".decrease").forEach((button) => {
    button.onclick = () => updateQuantity(button.dataset.id, -1);
  });
  document.querySelectorAll(".remove-item").forEach((button) => {
    button.onclick = () => removeItem(button.dataset.id);
  });
}

// Изменение количества товара
function updateQuantity(id, change) {
  const product = cart.find((p) => p.id == id);
  if (!product) return;

  product.quantity += change;
  if (product.quantity <= 0) {
    cart = cart.filter((p) => p.id != id);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartDisplay();
}

// Удаление товара из корзины
function removeItem(id) {
  cart = cart.filter((p) => p.id != id);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartDisplay();
}

// Очистка корзины
function clearCart() {
  cart = [];
  localStorage.removeItem("cart");
  updateCartDisplay();
}

// Отправка заказа в Telegram
function sendOrderToTelegram() {
  const name = document.querySelector("#customer-name").value.trim();
  const phone = document.querySelector("#customer-phone").value.trim();
  const comment = document.querySelector("#customer-comment").value.trim();

  if (!name || !phone) return alert("Введите имя и номер телефона!");

  const botToken = "6905026549:AAH-0fy_rTvYqsd7FjqB82VvuLRd0OYMoFI";
  const chatId = "@tomsk_24_7night";

  let orderMessage = `🛒 *Новый заказ:*
👤 Имя: ${name}
📞 Телефон: ${phone}
`;
  if (comment) orderMessage += `📝 Комментарий: ${comment}\n`;

  cart.forEach((product, index) => {
    orderMessage += `${index + 1}. ${product.name} - ${product.price}$ x ${
      product.quantity
    }\n`;
  });

  orderMessage += `\n💰 *Итого:* ${
    document.querySelector(".total-price").textContent
  } $`;

  fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: orderMessage,
      parse_mode: "Markdown",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.ok) {
        alert("Заказ успешно отправлен!");
        clearCart();
        document.querySelector("#customer-name").value = "";
        document.querySelector("#customer-phone").value = "";
        document.querySelector("#customer-comment").value = "";
        closeModal();
      } else {
        alert("Ошибка при отправке заказа!");
      }
    })
    .catch((error) => console.error("Ошибка:", error));
}

// Открытие/закрытие модального окна
function openModal() {
  document.getElementById("orderModal").classList.remove("hidden");
}
function closeModal() {
  document.getElementById("orderModal").classList.add("hidden");
}

// Назначение обработчиков событий
window.onload = () => {
  updateCartDisplay();
  document.querySelector(".checkout-btn").onclick = openModal;
  document.querySelector(".close").onclick = closeModal;
  document.getElementById("confirmOrder").onclick = sendOrderToTelegram;
  document.querySelector(".clear-cart").onclick = clearCart;
};
