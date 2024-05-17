import React ,{ useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import AuthContext from '../Store/auth-context'

const Expenses = () => {
  const authCtx = useContext(AuthContext)
  const [expenses, setExpenses] = useState([])
  const [expenseData, setExpenseData] = useState({
    amount: '',
    description: '',
    category: ''
  });

  const handleChange = (e) => {
    const {name, value} = e.target
    setExpenseData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  const newExpense = { ...expenseData };

  try {
    const response = await fetch('https://expense-tracker-694de-default-rtdb.asia-southeast1.firebasedatabase.app/expenses.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newExpense)
    });

    if (!response.ok) {
      throw new Error('Failed to send expense data');
    }

    const data = await response.json();
    setExpenses((prevExpenses) => [...prevExpenses, { ...newExpense, id: data.name }]);
    setExpenseData({ amount: '', description: '', category: '' });
  } catch (error) {
    console.error('Error:', error);
  }
};

const fetchExpenses = async () => {
    try {
      const response = await fetch('https://expense-tracker-694de-default-rtdb.asia-southeast1.firebasedatabase.app/expenses.json');

      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }

      const data = await response.json();
      const loadedExpenses = [];

      for (const key in data) {
        loadedExpenses.push({
          id: key,
          amount: data[key].amount,
          description: data[key].description,
          category: data[key].category
        });
      }

      setExpenses(loadedExpenses);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

   
  const handleLogout = () => {
    authCtx.logout()
  }


  return (
    <>
     <nav style={{ backgroundColor: '#333', color: '#fff', padding: '10px 20px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ height: '40px', marginRight: '20px' }}>Expense Tracker</h1>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', marginRight: '20px' }}>Home</Link>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', marginRight: '20px' }}>About Us</Link>
          <Link to="/expenses" style={{ color: '#fff', textDecoration: 'none', marginRight: '20px' }}>Expenses</Link>
        </div>
        <div>
          <button onClick={handleLogout}>Log out</button>
        </div>
      </nav>
      <div style={{ margin: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2>Add Expense</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
            <label htmlFor="amount" style={{ marginRight: '10px' }}>Amount:</label>
            <input type="text" id="amount" name="amount" value={expenseData.amount} onChange={handleChange} style={{ marginRight: '10px' }} />
          </div>
          <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
            <label htmlFor="description" style={{ marginRight: '10px' }}>Description:</label>
            <input type="text" id="description" name="description" value={expenseData.description} onChange={handleChange} style={{ marginRight: '10px' }} />
          </div>
          <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
            <label htmlFor="category" style={{ marginRight: '10px' }}>Category:</label>
            <select id="category" name="category" value={expenseData.category} onChange={handleChange} style={{ marginRight: '10px' }}>
              <option value="">Select category</option>
              <option value="Food">Food</option>
              <option value="Transportation">Transportation</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Utilities">Utilities</option>
            </select>
          </div>
          <button type="submit">Add Expense</button>
        </form>
      </div>
        <div>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
             {expenses.map((expense, index) => (
             <li key={index} style={{ marginBottom: '15px', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ marginBottom: '10px' }}>
               <strong>Amount:</strong> {expense.amount}
              </div>
              <div style={{ marginBottom: '10px' }}>
               <strong>Description:</strong> {expense.description}
              </div>
              <div>
               <strong>Category:</strong> {expense.category}
              </div>
             </li>
           ))}
          </ul>
        </div>
    </>

  )
}

export default Expenses