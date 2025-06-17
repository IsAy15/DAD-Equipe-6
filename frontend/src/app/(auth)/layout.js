import AppearanceSettings from "@/components/AppearanceSettings";
export default async function AuthLayout({ children }) {
  return (
    <div>
      <header className="fixed w-full z-50">
        <AppearanceSettings />
      </header>
      {children}
    </div>
  );
}
