import Header from "./Header";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <Navbar />
      <main>{children}</main>
    </>
  );
}
