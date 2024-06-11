import Expenses from "./Expenses"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter as Router } from 'react-router-dom';
import { themeActions } from '../Store/theme';



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

  const mockStore = configureStore([]);
const initialState = {
  auth: { email: 'test@example.com' },
  theme: { isDarkTheme: false },
};

// Mock global fetch
global.fetch = jest.fn();

const renderWithProviders = (ui, { store = mockStore(initialState) } = {}) => {
  return render(
    <Provider store={store}>
      <Router>
        {ui}
      </Router>
    </Provider>
  );
};

describe('Expenses component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('fetches and displays expenses on mount', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ '1': { amount: '50', description: 'Groceries', category: 'Food' } }),
    });

    renderWithProviders(<Expenses />);

    await waitFor(() => {
      expect(screen.getByText(/Groceries/i)).toBeInTheDocument();
    });
  });

  test('submits a new expense', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ '1': { amount: '50', description: 'Groceries', category: 'Food' } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ name: '2' }),
      });

    renderWithProviders(<Expenses />);

    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Dinner' } });
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'Food' } });

    fireEvent.click(screen.getByText(/add expense/i));

    await waitFor(() => {
      expect(screen.getByText(/Dinner/i)).toBeInTheDocument();
    });
  });

  test('edits an existing expense', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ '1': { amount: '50', description: 'Groceries', category: 'Food' } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

    renderWithProviders(<Expenses />);

    await waitFor(() => {
      expect(screen.getByText(/Groceries/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/edit/i));

    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '200' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Supermarket' } });

    fireEvent.click(screen.getByText(/update expense/i));

    await waitFor(() => {
      expect(screen.getByText(/Supermarket/i)).toBeInTheDocument();
    });
  });

  test('deletes an expense', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ '1': { amount: '50', description: 'Groceries', category: 'Food' } }),
      })
      .mockResolvedValueOnce({
        ok: true,
      });

    renderWithProviders(<Expenses />);

    await waitFor(() => {
      expect(screen.getByText(/Groceries/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/delete/i));

    await waitFor(() => {
      expect(screen.queryByText(/Groceries/i)).not.toBeInTheDocument();
    });
  });

  test('handles errors during fetch', async () => {
    fetch.mockRejectedValueOnce(new Error('Failed to fetch expenses'));

    renderWithProviders(<Expenses />);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error:', new Error('Failed to fetch expenses'));
    });
  });

  test('handles errors during submit', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ '1': { amount: '50', description: 'Groceries', category: 'Food' } }),
      })
      .mockRejectedValueOnce(new Error('Failed to send expense data'));

    renderWithProviders(<Expenses />);

    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Dinner' } });
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'Food' } });

    fireEvent.click(screen.getByText(/add expense/i));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error:', new Error('Failed to send expense data'));
    });
  });

  test('handles errors during delete', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ '1': { amount: '50', description: 'Groceries', category: 'Food' } }),
      })
      .mockRejectedValueOnce(new Error('Failed to delete expense'));

    renderWithProviders(<Expenses />);

    await waitFor(() => {
      expect(screen.getByText(/Groceries/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/delete/i));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error:', new Error('Failed to delete expense'));
    });
  });

  test('calculates total amount correctly', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ '1': { amount: '50', description: 'Groceries', category: 'Food' } }),
    });

    renderWithProviders(<Expenses />);

    await waitFor(() => {
      expect(screen.getByText(/Groceries/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Total:/i)).toHaveTextContent('50');
  });

  test('toggles theme based on total amount', async () => {
    const store = mockStore({
      auth: { email: 'test@example.com' },
      theme: { isDarkTheme: false },
    });

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ '1': { amount: '50', description: 'Groceries', category: 'Food' } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ name: '2' }),
      });

    renderWithProviders(<Expenses />, { store });

    await waitFor(() => {
      expect(screen.getByText(/Groceries/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '10000' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Car' } });
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'Transportation' } });

    fireEvent.click(screen.getByText(/add expense/i));

    await waitFor(() => {
      expect(store.getActions()).toContainEqual(themeActions.setDarkTheme());
    });
  });

  test('exports expenses to CSV', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ '1': { amount: '50', description: 'Groceries', category: 'Food' } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ name: '2' }),
      });

    renderWithProviders(<Expenses />);

    await waitFor(() => {
      expect(screen.getByText(/Groceries/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '10000' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Car' } });
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'Transportation' } });

    fireEvent.click(screen.getByText(/add expense/i));

    await waitFor(() => {
      fireEvent.click(screen.getByText(/Download Expenses as CSV/i));
    });

    expect(screen.getByText(/Download Expenses as CSV/i)).toBeInTheDocument();
  });
});