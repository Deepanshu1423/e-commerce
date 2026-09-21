"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  Printer,
  Download,
  Package,
  ReceiptText,
} from "lucide-react";

export default function InvoicePage() {
  const params = useParams();
  const id = params.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);

        const API_URL =
          process.env.NEXT_PUBLIC_API_URL;

        const response = await fetch(
          `${API_URL}/api/orders/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.message || "Unable to load invoice"
          );
          return;
        }

        setOrder(data.order);
      } catch (error) {
        console.error(error);

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

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="text-white mt-4">
            Generating invoice...
          </p>

        </div>

      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center p-6">

        <div className="bg-white rounded-2xl p-8 text-center">

          <h2 className="font-bold text-xl">
            Invoice unavailable
          </h2>

          <p className="text-gray-500 mt-2">
            {error}
          </p>

          <Link
            href={`/orders/${id}`}
            className="inline-flex mt-5 text-blue-600"
          >
            Back to order
          </Link>

        </div>

      </main>
    );
  }

  const subtotal =
    order.items?.reduce(
      (total, item) =>
        total +
        Number(item.price) *
          Number(item.quantity),
      0
    ) || 0;

  return (
    <main className="min-h-screen bg-slate-100 py-8 px-4">

      {/* Action Bar */}

      <div className="max-w-5xl mx-auto mb-5 flex flex-col sm:flex-row justify-between gap-3 no-print">

        <Link
          href={`/orders/${id}`}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back to Order
        </Link>

        <div className="flex gap-3">

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 bg-white border border-slate-200 px-5 py-3 rounded-xl font-medium hover:bg-slate-50"
          >
            <Printer size={18} />
            Print
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-blue-700"
          >
            <Download size={18} />
            Save as PDF
          </button>

        </div>

      </div>

      {/* Invoice */}

      <div
        id="invoice"
        className="invoice-container max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden"
      >

        {/* Invoice Header */}

        <div className="bg-slate-950 text-white p-8 md:p-10">

          <div className="flex flex-col md:flex-row justify-between gap-6">

            <div>

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                  <Package size={24} />
                </div>

                <div>
                  <h1 className="text-2xl font-bold">
                    ShopTrack
                  </h1>

                  <p className="text-slate-400 text-sm">
                    Order Management System
                  </p>
                </div>

              </div>

            </div>

            <div className="md:text-right">

              <div className="flex md:justify-end items-center gap-2 text-blue-400">

                <ReceiptText size={20} />

                <span className="uppercase tracking-[0.25em] text-sm font-semibold">
                  Invoice
                </span>

              </div>

              <p className="text-3xl font-bold mt-2">
                #{order.order_number}
              </p>

            </div>

          </div>

        </div>

        {/* Invoice Body */}

        <div className="p-7 md:p-10">

          {/* Customer + Invoice Details */}

          <div className="grid md:grid-cols-2 gap-10">

            <div>

              <p className="uppercase tracking-wider text-xs font-semibold text-slate-400">
                Bill To
              </p>

              <h2 className="font-bold text-xl text-slate-900 mt-3">
                {order.customer_name}
              </h2>

              <div className="text-sm text-slate-500 mt-3 space-y-1">

                <p>{order.email}</p>

                <p>{order.mobile}</p>

                <p>{order.address}</p>

              </div>

            </div>

            <div className="md:text-right">

              <p className="uppercase tracking-wider text-xs font-semibold text-slate-400">
                Invoice Details
              </p>

              <div className="mt-3 space-y-2 text-sm">

                <p>
                  <span className="text-slate-400">
                    Order ID:
                  </span>{" "}

                  <span className="font-medium text-slate-800">
                    {order.order_number}
                  </span>
                </p>

                <p>
                  <span className="text-slate-400">
                    Order Date:
                  </span>{" "}

                  <span className="font-medium text-slate-800">
                    {order.order_date
                      ? new Date(
                          order.order_date
                        ).toLocaleDateString()
                      : "-"}
                  </span>
                </p>

                <p>
                  <span className="text-slate-400">
                    Payment:
                  </span>{" "}

                  <span className="font-medium text-slate-800">
                    {order.payment_method}
                  </span>
                </p>

                <p>
                  <span className="text-slate-400">
                    Status:
                  </span>{" "}

                  <span className="font-semibold text-emerald-600">
                    {order.status}
                  </span>
                </p>

              </div>

            </div>

          </div>

          {/* Items */}

          <div className="mt-10">

            <h2 className="font-bold text-lg text-slate-900 mb-4">
              Order Items
            </h2>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[600px]">

                <thead>

                  <tr className="bg-slate-100 text-left">

                    <th className="px-4 py-3 text-xs uppercase text-slate-500 rounded-l-lg">
                      Product
                    </th>

                    <th className="px-4 py-3 text-xs uppercase text-slate-500">
                      Price
                    </th>

                    <th className="px-4 py-3 text-xs uppercase text-slate-500">
                      Qty
                    </th>

                    <th className="px-4 py-3 text-xs uppercase text-slate-500 text-right rounded-r-lg">
                      Total
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {order.items?.map((item) => (

                    <tr
                      key={item.id}
                      className="border-b border-slate-100"
                    >

                      <td className="px-4 py-5">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                            <Package size={18} />
                          </div>

                          <span className="font-medium text-slate-800">
                            {item.product_name}
                          </span>

                        </div>

                      </td>

                      <td className="px-4 py-5 text-slate-600">
                        ₹
                        {Number(
                          item.price
                        ).toFixed(2)}
                      </td>

                      <td className="px-4 py-5 text-slate-600">
                        {item.quantity}
                      </td>

                      <td className="px-4 py-5 text-right font-semibold text-slate-900">
                        ₹
                        {(
                          Number(item.price) *
                          Number(item.quantity)
                        ).toFixed(2)}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

          {/* Totals */}

          <div className="flex justify-end mt-8">

            <div className="w-full md:w-80">

              <div className="flex justify-between py-2">

                <span className="text-slate-500">
                  Subtotal
                </span>

                <span className="font-medium">
                  ₹{subtotal.toFixed(2)}
                </span>

              </div>

              <div className="flex justify-between py-2">

                <span className="text-slate-500">
                  Delivery
                </span>

                <span className="font-medium text-emerald-600">
                  FREE
                </span>

              </div>

              <div className="border-t border-dashed border-slate-300 mt-3 pt-4 flex justify-between items-center">

                <span className="font-bold text-lg">
                  Grand Total
                </span>

                <span className="text-2xl font-bold text-blue-600">
                  ₹
                  {Number(
                    order.total_amount
                  ).toFixed(2)}
                </span>

              </div>

            </div>

          </div>

          {/* Footer */}

          <div className="border-t border-slate-200 mt-12 pt-7 text-center">

            <p className="font-semibold text-slate-800">
              Thank you for your order!
            </p>

            <p className="text-sm text-slate-400 mt-2">
              This invoice was generated electronically.
            </p>

          </div>

        </div>

      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }

          .no-print {
            display: none !important;
          }

          .invoice-container {
            box-shadow: none !important;
            border-radius: 0 !important;
            max-width: 100% !important;
          }

          @page {
            margin: 12mm;
          }
        }
      `}</style>

    </main>
  );
}