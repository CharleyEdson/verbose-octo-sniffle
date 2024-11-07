import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import SecondPage from './pages/SecondPage/SecondPage';
import BudgetForm from './components/BudgetForm/BudgetForm';
import BudgetList from './components/BudgetList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/second" element={<SecondPage />} />
      </Routes>
    </Router>
  );
}

export default App;
