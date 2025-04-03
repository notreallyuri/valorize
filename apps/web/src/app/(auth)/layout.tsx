import { AuthContainer } from "@/components/(Auth)/Auth-container";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-white">
      <div className="absolute h-1/4 w-screen -translate-y-3/5 -skew-y-4 bg-gradient-to-br from-blue-600 to-indigo-500 opacity-75" />
      <AuthContainer>{children}</AuthContainer>
      <div className="absolute bottom-0 h-1/4 w-screen translate-y-3/5 -skew-y-4 bg-gradient-to-br from-indigo-500 to-blue-600 opacity-75" />
    </main>
  );
}
