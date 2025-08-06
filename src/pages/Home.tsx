import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuoteCard from "@/components/QuoteCard";
import UpdateQuoteDialog from "@/components/UpdateQuoteDialog";
import LoadingSpinner from "@/components/LoadingSpinner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const categories = [
  "all", "motivation", "success", "wisdom", "life", "inspiration", "business",
  "love", "friendship", "leadership", "creativity", "happiness", "health", 
  "education", "travel", "family", "other"
];

interface Quote {
  id: string;
  content: string;
  author: string;
  category: string;
  user_id: string;
  created_at: string;
}

interface Favorite {
  quote_id: string;
}

const getCategoryColor = (category: string) => {
  return `rgb(var(--category-${category}) / 0.2)`;
};

const getCategoryTextColor = (category: string) => {
  return `rgb(var(--category-${category}-dark))`;
};

const Home = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedQuoteForUpdate, setSelectedQuoteForUpdate] = useState<Quote | null>(null);
  const { user } = useAuth();

  // Fetch quotes from Supabase
  useEffect(() => {
    const fetchQuotes = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('quotes')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching quotes:', error);
        } else {
          setQuotes(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  // Fetch user favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('quote_id')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching favorites:', error);
        } else {
          setFavorites(data?.map((fav: Favorite) => fav.quote_id) || []);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchFavorites();
  }, [user]);

  // Filter quotes
  useEffect(() => {
    let filtered = quotes;

    // Filter by tab (All/Mine/Others)
    if (selectedTab === "mine" && user) {
      filtered = filtered.filter(quote => quote.user_id === user.id);
    } else if (selectedTab === "others" && user) {
      filtered = filtered.filter(quote => quote.user_id !== user.id);
    }

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
  }, [quotes, selectedCategory, searchTerm, selectedTab, user]);

  const handleToggleFavorite = async (quoteId: string) => {
    if (!user) return;

    try {
      const isFavorited = favorites.includes(quoteId);
      
      if (isFavorited) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('quote_id', quoteId);

        if (!error) {
          setFavorites(prev => prev.filter(id => id !== quoteId));
        }
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert([{ user_id: user.id, quote_id: quoteId }]);

        if (!error) {
          setFavorites(prev => [...prev, quoteId]);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleDeleteQuote = async (quoteId: string) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', quoteId);

      if (error) {
        console.error('Error deleting quote:', error);
        toast({
          title: "Error deleting quote",
          description: "Please try again later",
          variant: "destructive",
        });
      } else {
        // Remove the quote from the local state
        setQuotes(prev => prev.filter(quote => quote.id !== quoteId));
        toast({
          title: "Quote deleted successfully!",
          description: "Your quote has been removed",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error deleting quote",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleUpdateQuote = (quoteId: string) => {
    const quote = quotes.find(q => q.id === quoteId);
    if (quote) {
      setSelectedQuoteForUpdate(quote);
      setUpdateDialogOpen(true);
    }
  };

  const handleQuoteUpdated = async () => {
    // Refresh quotes after update
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching quotes:', error);
      } else {
        setQuotes(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
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
        
        {/* Tab Filter */}
        <div className="mb-8">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          {user && <>
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="mine" disabled={!user}>Mine</TabsTrigger>
              <TabsTrigger value="others" disabled={!user}>Others</TabsTrigger>
            </TabsList>
            </>}
          </Tabs>
        </div>

        {/* Search Bar and Category Filter */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search quotes or authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass-card border-2"
            />
          </div>
          <div className="w-full sm:w-48">
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
                      </div>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
              onDelete={handleDeleteQuote}
              onUpdate={handleUpdateQuote}
            />
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredQuotes.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            {quotes.length === 0 
              ? "No quotes yet. Be the first to submit a quote!" 
              : "No quotes found. Try adjusting your search or category filter."
            }
          </p>
        </div>
      )}

      {/* Update Quote Dialog */}
      <UpdateQuoteDialog
        isOpen={updateDialogOpen}
        onClose={() => setUpdateDialogOpen(false)}
        quote={selectedQuoteForUpdate}
        onUpdate={handleQuoteUpdated}
      />
    </div>
  );
};

export default Home;
