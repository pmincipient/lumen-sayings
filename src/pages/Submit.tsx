import { useState } from "react";
import { Send, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const categories = ["motivation", "success", "wisdom", "life", "inspiration", "business"];

const Submit = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    content: "",
    author: "",
    category: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim() || !formData.author.trim() || !formData.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement Supabase submission
      console.log("Submitting quote:", formData);
      
      toast({
        title: "Quote submitted!",
        description: "Thank you for contributing to our collection",
      });
      
      // Reset form
      setFormData({ content: "", author: "", category: "" });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
          <Quote className="h-10 w-10 text-primary" />
          <span className="gradient-text">Submit a Quote</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Share wisdom and inspiration with the QuickQuotes community
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="glass-card animate-scale-in">
          <CardHeader>
            <CardTitle>Add Your Quote</CardTitle>
            <CardDescription>
              Help others discover wisdom by sharing meaningful quotes
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="content">Quote Content *</Label>
                <Textarea
                  id="content"
                  placeholder="Enter the quote here..."
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  className="min-h-[120px] resize-none"
                  maxLength={500}
                />
                <p className="text-sm text-muted-foreground text-right">
                  {formData.content.length}/500 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  type="text"
                  placeholder="Who said this quote?"
                  value={formData.author}
                  onChange={(e) => handleInputChange("author", e.target.value)}
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleInputChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Preview */}
              {formData.content && formData.author && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="glass-card p-4 border-2 border-dashed">
                    <blockquote className="text-lg italic mb-2">
                      "{formData.content}"
                    </blockquote>
                    <p className="text-sm font-medium text-muted-foreground">
                      — {formData.author}
                    </p>
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary-hover"
                disabled={loading}
              >
                <Send className="w-4 h-4 mr-2" />
                {loading ? "Submitting..." : "Submit Quote"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Submit;