import { useEffect, useState } from "react";
import { Star, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface Review {
  review_id: string;
  rating: number;
  comment: string;
  created_at: string;
  movies: {
    title: string;
    release_year: number;
    poster_url: string;
    genre: string;
  };
  users: {
    username: string;
  };
}

export const ReviewsList = ({ refreshTrigger }: { refreshTrigger: number }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [refreshTrigger]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          review_id,
          rating,
          comment,
          created_at,
          movies (title, release_year, poster_url, genre),
          users (username)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Loading reviews...
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">Recent Reviews</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        {reviews.map((review, index) => (
          <Card 
            key={review.review_id} 
            className="p-6 shadow-card animate-fade-in hover:border-primary/50 transition-colors"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex gap-4">
              {review.movies.poster_url ? (
                <img
                  src={review.movies.poster_url}
                  alt={review.movies.title}
                  className="w-24 h-36 object-cover rounded shadow-lg"
                />
              ) : (
                <div className="w-24 h-36 bg-muted rounded flex items-center justify-center">
                  <span className="text-muted-foreground text-xs">No poster</span>
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg mb-1 text-primary line-clamp-1">
                  {review.movies.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {review.movies.release_year} • {review.movies.genre}
                </p>
                
                <div className="flex items-center gap-2 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? "fill-primary text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                
                {review.comment && (
                  <p className="text-sm mb-3 line-clamp-3">{review.comment}</p>
                )}
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <User className="w-3 h-3" />
                  <span>{review.users.username}</span>
                  <span>•</span>
                  <span>{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
