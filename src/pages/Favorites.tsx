import { useState, useEffect } from "react";
import { Heart, ArrowLeft } from "lucide-react";
import QuoteCard from "@/components/QuoteCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const categories = [
  "motivation", "success", "wisdom", "life", "inspiration", "business",
  "love", "friendship", "leadership", "creativity", "happiness", "health", 
  "education", "travel", "family", "other"
];

const getCategoryColor = (category: string) => {
  return `rgb(var(--category-${category}) / 0.3)`;
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
  quotes: Quote[];
}

const Favorites = () => {
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  // Fetch favorite quotes and group by category
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
          
          // Group quotes by category and calculate stats
          const stats = categories.map(category => {
            const categoryQuotes = quotes.filter(quote => quote.category === category);
            return {
              category,
              count: categoryQuotes.length,
              quotes: categoryQuotes
            };
          }).filter(stat => stat.count > 0);
          
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
        setCategoryStats(prev => 
          prev.map(stat => ({
            ...stat,
            quotes: stat.quotes.filter(quote => quote.id !== quoteId),
            count: stat.quotes.filter(quote => quote.id !== quoteId).length
          })).filter(stat => stat.count > 0)
        );
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  // Show category view
  if (selectedCategory) {
    const categoryData = categoryStats.find(stat => stat.category === selectedCategory);
    
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Header with back button */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => setSelectedCategory(null)}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div 
              className="w-6 h-6 rounded-full border-2"
              style={{ 
                backgroundColor: getCategoryColor(selectedCategory),
                borderColor: getCategoryTextColor(selectedCategory)
              }}
            />
            <h1 
              className="text-3xl font-bold"
              style={{ color: getCategoryTextColor(selectedCategory) }}
            >
              {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Quotes
            </h1>
            <Badge 
              variant="outline"
              className="ml-2"
              style={{
                backgroundColor: getCategoryColor(selectedCategory),
                color: getCategoryTextColor(selectedCategory),
                borderColor: getCategoryTextColor(selectedCategory)
              }}
            >
              {categoryData?.count || 0}
            </Badge>
          </div>
        </div>

        {/* Quotes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryData?.quotes.map((quote, index) => (
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
    );
  }

  // Show category cards view
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
          <Heart className="h-10 w-10 text-red-500" />
          <span className="gradient-text">My Favorite Quotes</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your curated collection organized by categories
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Category Cards */}
      {categoryStats.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoryStats.map((stat, index) => (
            <Card
              key={stat.category}
              className="glass-card cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-300 border-2 overflow-hidden"
              style={{ 
                backgroundColor: getCategoryColor(stat.category),
                borderColor: getCategoryTextColor(stat.category),
                animationDelay: `${index * 100}ms`
              }}
              onClick={() => setSelectedCategory(stat.category)}
            >
              <CardHeader className="pb-2">
                <CardTitle 
                  className="text-xl font-bold mb-2"
                  style={{ color: getCategoryTextColor(stat.category) }}
                >
                  {stat.category.charAt(0).toUpperCase() + stat.category.slice(1)} Category
                </CardTitle>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span 
                      className="text-3xl font-bold"
                      style={{ color: getCategoryTextColor(stat.category) }}
                    >
                      {stat.count}
                    </span>
                    <span 
                      className="text-sm opacity-80"
                      style={{ color: getCategoryTextColor(stat.category) }}
                    >
                      {stat.count === 1 ? 'Quote' : 'Quotes'}
                    </span>
                  </div>
                  <Badge 
                    variant="outline"
                    className="px-3 py-1 border-2 font-medium hover:bg-white/20 transition-colors"
                    style={{
                      backgroundColor: 'transparent',
                      color: getCategoryTextColor(stat.category),
                      borderColor: getCategoryTextColor(stat.category)
                    }}
                  >
                    View Quotes →
                  </Badge>
                </div>
              </CardHeader>
            </Card>
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