import { Check } from "lucide-react";

export default function OrderTimeline({ tracking = [] }) {
  if (tracking.length === 0) {
    return (
      <p className="text-gray-500">
        Tracking information is not available.
      </p>
    );
  }

  return (
    <div className="mt-6">
      {tracking.map((item, index) => {
        const isLast = index === tracking.length - 1;

        return (
          <div
            key={item.id}
            className="relative flex gap-4"
          >
            <div className="flex flex-col items-center">

              <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                <Check size={18} />
              </div>

              {!isLast && (
                <div className="w-0.5 h-20 bg-emerald-200" />
              )}

            </div>

            <div className="pb-7">

              <h3 className="font-semibold text-gray-900">
                {item.status}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {item.message}
              </p>

              <p className="text-xs text-gray-400 mt-2">
                {new Date(item.tracked_at).toLocaleString()}
              </p>

            </div>
          </div>
        );
      })}
    </div>
  );
}