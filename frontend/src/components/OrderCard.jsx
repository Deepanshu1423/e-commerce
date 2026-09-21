import Link from "next/link";

import {
  ArrowRight,
  Mail,
  Phone,
  CreditCard,
  MapPin,
  Package,
} from "lucide-react";

const statusStyles = {
  Delivered:
    "bg-emerald-100 text-emerald-700",

  Shipped:
    "bg-blue-100 text-blue-700",

  Pending:
    "bg-amber-100 text-amber-700",

  Confirmed:
    "bg-purple-100 text-purple-700",

  Cancelled:
    "bg-red-100 text-red-700",
};

export default function OrderCard({
  order,
}) {
  const product = order.items?.[0];

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-xl shadow-black/10 border border-slate-100 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">

      {/* Product Image */}

      <div className="relative h-56 bg-slate-100 overflow-hidden">

        {product?.product_image ? (
          <img
            src={product.product_image}
            alt={product.product_name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <Package size={50} />
          </div>
        )}

        {/* Status */}

        <span
          className={`absolute top-4 right-4 px-4 py-2 rounded-full text-xs font-bold shadow ${
            statusStyles[order.status] ||
            "bg-slate-100 text-slate-700"
          }`}
        >
          ● {order.status}
        </span>

        {/* Order Number */}

        <span className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur text-white px-3 py-2 rounded-lg text-xs font-semibold">
          {order.order_number}
        </span>

      </div>

      {/* Content */}

      <div className="p-6">

        <p className="text-xs uppercase tracking-widest text-blue-600 font-semibold">
          Product
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-1">
          {product?.product_name ||
            "Product"}
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Ordered by {order.customer_name}
        </p>

        {/* Information */}

        <div className="grid grid-cols-2 gap-4 mt-6">

          <Info
            icon={Mail}
            label="Email"
            value={order.email}
          />

          <Info
            icon={Phone}
            label="Mobile"
            value={order.mobile}
          />

          <Info
            icon={CreditCard}
            label="Payment"
            value={order.payment_method}
          />

          <Info
            icon={MapPin}
            label="Location"
            value={order.address}
          />

        </div>

        {/* Bottom */}

        <div className="border-t border-slate-100 mt-6 pt-5 flex items-center justify-between">

          <div>

            <p className="text-xs text-slate-400">
              Order Total
            </p>

            <p className="text-2xl font-bold text-slate-900">
              ₹
              {Number(
                order.total_amount
              ).toFixed(2)}
            </p>

          </div>

          <Link
            href={`/orders/${order.id}`}
            className="w-11 h-11 bg-slate-900 hover:bg-blue-600 text-white rounded-xl flex items-center justify-center transition"
          >
            <ArrowRight size={19} />
          </Link>

        </div>

      </div>

    </div>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex gap-2 min-w-0">

      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
        <Icon size={14} />
      </div>

      <div className="min-w-0">

        <p className="text-[11px] text-slate-400">
          {label}
        </p>

        <p className="text-xs font-semibold text-slate-700 truncate">
          {value || "-"}
        </p>

      </div>

    </div>
  );
}