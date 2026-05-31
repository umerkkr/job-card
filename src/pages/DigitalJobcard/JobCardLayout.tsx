const JobCardLayout = ({ title, children, isUrdu, setIsUrdu }: any) => {
  const toggleLanguage = () => {
    setIsUrdu(!isUrdu);
  };

  const handleLogout = () => {
    window.localStorage.removeItem("jobcard-auth");
    window.dispatchEvent(new Event("jobcard-auth-change"));
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f9fa_0%,#eef3f6_100%)] px-2 py-3 text-[11px]">
      <div className="mx-auto max-w-[1200px]">
        <div className="sticky top-2 z-20 mb-3 rounded-[22px] border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur">
          <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleLanguage}
                className="rounded-xl border border-green-200 bg-green-50 px-4 py-2 text-xs font-black text-green-800 transition hover:bg-green-100"
              >
                {isUrdu ? "Switch to English" : "Switch to Urdu"}
              </button>
            </div>

            <div className="text-center">
              <div className="text-[13px] font-black tracking-[0.22em] text-green-700">
                PAKISTAN CABLES LIMITED
              </div>
              <div className="text-[20px] font-black leading-tight text-slate-950">
                {title}
              </div>
            </div>

            <div className="flex items-center justify-start gap-2 md:justify-end">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-right text-[10px] font-bold leading-tight text-slate-500">
                Print Date: 4/6/2026 11:43:30 AM
                <br />
                Printed by: ABC USER
              </div>
              <button
                onClick={handleLogout}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 transition hover:border-green-300 hover:text-green-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-[26px] border border-slate-200 bg-white p-3 shadow-xl md:p-5">
          {children}
        </div>
      </div>
    </div>
  );
};

export default JobCardLayout;
