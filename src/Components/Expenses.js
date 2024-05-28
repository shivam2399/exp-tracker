import React ,{ useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../Store/auth';


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
  }, [userId]);

   
  const handleLogout = () => {
    dispatch(authActions.logout());
    navigate('/')
  }

  const totalAmount = useMemo(() => {
    return expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
  }, [expenses]);

  const handleActivatePremium = () => {
    alert('Premium Activated!');
  };


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
        <h2>{isEditing ? 'Edit Expense' : 'Add Expense'}</h2>
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
          <button type="submit">{isEditing ? 'Update Expense' : 'Add Expense'}</button>
        </form>
      </div>
      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {totalAmount >= 10000 && (
          <button onClick={handleActivatePremium} style={{ padding: '10px 20px', backgroundColor: 'gold', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Activate Premium
          </button>
        )}
      </div>
      <div>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {expenses.map((expense) => (
            <li key={expense.id} style={{ marginBottom: '15px', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ marginBottom: '10px' }}>
                <strong>Amount:</strong> {expense.amount}
              </div>
              <div style={{ marginBottom: '10px' }}>
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