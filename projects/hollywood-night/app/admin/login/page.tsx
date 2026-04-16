import LoginForm from "./_login-form";

export const metadata = { title: "Staff Entrance" };

export default function AdminLoginPage() {
  return (
    <main className="bg-stage grain min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <p className="text-center text-[11px] uppercase tracking-[0.28em] text-gold-500 mb-4">
          ◆ Restricted
        </p>
        <h1 className="text-center font-display text-4xl text-champagne mb-10">
          Staff Entrance
        </h1>
        <div className="bg-ink-800 border border-gold-500/20 shadow-card p-8">
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-ivory-faint text-[11px] uppercase tracking-[0.2em]">
          Authorized personnel only
        </p>
      </div>
    </main>
  );
}
