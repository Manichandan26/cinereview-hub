import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { MovieSearch } from "./MovieSearch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const ReviewForm = ({ onReviewSubmitted }: { onReviewSubmitted: () => void }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<{ title: string; releaseYear: number; posterUrl: string; genre: string } | null>(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMovie || rating === 0 || !username || !email) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // First, create or get user
      const { data: existingUser } = await supabase
        .from("users")
        .select("user_id")
        .eq("email", email)
        .maybeSingle();

      let userId = existingUser?.user_id;

      if (!userId) {
        const { data: newUser, error: userError } = await supabase
          .from("users")
          .insert({ username, email })
          .select("user_id")
          .single();

        if (userError) throw userError;
        userId = newUser.user_id;
      }

      // Create or get movie
      const { data: existingMovie } = await supabase
        .from("movies")
        .select("movie_id")
        .eq("title", selectedMovie.title)
        .eq("release_year", selectedMovie.releaseYear)
        .maybeSingle();

      let movieId = existingMovie?.movie_id;

      if (!movieId) {
        const { data: newMovie, error: movieError } = await supabase
          .from("movies")
          .insert({
            title: selectedMovie.title,
            release_year: selectedMovie.releaseYear,
            poster_url: selectedMovie.posterUrl,
            genre: selectedMovie.genre
          })
          .select("movie_id")
          .single();

        if (movieError) throw movieError;
        movieId = newMovie.movie_id;
      }

      // Create review
      const { error: reviewError } = await supabase
        .from("reviews")
        .insert({
          movie_id: movieId,
          user_id: userId,
          rating,
          comment
        });

      if (reviewError) throw reviewError;

      toast.success("Review submitted successfully!");
      
      // Reset form
      setUsername("");
      setEmail("");
      setSelectedMovie(null);
      setRating(0);
      setComment("");
      
      onReviewSubmitted();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 shadow-card">
      <h2 className="text-2xl font-bold mb-6 text-primary">Submit a Review</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Username *</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Email *</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Search Movie *</label>
          <MovieSearch onSelectMovie={setSelectedMovie} />
          {selectedMovie && (
            <div className="mt-3 p-3 bg-muted rounded-lg">
              <p className="font-medium text-primary">{selectedMovie.title}</p>
              <p className="text-sm text-muted-foreground">
                {selectedMovie.releaseYear} • {selectedMovie.genre}
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Rating *</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoveredRating || rating)
                      ? "fill-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Your Review</label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this movie..."
            rows={4}
          />
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </Card>
  );
};
