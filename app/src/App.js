import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
function App() {
  const [income, setIncome] = useState([]);
  const [incomeform, setIncomeform] = useState({
    income: 0,
    description: "",
    date: "",
  });
  const [expenseform, setExpenseform] = useState({
    amount: 0,
    description: "",
    date: "",
  });
  const handleChange1 = (e) => {
    const { name, value } = e.target;
    setIncomeform((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleChange2 = (e) => {
    const { name, value } = e.target;
    setExpenseform((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleAddInc = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/addincome", incomeform)
      .then((res) => {
        console.log("income added successfull", res.data);
        alert("Income added successffully");
        setIncomeform({
          income: 0,
          description: "",
          date: "",
        });
        window.location.reload(); 
      })
      .catch((err) => {
        console.log(err);
        alert("error adding income");
      });
  };

  const handleAddExp = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/addexpense", expenseform)
      .then((res) => {
        console.log("Expense added successfully", res.data);
        alert("Expense added successffully");
        setExpenseform({
          amount: 0,
          description: "",
          date: "",
        });
        window.location.reload(); 
      })
      .catch((err) => {
        console.log(err);
        alert("error adding expense");
      });
  };

  const [expense, setExpense] = useState([]);
  useEffect(() => {
    fetchIncome();
    fetchExpense();
  }, []);
  function fetchIncome() {
    axios
      .get("http://localhost:8080/income")
      .then((res) => {
        setIncome(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log("error fetching income", err);
      });
  }
  function fetchExpense() {
    axios
      .get("http://localhost:8080/expense")
      .then((res) => {
        setExpense(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log("error fetching expense", err);
      });
  }

  const removeExpense = (id) => {
    axios
      .delete(`http://localhost:8080/removeexpense/${id}`)
      .then(() => {
        fetchExpense();
        // fetchTotalIncome();
      })
      .catch((error) => {
        console.error("Error removing expense:", error);
      });
  };

  const removeIncome = (id) => {
    axios
      .delete(`http://localhost:8080/removeincome/${id}`)
      .then(() => {
        fetchIncome();
        // fetchTotalIncome();
      })
      .catch((error) => {
        console.error("Error removing expense:", error);
      });
  };
  const calculateTotalincome = () => {
    const totalIncome = income.reduce(
      (acc, curr) => acc + parseFloat(curr.income),
      0
    );
    if (totalIncome === 0) {
      return 0;
    }
    const totalExpense = expense.reduce(
      (acc, curr) => acc + parseFloat(curr.amount),
      0
    );
    return totalIncome - totalExpense;
  };
  const calculateTotalexpense = () => {
    return expense.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  };

  return (
    <>
      <h2 className="header">Expense tracker</h2>
      <div className="flex-container">
        <div className="add-income">
          <h5>Add Income</h5>
          <form onSubmit={handleAddInc}>
            <div>
              <label>
                <input
                  type="number"
                  name="income"
                  value={incomeform.income}
                  onChange={handleChange1}
                  required
                />
              </label>
              <label>
                <input
                  type="text"
                  name="description"
                  value={incomeform.description}
                  onChange={handleChange1}
                  required
                />
              </label>
              <label>
                <input
                  type="date"
                  name="date"
                  value={incomeform.date}
                  onChange={handleChange1}
                  required
                />
              </label>
              <button className="add-btn" type="submit">
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </form>
        </div>
        <div className="add-expense">
          <h5>Add Expenses</h5>
          <form onSubmit={handleAddExp}>
            <div>
              <label>
                <input
                  type="number"
                  name="amount"
                  value={expenseform.amount}
                  onChange={handleChange2}
                  required
                />
              </label>
              <label>
                <input
                  type="text"
                  name="description"
                  value={expenseform.description}
                  onChange={handleChange2}
                  required
                />
              </label>
              <label>
                <input
                  type="date"
                  name="date"
                  value={expenseform.date}
                  onChange={handleChange2}
                  required
                />
              </label>
              <button className="add-btn" type="submit">
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="flex-container">
        <div className="income-list">
          <h3>Income:</h3>
          <ul className="income-list">
            {income.map((inc) => (
              <li key={inc.id} className="income-item">
                <span className="income-item-description">
                  {inc.description}
                </span>
                <span className="income-item-amount">Rs {inc.income}</span>
                <span
                  className="delete-icon"
                  onClick={() => removeIncome(inc.id)}
                >
                  <i className="fas fa-trash-alt"></i>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="expense-list">
          <h3>Expenses:</h3>
          <ul className="expense-list">
            {expense.map((exp) => (
              <li key={exp.id} className="expense-item">
                <span className="expense-item-description">
                  {exp.description}
                </span>
                <span className="expense-item-amount">Rs {exp.amount}</span>
                <span
                  className="delete-icon"
                  onClick={() => removeExpense(exp.id)}
                >
                  <i className="fas fa-trash-alt"></i>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="total-income">
        <h3>Remaing Balance:</h3>
        <p>Rs {calculateTotalincome()}</p>
        <h3>Total Expense Spent:</h3>
        <p>Rs {calculateTotalexpense()}</p>
      </div>
    </>
  );
}

export default App;
