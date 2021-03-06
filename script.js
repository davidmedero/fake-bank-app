'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const timeOutModal = document.querySelector('.time-out-modal');
const timeOutModalBtn = document.querySelector('.time-out-button');
const labelModalTimer = document.querySelector('.modal-timer');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatCurrency = function(acc) {
  const money = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(acc);
  return money;
}

const formatMovementDate = function(date) {
    const calcDaysPassed = (date1, date2) =>
      Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

    const daysPassed = calcDaysPassed(new Date(), date);

    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: '2-digit',
      year: 'numeric'
    };
    
    const locale = navigator.language;

    if (daysPassed === 0) return `Today at ${new Date().toLocaleString(locale, { hour: 'numeric', minute: 'numeric', hour12: true })}`;
    if (daysPassed === 1) return `Yesterday at ${new Date().toLocaleString(locale, { hour: 'numeric', minute: 'numeric', hour12: true })}`;
    else {
      return new Intl.DateTimeFormat(locale, options).format(date);
    }
}

const displayMovements = function(acc, sort = false) {
    containerMovements.innerHTML = '';

    const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

    movs.forEach(function (mov, i) {
        const type = mov > 0 ? 'deposit' : 'withdrawal';

        const date = new Date(acc.movementsDates[i]);
        const displayDate = formatMovementDate(date);

        const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formatCurrency(mov)}</div>
        </div>
        `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
    })
}

const createUsernames = function (accs) {
    accs.forEach(function(acc) {
    acc.username = acc.owner
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join(''); 
    })
}

createUsernames(accounts);

const calcDisplayBalance = function(acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${formatCurrency(acc.balance)}`;
}

const calcDisplaySummary = function (acc) {
    const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = `${formatCurrency(incomes)}`;

    const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = `${formatCurrency(Math.abs(out))}`;

    const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
    labelSumInterest.textContent = `${formatCurrency(interest)}`
}

const updateUI = function(acc) {
    displayMovements(acc);

    calcDisplayBalance(acc);

    calcDisplaySummary(acc);
}

const startModalTimer = function () {

  const tick = function () {

    const min = String(Math.trunc(modalTime / 60)).padStart(2, 0);
    const sec = String(modalTime % 60).padStart(2, 0);

    labelModalTimer.textContent = `${min}:${sec}`;

    if (modalTime === 0) {
      timeOutModal.classList.add('show-modal');
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    modalTime--;
  }

    let modalTime = 10;

    tick();
    const modalTimer = setInterval(tick, 1000);

    return modalTimer;
}

let modalTimer;

const startLogOutTimer = function () {

  const tick = function () {

    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      timeOutModal.classList.remove('show-modal');
      clearInterval(modalTimer);
      modalTimer = startModalTimer();
    }
  
    time--;

  }

    let time = 300;

    tick();
    const timer = setInterval(tick, 1000);

    return timer;
}

timeOutModalBtn.addEventListener('click', function () {
  timeOutModal.classList.add('show-modal');
  clearInterval(modalTimer);
  clearInterval(timer);
  timer = startLogOutTimer();
})


let currentAccount, timer;



btnLogin.addEventListener('click', function(e) {
    e.preventDefault();

    timer = startLogOutTimer();

    currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

    if (currentAccount?.pin === Number(inputLoginPin.value)) {
      console.log('LOGIN')

      labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;

      containerApp.style.opacity = 100;

      const now = new Date();
        const options = {
        hour: 'numeric',
        minute: 'numeric',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      };

      const locale = navigator.language;

      labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now);

      inputLoginUsername.value = inputLoginPin.value = "";

      inputLoginUsername.blur();
      inputLoginPin.blur();

      updateUI(currentAccount);
    }
})

btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);

  inputTransferAmount.value = inputTransferTo.value = '';

  if(amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username) {
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date());
    receiverAcc.movements.push(amount);
    receiverAcc.movementsDates.push(new Date());
    updateUI(currentAccount);

    clearInterval(timer);
    timer = startLogOutTimer();
  };
})

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
})

btnLoan.addEventListener('click', function(e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    alert("Please wait as we process your loan ??????");

    setTimeout(function () {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date());
    updateUI(currentAccount);
    alert("Success!!! ????");
    }, 5000);
    clearInterval(timer);
    timer = startLogOutTimer();
  }

  inputLoanAmount.value = "";
})

let sorted = false;
btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
})


  // localStorage.setItem("store", JSON.stringify(currentAccount));
  // console.log(localStorage);

  // const data = localStorage.getItem("store");

  // if (data) {
  //   updateUI(currentAccount) = data;
  // }


