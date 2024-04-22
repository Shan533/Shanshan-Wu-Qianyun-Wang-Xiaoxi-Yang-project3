import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Spinner from "./components/Spinner";
import Home from "./pages/Home";

function App() {
  const { loading } = useSelector((state) => state.loaders);

  return (
    <>
      {loading && <Spinner />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
