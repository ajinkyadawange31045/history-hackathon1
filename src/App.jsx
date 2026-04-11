import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ArchiveApp } from './components/ArchiveApp';
import { DetailPage } from './components/DetailPage';
import data from './data/archive.json';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ArchiveApp data={data} />} />
        <Route path="/document/:id" element={<DetailPage documents={data?.documents || []} />} />
      </Routes>
    </Router>
  );
}

export default App;
