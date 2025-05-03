import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Upload from "./pages/Upload";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from 'sonner';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <Toaster richColors position="top-center" />
            <Upload />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
