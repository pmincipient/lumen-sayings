import { useState } from "react";
import { Heart, Share2, Copy, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface QuoteCardProps {
  id: string;
  content: string;
  author: string;
  category: string;
  isFavorited?: boolean;
  onToggleFavorite?: (id: string) => void;
}

const QuoteCard = ({ 
  id, 
  content, 
  author, 
  category, 
  isFavorited = false, 
  onToggleFavorite 
}: QuoteCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`"${content}" - ${author}`);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Quote has been copied to your clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
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
          title: "Check out this quote",
          text: `"${content}" - ${author}`,
          url: `${window.location.origin}/shared/${id}`,
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
    <Card className="glass-card group hover:scale-[1.02] transition-all duration-300 animate-fade-in">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Quote Content */}
          <blockquote className="text-lg leading-relaxed text-foreground">
            "{content}"
          </blockquote>
          
          {/* Author */}
          <p className="text-sm font-medium text-muted-foreground">
            — {author}
          </p>
          
          {/* Category Badge */}
          <div className="flex items-center justify-between">
            <Badge 
              variant="outline" 
              className={`${getCategoryClass(category)} border-2 font-medium`}
            >
              {category}
            </Badge>
            
            {/* Actions */}
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onToggleFavorite?.(id)}
                className={`h-8 w-8 ${isFavorited ? 'text-red-500 hover:text-red-600' : 'hover:text-red-500'}`}
              >
                <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
              </Button>
              
              <Button
                size="icon"
                variant="ghost"
                onClick={handleCopy}
                className="h-8 w-8 hover:text-primary"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              
              <Button
                size="icon"
                variant="ghost"
                onClick={handleShare}
                className="h-8 w-8 hover:text-primary"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteCard;