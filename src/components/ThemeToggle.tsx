import { useState } from "react";
import { Moon, Sun, Brush } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
      setShowColorPicker(true);
    } else {
      setTheme(selectedTheme);
      setShowColorPicker(false);
    }
  };

  return (
    <>
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
          </div>
        </PopoverContent>
      </Popover>

      {/* Custom Theme Modal */}
      <Dialog open={showColorPicker} onOpenChange={setShowColorPicker}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Customize Your Theme</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex gap-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Pick Your Color</Label>
                <HexColorPicker 
                  color={customColor} 
                  onChange={handleColorChange}
                  style={{ width: "200px", height: "200px" }}
                />
                <div className="text-center text-sm font-mono bg-muted px-3 py-2 rounded">
                  {customColor}
                </div>
                <Button 
                  onClick={() => {
                    setTheme("custom");
                    applyCustomTheme(customColor);
                  }}
                  className="w-full"
                >
                  Apply Theme
                </Button>
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <Label className="text-sm font-medium">Live Preview</Label>
                  <div className="space-y-3 mt-3">
                    <div className="flex gap-2 flex-wrap">
                      <Button 
                        size="sm"
                        style={{ 
                          backgroundColor: `hsl(${hexToHsl(customColor)})`,
                          color: parseInt(customColor.slice(1, 3), 16) + parseInt(customColor.slice(3, 5), 16) + parseInt(customColor.slice(5, 7), 16) > 384 ? '#000' : '#fff'
                        }}
                      >
                        Primary Button
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        style={{ 
                          borderColor: `hsl(${hexToHsl(customColor)})`,
                          color: `hsl(${hexToHsl(customColor)})`
                        }}
                      >
                        Outline Button
                      </Button>
                      <Badge 
                        style={{ 
                          backgroundColor: `hsl(${hexToHsl(customColor)})`,
                          color: parseInt(customColor.slice(1, 3), 16) + parseInt(customColor.slice(3, 5), 16) + parseInt(customColor.slice(5, 7), 16) > 384 ? '#000' : '#fff'
                        }}
                      >
                        Badge Example
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Sample Card</Label>
                      <div 
                        className="p-4 rounded-lg border-2"
                        style={{ 
                          borderColor: `hsl(${hexToHsl(customColor)})`,
                          backgroundColor: `hsl(${hexToHsl(customColor)} / 0.05)`
                        }}
                      >
                        <h3 className="font-semibold text-foreground">Card Title</h3>
                        <p className="text-muted-foreground">This is how your cards will look with the selected color.</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Category Colors</Label>
                      <div className="flex gap-1 flex-wrap">
                        {['motivational', 'life', 'wisdom', 'success', 'happiness', 'inspiration'].map((category, index) => {
                          const [h, s, l] = hexToHsl(customColor).split(' ').map(v => parseInt(v));
                          const categoryH = (h + (index * 60)) % 360;
                          const categoryHsl = `${categoryH} ${Math.max(s - 10, 20)}% ${Math.min(l + 10, 80)}%`;
                          return (
                            <Badge 
                              key={category}
                              variant="outline"
                              className="text-xs"
                              style={{ 
                                borderColor: `hsl(${categoryHsl})`,
                                color: `hsl(${categoryHsl})`
                              }}
                            >
                              {category}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
                      <strong>Auto-adjustments:</strong> Text colors, borders, and backgrounds automatically adapt for optimal readability and accessibility.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};