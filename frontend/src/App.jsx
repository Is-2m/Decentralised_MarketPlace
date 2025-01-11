import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initializeContract } from './utils/api';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ListItem from './pages/ListItem';
import ItemPage from './pages/ItemPage';

function App() {
  useEffect(() => {
    initializeContract();
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow bg-gray-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/list-item" element={<ListItem />} />
            <Route path="/item/:id" element={<ItemPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;