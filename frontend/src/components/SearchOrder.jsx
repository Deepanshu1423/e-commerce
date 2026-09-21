"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Search,
  Hash,
  Smartphone,
  User,
  Mail,
  LoaderCircle,
  RotateCcw,
  PackageSearch,
} from "lucide-react";

import OrderCard from "./OrderCard";

const searchOptions = [
  {
    label: "Order ID",
    value: "order_number",
    icon: Hash,
  },
  {
    label: "Mobile",
    value: "mobile",
    icon: Smartphone,
  },
  {
    label: "Name",
    value: "customer_name",
    icon: User,
  },
  {
    label: "Email",
    value: "email",
    icon: Mail,
  },
];

export default function SearchOrder() {
  const [type, setType] = useState("order_number");
  const [value, setValue] = useState("");

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ==========================================
  // GET ALL ORDERS
  // ==========================================

  const fetchAllOrders = useCallback(async () => {
    try {
      setLoading(true);
      setMessage("");

      const API_URL =
        process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(
        `${API_URL}/api/orders`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setOrders([]);

        setMessage(
          data.message || "Unable to load orders"
        );

        return;
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error(
        "Fetch all orders error:",
        error
      );

      setOrders([]);

      setMessage(
        "Unable to connect to server"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // LOAD ALL ORDERS WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  // ==========================================
  // SEARCH ORDER
  // ==========================================

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!value.trim()) {
      setMessage(
        "Please enter a search value"
      );

      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const API_URL =
        process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(
        `${API_URL}/api/orders/search?type=${type}&value=${encodeURIComponent(
          value.trim()
        )}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setOrders([]);

        setMessage(
          data.message ||
            "Something went wrong"
        );

        return;
      }

      if (
        !data.orders ||
        data.orders.length === 0
      ) {
        setOrders([]);

        setMessage(
          "No matching order found"
        );

        return;
      }

      // IMPORTANT:
      // only searched orders will show
      setOrders(data.orders);
    } catch (error) {
      console.error(
        "Search order error:",
        error
      );

      setOrders([]);

      setMessage(
        "Unable to connect to server"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CLEAR SEARCH
  // ==========================================

  const handleClear = () => {
    setValue("");
    setType("order_number");
    setMessage("");

    fetchAllOrders();
  };

  return (
    <div className="w-full">

      {/* ======================================
          SEARCH BOX
      ====================================== */}

      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/20 border border-white/20 overflow-hidden">

        {/* Search heading */}

        <div className="p-6 md:p-8 border-b border-slate-100">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
              <PackageSearch size={23} />
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                Find Your Order
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Search using order ID,
                mobile, name or email
              </p>
            </div>

          </div>

        </div>

        <div className="p-6 md:p-8">

          {/* Search Types */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">

            {searchOptions.map(
              (option) => {
                const Icon = option.icon;

                const active =
                  type === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setType(
                        option.value
                      );

                      setMessage("");
                    }}
                    className={`flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border font-medium text-sm transition-all duration-200 ${
                      active
                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    <Icon size={17} />

                    {option.label}
                  </button>
                );
              }
            )}

          </div>

          {/* Search Form */}

          <form
            onSubmit={handleSearch}
            className="flex flex-col lg:flex-row gap-3"
          >

            <div className="relative flex-1">

              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={value}
                onChange={(e) => {
                  setValue(
                    e.target.value
                  );

                  if (message) {
                    setMessage("");
                  }
                }}
                placeholder={
                  type === "order_number"
                    ? "Enter order number e.g. ORD1001"
                    : type === "mobile"
                    ? "Enter mobile number"
                    : type ===
                      "customer_name"
                    ? "Enter customer name"
                    : "Enter email address"
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-4 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
              />

            </div>

            {/* Search Button */}

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold px-7 py-4 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/20"
            >
              {loading ? (
                <>
                  <LoaderCircle
                    size={19}
                    className="animate-spin"
                  />

                  Searching...
                </>
              ) : (
                <>
                  <Search size={19} />

                  Search Order
                </>
              )}
            </button>

            {/* Clear Button */}

            <button
              type="button"
              onClick={handleClear}
              disabled={loading}
              className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold px-6 py-4 rounded-xl flex items-center justify-center gap-2 transition"
            >
              <RotateCcw size={18} />

              Clear
            </button>

          </form>

          {/* Message */}

          {message && (
            <div className="mt-5 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm text-center">
              {message}
            </div>
          )}

        </div>

      </div>

      {/* ======================================
          ORDERS SECTION
      ====================================== */}

      <div className="mt-10">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">

          <div>

            <p className="text-blue-400 font-semibold uppercase tracking-widest text-xs">
              Customer Orders
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-white mt-1">
              {value.trim()
                ? "Search Results"
                : "Latest Orders"}
            </h2>

            <p className="text-slate-400 text-sm mt-2">
              {value.trim()
                ? "Orders matching your search"
                : "Browse all available customer orders"}
            </p>

          </div>

          {!loading && (
            <div className="bg-white/10 border border-white/10 backdrop-blur text-white px-4 py-2 rounded-xl text-sm font-medium">
              {orders.length}{" "}
              {orders.length === 1
                ? "Order"
                : "Orders"}
            </div>
          )}

        </div>

        {/* Initial Loading */}

        {loading &&
        orders.length === 0 ? (
          <div className="bg-white/10 border border-white/10 rounded-3xl py-20 flex flex-col items-center justify-center">

            <LoaderCircle
              size={38}
              className="text-blue-400 animate-spin"
            />

            <p className="text-slate-300 mt-4">
              Loading orders...
            </p>

          </div>
        ) : orders.length > 0 ? (

          /* PRODUCT / ORDER GRID */

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
              />
            ))}

          </div>

        ) : !message ? (

          <div className="bg-white/10 border border-white/10 rounded-3xl py-20 text-center">

            <PackageSearch
              size={45}
              className="text-slate-500 mx-auto"
            />

            <h3 className="text-white font-semibold text-lg mt-4">
              No Orders Available
            </h3>

            <p className="text-slate-400 text-sm mt-2">
              Orders will appear here.
            </p>

          </div>

        ) : null}

      </div>

    </div>
  );
}