import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import FrontPage from "./pages/FrontPage";
const Home = lazy(() => import("./pages/Home"));
const Upload = lazy(() => import("./pages/Upload"));
const Admin = lazy(() => import("./pages/Admin"));
const Signin = lazy(() => import("./pages/Signin"));
const EditOrder = lazy(() => import("./pages/EditOrder"));
const EditUser = lazy(() => import("./pages/EditUser"));
function App() {
  return (
    <div className="bg-linear-to-b from-mycolor to-rose-200">
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<Signin />} />
          <Route path="/" element={<Home />} />
          {/* <Route path="/" element={<FrontPage />} /> */}
          <Route path="/upload" element={<Upload />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/editDoc/:orderId" element={<EditOrder />} />
          <Route path="/editUser/:userId" element={<EditUser />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
