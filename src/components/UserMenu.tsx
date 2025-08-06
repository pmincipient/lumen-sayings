import { User, Settings, Heart, LogOut, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { NavLink, useNavigate } from "react-router-dom";

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });
      // Redirect to auth page after successful logout
      navigate("/auth");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <User className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2 bg-white dark:bg-zinc-900" align="end">
        <div className="space-y-1">
          <NavLink
            to="/profile"
            className="flex items-center gap-2 w-full px-2 py-2 text-sm rounded-md hover:bg-secondary transition-colors"
          >
            <User className="h-4 w-4" />
            Profile
          </NavLink>
          
          <NavLink
            to="/theme"
            className="flex items-center gap-2 w-full px-2 py-2 text-sm rounded-md hover:bg-secondary transition-colors"
          >
            <Palette className="h-4 w-4" />
            Theme
          </NavLink>
          
          <NavLink
            to="/favorites"
            className="flex items-center gap-2 w-full px-2 py-2 text-sm rounded-md hover:bg-secondary transition-colors"
          >
            <Heart className="h-4 w-4" />
            Favorites
          </NavLink>
          
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 w-full px-2 py-2 text-sm rounded-md hover:bg-secondary transition-colors text-left"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserMenu;