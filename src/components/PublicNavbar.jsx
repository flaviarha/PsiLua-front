import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

export const PublicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLink = [
    { to: "/", label: "Home" },
    { to: "/about", label: "Sobre" },
    { to: "/login", label: "Login" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      style={{ backgroundColor: "#9d7cc1" }}
      className="bg-lilac-40 to-lilac-400 px-6 py-3 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center justify-between">
          {/* logotipo */}
          <div className="flex items-center space-x-88 md:space-x-8">
            <div className="relative">
              <img
                src="/logo.png"
                alt="logotipo site lunysse"
                className="w-60 h-5 md:w-12 md:h-12 shadow-lg"
              />
              <div className="absolute inset-1 bg-gradient-to-r from-light to-accent rounded-xl blur opacity-30 md:rounded-b-xl"></div>
            </div>
            <div>
              <span className="text-2xl font-bold text-white md:text-4xl">
                PsiLua
              </span>
              <p className="text-sm text-white font-medium sm:text-base md:text-xl">
                Sistema de Agendamento Psicologico
              </p>
            </div>
          </div>

          {/* Links desktop */}
          <div className="flex items-center space-x-3 md:space-x-4">
            {navLink.slice(0, -1).map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`hidden text-white sm:block font-medium transition-colors text-sm sm:text-base md:text-xl ${
                  isActive(link.to)
                    ? "text-white/50"
                    : "text-white hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/login">
              <button className="text-white px-3 py-2 md:px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-300 text-sm sm:text-base md:text-xl">
                <span className="hidden sm:inline">Entrar</span>
                <span className="sm:hidden">Login</span>
              </button>
            </Link>
          </div>

          {/* Menu mobile */}
          <div className="md:hidden flex items-center ml-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-dark/70 hover:text-light"
              aria-label="Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menu mobile aberto */}
        {isOpen && (
          <div className="md:hidden mt-4">
            <div className="px-2 pt-2 pb-2 space-y-1 bg-white/80 backdrop:blur-md rounded-lg">
              {navLink.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-3 rounded-lg transition-colors text-sm sm:text-base md:text-xl ${
                    isActive(link.to)
                      ? "text-light bg-light/10 font-medium"
                      : "text-dark/70 hover:text-accent hover:bg-light/5"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
