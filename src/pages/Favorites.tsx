import { useState, useEffect } from "react";
import { Heart, Quote } from "lucide-react";
import QuoteCard from "@/components/QuoteCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const categories = [
  "all", "motivation", "success", "wisdom", "life", "inspiration", "business",
  "love", "friendship", "leadership", "creativity", "happiness", "health", 
  "education", "travel", "family", "other"
];

const getCategoryColor = (category: string) => {
  return `rgb(var(--category-${category}) / 0.2)`;
};

const getCategoryTextColor = (category: string) => {
  return `rgb(var(--category-${category}-dark))`;
};

interface Quote {
  id: string;
  content: string;
  author: string;
  category: string;
  user_id: string;
  created_at: string;
}

interface QuotesByCategory {
  [category: string]: Quote[];
}

const Favorites = () => {
  const [favoriteQuotes, setFavoriteQuotes] = useState<Quote[]>([]);
  const [quotesByCategory, setQuotesByCategory] = useState<QuotesByCategory>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  // Fetch favorite quotes
  useEffect(() => {
    const fetchFavoriteQuotes = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select(`
            quote_id,
            quotes (
              id,
              content,
              author,
              category,
              user_id,
              created_at
            )
          `)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching favorites:', error);
        } else {
          const quotes = data?.map(item => item.quotes).filter(Boolean) as Quote[] || [];
          setFavoriteQuotes(quotes);
          
          // Group quotes by category
          const grouped = quotes.reduce((acc: QuotesByCategory, quote) => {
            if (!acc[quote.category]) {
              acc[quote.category] = [];
            }
            acc[quote.category].push(quote);
            return acc;
          }, {});
          
          setQuotesByCategory(grouped);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteQuotes();
  }, [user]);


  const handleToggleFavorite = async (quoteId: string) => {
    if (!user) return;

    try {
      // Remove from favorites
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('quote_id', quoteId);

      if (!error) {
        // Update local state
        setFavoriteQuotes(prev => {
          const updated = prev.filter(quote => quote.id !== quoteId);
          
          // Re-group quotes by category
          const grouped = updated.reduce((acc: QuotesByCategory, quote) => {
            if (!acc[quote.category]) {
              acc[quote.category] = [];
            }
            acc[quote.category].push(quote);
            return acc;
          }, {});
          
          setQuotesByCategory(grouped);
          return updated;
        });
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
          <Heart className="h-10 w-10 text-red-500" />
          <span className="gradient-text">My Favorite Quotes</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your curated collection of inspiring quotes
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Category-wise Quote Sections */}
      {Object.entries(quotesByCategory).length > 0 ? (
        <div className="space-y-12">
          {Object.entries(quotesByCategory).map(([category, quotes]) => (
            <div key={category} className="animate-fade-in">
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-4 h-4 rounded-full border-2"
                  style={{ 
                    backgroundColor: getCategoryColor(category),
                    borderColor: getCategoryTextColor(category)
                  }}
                />
                <h2 
                  className="text-2xl font-bold"
                  style={{ color: getCategoryTextColor(category) }}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h2>
                <Badge 
                  variant="outline"
                  className="ml-2"
                  style={{
                    backgroundColor: getCategoryColor(category),
                    color: getCategoryTextColor(category),
                    borderColor: getCategoryTextColor(category)
                  }}
                >
                  {quotes.length}
                </Badge>
              </div>
              
              {/* Quotes Grid for this category */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quotes.map((quote, index) => (
                  <div
                    key={quote.id}
                    style={{ animationDelay: `${index * 100}ms` }}
                    className="animate-slide-up"
                  >
                    <QuoteCard
                      {...quote}
                      isFavorited={true}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : !loading && (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">
            No favorite quotes yet. Start exploring and save the ones you love!
          </p>
        </div>
      )}
    </div>
  );
};

export default Favorites;