import NavBar from "../../components/NavBar";

export default async function MainLayout({ children }) {
  return (
    <div>
      <NavBar />
      <div className="flex justify-center pt-16 sm:pt-6">
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
