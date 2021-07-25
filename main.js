'use strict';
const assert = require('assert');

class BankAccount {
    accountNumber;
    owner;
    transactions;
    constructor (iAccountNumber, iOwner) {
        this.accountNumber = iAccountNumber;
        this.owner = iOwner;
        this.transactions = [];
    }

    balance () {
        let totalsArray = this.transactions.map(transaction => transaction.amount);
        return totalsArray.reduce((a, b) => a + b, 0);
    }

    isNumber (amt) {
        return typeof amt === 'number';
    }

    deposit (amt) {
        if (!this.isNumber(amt)) {
            console.log('Please enter a number');
            return 'Please enter a number';
        }

        if (amt > 0) {
            this.transactions.push(new Transaction(amt, 'Deposit'));
        } else {
            console.log('You cannot deposit a negative amount');
            return 'You cannot deposit a negative amount';
        }
    }

    charge (payee, amt) {
        if (!this.isNumber(amt)) {
            console.log('Please enter a number');
            return 'Please enter a number';
        }

        if (this.balance() - amt >= 0) {
            this.transactions.push(new Transaction(-Math.abs(amt), payee));
        } else {
            console.log('You do not have enough funds to process this transaction');
            return 'You do not have enough funds to process this transaction';
        }
    }
}

class Transaction {
    date;
    amount;
    payee;
    constructor (iAmount, iPayee) {
        this.date = new Date();
        this.amount = iAmount;
        this.payee = iPayee;
    }
}


// Tests
if (typeof describe === 'function') {
    describe ('BankAccount', function () {
        it ('has an account number and owner.', function () {
            const bankAccountOne = new BankAccount(12345, 'Mozzie');
            assert.strictEqual(bankAccountOne.accountNumber, 12345);
            assert.strictEqual(bankAccountOne.owner, 'Mozzie');
        });

        it ('cannot deposit non-numeric values', function () {
            const bankAccountOne = new BankAccount(12345, 'Mozzie');
            assert.strictEqual(bankAccountOne.deposit('abc'), 'Please enter a number');
        });

        it ('can make a deposit, update the balance and create a new transaction.', function () {
            const bankAccountOne = new BankAccount(12345, 'Mozzie');
            bankAccountOne.deposit(50.00);
            assert.strictEqual(bankAccountOne.balance(), 50.00);
            assert.strictEqual(bankAccountOne.transactions.length, 1);
        });

        it ('cannot deposit a negative amount', function () {
            const bankAccountOne = new BankAccount(12345, 'Mozzie');
            assert.strictEqual(bankAccountOne.deposit(-50.00), 'You cannot deposit a negative amount');
        });

        it ('cannot charge non-numeric values', function () {
            const bankAccountOne = new BankAccount(12345, 'Mozzie');
            assert.strictEqual(bankAccountOne.charge('All the treats', 'abc'), 'Please enter a number');
        });

        it ('can make a charge, update the balance and create a new transaction.', function () {
            const bankAccountOne = new BankAccount(12345, 'Mozzie');
            bankAccountOne.deposit(50.00);
            bankAccountOne.charge('All the treats', 25.50);
            assert.strictEqual(bankAccountOne.balance(), 24.50);
            assert.strictEqual(bankAccountOne.transactions.length, 2);
        });

        it ('cannot process a charge if there are not enough funds', function () {
            const bankAccountOne = new BankAccount(12345, 'Mozzie');
            bankAccountOne.deposit(50.00);
            assert.strictEqual(bankAccountOne.charge('All the treats', 52.50), 'You do not have enough funds to process this transaction')
        });

        it ('correctly calculates the account balance.', function () {
            const bankAccountOne = new BankAccount(12345, 'Mozzie');
            bankAccountOne.deposit(50.00);
            bankAccountOne.charge('All the treats', 25.50);
            assert.strictEqual(bankAccountOne.balance(), 24.50);
        });
    });

    describe ('Transaction', function () {
        it ('has an amount and payee', function () {
            const transactionOne = new Transaction(50.00, 'All the treats');
            assert.strictEqual(transactionOne.amount, 50.00);
            assert.strictEqual(transactionOne.payee, 'All the treats');
        });
    });
}