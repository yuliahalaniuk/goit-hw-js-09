import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

let intervalID = 0;

const refs = {
  datePicker: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  daysEl: document.querySelector('span[data-days]'),
  hoursEl: document.querySelector('span[data-hours]'),
  minutesEl: document.querySelector('span[data-minutes]'),
  secondsEl: document.querySelector('span[data-seconds]'),
};

const calendar = flatpickr(refs.datePicker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    let userDate = selectedDates[0].getTime();
    const dateNow = Date.now();

    if (userDate < dateNow) {
      alert('Please choose a date in the future');
      refs.startBtn.disabled = true;
    } else {
      refs.startBtn.disabled = false;
    }
  },
});

refs.startBtn.addEventListener('click', () => {
  const selectedDate = calendar.selectedDates[0].getTime();
  let remainingTime = calculateRemainingTime(selectedDate);
  refs.startBtn.disabled = true;
});

function calculateRemainingTime(selDate) {
  const intervalID = setInterval(() => {
    const currentTime = Date.now();
    const timeRemaining = selDate - currentTime;

    if (timeRemaining <= 0) {
      clearInterval(intervalID);
      refs.startBtn.disabled = false;
    }

    const neededTime = convertMs(timeRemaining);
    updateUI(neededTime);
  }, 1000);
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function pad(num) {
  return num.toString().padStart(2, '0');
}

function updateUI({ days, hours, minutes, seconds }) {
  refs.daysEl.textContent = pad(days);
  refs.hoursEl.textContent = pad(hours);
  refs.minutesEl.textContent = pad(minutes);
  refs.secondsEl.textContent = pad(seconds);
}
