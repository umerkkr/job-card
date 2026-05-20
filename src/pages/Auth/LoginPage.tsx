import { useState, type FormEvent } from "react";
import type { AuthUser } from "../../App";

type Props = {
  users: Array<AuthUser & { password: string }>;
  onLogin: (username: string, password: string) => boolean;
};

const LoginPage = ({ users, onLogin }: Props) => {
  const [username, setUsername] = useState(users[0]?.username ?? "");
  const [password, setPassword] = useState("1234");
  const [error, setError] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();

    const ok = onLogin(username, password);
    if (!ok) {
      setError("Invalid username or password.");
      return;
    }

    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900">
        <div className="p-10 bg-gradient-to-br from-emerald-600 via-emerald-700 to-slate-900">
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-100/80">
            Job Card Access
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight">
            Sign in with a crew number to create the next job-card line.
          </h1>
          <p className="mt-4 text-emerald-50/90">
            Two dummy users are included for testing. When a user logs out and another logs in, the production log starts a new row with that crew number.
          </p>

          <div className="mt-8 space-y-3">
            {users.map((user) => (
              <div key={user.username} className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <div className="font-bold">{user.username}</div>
                <div className="text-sm text-emerald-50/80">Crew No: {user.crewNo}</div>
                <div className="text-xs text-emerald-50/60">Password: {user.password}</div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={submit} className="p-10 bg-slate-900">
          <h2 className="text-2xl font-black">Login</h2>
          <p className="mt-2 text-sm text-slate-400">Select a dummy user and enter the password.</p>

          <label className="block mt-6 text-sm font-semibold text-slate-300">
            Username
            <select
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 w-full rounded-2xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none"
            >
              {users.map((user) => (
                <option key={user.username} value={user.username}>
                  {user.username}
                </option>
              ))}
            </select>
          </label>

          <label className="block mt-4 text-sm font-semibold text-slate-300">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none"
              placeholder="1234"
            />
          </label>

          {error && <div className="mt-4 text-sm text-red-400">{error}</div>}

          <button
            type="submit"
            className="mt-8 w-full rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 transition-colors"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
