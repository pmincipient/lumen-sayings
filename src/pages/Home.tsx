import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import QuoteCard from "@/components/QuoteCard";
import LoadingSpinner from "@/components/LoadingSpinner";

// Mock data for now
const mockQuotes = [
  {
    id: "1",
    content: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "motivation",
  },
  {
    id: "2", 
    content: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "success",
  },
  {
    id: "3",
    content: "The only true wisdom is in knowing you know nothing.",
    author: "Socrates", 
    category: "wisdom",
  },
  {
    id: "4",
    content: "Life is what happens to you while you're busy making other plans.",
    author: "John Lennon",
    category: "life",
  },
  {
    id: "5",
    content: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    category: "inspiration",
  },
  {
    id: "6",
    content: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
    category: "business",
  },
];

const categories = ["all", "motivation", "success", "wisdom", "life", "inspiration", "business"];

const Home = () => {
  const [quotes, setQuotes] = useState(mockQuotes);
  const [filteredQuotes, setFilteredQuotes] = useState(mockQuotes);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let filtered = quotes;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(quote => quote.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(quote => 
        quote.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredQuotes(filtered);
  }, [quotes, selectedCategory, searchTerm]);

  const handleToggleFavorite = (quoteId: string) => {
    setFavorites(prev => 
      prev.includes(quoteId) 
        ? prev.filter(id => id !== quoteId)
        : [...prev, quoteId]
    );
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
    return categoryMap[cat] || "";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="gradient-text">Discover Wisdom</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Find inspiration through carefully curated quotes from the world's greatest minds
        </p>
        
        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Search quotes or authors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 glass-card border-2"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                selectedCategory === category 
                  ? "bg-primary text-primary-foreground" 
                  : category !== "all" ? getCategoryClass(category) : "hover:bg-secondary"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Badge>
          ))}
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
              isFavorited={favorites.includes(quote.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredQuotes.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            No quotes found. Try adjusting your search or category filter.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;