import { useState } from "react";
import { Film } from "lucide-react";
import { ReviewForm } from "@/components/ReviewForm";
import { ReviewsList } from "@/components/ReviewsList";

const Index = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleReviewSubmitted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-cinematic">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg shadow-glow">
              <Film className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">CineReview</h1>
              <p className="text-sm text-muted-foreground">Share Your Movie Experience</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4 py-8">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-gold bg-clip-text text-transparent">
            Rate & Review Movies
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover, review, and share your favorite films with the community
          </p>
        </section>

        {/* Review Form */}
        <section className="max-w-3xl mx-auto">
          <ReviewForm onReviewSubmitted={handleReviewSubmitted} />
        </section>

        {/* Reviews List */}
        <section className="max-w-6xl mx-auto">
          <ReviewsList refreshTrigger={refreshTrigger} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground text-sm">
          <p>© 2025 CineReview. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
