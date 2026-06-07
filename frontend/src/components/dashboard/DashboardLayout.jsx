export default function DashboardLayout({ sidebar, header, children }) {
  return (
    <div className="min-h-screen bg-brand-surface">
      {sidebar}
      <div className="main-scroll flex flex-col">
        {header}
        <main className="flex-1 p-5 lg:p-6">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
