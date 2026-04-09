import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Filler } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import api from "../api/api";
import { API_ENDPOINTS } from "../api/EndPoints";
import { format, startOfMonth, endOfMonth, subDays } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    dailySales: 0,
    monthlySales: 0,
    totalProfit: 0,
    todaysOrders: 0,
    lowStockCount: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalEmployees: 0,
    totalRemaining: 0,
  });

  const [salesReport, setSalesReport] = useState({
    daily: [],
    weekly: [],
    monthly: [],
  });

  const [topProducts, setTopProducts] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/dashboard/stats"); // sirf ek call!
      const d = res.data;

      setStats({
        dailySales: d.dailySales,
        monthlySales: d.monthlySales,
        totalProfit: d.totalProfit,
        todaysOrders: d.todaysOrders,
        lowStockCount: d.lowStockCount,
        totalCustomers: d.totalCustomers,
        totalProducts: d.totalProducts,
        totalEmployees: d.totalEmployees,
        totalRemaining: 0, // agar chahiye toh alag endpoint se lo
      });

      setSalesReport({ daily: d.salesTrend.data });
      setTopProducts(d.topProducts);
      setRecentSales(d.recentSales);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };
  // Prepare chart data
  const salesChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Daily Sales (RS)",
        data:
          salesReport.daily.length === 7
            ? salesReport.daily
            : [18000, 22000, 19500, 28000, 25500, 32000, 29000],
        borderColor: "#0d6efd",
        backgroundColor: "rgba(13, 110, 253, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const profitChartData = {
    labels: ["Profit", "Cost"],
    datasets: [
      {
        data: [
          stats.totalProfit,
          Math.max(0, stats.monthlySales - stats.totalProfit),
        ],
        backgroundColor: ["#198754", "#dc3545"],
        hoverOffset: 10,
      },
    ],
  };

  const topProductsChartData = {
    labels: topProducts.slice(0, 5).map((p) => p.name || "Product"),
    datasets: [
      {
        label: "Sales (RS)",
        data: topProducts
          .slice(0, 5)
          .map((p) => parseFloat(p.revenue || p.sales || 0)),
        backgroundColor: [
          "#0d6efd",
          "#198754",
          "#ffc107",
          "#dc3545",
          "#6f42c1",
        ],
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => "RS " + value.toLocaleString(),
        },
      },
    },
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: RS ${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => "RS " + value.toLocaleString(),
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="text-center my-5 py-5">
          <div
            className="spinner-border text-primary"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">Dashboard</h2>
          <p className="text-muted mb-0 small">
            Welcome back! Here's your shop overview
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/sales/pos" className="btn btn-primary">
            <i className="bi bi-cart-plus me-2"></i> New Sale
          </Link>
          <button
            className="btn btn-outline-primary"
            onClick={fetchDashboardData}
            title="Refresh Data"
          >
            <i className="bi bi-arrow-clockwise"></i>
          </button>
        </div>
      </div>

      {error && (
        <div
          className="alert alert-warning alert-dismissible fade show"
          role="alert"
        >
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100 bg-primary bg-opacity-10">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Today's Sales</p>
                  <h4 className="mb-0 fw-bold">
                    RS {stats.dailySales.toLocaleString()}
                  </h4>
                </div>
                <div className="bg-primary bg-opacity-25 rounded-3 p-3">
                  <i className="bi bi-cash-stack fs-3 text-primary"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100 bg-success bg-opacity-10">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Monthly Sales</p>
                  <h4 className="mb-0 fw-bold">
                    RS {stats.monthlySales.toLocaleString()}
                  </h4>
                </div>
                <div className="bg-success bg-opacity-25 rounded-3 p-3">
                  <i className="bi bi-graph-up-arrow fs-3 text-success"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100 bg-info bg-opacity-10">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Total Profit</p>
                  <h4 className="mb-0 fw-bold text-success">
                    RS {stats.totalProfit.toLocaleString()}
                  </h4>
                </div>
                <div className="bg-info bg-opacity-25 rounded-3 p-3">
                  <i className="bi bi-wallet2 fs-3 text-info"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100 bg-warning bg-opacity-10">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1 small">Today's Orders</p>
                  <h4 className="mb-0 fw-bold">{stats.todaysOrders}</h4>
                </div>
                <div className="bg-warning bg-opacity-25 rounded-3 p-3">
                  <i className="bi bi-receipt fs-3 text-warning"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Total Sales</p>
                  <h4 className="mb-0 fw-bold">{stats.totalCustomers}</h4>
                </div>
                <i className="bi bi-receipt-cutoff fs-2 text-primary opacity-50"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Total Products</p>
                  <h4 className="mb-0 fw-bold">{stats.totalProducts}</h4>
                </div>
                <i className="bi bi-box-seam fs-2 text-success opacity-50"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Employees</p>
                  <h4 className="mb-0 fw-bold">{stats.totalEmployees}</h4>
                </div>
                <i className="bi bi-person-badge fs-2 text-info opacity-50"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Low Stock Items</p>
                  <h4 className="mb-0 fw-bold text-danger">
                    {stats.lowStockCount}
                  </h4>
                </div>
                <i className="bi bi-exclamation-triangle fs-2 text-danger opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Alert */}
      {stats.totalRemaining > 0 && (
        <div className="alert alert-danger d-flex align-items-center mb-4 border-0 shadow-sm">
          <i className="bi bi-exclamation-triangle-fill fs-3 me-3"></i>
          <div>
            <strong>Remaining Credit:</strong> RS{" "}
            {stats.totalRemaining.toLocaleString()}
            <Link
              to="/customers/permanent-credit"
              className="ms-3 fw-bold text-decoration-underline text-dark"
            >
              View Details →
            </Link>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-primary border-0 py-3">
              <h5 className="mb-0 fw-bold text-white">
                Sales Trend (Last 7 Days)
              </h5>
            </div>
            <div className="card-body" style={{ height: "350px" }}>
              <Line data={salesChartData} options={lineChartOptions} />
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-primary border-0 py-3">
              <h5 className="mb-0 fw-bold text-white">Profit vs Cost</h5>
            </div>
            <div className="card-body d-flex align-items-center justify-content-center">
              <div style={{ height: "300px", width: "100%" }}>
                <Doughnut
                  data={profitChartData}
                  options={doughnutChartOptions}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-primary border-0 py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold text-white">Top Selling Products</h5>
              <Link to="/products" className="btn btn-sm btn-light">
                View All
              </Link>
            </div>
            <div className="card-body">
              {topProducts.length > 0 ? (
                <div style={{ height: "300px" }}>
                  <Bar data={topProductsChartData} options={barChartOptions} />
                </div>
              ) : (
                <div className="text-center py-5 text-muted">
                  No top products data available yet
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-primary border-0 py-3">
              <h5 className="mb-0 fw-bold text-white">Recent Sales</h5>
            </div>
            <div
              className="card-body"
              style={{ maxHeight: "350px", overflowY: "auto" }}
            >
              {recentSales.length > 0 ? (
                <div className="list-group list-group-flush">
                  {recentSales.map((sale, idx) => (
                    <div key={idx} className="list-group-item px-0">
                      <div className="d-flex w-100 justify-content-between">
                        <h6 className="mb-1">{sale.message}</h6>
                        <small className="text-muted">
                          {sale.createdAt
                            ? format(new Date(sale.createdAt), "hh:mm a")
                            : "Just now"}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5 text-muted">
                  No recent sales
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
