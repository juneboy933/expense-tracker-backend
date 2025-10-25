const { readDB, writeDB } = require('../utils/db');
const crypto = require('crypto');

// GET all expenses
const getExpenses = () => {
   const db = readDB();
   const expenses = db.expenses || [];
   const sortedExpenses = expenses.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
   return {success: true, expenses: sortedExpenses};
}

// GET an expense
const getExpense = (id) => {
   // Access the db
   const db = readDB();
   // Access the expense
   const expenses = db.expenses || [];
   const expense = expenses.find(e => e.id === id);
   if(!expense){
      return {success: false, message: 'Expense not found.'};
   }
   return {success: true, expense: expense};
}

// POST a new expense
const createExpense = (title, category, amount) => {
   // Access the db
   const db = readDB();
   const expenses = db.expenses || [];

   // validate the inputs
   if(!title.trim()) return {success: false, message: 'Title is required.'};
   if(!category.trim()) return {success: false, message: 'Category is required.'};
   if(!amount || isNaN(amount) || amount < 0) return {success: false, message: 'Invalid amount.'};

   // create a new expense
   const newExpense = {
      id: crypto.randomUUID(),
      title: title.trim(),
      category: category.trim(),
      amount: parseFloat(amount),
      createdAt: new Date().toISOString(),
      updatedAt: null
   }

   // push new expense
   expenses.push(newExpense);
   db.expenses = expenses

   // write to our db
   writeDB(db);
   return {success: true, message: 'Expense added successfully', expense:newExpense};
}

// update an expense
const updateExpense = (id, updatedFields) => {
   const db = readDB();
   const expenses = db.expenses || [];
   const index = expenses.findIndex(e => e.id === id);
   if(index === -1){
      return {success: false, message: 'Expense not found'};
   }

   if(updatedFields.amount && (isNaN(updatedFields.amount) || updatedFields.amount < 0)) {
      return {success: false, message: 'Invalid amount.'}
   }

   expenses[index] = {
      ...expenses[index],
      ...updatedFields,
      updatedAt: new Date().toISOString()
   }

   db.expenses = expenses;
   writeDB(db);
   return {success: true, message: 'Expense updated successfully', expense:expenses[index]};
}

// DELETE an expense
const deleteExpense = (id) => {
   const db = readDB();
   const expenses = db.expenses || [];
   
   // check if the expense exists
   const index = expenses.findIndex(e => e.id === id);
   if(index === -1){
      return {success: false, message: 'Expense not found'};
   }

   // delete the expense
   const deletedExpense = expenses.splice(index, 1)[0];

   db.expenses = expenses;
   writeDB(db);
   return {success: true, message: 'Expense deleted successfully', expense: deletedExpense};
}

module.exports = { getExpense, getExpenses, createExpense, updateExpense, deleteExpense};