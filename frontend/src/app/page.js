import SearchOrder from "@/components/SearchOrder";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 blur-3xl rounded-full" />

        <div className="absolute top-40 right-0 w-96 h-96 bg-purple-600/10 blur-3xl rounded-full" />

      </div>

      <div className="relative max-w-6xl mx-auto px-5 py-14 md:py-20">

        <div className="text-center mb-10">

          <span className="inline-block text-blue-400 text-sm font-semibold tracking-widest uppercase mb-3">
            E-Commerce
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Order Management
            <span className="text-blue-400">
              {" "}System
            </span>
          </h1>

          <p className="text-slate-400 mt-4 max-w-xl mx-auto">
            Search customer orders, view complete details
            and track delivery status from one dashboard.
          </p>

        </div>

        <SearchOrder />

      </div>
    </main>
  );
}