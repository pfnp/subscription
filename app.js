let subs = JSON.parse(localStorage.getItem("subs") || "[]");

function save() {
  localStorage.setItem("subs", JSON.stringify(subs));
}

// расчет следующей даты
function nextDate(date, period) {
  let d = new Date(date);
  let now = new Date();

  while (d < now) {
    if (period === "month") d.setMonth(d.getMonth() + 1);
    if (period === "year") d.setFullYear(d.getFullYear() + 1);
  }
  return d;
}

// дни до списания
function daysLeft(d) {
  let diff = d - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// формат даты
function formatDate(d) {
  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long"
  });
}

// добавить
function addSub() {
  subs.push({
    id: Date.now(),
    name: name.value,
    price: +price.value,
    date: date.value,
    period: period.value
  });

  save();
  render();
}

// удалить
function remove(id) {
  subs = subs.filter(s => s.id !== id);
  save();
  render();
}

// рендер
function render() {
  list.innerHTML = "";

  let total = 0;

  subs
    .map(s => {
      let next = nextDate(s.date, s.period);
      return { ...s, next };
    })
    .sort((a, b) => a.next - b.next)
    .forEach(s => {
      total += s.price;

      let el = document.createElement("div");
      el.className = "card";

      let days = daysLeft(s.next);

      el.innerHTML = `
        <b>${s.name}</b><br>
        ${s.price} ₽<br>
        <div class="date">
          списание ${formatDate(s.next)} (${days} дней)
        </div>
        <button onclick="remove(${s.id})">Удалить</button>
      `;

      list.appendChild(el);
    });

  totalEl.innerHTML = "Всего: " + total + " ₽";
}

const list = document.getElementById("list");
const totalEl = document.getElementById("total");

render();

// PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
