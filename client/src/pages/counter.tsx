import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/circular-progress";
import { ChevronLeft, RotateCcw } from "lucide-react";
import { DotLottiePlayer } from "@dotlottie/react-player";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import confetti from "canvas-confetti";
import bgImage from "../assets/bg.png";

export default function Counter() {
  const [, navigate] = useLocation();
  const { id } = useParams();
  const [showComplete, setShowComplete] = useState(false);
  const [current, setCurrent] = useState(0);

  // Get tasbih data from localStorage
  const tasbihs = JSON.parse(localStorage.getItem("tasbihs") || "[]");
  const tasbih = tasbihs.find((t: any) => t.id === Number(id));

  // Load saved progress when component mounts
  useEffect(() => {
    const progress = localStorage.getItem(`tasbih_progress_${id}`);
    if (progress) {
      setCurrent(parseInt(progress));
    }
  }, [id]);

  // Save progress when component unmounts or when current changes
  useEffect(() => {
    localStorage.setItem(`tasbih_progress_${id}`, current.toString());

    // Save to history when progress is made
    // Only save to history when counter is completed
    if (current === tasbih?.count) {
      const historyItem = {
        id: Date.now(),
        tasbihId: Number(id),
        title: tasbih?.title,
        total: tasbih?.count,
        current: current,
        timestamp: new Date().toISOString(),
      };

      const history = JSON.parse(
        localStorage.getItem("tasbih_history") || "[]"
      );
      history.push(historyItem);
      localStorage.setItem("tasbih_history", JSON.stringify(history));
    }
  }, [current, id, tasbih]);

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
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }

  function resetCounter() {
    setCurrent(0);
    setShowComplete(false);
    localStorage.removeItem(`tasbih_progress_${id}`);
  }

  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,

        backgroundPosition: "center",
        backgroundRepeat: "repeat",
      }}
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
          <div className="mt-[90px] sm:mt-16 md:mt-0 flex justify-center items-center relative mb-14 sm:mb-32">
            <DotLottiePlayer
              src="https://lottie.host/c8eec2f4-e353-4437-8b50-98f36400cd19/qz1AeuZFVQ.lottie"
              autoplay
              loop
              style={{
                width: "150px",
                height: "150px",
                position: "absolute",
                left: "50%",
                marginTop: "0px",
                transform: "translateX(-50%)",
              }}
            />
          </div>
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
