import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Home, Heart, Plus, User, LogOut, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    ...(user ? [
      { to: "/favorites", icon: Heart, label: "Favorites" },
      { to: "/submit", icon: Plus, label: "Submit" },
    ] : []),
    { to: "/auth", icon: User, label: user ? "Profile" : "Login" },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-card border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2">
            <Quote className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl gradient-text">QuickQuotes</span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Theme Toggle, Logout & Mobile Menu */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            {user && (
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex"
                onClick={handleSignOut}
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                    }`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}
              {user && (
                <Button
                  variant="ghost"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg w-full justify-start text-muted-foreground hover:text-foreground hover:bg-secondary"
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Sign Out</span>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;