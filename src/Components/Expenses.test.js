import Expenses from "./Expenses"


test('renders Home', () => {
    render (<Expenses />)
    expect(screen.getByText('Home')).toBeInTheDocument()
  })
  
  test('renders About us', () => {
    render (<Expenses />)
    expect(screen.getByText('About us')).toBeInTheDocument()
  })
  
  test('renders Expenses', () => {
    render (<Expenses />)
    expect(screen.getByText('Expenses')).toBeInTheDocument()
  })
  
  test('renders Activate Premium', () => {
    render (<Expenses />)
    expect(screen.getByText('Activate Premium')).toBeInTheDocument()
  })
  
  test('renders Download Expenses as CSV', () => {
    render (<Expenses />)
    expect(screen.getByText('Download Expenses as CSV')).toBeInTheDocument()
  })
  
  test('renders Edit', () => {
    render (<Expenses />)
    expect(screen.getByText('Edit')).toBeInTheDocument()
  })
  
  test('renders Delete', () => {
    render (<Expenses />)
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })