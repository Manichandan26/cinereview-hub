import { useState } from "react";
import { Film } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MovieSearchProps {
  onSelectMovie: (movie: { title: string; releaseYear: number; posterUrl: string; genre: string }) => void;
}

const genres = [
  "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", 
  "Drama", "Family", "Fantasy", "History", "Horror", "Music", 
  "Mystery", "Romance", "Sci-Fi", "Thriller", "War", "Western"
];

export const MovieSearch = ({ onSelectMovie }: MovieSearchProps) => {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");

  const handleAddMovie = () => {
    if (!title.trim()) return;
    
    onSelectMovie({
      title: title.trim(),
      releaseYear: year ? parseInt(year) : new Date().getFullYear(),
      posterUrl: "",
      genre: genre || "Unknown"
    });
    
    setTitle("");
    setYear("");
    setGenre("");
  };

  return (
    <div className="space-y-3">
      <div>
        <Input
          placeholder="Movie title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAddMovie()}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Input
          type="number"
          placeholder="Year (optional)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          min="1900"
          max={new Date().getFullYear()}
        />
        
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">Genre (optional)</option>
          {genres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
      
      <Button onClick={handleAddMovie} disabled={!title.trim()} className="w-full">
        <Film className="w-4 h-4 mr-2" />
        Add Movie
      </Button>
    </div>
  );
};
