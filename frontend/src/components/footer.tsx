import { useLocation } from "react-router-dom";
const Footer = () => {
  const location = useLocation();

  const hideHeaderPaths = ["/login", "/signup"];

  if (hideHeaderPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <footer className="mx-auto w-full max-w-screen-xl shadow-lg">
      <div className="flex flex-col">
        <ul className="flex justify-around">
          <li>GRing</li>
          <li>Адрес</li>
          <li>Почта</li>
        </ul>
        <span className="mt-2 flex justify-center">Все права защищены</span>
      </div>
    </footer>
  );
};

export default Footer;
