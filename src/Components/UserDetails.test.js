import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import UserDetails from './UserDetails';
import * as authActions from '../Store/auth';

const mockStore = configureStore([]);

const initialState = {
  auth: { token: 'dummyToken', isLoggedIn: true },
};

let store;

beforeEach(() => {
  store = mockStore(initialState);
});

const renderWithProviders = (ui, { store } = {}) => {
  return render(
    <Provider store={store}>
      <Router>{ui}</Router>
    </Provider>
  );
};

test('renders component correctly', () => {
  renderWithProviders(<UserDetails />, { store });
  expect(screen.getByText('Winners never quit')).toBeInTheDocument();
});

test('initial state is correct', () => {
  renderWithProviders(<UserDetails />, { store });
  expect(screen.getByLabelText('Name').value).toBe('');
  expect(screen.getByLabelText('Profile Photo URL').value).toBe('');
});

test('changing name input updates state', () => {
  renderWithProviders(<UserDetails />, { store });
  
  const nameInput = screen.getByLabelText('Name');
  fireEvent.change(nameInput, { target: { value: 'John Doe' } });
  expect(nameInput.value).toBe('John Doe');
});

test('changing photo URL input updates state', () => {
  renderWithProviders(<UserDetails />, { store });
  
  const photoInput = screen.getByLabelText('Profile Photo URL');
  fireEvent.change(photoInput, { target: { value: 'http://example.com/photo.jpg' } });
  expect(photoInput.value).toBe('http://example.com/photo.jpg');
});

test('button is disabled when loading', () => {
  renderWithProviders(<UserDetails />, { store });

  fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
  fireEvent.change(screen.getByLabelText('Profile Photo URL'), { target: { value: 'http://example.com/photo.jpg' } });

  fireEvent.click(screen.getByText('Update'));

  const updateButton = screen.getByText('Update');
  expect(updateButton).toBeDisabled();
});

test('logout resets state', () => {
  renderWithProviders(<UserDetails />, { store });

  fireEvent.click(screen.getByText('Logout'));

  expect(store.getActions()).toContainEqual(authActions.logout());
  expect(screen.getByLabelText('Name').value).toBe('');
  expect(screen.getByLabelText('Profile Photo URL').value).toBe('');
});

test('handle name change function updates state', () => {
  renderWithProviders(<UserDetails />, { store });
  
  const nameInput = screen.getByLabelText('Name');
  fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
  expect(nameInput.value).toBe('Jane Doe');
});

test('handle photo URL change function updates state', () => {
  renderWithProviders(<UserDetails />, { store });
  
  const photoInput = screen.getByLabelText('Profile Photo URL');
  fireEvent.change(photoInput, { target: { value: 'http://example.com/newphoto.jpg' } });
  expect(photoInput.value).toBe('http://example.com/newphoto.jpg');
});

test('form initial state reflects userData state', () => {
  store = mockStore({
    auth: { token: 'dummyToken', isLoggedIn: true },
    user: { name: 'John Doe', photoUrl: 'http://example.com/photo.jpg' },
  });

  renderWithProviders(<UserDetails />, { store });
  
  expect(screen.getByLabelText('Name').value).toBe('John Doe');
  expect(screen.getByLabelText('Profile Photo URL').value).toBe('http://example.com/photo.jpg');
});

test('button click navigates to expenses', () => {
  const { getByText } = renderWithProviders(<UserDetails />, { store });

  fireEvent.click(getByText('Start adding expenses'));

  // Mock navigation verification
  expect(window.location.pathname).toBe('/expenses');
});
