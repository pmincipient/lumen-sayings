import { useState, useEffect } from "react";
import { Palette, Moon, Sun, Brush, Save, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { toast } from "@/hooks/use-toast";
import { HexColorPicker } from "react-colorful";

const Theme = () => {
  const { theme, setTheme } = useTheme();
  const [customColor, setCustomColor] = useState("#6366f1");
  const [showColorPicker, setShowColorPicker] = useState(theme === "custom");
  const [previousTheme, setPreviousTheme] = useState<string>("light");

  // Store previous theme when switching to custom
  useEffect(() => {
    if (theme && theme !== "custom") {
      setPreviousTheme(theme);
    }
  }, [theme]);

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

  // Handle theme selection
  const handleThemeSelect = (selectedTheme: string) => {
    setTheme(selectedTheme);
    if (selectedTheme === "custom") {
      setShowColorPicker(true);
      applyCustomTheme(customColor);
    } else {
      setShowColorPicker(false);
    }
  };

  // Handle color change
  const handleColorChange = (color: string) => {
    setCustomColor(color);
    if (theme === "custom") {
      applyCustomTheme(color);
    }
  };

  const handleApplyTheme = () => {
    setTheme("custom");
    applyCustomTheme(customColor);
    toast({
      title: "Custom theme applied!",
      description: "Your personalized theme has been activated",
    });
  };

  const handleResetTheme = () => {
    setTheme(previousTheme);
    setShowColorPicker(false);
    
    // Clear custom CSS variables by removing them
    const customProperties = ['--primary', '--primary-foreground', '--secondary', '--accent', '--border', '--ring'];
    customProperties.forEach(prop => {
      document.documentElement.style.removeProperty(prop);
    });
    
    // Clear category colors
    const categories = ['motivational', 'life', 'wisdom', 'success', 'happiness', 'inspiration'];
    categories.forEach(category => {
      document.documentElement.style.removeProperty(`--category-${category}`);
    });
    
    toast({
      title: "Theme reset!",
      description: `Restored to ${previousTheme} theme`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="gradient-text">Choose Theme</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Personalize your QuickQuotes experience with beautiful themes
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Theme Selection */}
        <Card className="glass-card animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Theme Options
            </CardTitle>
            <CardDescription>
              Choose how QuickQuotes looks on your device
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Light Theme */}
              <Card className={`cursor-pointer transition-all duration-200 hover:scale-105 ${theme === "light" ? "ring-2 ring-primary" : ""}`}>
                <CardContent className="p-6 text-center">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    className="flex flex-col gap-3 h-auto p-6 w-full"
                    onClick={() => handleThemeSelect("light")}
                  >
                    <Sun className="h-8 w-8" />
                    <span className="text-lg font-medium">Light Mode</span>
                    <span className="text-sm text-muted-foreground">Clean and bright interface</span>
                  </Button>
                </CardContent>
              </Card>

              {/* Dark Theme */}
              <Card className={`cursor-pointer transition-all duration-200 hover:scale-105 ${theme === "dark" ? "ring-2 ring-primary" : ""}`}>
                <CardContent className="p-6 text-center">
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    className="flex flex-col gap-3 h-auto p-6 w-full"
                    onClick={() => handleThemeSelect("dark")}
                  >
                    <Moon className="h-8 w-8" />
                    <span className="text-lg font-medium">Dark Mode</span>
                    <span className="text-sm text-muted-foreground">Easy on the eyes</span>
                  </Button>
                </CardContent>
              </Card>

              {/* Custom Theme */}
              <Card className={`cursor-pointer transition-all duration-200 hover:scale-105 ${theme === "custom" ? "ring-2 ring-primary" : ""}`}>
                <CardContent className="p-6 text-center">
                  <Button
                    variant={theme === "custom" ? "default" : "outline"}
                    className="flex flex-col gap-3 h-auto p-6 w-full"
                    onClick={() => handleThemeSelect("custom")}
                  >
                    <Brush className="h-8 w-8" />
                    <span className="text-lg font-medium">Custom Theme</span>
                    <span className="text-sm text-muted-foreground">Your personal touch</span>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Custom Theme Color Picker */}
        {showColorPicker && (
          <Card className="glass-card animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brush className="h-5 w-5" />
                Customize Your Theme
              </CardTitle>
              <CardDescription>
                Pick a color and see how it transforms your entire experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Color Picker */}
                <div className="space-y-4">
                  <Label className="text-lg font-medium">Pick Your Color</Label>
                  <div className="flex flex-col items-center space-y-4">
                    <HexColorPicker 
                      color={customColor} 
                      onChange={handleColorChange}
                      style={{ width: "250px", height: "250px" }}
                    />
                    <div className="text-center">
                      <div className="text-lg font-mono bg-muted px-4 py-2 rounded-lg">
                        {customColor}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Your selected color
                      </p>
                    </div>
                    <div className="w-full space-y-3">
                      <Button 
                        onClick={handleApplyTheme}
                        className="w-full bg-primary hover:bg-primary/90"
                        size="lg"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Apply Custom Theme
                      </Button>
                      <Button 
                        onClick={handleResetTheme}
                        variant="outline"
                        className="w-full"
                        size="lg"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset to {previousTheme === "light" ? "Light" : "Dark"} Theme
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Live Preview */}
                <div className="space-y-6">
                  <div>
                    <Label className="text-lg font-medium">Live Preview</Label>
                    <p className="text-sm text-muted-foreground">
                      See how your color affects different UI elements
                    </p>
                  </div>

                  {/* Button Previews */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Buttons</Label>
                    <div className="flex gap-3 flex-wrap">
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
                  </div>
                  
                  {/* Card Preview */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Sample Card</Label>
                    <Card 
                      className="transition-all duration-200"
                      style={{ 
                        borderColor: `hsl(${hexToHsl(customColor)})`,
                        backgroundColor: `hsl(${hexToHsl(customColor)} / 0.05)`
                      }}
                    >
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-foreground mb-2">Quote Card Preview</h3>
                        <p className="text-muted-foreground text-sm">
                          "The only way to do great work is to love what you do."
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">- Steve Jobs</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Category Colors Preview */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Category Colors</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['motivational', 'life', 'wisdom', 'success', 'happiness', 'inspiration'].map((category, index) => {
                        const [h, s, l] = hexToHsl(customColor).split(' ').map(v => parseInt(v));
                        const categoryH = (h + (index * 60)) % 360;
                        const categoryHsl = `${categoryH} ${Math.max(s - 10, 20)}% ${Math.min(l + 10, 80)}%`;
                        return (
                          <Badge 
                            key={category}
                            variant="outline"
                            className="text-xs justify-center py-1"
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

                  <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <strong>Smart Adjustments:</strong> Text colors, borders, and backgrounds automatically adapt for optimal readability and accessibility across your entire app.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Theme;