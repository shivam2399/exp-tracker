import React ,{ useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../Store/auth'
import { themeActions } from '../Store/theme';
import './Expenses.css';



const Expenses = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [expenses, setExpenses] = useState([])
  const [expenseData, setExpenseData] = useState({
    amount: '',
    description: '',
    category: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentExpenseId, setCurrentExpenseId] = useState(null);
  const userId = useSelector(state => state.auth.email)?.replace(/[.@]/g, '');
  const isDarkTheme = useSelector(state => state.theme.isDarkTheme)


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

    if(!userId) {
     console.error('User ID not available');
     return
    }

    try {
     const response = await fetch(`https://expense-tracker-694de-default-rtdb.asia-southeast1.firebasedatabase.app/expenses/${userId}/${isEditing ? currentExpenseId: ''}.json`, {
       method: isEditing ? 'PUT' : 'POST',
       headers: {
        'Content-Type': 'application/json'
       },
       body: JSON.stringify(newExpense)
     });

     if (!response.ok) {
      throw new Error(`Failed to ${isEditing ? 'update' : 'send'} expense data`);
    }

    const data = await response.json();
    if (isEditing) {
      setExpenses((prevExpenses) =>
        prevExpenses.map((expense) =>
          expense.id === currentExpenseId ? { ...newExpense, id: currentExpenseId } : expense
        )
      );
    } else {
      setExpenses((prevExpenses) => [...prevExpenses, { ...newExpense, id: data.name }]);
    }
    setExpenseData({ amount: '', description: '', category: '' });
    setIsEditing(false);
    setCurrentExpenseId(null);
  } catch (error) {
    console.error('Error:', error);
  }
};

const fetchExpenses = async () => {
  if (!userId) {
    console.error('User ID is not available');
    return;
  }

    try {
      const response = await fetch(`https://expense-tracker-694de-default-rtdb.asia-southeast1.firebasedatabase.app/expenses/${userId}.json`);

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

  const handleEdit = (expense) => {
    setExpenseData({
      amount: expense.amount,
      description: expense.description,
      category: expense.category
    })
    setIsEditing(true);
    setCurrentExpenseId(expense.id)
  }

  const handleDelete = async (expenseId) => {
    try {
      const response = await fetch(`https://expense-tracker-694de-default-rtdb.asia-southeast1.firebasedatabase.app/expenses/${userId}/${expenseId}.json`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }

      setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== expenseId));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchExpenses();
    }
  }, []);

   
  const handleLogout = () => {
    dispatch(authActions.logout());
    navigate('/')
  }

  const totalAmount = useMemo(() => {
    return expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
  }, [expenses]);

  const handleActivatePremium = () => {
    alert('Premium Activated!');
    dispatch(themeActions.setDarkTheme())
  };

  const toggleTheme = () => {
    dispatch(themeActions.toggleTheme())
  }

  const exportToCSV = () => {
    const csvRows = [
      ['Amount', 'Description', 'Category'],
      ...expenses.map(expense => [expense.amount, expense.description, expense.category])
    ];

    const csvContent = csvRows.map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.setAttribute('download', 'expenses.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



  return (
    <>
      <nav className="navbar">
        <div>
          <h1>Expense Tracker</h1>
          <Link to="/">Home</Link>
          <Link to="/">About Us</Link>
          <Link to="/expenses">Expenses</Link>
        </div>
        <div>
        {totalAmount >= 10000 && (
            <button className="button" onClick={toggleTheme}>
              {isDarkTheme ? 'Light Mode' : 'Dark Mode'}
            </button>
          )}
          <button onClick={handleLogout}>Log out</button>
        </div>
      </nav>
      <div className={`container ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
        <h2>{isEditing ? 'Edit Expense' : 'Add Expense'}</h2>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="amount">Amount:</label>
            <input type="text" id="amount" name="amount" value={expenseData.amount} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <input type="text" id="description" name="description" value={expenseData.description} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <select id="category" name="category" value={expenseData.category} onChange={handleChange}>
              <option value="">Select category</option>
              <option value="Food">Food</option>
              <option value="Transportation">Transportation</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Utilities">Utilities</option>
            </select>
          </div>
          <button type="submit">{isEditing ? 'Update Expense' : 'Add Expense'}</button>
        </form>
      </div>
      <div className="container">
        {totalAmount >= 10000 && (
          <button onClick={handleActivatePremium} className="premium-button">
            Activate Premium
          </button>
        )}
        {totalAmount >= 10000 && (
          <button onClick={exportToCSV} className="button">
          Download Expenses as CSV
          </button>
        )}
      </div>
      <div>
        <ul className="expense-list">
          {expenses.map((expense) => (
            <li key={expense.id} className={`expense-item ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
              <div>
                <strong>Amount:</strong> {expense.amount}
              </div>
              <div>
                <strong>Description:</strong> {expense.description}
              </div>
              <div>
                <strong>Category:</strong> {expense.category}
              </div>
              <button onClick={() => handleEdit(expense)}>Edit</button>
              <button onClick={() => handleDelete(expense.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </>

  )
}

export default Expenses