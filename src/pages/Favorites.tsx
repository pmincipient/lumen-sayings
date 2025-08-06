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

interface CategoryStats {
  category: string;
  count: number;
}

const Favorites = () => {
  const [favoriteQuotes, setFavoriteQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
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
          
          // Calculate category stats
          const stats = categories.slice(1).map(category => ({
            category,
            count: quotes.filter(quote => quote.category === category).length
          })).filter(stat => stat.count > 0);
          
          setCategoryStats(stats);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteQuotes();
  }, [user]);

  // Filter quotes by category
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredQuotes(favoriteQuotes);
    } else {
      setFilteredQuotes(favoriteQuotes.filter(quote => quote.category === selectedCategory));
    }
  }, [favoriteQuotes, selectedCategory]);

  const handleToggleFavorite = async (quoteId: string) => {
    if (!user) return;

    try {
      // Remove from favorites (since we're on favorites page, only removal makes sense)
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('quote_id', quoteId);

      if (!error) {
        // Update local state
        setFavoriteQuotes(prev => prev.filter(quote => quote.id !== quoteId));
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

      {/* Category Stats */}
      {categoryStats.length > 0 && (
        <div className="mb-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categoryStats.map((stat) => (
                  <Badge
                    key={stat.category}
                    variant="outline"
                    className="cursor-pointer border-2"
                    style={{
                      backgroundColor: getCategoryColor(stat.category),
                      color: getCategoryTextColor(stat.category),
                      borderColor: getCategoryTextColor(stat.category)
                    }}
                    onClick={() => setSelectedCategory(stat.category)}
                  >
                    {stat.category.charAt(0).toUpperCase() + stat.category.slice(1)} ({stat.count})
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex justify-center mb-8">
        <div className="w-full max-w-xs">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="glass-card border-2">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? (
                    "All Categories"
                  ) : (
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full border"
                        style={{ 
                          backgroundColor: getCategoryColor(category),
                          borderColor: getCategoryTextColor(category)
                        }}
                      />
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                      {categoryStats.find(s => s.category === category) && (
                        <span className="text-xs text-muted-foreground">
                          ({categoryStats.find(s => s.category === category)?.count})
                        </span>
                      )}
                    </div>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Quotes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuotes.map((quote, index) => (
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

      {/* No Results */}
      {filteredQuotes.length === 0 && !loading && (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">
            {favoriteQuotes.length === 0 
              ? "No favorite quotes yet. Start exploring and save the ones you love!"
              : "No quotes found in this category."
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Favorites;