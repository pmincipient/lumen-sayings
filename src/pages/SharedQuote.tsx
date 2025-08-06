import { useParams } from "react-router-dom";
import { Share2, Heart, Copy, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { NavLink } from "react-router-dom";

// Mock data - this would come from Supabase
const mockQuote = {
  id: "1",
  content: "The only way to do great work is to love what you do.",
  author: "Steve Jobs",
  category: "motivation",
};

const SharedQuote = () => {
  const { id } = useParams();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`"${mockQuote.content}" - ${mockQuote.author}`);
      toast({
        title: "Copied to clipboard",
        description: "Quote has been copied to your clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "QuickQuotes - Inspiring Quote",
          text: `"${mockQuote.content}" - ${mockQuote.author}`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      handleCopy();
    }
  };

  const getCategoryClass = (cat: string) => {
    const categoryMap: Record<string, string> = {
      motivation: "category-motivation",
      success: "category-success", 
      wisdom: "category-wisdom",
      life: "category-life",
      inspiration: "category-inspiration",
      business: "category-business",
    };
    return categoryMap[cat.toLowerCase()] || "category-motivation";
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl space-y-6">
        {/* Back Button */}
        <NavLink to="/">
          <Button variant="ghost" className="glass hover:bg-secondary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Gallery
          </Button>
        </NavLink>

        {/* Quote Card */}
        <Card className="glass-card animate-scale-in">
          <CardContent className="p-8 md:p-12">
            <div className="text-center space-y-6">
              {/* Quote Content */}
              <blockquote className="text-2xl md:text-3xl leading-relaxed text-foreground font-medium">
                "{mockQuote.content}"
              </blockquote>
              
              {/* Author */}
              <p className="text-lg md:text-xl font-semibold text-muted-foreground">
                — {mockQuote.author}
              </p>
              
              {/* Category */}
              <div className="flex justify-center">
                <Badge 
                  variant="outline" 
                  className={`${getCategoryClass(mockQuote.category)} border-2 font-medium px-4 py-2 text-sm`}
                >
                  {mockQuote.category}
                </Badge>
              </div>
              
              {/* Actions */}
              <div className="flex items-center justify-center space-x-4 pt-6">
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  className="glass hover:bg-secondary"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Quote
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="glass hover:bg-secondary"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                
                <Button
                  variant="outline"
                  className="glass hover:bg-secondary text-red-500 hover:text-red-600"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Add to Favorites
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Branding */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Shared from{" "}
            <NavLink to="/" className="text-primary font-medium hover:underline">
              QuickQuotes
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SharedQuote;