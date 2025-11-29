import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  genre_ids: number[];
}

interface MovieSearchProps {
  onSelectMovie: (movie: { title: string; releaseYear: number; posterUrl: string; genre: string }) => void;
}

export const MovieSearch = ({ onSelectMovie }: MovieSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchMovies = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // Using TMDB API (free, no key needed for basic search via their public endpoint)
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=YOUR_API_KEY&query=${encodeURIComponent(searchQuery)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setMovies(data.results?.slice(0, 6) || []);
      }
    } catch (error) {
      console.error("Error searching movies:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectMovie = (movie: Movie) => {
    const genreMap: { [key: number]: string } = {
      28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
      80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
      14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
      9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
      53: "Thriller", 10752: "War", 37: "Western"
    };
    
    onSelectMovie({
      title: movie.title,
      releaseYear: movie.release_date ? parseInt(movie.release_date.split("-")[0]) : new Date().getFullYear(),
      posterUrl: movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
        : "",
      genre: movie.genre_ids?.[0] ? genreMap[movie.genre_ids[0]] || "Unknown" : "Unknown"
    });
    setMovies([]);
    setSearchQuery("");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search for a movie..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && searchMovies()}
          className="flex-1"
        />
        <Button onClick={searchMovies} disabled={isSearching}>
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>
      
      {movies.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {movies.map((movie) => (
            <Card
              key={movie.id}
              className="p-3 cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleSelectMovie(movie)}
            >
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-32 object-cover rounded mb-2"
                />
              ) : (
                <div className="w-full h-32 bg-muted rounded mb-2 flex items-center justify-center text-muted-foreground text-sm">
                  No poster
                </div>
              )}
              <p className="font-medium text-sm line-clamp-2">{movie.title}</p>
              <p className="text-xs text-muted-foreground">
                {movie.release_date?.split("-")[0] || "N/A"}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
