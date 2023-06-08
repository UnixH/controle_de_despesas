// Getting references to HTML elements
let balance = document.getElementById('balance');
let money_plus = document.getElementById('money-plus');
let money_minus = document.getElementById('money-minus');
let list = document.getElementById('transactions');
let form = document.getElementById('form');
let textInput = document.getElementById('text');
let amountInput = document.getElementById('amount');
let categoryInput = document.getElementById('category');

let filterType = document.getElementById('filter-type');
let filterCategory = document.getElementById('filter-category');

// Getting stored transactions from local storage
let transactions = JSON.parse(localStorage.getItem('transactions')) != null ? 
                  JSON.parse(localStorage.getItem('transactions')) : [];

// Function to generate a random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Function to add a new transaction
function addTransaction(e) {
  e.preventDefault();
  if (textInput.value.trim() === '' || amountInput.value.trim() === '') {
    alert('Por favor, preencha o nome e o valor da transação.');
  } else {
    const transaction = {
      id: generateID(),
      text: textInput.value,
      amount: +amountInput.value,
      category: categoryInput.value
    };
    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();
    textInput.value = '';
    amountInput.value = '';
    categoryInput.value = '';
  }
}

// Function to remove a transaction
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

// Function to add transactions to the DOM
function addTransactionDOM(transaction) {
  // Classify if income or expense
  const type = transaction.amount > 0 ? '+' : '-';
  const item = document.createElement('li');
  // Add class based on type
  item.classList.add(transaction.amount > 0 ? 'plus' : 'minus');
  item.innerHTML = `
    ${transaction.text} <span>${type}${formatToCurrency(Math.abs(transaction.amount))}</span> <span>${transaction.category}</span> <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;
  list.appendChild(item);
}

// Update balance, income and expense
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
  const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);
  balance.innerText = `R$${formatToCurrency(total)}`;
  money_plus.innerText = `R$${formatToCurrency(income)}`;
  money_minus.innerText = `R$${formatToCurrency(expense)}`;
}

// Function to update local storage transactions
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Function to format numbers as money
function formatToCurrency(amount) {
  return amount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

// Event listeners for filter changes
filterType.addEventListener('change', filterTransactions);
filterCategory.addEventListener('change', filterTransactions);

// Function to filter transactions based on user selection
function filterTransactions() {
  let type = filterType.value; // 'all', 'income', 'expense'
  let category = filterCategory.value;

  let filteredTransactions = transactions;

  // Filter based on type
  if (type !== 'all') {
    filteredTransactions = filteredTransactions.filter(transaction => 
      type === 'income' ? transaction.amount > 0 : transaction.amount < 0
    );
  }

  // Filter based on category
  if (category !== 'all') {
    filteredTransactions = filteredTransactions.filter(transaction => transaction.category === category);
  }

  // Clear current transactions from DOM
  list.innerHTML = '';

  // Add filtered transactions to DOM
  filteredTransactions.forEach(addTransactionDOM);
}

// Init app
function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

form.addEventListener('submit', addTransaction);
