/*
 * Watch this tutorial on YouTube
 * https://youtu.be/fIR3isyFV8s
 */

const resizeBtn = document.querySelector("[data-resize-btn]");

resizeBtn.addEventListener("click", function (e) {
  e.preventDefault();
  document.body.classList.toggle("sb-expanded");
});

document.getElementById('exampel').addEventListener('click', function () {
  window.location.href = 'classroomex.html';
});

const monthYearElement = document.getElementById('monthYear')
const datesElement = document.getElementById('dates')
const prevBtn = document.getElementById('prevBtn')
const nextBtn = document.getElementById('nextBtn')

let currentDate =new Date();

const updateCalender = () => {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const firstday = new Date(currentYear, currentMonth, 0);
  const lastDay = new Date(currentYear, currentMonth +1, 0);
  const totalDays = lastDay.getDate();
  const firstDayIndex = firstday.getDate();
  const lastDayIndex = lastDay.getDay();

  const monthYearString = currentDate.toLocaleString
  ('default', {month: 'long', year: 'numeric'});
  monthYearElement.textContent = monthYearString

  let datesHTML = '';

  for(let i = firstDayIndex; i > 0; i--) {
    const prevDate = new Date(currentYear, currentMonth, 0 - i + 1);
    datesHTML += `<div class="date inactive">${prevDate.getDate()}</div>`;
  }

  for(let i = 1; i <= totalDays; i++) {
    const date = new Date(currentYear, currentMonth, i);
    const activeClass = new date.toDateString() == new Date().toDateString() ? 'active' : '';
    datesHTML += `<div class="date ${activeClass}">${i}</div>`;
  }

  for(let i = 1; i <= 7 - lastDayIndex; i++) {
    const nextDate = new Date(currentYear, currentMonth, + 1, i);
    datesHTML += `<div class="date inactive">${nextDate.getDate()}</div>`;
  }

  datesElement.innerHTML =datesHTML
}

prevBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  updateCalender();
})

nextBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  updateCalender();
})

updateCalender();