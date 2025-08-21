import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import AppRouter from '@/router';
import { verifyToken } from '@/store/slices/authSlice';

function App() {
  useEffect(() => {
    // Verify token on app start
    const token = localStorage.getItem('token');
    if (token) {
      store.dispatch(verifyToken());
    }
  }, []);

  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
}

export default App;
