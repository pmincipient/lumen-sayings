import { useState, useEffect } from "react";
import { Heart, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import QuoteCard from "@/components/QuoteCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Quote {
  id: string;
  content: string;
  author: string;
  category: string;
  user_id: string;
  created_at: string;
}

const Favorites = () => {
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  // Fetch user's favorite quotes
  useEffect(() => {
    const fetchFavorites = async () => {
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
          const favoriteQuotes = data?.map((fav: any) => fav.quotes).filter(Boolean) || [];
          setFavorites(favoriteQuotes);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const filteredFavorites = favorites.filter(quote => 
    quote.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleFavorite = async (quoteId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('quote_id', quoteId);

      if (!error) {
        setFavorites(prev => prev.filter(quote => quote.id !== quoteId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
          <Heart className="h-10 w-10 text-red-500 fill-current" />
          <span className="gradient-text">Your Favorites</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your personally curated collection of inspiring quotes
        </p>
      </div>

      {favorites.length > 0 && (
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search your favorites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass-card border-2"
            />
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {!loading && favorites.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-24 w-24 text-muted-foreground mx-auto mb-6 opacity-50" />
          <h2 className="text-2xl font-semibold mb-4">No favorites yet</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Start exploring quotes and save the ones that inspire you
          </p>
        </div>
      ) : !loading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFavorites.map((quote, index) => (
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

          {filteredFavorites.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No favorites match your search. Try a different term.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Favorites;