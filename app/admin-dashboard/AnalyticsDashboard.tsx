"use client"
export default function AnalyticsDashboard() {
  return (
    <section className="bg-white rounded-lg shadow p-6 animate-fade-in">
      <h2 className="text-xl font-bold mb-4">Analytics Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-100 p-4 rounded shadow animate-slide-in">
          <div className="font-semibold">Products Sold</div>
          <div className="text-2xl">Daily / Weekly / Monthly</div>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow animate-slide-in">
          <div className="font-semibold">Orders</div>
          <div className="text-2xl">Total Orders</div>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow animate-slide-in">
          <div className="font-semibold">Live Users</div>
          <div className="text-2xl">Currently Browsing</div>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow animate-slide-in">
          <div className="font-semibold">Top-Selling Products</div>
          <div className="text-2xl">Product List</div>
        </div>
      </div>
      {/* Implement real-time charts here */}
    </section>
  )
}
