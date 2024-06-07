import Home from "./Home";

test('renders welcome to expense tracker', () => {
  render (<Home />)
  expect(screen.getByText('Welcome to Expense Tracker')).toBeInTheDocument()
})

test('renders p tag', () => {
  render (<Home />)
  expect(screen.getByText('A simple tool to manage your expenses efficiently.')).toBeInTheDocument()
})

test('renders View Your Expenses', () => {
  render (<Home />)
  expect(screen.getByText('View Your Expenses')).toBeInTheDocument()
})