import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/circular-progress";
import { ChevronLeft, RotateCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import confetti from "canvas-confetti";

export default function Counter() {
  const [, navigate] = useLocation();
  const { id } = useParams();
  const [showComplete, setShowComplete] = useState(false);
  const [current, setCurrent] = useState(0);

  // Get tasbih data from localStorage
  const tasbihs = JSON.parse(localStorage.getItem('tasbihs') || '[]');
  const tasbih = tasbihs.find((t: any) => t.id === Number(id));

  if (!tasbih) {
    navigate("/");
    return null;
  }

  function increment() {
    if (current >= tasbih.count) return;

    const newCount = current + 1;
    setCurrent(newCount);

    if (newCount === tasbih.count) {
      setShowComplete(true);
      // Update in localStorage
      const updatedTasbihs = tasbihs.map((t: any) => 
        t.id === tasbih.id ? { ...t, count: newCount } : t
      );
      localStorage.setItem('tasbihs', JSON.stringify(updatedTasbihs));

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }

  function resetCounter() {
    setCurrent(0);
    setShowComplete(false);
  }

  return (
    <div 
      className="min-h-screen bg-background flex flex-col touch-none"
      onClick={increment}
    >
      <div className="container p-4 sm:p-6 md:p-8 max-w-2xl mx-auto w-full flex-grow flex flex-col">
        <div 
          className="bg-muted/20 backdrop-blur-sm py-4 px-4 w-full rounded-md shadow-sm flex items-center justify-between mb-4 sm:mb-8"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-sm md:text-base hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            variant="outline"
            onClick={resetCounter}
            className="text-sm md:text-base hover:text-primary"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Restart
          </Button>
        </div>

        <div className="text-center mb-6 md:mb-8">
          <h1 className="racing-sans-one text-2xl md:text-3xl font-bold mb-2 border-b-2 border-gray-300 pb-2">
            {tasbih.title}
          </h1>
        </div>

        <div className="flex-grow flex flex-col justify-center items-center">
          <CircularProgress current={current} total={tasbih.count} />
        </div>

        <Dialog open={showComplete} onOpenChange={setShowComplete}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-primary">
                Masha Allah! 🎉
              </DialogTitle>
              <DialogDescription>
                You have completed {tasbih.count} counts of {tasbih.title}
                <br />
                <b>"May Allah accept your recitation."</b>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  resetCounter();
                  setShowComplete(false);
                  navigate("/");
                }}
              >
                Back to Home
              </Button>
              <Button
                onClick={() => {
                  resetCounter();
                }}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Continue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}