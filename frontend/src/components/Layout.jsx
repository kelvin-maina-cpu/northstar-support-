import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ContactModal from "./ContactModal";
import SettingsModal from "./SettingsModal";
import SignOutModal from "./SignOutModal";

export default function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />

      <ContactModal />
      <SettingsModal />
      <SignOutModal />
    </>
  );
}
