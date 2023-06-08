// Selecionando elementos importantes
const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const transactions = document.getElementById('transactions');

// Array de transações
let transactionsArray = JSON.parse(localStorage.getItem('transactions')) || [];

// Função para adicionar transação
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '' || isNaN(amount.value) || Number(amount.value) === 0) {
    alert('Por favor, preencha corretamente os campos de nome e valor da transação.');
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value
    };

    transactionsArray.push(transaction);

    addTransactionToDOM(transaction);
    updateValues();

    text.value = '';
    amount.value = '';

    updateLocalStorage();
  }
}

// Função para gerar um ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Função para adicionar transações ao DOM
function addTransactionToDOM(transaction) {
  const li = document.createElement('li');

  li.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  li.setAttribute('data-id', transaction.id);
  li.innerHTML = `
    ${transaction.text} <span>${transaction.amount < 0 ? '-' : '+'}${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Math.abs(transaction.amount))}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  transactions.appendChild(li);
}

// Função para atualizar o saldo, a receita e a despesa
function updateValues() {
  const amounts = transactionsArray.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0);
  const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1);

  // Utilizando o Intl.NumberFormat para formatar os valores para Reais
  balance.innerText = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total);
  money_plus.innerText = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(income);
  money_minus.innerText = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(expense);
}

// Função para remover transação
function removeTransaction(id) {
  transactionsArray = transactionsArray.filter(transaction => transaction.id !== id);

  // Removendo a transação do DOM
  const transactionElement = document.querySelector(`li[data-id="${id}"]`);  // Use o atributo data-id para encontrar a transação correta
  transactionElement.remove();

  updateValues();
  updateLocalStorage();
}

// Função para atualizar o Local Storage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactionsArray));
}

form.addEventListener('submit', addTransaction);

// Inicializando a aplicação
transactionsArray.forEach(addTransactionToDOM);
updateValues();
