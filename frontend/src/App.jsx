import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { ModalProvider } from "./context/ModalContext";
import { ProfileProvider } from "./context/ProfileContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";

// Secondary pages are only downloaded when a visitor opens them, keeping the
// first render of the support home page responsive.
const OrderStatus = lazy(() => import("./pages/OrderStatus"));
const ReturnsRefunds = lazy(() => import("./pages/ReturnsRefunds"));
const MyTickets = lazy(() => import("./pages/MyTickets"));
const Profile = lazy(() => import("./pages/Profile"));

function PageLoader({ children }) {
  return <Suspense fallback={<div className="route-loading" aria-live="polite">Loading page&hellip;</div>}>{children}</Suspense>;
}

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
                  <Route path="/order-status" element={<PageLoader><OrderStatus /></PageLoader>} />
                  <Route path="/returns-refunds" element={<PageLoader><ReturnsRefunds /></PageLoader>} />
                  <Route path="/my-tickets" element={<PageLoader><MyTickets /></PageLoader>} />
                  <Route path="/profile" element={<PageLoader><Profile /></PageLoader>} />
                </Route>
              </Routes>
            </BrowserRouter>
          </ModalProvider>
        </ToastProvider>
      </ProfileProvider>
    </ThemeProvider>
  );
}
