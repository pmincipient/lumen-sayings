
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const categories = [
  "motivation", "success", "wisdom", "life", "inspiration", "business",
  "love", "friendship", "leadership", "creativity", "happiness", "health", 
  "education", "travel", "family", "other"
];

interface Quote {
  id: string;
  content: string;
  author: string;
  category: string;
}

interface UpdateQuoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  quote: Quote | null;
  onUpdate: () => void;
}

const UpdateQuoteDialog = ({ isOpen, onClose, quote, onUpdate }: UpdateQuoteDialogProps) => {
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (quote) {
      setContent(quote.content);
      setAuthor(quote.author);
      setCategory(quote.category);
    }
  }, [quote]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quote) return;

    if (!content.trim() || !author.trim() || !category) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('quotes')
        .update({
          content: content.trim(),
          author: author.trim(),
          category: category,
          updated_at: new Date().toISOString(),
        })
        .eq('id', quote.id);

      if (error) {
        console.error('Error updating quote:', error);
        toast({
          title: "Error updating quote",
          description: "Please try again later",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Quote updated successfully!",
          description: "Your quote has been updated",
        });
        onUpdate();
        onClose();
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error updating quote",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form when closing
    if (quote) {
      setContent(quote.content);
      setAuthor(quote.author);
      setCategory(quote.category);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Quote</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Quote Content</Label>
            <Textarea
              id="content"
              placeholder="Enter the quote..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              placeholder="Who said this quote?"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Quote"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateQuoteDialog;
