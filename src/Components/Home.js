import React ,{ useState } from 'react'
import { Link } from 'react-router-dom';


const Home = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault()
    const newExpense = {...expenseData};
    setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
    setExpenseData({ amount: '', description: '', category: '' })
  }


  return (
    <>
     <nav style={{ backgroundColor: '#333', color: '#fff', padding: '10px 20px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ height: '40px', marginRight: '20px' }}>Expense Tracker</h1>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', marginRight: '20px' }}>Home</Link>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', marginRight: '20px' }}>About Us</Link>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', marginRight: '20px' }}>Products</Link>
        </div>
        <div>
          <Link to="/signup" style={{ color: '#fff', textDecoration: 'none' }}>Sign Up</Link>
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

export default Home