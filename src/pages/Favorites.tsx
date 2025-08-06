import { useState } from "react";
import { Heart, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import QuoteCard from "@/components/QuoteCard";

// Mock favorites data
const mockFavorites = [
  {
    id: "1",
    content: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "motivation",
  },
  {
    id: "3",
    content: "The only true wisdom is in knowing you know nothing.",
    author: "Socrates", 
    category: "wisdom",
  },
];

const Favorites = () => {
  const [favorites, setFavorites] = useState(mockFavorites);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFavorites = favorites.filter(quote => 
    quote.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleFavorite = (quoteId: string) => {
    setFavorites(prev => prev.filter(quote => quote.id !== quoteId));
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

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-24 w-24 text-muted-foreground mx-auto mb-6 opacity-50" />
          <h2 className="text-2xl font-semibold mb-4">No favorites yet</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Start exploring quotes and save the ones that inspire you
          </p>
        </div>
      ) : (
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