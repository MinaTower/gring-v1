import { BrowserRouter } from "react-router-dom";
import AppRouter from "@/router/app-router";
import Header from "@/components/header";
import Footer from "@/components/footer";

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-grow">
          <AppRouter />
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
