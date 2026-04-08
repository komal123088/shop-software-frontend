import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Dashboard from "./pages/Dashboard";
import Products from "./pages/products/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import SalesPOS from "./pages/SalesPOS.jsx";
import CashCustomers from "./pages/customers/CashCustomers.jsx";
import PermanentCredit from "./pages/customers/PermanentCredit.jsx";
import TemporaryCredit from "./pages/customers/TemporaryCredit.jsx";
import Employees from "./pages/Employees";
import Reports from "./pages/Reports";
import Layout from "./components/layout.jsx";
import Setting from "./pages/Settings.jsx";
import SalesHistoryPage from "./pages/SalesHistory.jsx";
import Categories from "./pages/products/Categories.jsx";
import Locations from "./pages/products/Locations.jsx";

// Auth Pages
import OwnerLogin from "./pages/auth/OwnerLogin";
import EmployeeLogin from "./pages/auth/EmployeeLogin";
import OwnerRegister from "./pages/auth/OwnerRegister";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import Expenses from "./pages/Expenses.jsx";
import InventoryPage from "./pages/InventoryPage.jsx";
import ReturnExchange from "./pages/ReturnExchange.jsx";

// ─────────────────────────────────────────────────────────────────────────────
// Role reference (must match backend token values):
//   owner        → everything
//   manager      → dashboard, products, categories, locations, sales(all),
//                  customers(all), reports, expenses, inventory
//   cashier      → products, categories, sales(all), customers(all), inventory
//   stock_keeper → products, categories, locations
// ─────────────────────────────────────────────────────────────────────────────

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          {/* ── Public ── */}
          <Route path="/login" element={<OwnerLogin />} />
          <Route path="/owner-login" element={<OwnerLogin />} />
          <Route path="/employee-login" element={<EmployeeLogin />} />
          <Route path="/owner-register" element={<OwnerRegister />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* ── Protected shell ── */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard — owner, manager */}
            <Route
              index
              element={
                <ProtectedRoute allowedRoles={["manager"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Products — owner, manager, cashier, stock_keeper */}
            <Route
              path="products"
              element={
                <ProtectedRoute
                  allowedRoles={["manager", "cashier", "stock_keeper"]}
                >
                  <Products />
                </ProtectedRoute>
              }
            />
            <Route
              path="products/:id"
              element={
                <ProtectedRoute
                  allowedRoles={["manager", "cashier", "stock_keeper"]}
                >
                  <ProductDetail />
                </ProtectedRoute>
              }
            />

            {/* Categories — owner, manager, cashier, stock_keeper */}
            <Route
              path="categories"
              element={
                <ProtectedRoute
                  allowedRoles={["manager", "cashier", "stock_keeper"]}
                >
                  <Categories />
                </ProtectedRoute>
              }
            />

            {/* Locations — owner, manager, stock_keeper */}
            <Route
              path="locations"
              element={
                <ProtectedRoute allowedRoles={["manager", "stock_keeper"]}>
                  <Locations />
                </ProtectedRoute>
              }
            />

            {/* Sales POS — owner, manager, cashier */}
            <Route
              path="sales/pos"
              element={
                <ProtectedRoute allowedRoles={["manager", "cashier"]}>
                  <SalesPOS />
                </ProtectedRoute>
              }
            />

            {/* Sales History — owner, manager, cashier */}
            <Route
              path="sales/history"
              element={
                <ProtectedRoute allowedRoles={["manager", "cashier"]}>
                  <SalesHistoryPage />
                </ProtectedRoute>
              }
            />

            {/* Return/Exchange — owner, manager, cashier */}
            <Route
              path="sales/return"
              element={
                <ProtectedRoute allowedRoles={["manager", "cashier"]}>
                  <ReturnExchange />
                </ProtectedRoute>
              }
            />

            {/* Customers — owner, manager, cashier */}
            <Route
              path="customers/cash"
              element={
                <ProtectedRoute allowedRoles={["manager", "cashier"]}>
                  <CashCustomers />
                </ProtectedRoute>
              }
            />
            <Route
              path="customers/permanent-credit"
              element={
                <ProtectedRoute allowedRoles={["manager", "cashier"]}>
                  <PermanentCredit />
                </ProtectedRoute>
              }
            />
            <Route
              path="customers/temporary-credit"
              element={
                <ProtectedRoute allowedRoles={["manager", "cashier"]}>
                  <TemporaryCredit />
                </ProtectedRoute>
              }
            />

            {/* Reports — owner, manager */}
            <Route
              path="reports"
              element={
                <ProtectedRoute allowedRoles={["manager"]}>
                  <Reports />
                </ProtectedRoute>
              }
            />

            {/* Expenses — owner, manager */}
            <Route
              path="expenses"
              element={
                <ProtectedRoute allowedRoles={["manager"]}>
                  <Expenses />
                </ProtectedRoute>
              }
            />

            {/* Inventory — owner, manager, cashier */}
            <Route
              path="inventory"
              element={
                <ProtectedRoute allowedRoles={["manager", "cashier"]}>
                  <InventoryPage />
                </ProtectedRoute>
              }
            />

            {/* Employees — owner only (empty allowedRoles = owner only) */}
            <Route
              path="employees"
              element={
                <ProtectedRoute allowedRoles={[]}>
                  <Employees />
                </ProtectedRoute>
              }
            />

            {/* Settings — owner only */}
            <Route
              path="setting"
              element={
                <ProtectedRoute allowedRoles={[]}>
                  <Setting />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
