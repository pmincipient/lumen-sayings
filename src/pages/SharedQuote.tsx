import { useParams, useNavigate } from "react-router-dom";
import { Heart, Copy, ArrowLeft, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Quote {
  id: string;
  content: string;
  author: string;
  category: string;
  user_id: string;
  created_at: string;
}

const SharedQuote = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const fetchQuote = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('quotes')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching quote:', error);
          toast({
            title: "Quote not found",
            description: "The shared quote could not be found.",
            variant: "destructive",
          });
          return;
        }

        setQuote(data);

        // Check if quote is favorited by current user
        if (user) {
          const { data: favoriteData } = await supabase
            .from('favorites')
            .select('quote_id')
            .eq('user_id', user.id)
            .eq('quote_id', id)
            .single();
          
          setIsFavorited(!!favoriteData);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [id, user]);

  const handleCopy = async () => {
    if (!quote) return;
    
    try {
      await navigator.clipboard.writeText(`"${quote.content}" - ${quote.author}`);
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

  const handleFavorite = async () => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }

    if (!quote) return;

    try {
      if (isFavorited) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('quote_id', quote.id);

        if (error) throw error;
        setIsFavorited(false);
        toast({
          title: "Removed from favorites",
          description: "Quote has been removed from your favorites",
        });
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            quote_id: quote.id,
          });

        if (error) throw error;
        setIsFavorited(true);
        toast({
          title: "Added to favorites",
          description: "Quote has been added to your favorites",
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive",
      });
    }
  };

  const handleAuthRedirect = () => {
    setShowAuthDialog(false);
    navigate('/auth');
  };

  const getCategoryColor = (category: string) => {
    return `rgb(var(--category-${category}) / 0.2)`;
  };

  const getCategoryBorderColor = (category: string) => {
    return `rgb(var(--category-${category}) / 0.4)`;
  };

  const getCategoryTextColor = (category: string) => {
    return `rgb(var(--category-${category}-dark))`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Quote Not Found</h1>
          <p className="text-muted-foreground mb-6">The shared quote could not be found.</p>
          <NavLink to="/">
            <Button>Go to Gallery</Button>
          </NavLink>
        </div>
      </div>
    );
  }

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
        <Card 
          className="glass-card animate-scale-in border-2" 
          style={{ 
            backgroundColor: getCategoryColor(quote.category),
            borderColor: getCategoryBorderColor(quote.category)
          }}
        >
          <CardContent className="p-8 md:p-12">
            <div className="text-center space-y-6">
              {/* Quote Content */}
              <blockquote className="text-2xl md:text-3xl leading-relaxed text-foreground font-medium">
                "{quote.content}"
              </blockquote>
              
              {/* Author */}
              <p className="text-lg md:text-xl font-semibold text-muted-foreground">
                — {quote.author}
              </p>
              
              {/* Category */}
              <div className="flex justify-center">
                <Badge 
                  variant="outline" 
                  className="border-2 font-medium px-4 py-2 text-sm"
                  style={{ 
                    backgroundColor: getCategoryColor(quote.category),
                    color: getCategoryTextColor(quote.category),
                    borderColor: getCategoryTextColor(quote.category)
                  }}
                >
                  {quote.category.charAt(0).toUpperCase() + quote.category.slice(1)}
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
                  onClick={handleFavorite}
                  className={`glass hover:bg-secondary ${isFavorited ? 'text-red-500 hover:text-red-600' : 'hover:text-red-500'}`}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
                  {isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
                </Button>
              </div>

              {/* Sign In/Sign Up prompt for non-authenticated users */}
              {!user && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
                  <p className="text-sm text-muted-foreground mb-3">
                    Create an account to save your favorite quotes and submit your own!
                  </p>
                  <NavLink to="/auth">
                    <Button variant="default" className="w-full">
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In / Sign Up
                    </Button>
                  </NavLink>
                </div>
              )}
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

        {/* Authentication Dialog */}
        <AlertDialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sign In Required</AlertDialogTitle>
              <AlertDialogDescription>
                You need to sign in or create an account to add quotes to your favorites. 
                Would you like to continue to the sign in page?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleAuthRedirect}>
                Sign In / Sign Up
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default SharedQuote;