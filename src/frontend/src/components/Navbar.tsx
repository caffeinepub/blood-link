import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Droplets, Menu, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Navbar() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoggedIn = loginStatus === "success" && !!identity;

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/find-blood", label: "Find Blood" },
    { to: "/register", label: "Register" },
    { to: "/contact", label: "Contact Us" },
    { to: "/admin", label: "Admin" },
  ];

  return (
    <header className="bg-white border-b border-border shadow-xs sticky top-0 z-50">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-xl font-bold text-primary"
          data-ocid="nav.link"
        >
          <Droplets className="h-7 w-7 text-primary" />
          <span>Blood Link</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              activeProps={{ className: "text-primary font-semibold" }}
              data-ocid="nav.link"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                {identity.getPrincipal().toString().slice(0, 10)}…
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={clear}
                data-ocid="nav.button"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              onClick={login}
              disabled={loginStatus === "logging-in"}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-ocid="nav.button"
            >
              {loginStatus === "logging-in" ? "Signing in…" : "Sign In"}
            </Button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          data-ocid="nav.button"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-border px-4 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium py-1 text-foreground hover:text-primary"
              onClick={() => setMobileOpen(false)}
              data-ocid="nav.link"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-border">
            {isLoggedIn ? (
              <Button
                variant="outline"
                size="sm"
                onClick={clear}
                className="w-full"
                data-ocid="nav.button"
              >
                Sign Out
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={login}
                className="w-full bg-primary text-primary-foreground"
                data-ocid="nav.button"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
