import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FavoriteButtonProps {
  userId: number;
  itemType: "recipe" | "activity";
  itemId: number;
  className?: string;
}

export default function FavoriteButton({ userId, itemType, itemId, className = "" }: FavoriteButtonProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Check if item is favorited
  const { data: favoriteStatus } = useQuery({
    queryKey: ["favorites", userId, itemType, itemId, "check"],
    queryFn: async () => {
      const response = await fetch(`/api/favorites/${userId}/${itemType}/${itemId}/check`);
      return response.json();
    },
  });

  const isFavorite = favoriteStatus?.isFavorite || false;

  // Add favorite mutation
  const addFavoriteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          itemType,
          itemId,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to add favorite");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast({
        title: "Added to favorites",
        description: `${itemType === "recipe" ? "Recipe" : "Activity"} saved to your profile`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add to favorites",
        variant: "destructive",
      });
    },
  });

  // Remove favorite mutation
  const removeFavoriteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/favorites/${userId}/${itemType}/${itemId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to remove favorite");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast({
        title: "Removed from favorites",
        description: `${itemType === "recipe" ? "Recipe" : "Activity"} removed from your profile`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove from favorites",
        variant: "destructive",
      });
    },
  });

  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeFavoriteMutation.mutate();
    } else {
      addFavoriteMutation.mutate();
    }
  };

  const isLoading = addFavoriteMutation.isPending || removeFavoriteMutation.isPending;

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
        isFavorite 
          ? "text-red-500 hover:text-red-600" 
          : "text-gray-400 hover:text-red-400"
      } ${className}`}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart 
        className={`w-5 h-5 transition-all ${
          isFavorite ? "fill-current" : ""
        } ${isLoading ? "animate-pulse" : ""}`} 
      />
    </button>
  );
}