"use client";
import { LoginPage, RegisterPage } from "../ui";

type ContentType = "login" | "register";

interface AuthContainerProps {
  type: ContentType;
  header: string;
  description: string;
}

export function AuthContainer({
  type,
  header,
  description,
}: AuthContainerProps) {
  const renderContent = () => {
    switch (type) {
      case "login":
        return <LoginPage />;
      case "register":
        return <RegisterPage />;

      default:
        return null;
    }
  };

  return (
    <section className="mx-auto max-h-[700px] overflow-auto no-scrollbar w-full max-w-xl bg-white/90 py-6 px-6 rounded-xl shadow-lg backdrop-blur-sm">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{header}</h1>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      {renderContent()}
    </section>
  );
}
