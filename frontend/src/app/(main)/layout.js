import NavBar from "../../components/NavBar";

export default async function MainLayout({ children }) {
  return (
    <div>
      <NavBar />
      <div className="p-6">{children}</div>
    </div>
  );
}
