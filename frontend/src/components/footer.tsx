import { useLocation } from "react-router-dom";
const Footer = () => {
  const location = useLocation();

  const hideHeaderPaths = ["/login", "/signup"];

  if (hideHeaderPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <footer className="bg-gray-800 py-6 text-white">
      <div className="container mx-auto flex flex-col items-center">
        <ul className="flex space-x-8 text-sm md:text-base">
          <li className="transition-colors hover:text-gray-400">GRing</li>
          <li className="transition-colors hover:text-gray-400">Адрес</li>
          <li className="transition-colors hover:text-gray-400">Почта</li>
        </ul>
        <span className="mt-4 text-xs text-gray-400 md:text-sm">
          © {new Date().getFullYear()} Все права защищены
        </span>
      </div>
    </footer>
  );
};

export default Footer;
