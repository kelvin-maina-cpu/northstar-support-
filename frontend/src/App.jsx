import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { ModalProvider } from "./context/ModalContext";
import { ProfileProvider } from "./context/ProfileContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import OrderStatus from "./pages/OrderStatus";
import ReturnsRefunds from "./pages/ReturnsRefunds";
import MyTickets from "./pages/MyTickets";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <ToastProvider>
          <ModalProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/order-status" element={<OrderStatus />} />
                  <Route path="/returns-refunds" element={<ReturnsRefunds />} />
                  <Route path="/my-tickets" element={<MyTickets />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </ModalProvider>
        </ToastProvider>
      </ProfileProvider>
    </ThemeProvider>
  );
}
