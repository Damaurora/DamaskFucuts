import { Route, Switch } from "wouter";
import HomePage from "@/pages/home-page";
import CatalogPage from "@/pages/catalog-page";
import ProductPage from "@/pages/product-page";
import NewsPage from "@/pages/news-page";
import StoresPage from "@/pages/stores-page";
import AuthPage from "@/pages/auth-page";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminProducts from "@/pages/admin/products";
import AdminCategories from "@/pages/admin/categories";
import AdminNews from "@/pages/admin/news";
import AdminStores from "@/pages/admin/stores";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "@/lib/protected-route";
import MainLayout from "@/components/layout/main-layout";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ScrollToTop from "@/components/utils/scroll-to-top";
import AgeVerificationModal from "@/components/age-verification-modal";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <AgeVerificationModal />
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/catalog" component={CatalogPage} />
          <Route path="/catalog/:categorySlug" component={CatalogPage} />
          <Route path="/product/:id" component={ProductPage} />
          <Route path="/news" component={NewsPage} />
          <Route path="/stores" component={StoresPage} />
          <Route path="/auth" component={AuthPage} />
          
          {/* Admin Routes - Protected */}
          <ProtectedRoute path="/admin" component={AdminDashboard} />
          <ProtectedRoute path="/admin/products" component={AdminProducts} />
          <ProtectedRoute path="/admin/categories" component={AdminCategories} />
          <ProtectedRoute path="/admin/news" component={AdminNews} />
          <ProtectedRoute path="/admin/stores" component={AdminStores} />
          
          {/* Fallback to 404 */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

export default App;
