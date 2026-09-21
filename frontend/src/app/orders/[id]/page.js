"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  Package,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  CalendarDays,
  ReceiptText,
  Truck,
  ShoppingBag,
  LoaderCircle,
  ChevronRight,
} from "lucide-react";

import OrderTimeline from "@/components/OrderTimeline";

const statusStyles = {
  Delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Shipped: "bg-blue-100 text-blue-700 border-blue-200",
  Pending: "bg-amber-100 text-amber-700 border-amber-200",
  Confirmed: "bg-purple-100 text-purple-700 border-purple-200",
  Cancelled: "bg-red-100 text-red-700 border-red-200",
  "Out for Delivery": "bg-cyan-100 text-cyan-700 border-cyan-200",
};

export default function OrderDetailsPage() {
  const params = useParams();
  const id = params?.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        const response = await fetch(
          `${API_URL}/api/orders/${id}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Order not found");
          return;
        }

        setOrder(data.order);
      } catch (error) {
        console.error("Order fetch error:", error);

        setError("Unable to connect to server");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <LoaderCircle
            size={48}
            className="text-blue-500 animate-spin mx-auto"
          />

          <p className="text-slate-300 mt-4">
            Loading order details...
          </p>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center p-5">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">

          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
            <Package size={30} />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mt-5">
            Order Not Found
          </h2>

          <p className="text-slate-500 mt-2">
            {error || "Unable to load this order."}
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition"
          >
            <ArrowLeft size={18} />
            Back to Search
          </Link>

        </div>
      </main>
    );
  }

  const calculatedSubtotal =
    order.items?.reduce((total, item) => {
      return (
        total +
        Number(item.price || 0) *
          Number(item.quantity || 0)
      );
    }, 0) || 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">

      {/* Background decoration */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-60 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">

        {/* Back button */}

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-7 transition"
        >
          <ArrowLeft size={18} />
          Back to Search
        </Link>

        {/* ================= HEADER ================= */}

        <div className="bg-white rounded-3xl shadow-2xl shadow-black/20 p-6 md:p-8">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div className="flex items-start gap-4">

              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20 shrink-0">
                <Package size={28} />
              </div>

              <div>

                <p className="text-sm text-slate-400 font-medium">
                  Order Number
                </p>

                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  {order.order_number}
                </h1>

                <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">

                  <CalendarDays size={16} />

                  <span>
                    {order.order_date
                      ? new Date(
                          order.order_date
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "Date not available"}
                  </span>

                </div>

              </div>

            </div>

            {/* Status + Invoice */}

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">

              <span
                className={`inline-flex justify-center items-center border px-5 py-2.5 rounded-xl text-sm font-semibold ${
                  statusStyles[order.status] ||
                  "bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                <span className="w-2 h-2 bg-current rounded-full mr-2" />

                {order.status}
              </span>

              <Link
                href={`/orders/${order.id}/invoice`}
                className="inline-flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-600/20 transition"
              >
                <ReceiptText size={19} />
                Generate Invoice
              </Link>

            </div>

          </div>

        </div>

        {/* ================= MAIN GRID ================= */}

        <div className="grid lg:grid-cols-3 gap-6 mt-6">

          {/* LEFT */}

          <div className="lg:col-span-2 space-y-6">

            {/* Customer */}

            <SectionCard
              icon={User}
              title="Customer Details"
              subtitle="Customer and delivery information"
            >
              <div className="grid sm:grid-cols-2 gap-5">

                <InfoBox
                  icon={User}
                  label="Customer Name"
                  value={order.customer_name}
                />

                <InfoBox
                  icon={Mail}
                  label="Email Address"
                  value={order.email}
                />

                <InfoBox
                  icon={Phone}
                  label="Mobile Number"
                  value={order.mobile}
                />

                <InfoBox
                  icon={MapPin}
                  label="Delivery Address"
                  value={order.address}
                />

              </div>
            </SectionCard>

            {/* Products */}

            <SectionCard
              icon={ShoppingBag}
              title="Order Items"
              subtitle={`${order.items?.length || 0} product(s) in this order`}
            >

              {order.items?.length > 0 ? (
                <div className="overflow-x-auto">

                  <table className="w-full min-w-[600px]">

                    <thead>
                      <tr className="border-b border-slate-200">

                        <th className="text-left pb-4 text-xs uppercase tracking-wider text-slate-400">
                          Product
                        </th>

                        <th className="text-center pb-4 text-xs uppercase tracking-wider text-slate-400">
                          Quantity
                        </th>

                        <th className="text-right pb-4 text-xs uppercase tracking-wider text-slate-400">
                          Price
                        </th>

                        <th className="text-right pb-4 text-xs uppercase tracking-wider text-slate-400">
                          Total
                        </th>

                      </tr>
                    </thead>

                    <tbody>

                      {order.items.map((item) => {

                        const itemTotal =
                          Number(item.price || 0) *
                          Number(item.quantity || 0);

                        return (
                          <tr
                            key={item.id}
                            className="border-b border-slate-100 last:border-b-0"
                          >

                            <td className="py-5">

                              <div className="flex items-center gap-3">

                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                  <Package size={20} />
                                </div>

                                <div>
                                  <p className="font-semibold text-slate-800">
                                    {item.product_name}
                                  </p>

                                  <p className="text-xs text-slate-400 mt-1">
                                    Product #{item.id}
                                  </p>
                                </div>

                              </div>

                            </td>

                            <td className="py-5 text-center">
                              <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg font-medium text-sm">
                                {item.quantity}
                              </span>
                            </td>

                            <td className="py-5 text-right text-slate-600 font-medium">
                              ₹
                              {Number(
                                item.price
                              ).toFixed(2)}
                            </td>

                            <td className="py-5 text-right text-slate-900 font-bold">
                              ₹{itemTotal.toFixed(2)}
                            </td>

                          </tr>
                        );
                      })}

                    </tbody>

                  </table>

                </div>
              ) : (
                <div className="text-center py-10">

                  <Package
                    size={38}
                    className="mx-auto text-slate-300"
                  />

                  <p className="text-slate-500 mt-3">
                    No products found for this order.
                  </p>

                </div>
              )}

            </SectionCard>

            {/* Tracking */}

            <SectionCard
              id="tracking"
              icon={Truck}
              title="Order Tracking"
              subtitle="Follow the complete journey of your order"
            >
              <OrderTimeline
                tracking={order.tracking || []}
              />
            </SectionCard>

          </div>

          {/* RIGHT */}

          <div className="space-y-6">

            {/* Payment */}

            <SectionCard
              icon={CreditCard}
              title="Payment Details"
              subtitle="Payment and billing summary"
            >

              <div>

                <p className="text-xs uppercase tracking-wider text-slate-400">
                  Payment Method
                </p>

                <div className="flex items-center gap-3 mt-3">

                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <CreditCard size={18} />
                  </div>

                  <p className="font-semibold text-slate-800">
                    {order.payment_method || "-"}
                  </p>

                </div>

              </div>

              <div className="border-t border-slate-100 mt-6 pt-5 space-y-4">

                <PriceRow
                  label="Subtotal"
                  value={`₹${calculatedSubtotal.toFixed(
                    2
                  )}`}
                />

                <PriceRow
                  label="Delivery"
                  value="FREE"
                  green
                />

                <div className="border-t border-dashed border-slate-200 pt-5 flex justify-between items-center">

                  <span className="font-bold text-slate-900">
                    Grand Total
                  </span>

                  <span className="text-2xl font-bold text-blue-600">
                    ₹
                    {Number(
                      order.total_amount || 0
                    ).toFixed(2)}
                  </span>

                </div>

              </div>

            </SectionCard>

            {/* Current Status */}

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-950/20">

              <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center">
                <Truck size={24} />
              </div>

              <p className="text-blue-100 text-sm mt-6">
                Current Status
              </p>

              <h3 className="text-2xl font-bold mt-1">
                {order.status}
              </h3>

              <p className="text-blue-100 text-sm leading-relaxed mt-3">
                Check the tracking timeline for the latest
                update on your order.
              </p>

              <a
                href="#tracking"
                className="mt-6 w-full inline-flex items-center justify-between bg-white/15 hover:bg-white/25 px-4 py-3 rounded-xl font-medium transition"
              >
                View Full Tracking
                <ChevronRight size={18} />
              </a>

            </div>

            {/* Invoice Card */}

            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-black/10">

              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <ReceiptText size={23} />
              </div>

              <h3 className="text-lg font-bold text-slate-900 mt-5">
                Need an Invoice?
              </h3>

              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                Generate a complete invoice with customer,
                payment and product details.
              </p>

              <Link
                href={`/orders/${order.id}/invoice`}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold transition"
              >
                <ReceiptText size={18} />
                Generate Invoice
              </Link>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

function SectionCard({
  id,
  icon: Icon,
  title,
  subtitle,
  children,
}) {
  return (
    <section
      id={id}
      className="bg-white rounded-3xl p-6 md:p-7 shadow-xl shadow-black/10"
    >

      <div className="flex items-center gap-3 mb-6">

        <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
          <Icon size={20} />
        </div>

        <div>
          <h2 className="font-bold text-lg text-slate-900">
            {title}
          </h2>

          <p className="text-xs text-slate-400 mt-0.5">
            {subtitle}
          </p>
        </div>

      </div>

      {children}

    </section>
  );
}

function InfoBox({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex items-start gap-3 bg-slate-50 rounded-2xl p-4">

      <div className="w-10 h-10 bg-white text-slate-500 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
        <Icon size={17} />
      </div>

      <div className="min-w-0">

        <p className="text-xs text-slate-400">
          {label}
        </p>

        <p className="text-sm font-semibold text-slate-800 mt-1 break-words">
          {value || "-"}
        </p>

      </div>

    </div>
  );
}

function PriceRow({
  label,
  value,
  green = false,
}) {
  return (
    <div className="flex justify-between items-center text-sm">

      <span className="text-slate-500">
        {label}
      </span>

      <span
        className={
          green
            ? "font-semibold text-emerald-600"
            : "font-semibold text-slate-800"
        }
      >
        {value}
      </span>

    </div>
  );
}