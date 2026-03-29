const today = new Date().toISOString().split("T")[0];

let habits = JSON.parse(localStorage.getItem("habits")) || [];

function save() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

function getDaysInMonth(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), 1);
  const days = [];
  while (d.getMonth() === date.getMonth()) {
    days.push(d.toISOString().split("T")[0]);
    d.setDate(d.getDate() + 1);
  }
  return days;
}

function calcStreak(dates) {
  let streak = 0;
  const days = Object.keys(dates).sort((a,b) => b.localeCompare(a)); // от сегодня назад
  for (let day of days) {
    if (dates[day]) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function render() {
  const list = document.getElementById("habitList");
  const stats = document.getElementById("stats");

  list.innerHTML = "";

  let doneCount = 0;
  const monthDays = getDaysInMonth(new Date());

  habits.forEach((habit, index) => {
    const isDoneToday = habit.dates && habit.dates[today];
    if (isDoneToday) doneCount++;

    const li = document.createElement("li");

    const topRow = document.createElement("div");
    topRow.className = "top-row";

    const span = document.createElement("span");
    span.textContent = habit.text;
    if (isDoneToday) span.classList.add("done");

    const actions = document.createElement("div");
    actions.className = "actions";

    const doneBtn = document.createElement("button");
    doneBtn.textContent = "✓";
    doneBtn.className = "small-btn";
    doneBtn.onclick = () => toggleHabit(index);

    const delBtn = document.createElement("button");
    delBtn.textContent = "✕";
    delBtn.className = "small-btn";
    delBtn.onclick = () => deleteHabit(index);

    actions.appendChild(doneBtn);
    actions.appendChild(delBtn);

    topRow.appendChild(span);
    topRow.appendChild(actions);

    li.appendChild(topRow);

    // Стрик
    const streak = calcStreak(habit.dates || {});
    const streakDiv = document.createElement("div");
    streakDiv.className = "streak";
    streakDiv.textContent = "Стрик: " + streak + " дней";
    li.appendChild(streakDiv);

    // Мини-календарь месяца
    const calDiv = document.createElement("div");
    calDiv.className = "calendar";
    monthDays.forEach(day => {
      const dayDiv = document.createElement("div");
      dayDiv.className = "calendar-day";
      if (habit.dates && habit.dates[day]) {
        dayDiv.classList.add("done");
      }
      dayDiv.title = day;
      calDiv.appendChild(dayDiv);
    });
    li.appendChild(calDiv);

    list.appendChild(li);
  });

  stats.textContent = `${doneCount} / ${habits.length} выполнено`;
}

function addHabit() {
  const input = document.getElementById("habitInput");
  const text = input.value.trim();
  if (!text) return;

  habits.push({ text, dates: {} });
  input.value = "";
  input.focus();

  save();
  render();
}

function toggleHabit(index) {
  if (!habits[index].dates) habits[index].dates = {};
  habits[index].dates[today] = !habits[index].dates[today];

  save();
  render();
}

function deleteHabit(index) {
  if (confirm("Удалить привычку?")) {
    habits.splice(index, 1);
    save();
    render();
  }
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark"));
}

if (localStorage.getItem("theme") === "true") document.body.classList.add("dark");

document.getElementById("habitInput")
  .addEventListener("keydown", e => {
    if (e.key === "Enter") addHabit();
  });

document.getElementById("today").textContent = "Сегодня: " + today;

render();
