import { useState } from "react";
import { Moon, Sun, Brush } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTheme } from "next-themes";
import { HexColorPicker } from "react-colorful";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [customColor, setCustomColor] = useState("#6366f1");
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Convert hex to HSL
  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  // Apply custom theme
  const applyCustomTheme = (color: string) => {
    const hsl = hexToHsl(color);
    const [h, s, l] = hsl.split(' ').map(v => parseInt(v));
    
    // Calculate variations for better contrast
    const primaryHsl = `${h} ${s}% ${Math.max(l - 10, 10)}%`;
    const primaryForegroundHsl = l > 50 ? "0 0% 98%" : "0 0% 2%";
    const secondaryHsl = `${h} ${Math.max(s - 20, 10)}% ${Math.min(l + 20, 90)}%`;
    const accentHsl = `${h} ${Math.max(s - 10, 5)}% ${Math.min(l + 15, 85)}%`;
    const borderHsl = `${h} ${Math.max(s - 30, 5)}% ${Math.min(l + 30, 80)}%`;
    
    // Apply CSS variables
    document.documentElement.style.setProperty('--primary', primaryHsl);
    document.documentElement.style.setProperty('--primary-foreground', primaryForegroundHsl);
    document.documentElement.style.setProperty('--secondary', secondaryHsl);
    document.documentElement.style.setProperty('--accent', accentHsl);
    document.documentElement.style.setProperty('--border', borderHsl);
    document.documentElement.style.setProperty('--ring', primaryHsl);
    
    // Update category colors to work with the new theme
    const categories = ['motivational', 'life', 'wisdom', 'success', 'happiness', 'inspiration'];
    categories.forEach((category, index) => {
      const categoryH = (h + (index * 60)) % 360;
      const categoryHsl = `${categoryH} ${Math.max(s - 10, 20)}% ${Math.min(l + 10, 80)}%`;
      document.documentElement.style.setProperty(`--category-${category}`, categoryHsl);
    });
  };

  // Handle custom theme selection
  const handleCustomTheme = () => {
    setTheme("custom");
    setShowColorPicker(true);
    applyCustomTheme(customColor);
  };

  // Handle color change
  const handleColorChange = (color: string) => {
    setCustomColor(color);
    if (theme === "custom") {
      applyCustomTheme(color);
    }
  };

  const handleThemeSelect = (selectedTheme: string) => {
    if (selectedTheme === "custom") {
      handleCustomTheme();
    } else {
      setTheme(selectedTheme);
      setShowColorPicker(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="glass hover:bg-primary/10"
        >
          {theme === "custom" ? (
            <Brush className="h-5 w-5" />
          ) : (
            <>
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </>
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <Label className="text-base font-semibold">Choose Theme</Label>
          
          {/* Theme Options */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              className="flex flex-col gap-1 h-auto p-3"
              onClick={() => handleThemeSelect("light")}
              size="sm"
            >
              <Sun className="h-4 w-4" />
              <span className="text-xs">Light</span>
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              className="flex flex-col gap-1 h-auto p-3"
              onClick={() => handleThemeSelect("dark")}
              size="sm"
            >
              <Moon className="h-4 w-4" />
              <span className="text-xs">Dark</span>
            </Button>
            <Button
              variant={theme === "custom" ? "default" : "outline"}
              className="flex flex-col gap-1 h-auto p-3"
              onClick={() => handleThemeSelect("custom")}
              size="sm"
            >
              <Brush className="h-4 w-4" />
              <span className="text-xs">Custom</span>
            </Button>
          </div>

          {/* Custom Theme Color Picker */}
          {showColorPicker && (
            <div className="space-y-3 p-3 border rounded-lg bg-secondary/20">
              <Label className="text-sm font-medium">Custom Color</Label>
              <div className="flex gap-4">
                <div className="space-y-2">
                  <HexColorPicker 
                    color={customColor} 
                    onChange={handleColorChange}
                    style={{ width: "120px", height: "120px" }}
                  />
                  <div className="text-center text-xs font-mono">{customColor}</div>
                </div>
                
                <div className="flex-1 space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Preview</Label>
                    <div className="space-y-2 mt-1">
                      <div className="flex gap-1 flex-wrap">
                        <Button 
                          size="sm" 
                          className="text-xs px-2 py-1"
                          style={{ 
                            backgroundColor: `hsl(${hexToHsl(customColor)})`,
                            color: parseInt(customColor.slice(1, 3), 16) + parseInt(customColor.slice(3, 5), 16) + parseInt(customColor.slice(5, 7), 16) > 384 ? '#000' : '#fff'
                          }}
                        >
                          Primary
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-xs px-2 py-1"
                          style={{ 
                            borderColor: `hsl(${hexToHsl(customColor)})`,
                            color: `hsl(${hexToHsl(customColor)})`
                          }}
                        >
                          Outline
                        </Button>
                        <Badge 
                          className="text-xs"
                          style={{ 
                            backgroundColor: `hsl(${hexToHsl(customColor)})`,
                            color: parseInt(customColor.slice(1, 3), 16) + parseInt(customColor.slice(3, 5), 16) + parseInt(customColor.slice(5, 7), 16) > 384 ? '#000' : '#fff'
                          }}
                        >
                          Badge
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Colors adapt for readability
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};