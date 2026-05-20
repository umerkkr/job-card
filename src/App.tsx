import { useEffect, useMemo, useState } from "react";
import JobCardController from "./pages/DigitalJobcard/JobCardController";
import LoginPage from "./pages/Auth/LoginPage";

export type AuthUser = {
  username: string;
  crewNo: string;
};

const USERS: Array<AuthUser & { password: string }> = [
  { username: "Ali", crewNo: "C-101", password: "1234" },
  { username: "Usman", crewNo: "C-202", password: "1234" },
];

function App() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("jobcard-auth");
    if (!stored) return;

    try {
      setUser(JSON.parse(stored) as AuthUser);
    } catch {
      window.localStorage.removeItem("jobcard-auth");
    }
  }, []);

  const authApi = useMemo(
    () => ({
      login: (username: string, password: string) => {
        const found = USERS.find(
          (item) => item.username === username && item.password === password
        );

        if (!found) return false;

        const nextUser: AuthUser = {
          username: found.username,
          crewNo: found.crewNo,
        };

        window.localStorage.setItem(
          "jobcard-auth",
          JSON.stringify(nextUser)
        );
        window.dispatchEvent(new Event("jobcard-auth-change"));
        setUser(nextUser);
        return true;
      },
      logout: () => {
        window.localStorage.removeItem("jobcard-auth");
        window.dispatchEvent(new Event("jobcard-auth-change"));
        setUser(null);
      },
    }),
    []
  );

  if (!user) {
    return <LoginPage onLogin={authApi.login} users={USERS} />;
  }

  return (
    <JobCardController
      user={user}
      onLogout={authApi.logout}
    />
  );
}

export default App
