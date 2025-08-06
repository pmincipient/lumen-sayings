import { useState, useEffect } from "react";
import { Palette, Moon, Sun, Brush, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import { toast } from "@/hooks/use-toast";
import { HexColorPicker } from "react-colorful";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    autoSave: true,
    language: "en",
  });
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
    
    // Calculate variations
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

  const handleSave = () => {
    // TODO: Save settings to Supabase
    toast({
      title: "Settings saved!",
      description: "Your preferences have been updated",
    });
  };

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="gradient-text">Settings</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Customize your QuickQuotes experience
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Theme Settings */}
        <Card className="glass-card animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Choose how QuickQuotes looks on your device
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Theme</Label>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  className="flex flex-col gap-2 h-auto p-4"
                  onClick={() => {
                    setTheme("light");
                    setShowColorPicker(false);
                  }}
                >
                  <Sun className="h-5 w-5" />
                  <span className="text-sm">Light</span>
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  className="flex flex-col gap-2 h-auto p-4"
                  onClick={() => {
                    setTheme("dark");
                    setShowColorPicker(false);
                  }}
                >
                  <Moon className="h-5 w-5" />
                  <span className="text-sm">Dark</span>
                </Button>
                <Button
                  variant={theme === "custom" ? "default" : "outline"}
                  className="flex flex-col gap-2 h-auto p-4"
                  onClick={handleCustomTheme}
                >
                  <Brush className="h-5 w-5" />
                  <span className="text-sm">Custom</span>
                </Button>
              </div>
            </div>

            {/* Custom Theme Color Picker */}
            {showColorPicker && (
              <div className="space-y-4 p-4 border rounded-lg bg-secondary/20">
                <Label>Choose Your Custom Color</Label>
                <div className="flex gap-6">
                  <div className="space-y-2">
                    <HexColorPicker color={customColor} onChange={handleColorChange} />
                    <div className="text-center text-sm font-mono">{customColor}</div>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <Label className="text-xs">Preview</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
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
                            style={{ 
                              borderColor: `hsl(${hexToHsl(customColor)})`,
                              color: `hsl(${hexToHsl(customColor)})`
                            }}
                          >
                            Outline
                          </Button>
                          <Badge 
                            style={{ 
                              backgroundColor: `hsl(${hexToHsl(customColor)})`,
                              color: parseInt(customColor.slice(1, 3), 16) + parseInt(customColor.slice(3, 5), 16) + parseInt(customColor.slice(5, 7), 16) > 384 ? '#000' : '#fff'
                            }}
                          >
                            Badge
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Colors will automatically adapt for optimal readability
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Manage how you receive updates and notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about new quotes and updates
                </p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) => handleSettingChange("notifications", checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Get weekly digest of popular quotes via email
                </p>
              </div>
              <Switch
                checked={settings.emailUpdates}
                onCheckedChange={(checked) => handleSettingChange("emailUpdates", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* General Settings */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>General</CardTitle>
            <CardDescription>
              General application preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-save Favorites</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically save quotes when you heart them
                </p>
              </div>
              <Switch
                checked={settings.autoSave}
                onCheckedChange={(checked) => handleSettingChange("autoSave", checked)}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label>Language</Label>
              <Select 
                value={settings.language} 
                onValueChange={(value) => handleSettingChange("language", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button 
          onClick={handleSave}
          className="w-full bg-primary hover:bg-primary-hover"
        >
          <Save className="w-4 h-4 mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;