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
  Delivered:
    "bg-emerald-100 text-emerald-700 border-emerald-200",

  Shipped:
    "bg-blue-100 text-blue-700 border-blue-200",

  Pending:
    "bg-amber-100 text-amber-700 border-amber-200",

  Confirmed:
    "bg-purple-100 text-purple-700 border-purple-200",

  Cancelled:
    "bg-red-100 text-red-700 border-red-200",

  "Out for Delivery":
    "bg-cyan-100 text-cyan-700 border-cyan-200",
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

        const API_URL =
          process.env.NEXT_PUBLIC_API_URL;

        const response = await fetch(
          `${API_URL}/api/orders/${id}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.message || "Order not found"
          );
          return;
        }

        setOrder(data.order);
      } catch (error) {
        console.error(
          "Order fetch error:",
          error
        );

        setError(
          "Unable to connect to server"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <main className="min-h-screen w-full bg-slate-950 flex items-center justify-center px-4">

        <div className="text-center">

          <LoaderCircle
            size={42}
            className="text-blue-500 animate-spin mx-auto"
          />

          <p className="text-slate-300 mt-4 text-sm sm:text-base">
            Loading order details...
          </p>

        </div>

      </main>
    );
  }

  // ==============================
  // ERROR
  // ==============================

  if (error || !order) {
    return (
      <main className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center p-4">

        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl">

          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">

            <Package size={28} />

          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-5">
            Order Not Found
          </h2>

          <p className="text-sm sm:text-base text-slate-500 mt-2">
            {error ||
              "Unable to load this order."}
          </p>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium transition w-full sm:w-auto"
          >
            <ArrowLeft size={18} />

            Back to Search
          </Link>

        </div>

      </main>
    );
  }

  const calculatedSubtotal =
    order.items?.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
          Number(item.quantity || 0),
      0
    ) || 0;

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">

      {/* Background */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <div className="absolute -top-40 -left-40 w-80 sm:w-96 h-80 sm:h-96 bg-blue-600/10 rounded-full blur-3xl" />

        <div className="absolute top-60 -right-40 w-80 sm:w-96 h-80 sm:h-96 bg-indigo-500/10 rounded-full blur-3xl" />

      </div>

      {/* Main Container */}

      <div className="relative w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 md:py-12">

        {/* Back */}

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-5 sm:mb-7 transition text-sm sm:text-base"
        >
          <ArrowLeft size={17} />

          Back to Search
        </Link>

        {/* ====================================
            HEADER
        ==================================== */}

        <div className="w-full bg-white rounded-2xl md:rounded-3xl shadow-2xl shadow-black/20 p-4 sm:p-6 md:p-8">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 sm:gap-6">

            {/* Order Info */}

            <div className="flex items-start gap-3 sm:gap-4 min-w-0">

              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20 shrink-0">

                <Package
                  size={24}
                  className="sm:hidden"
                />

                <Package
                  size={28}
                  className="hidden sm:block"
                />

              </div>

              <div className="min-w-0">

                <p className="text-xs sm:text-sm text-slate-400 font-medium">
                  Order Number
                </p>

                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 break-words">
                  {order.order_number}
                </h1>

                <div className="flex items-center gap-2 mt-2 text-xs sm:text-sm text-slate-500">

                  <CalendarDays
                    size={15}
                    className="shrink-0"
                  />

                  <span className="break-words">
                    {order.order_date
                      ? new Date(
                          order.order_date
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "Date not available"}
                  </span>

                </div>

              </div>

            </div>

            {/* Status + Invoice */}

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">

              <span
                className={`inline-flex justify-center items-center border px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold w-full sm:w-auto ${
                  statusStyles[
                    order.status
                  ] ||
                  "bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >

                <span className="w-2 h-2 bg-current rounded-full mr-2 shrink-0" />

                {order.status}

              </span>

              <Link
                href={`/orders/${order.id}/invoice`}
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-600/20 transition text-sm sm:text-base"
              >
                <ReceiptText size={18} />

                Generate Invoice
              </Link>

            </div>

          </div>

        </div>

        {/* ====================================
            MAIN GRID
        ==================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">

          {/* ==================================
              LEFT SIDE
          ================================== */}

          <div className="lg:col-span-2 min-w-0 space-y-4 sm:space-y-6">

            {/* Customer Details */}

            <SectionCard
              icon={User}
              title="Customer Details"
              subtitle="Customer and delivery information"
            >

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">

                <InfoBox
                  icon={User}
                  label="Customer Name"
                  value={
                    order.customer_name
                  }
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

            {/* ==================================
                ORDER ITEMS
            ================================== */}

            <SectionCard
              icon={ShoppingBag}
              title="Order Items"
              subtitle={`${
                order.items?.length || 0
              } product(s) in this order`}
            >

              {order.items?.length > 0 ? (
                <>

                  {/* ============================
                      MOBILE PRODUCT CARDS
                  ============================ */}

                  <div className="md:hidden space-y-3">

                    {order.items.map(
                      (item) => {
                        const itemTotal =
                          Number(
                            item.price || 0
                          ) *
                          Number(
                            item.quantity || 0
                          );

                        return (
                          <div
                            key={item.id}
                            className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-100"
                          >

                            {/* Product Top */}

                            <div className="flex items-center gap-3 min-w-0">

                              {item.product_image ? (
                                <img
                                  src={
                                    item.product_image
                                  }
                                  alt={
                                    item.product_name
                                  }
                                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                                />
                              ) : (
                                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">

                                  <Package
                                    size={22}
                                  />

                                </div>
                              )}

                              <div className="min-w-0 flex-1">

                                <p className="font-semibold text-slate-900 text-sm break-words">
                                  {
                                    item.product_name
                                  }
                                </p>

                                <p className="text-xs text-slate-400 mt-1">
                                  Product #
                                  {item.id}
                                </p>

                              </div>

                            </div>

                            {/* Product Details */}

                            <div className="grid grid-cols-3 gap-2 mt-4">

                              <MobileProductInfo
                                label="Qty"
                                value={
                                  item.quantity
                                }
                              />

                              <MobileProductInfo
                                label="Price"
                                value={`₹${Number(
                                  item.price
                                ).toFixed(
                                  2
                                )}`}
                              />

                              <MobileProductInfo
                                label="Total"
                                value={`₹${itemTotal.toFixed(
                                  2
                                )}`}
                                bold
                              />

                            </div>

                          </div>
                        );
                      }
                    )}

                  </div>

                  {/* ============================
                      DESKTOP TABLE
                  ============================ */}

                  <div className="hidden md:block w-full overflow-x-auto">

                    <table className="w-full">

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

                        {order.items.map(
                          (item) => {
                            const itemTotal =
                              Number(
                                item.price ||
                                  0
                              ) *
                              Number(
                                item.quantity ||
                                  0
                              );

                            return (
                              <tr
                                key={
                                  item.id
                                }
                                className="border-b border-slate-100 last:border-b-0"
                              >

                                <td className="py-5 pr-4">

                                  <div className="flex items-center gap-3">

                                    {item.product_image ? (
                                      <img
                                        src={
                                          item.product_image
                                        }
                                        alt={
                                          item.product_name
                                        }
                                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                                      />
                                    ) : (
                                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">

                                        <Package
                                          size={
                                            20
                                          }
                                        />

                                      </div>
                                    )}

                                    <div className="min-w-0">

                                      <p className="font-semibold text-slate-800 break-words">
                                        {
                                          item.product_name
                                        }
                                      </p>

                                      <p className="text-xs text-slate-400 mt-1">
                                        Product #
                                        {
                                          item.id
                                        }
                                      </p>

                                    </div>

                                  </div>

                                </td>

                                <td className="py-5 text-center">

                                  <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg font-medium text-sm">

                                    {
                                      item.quantity
                                    }

                                  </span>

                                </td>

                                <td className="py-5 text-right text-slate-600 font-medium whitespace-nowrap">

                                  ₹
                                  {Number(
                                    item.price
                                  ).toFixed(
                                    2
                                  )}

                                </td>

                                <td className="py-5 text-right text-slate-900 font-bold whitespace-nowrap">

                                  ₹
                                  {itemTotal.toFixed(
                                    2
                                  )}

                                </td>

                              </tr>
                            );
                          }
                        )}

                      </tbody>

                    </table>

                  </div>

                </>
              ) : (
                <div className="text-center py-8 sm:py-10">

                  <Package
                    size={36}
                    className="mx-auto text-slate-300"
                  />

                  <p className="text-slate-500 mt-3 text-sm">
                    No products found for
                    this order.
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

              <div className="w-full overflow-hidden">

                <OrderTimeline
                  tracking={
                    order.tracking ||
                    []
                  }
                />

              </div>

            </SectionCard>

          </div>

          {/* ==================================
              RIGHT SIDE
          ================================== */}

          <div className="min-w-0 space-y-4 sm:space-y-6">

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

                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">

                    <CreditCard
                      size={18}
                    />

                  </div>

                  <p className="font-semibold text-slate-800 text-sm sm:text-base break-words min-w-0">
                    {order.payment_method ||
                      "-"}
                  </p>

                </div>

              </div>

              <div className="border-t border-slate-100 mt-5 sm:mt-6 pt-5 space-y-4">

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

                <div className="border-t border-dashed border-slate-200 pt-5 flex justify-between items-center gap-3">

                  <span className="font-bold text-slate-900 text-sm sm:text-base">
                    Grand Total
                  </span>

                  <span className="text-xl sm:text-2xl font-bold text-blue-600 whitespace-nowrap">
                    ₹
                    {Number(
                      order.total_amount ||
                        0
                    ).toFixed(2)}
                  </span>

                </div>

              </div>

            </SectionCard>

            {/* Current Status */}

            <div className="w-full bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl md:rounded-3xl p-5 sm:p-6 text-white shadow-xl shadow-blue-950/20">

              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-white/15 rounded-xl flex items-center justify-center">

                <Truck size={22} />

              </div>

              <p className="text-blue-100 text-xs sm:text-sm mt-5 sm:mt-6">
                Current Status
              </p>

              <h3 className="text-xl sm:text-2xl font-bold mt-1 break-words">
                {order.status}
              </h3>

              <p className="text-blue-100 text-sm leading-relaxed mt-3">
                Check the tracking timeline
                for the latest update on
                your order.
              </p>

              <a
                href="#tracking"
                className="mt-5 sm:mt-6 w-full inline-flex items-center justify-between gap-3 bg-white/15 hover:bg-white/25 px-4 py-3 rounded-xl font-medium transition text-sm"
              >
                <span>
                  View Full Tracking
                </span>

                <ChevronRight
                  size={18}
                  className="shrink-0"
                />

              </a>

            </div>

            {/* Invoice Card */}

            <div className="w-full bg-white rounded-2xl md:rounded-3xl p-5 sm:p-6 shadow-xl shadow-black/10">

              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">

                <ReceiptText
                  size={22}
                />

              </div>

              <h3 className="text-lg font-bold text-slate-900 mt-4 sm:mt-5">
                Need an Invoice?
              </h3>

              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                Generate a complete invoice
                with customer, payment and
                product details.
              </p>

              <Link
                href={`/orders/${order.id}/invoice`}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold transition text-sm sm:text-base"
              >
                <ReceiptText
                  size={18}
                />

                Generate Invoice
              </Link>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

// ==========================================
// SECTION CARD
// ==========================================

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
      className="w-full min-w-0 overflow-hidden bg-white rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-7 shadow-xl shadow-black/10"
    >

      <div className="flex items-center gap-3 mb-4 sm:mb-6 min-w-0">

        <div className="w-10 h-10 sm:w-11 sm:h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">

          <Icon size={19} />

        </div>

        <div className="min-w-0">

          <h2 className="font-bold text-base sm:text-lg text-slate-900 break-words">
            {title}
          </h2>

          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 break-words">
            {subtitle}
          </p>

        </div>

      </div>

      <div className="w-full min-w-0">
        {children}
      </div>

    </section>
  );
}

// ==========================================
// INFO BOX
// ==========================================

function InfoBox({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="w-full min-w-0 flex items-start gap-3 bg-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-4">

      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white text-slate-500 rounded-xl flex items-center justify-center shrink-0 shadow-sm">

        <Icon size={16} />

      </div>

      <div className="min-w-0 flex-1">

        <p className="text-[10px] sm:text-xs text-slate-400">
          {label}
        </p>

        <p className="text-xs sm:text-sm font-semibold text-slate-800 mt-1 break-all">
          {value || "-"}
        </p>

      </div>

    </div>
  );
}

// ==========================================
// MOBILE PRODUCT INFO
// ==========================================

function MobileProductInfo({
  label,
  value,
  bold = false,
}) {
  return (
    <div className="bg-white rounded-xl p-2.5 text-center border border-slate-100 min-w-0">

      <p className="text-[10px] uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p
        className={`text-xs mt-1 break-words ${
          bold
            ? "font-bold text-slate-900"
            : "font-semibold text-slate-700"
        }`}
      >
        {value}
      </p>

    </div>
  );
}

// ==========================================
// PRICE ROW
// ==========================================

function PriceRow({
  label,
  value,
  green = false,
}) {
  return (
    <div className="flex justify-between items-center gap-3 text-sm">

      <span className="text-slate-500">
        {label}
      </span>

      <span
        className={`whitespace-nowrap ${
          green
            ? "font-semibold text-emerald-600"
            : "font-semibold text-slate-800"
        }`}
      >
        {value}
      </span>

    </div>
  );
}