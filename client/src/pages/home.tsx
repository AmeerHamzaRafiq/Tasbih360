import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaInstagram, FaGlobe, FaLinkedin } from "react-icons/fa";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Plus, History, Pencil, X } from "lucide-react";
import { useLocation } from "wouter";
import bgImage from "../assets/tasbeeh.jpg";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  count: z.coerce
    .number()
    .min(1, "Count must be at least 1")
    .max(10000, "Count cannot exceed 10,000"),
});

type Tasbih = {
  id: number;
  title: string;
  count: number;
  createdAt: string;
};

const buttonStyles = {
  editButton:
    "h-8 w-8 text-gray-600 hover:text-primary transition-colors duration-200",
  deleteButton:
    "h-8 w-8 text-gray-600 hover:text-red-500 transition-colors duration-200",
};

export default function Home() {
  const [open, setOpen] = useState(false);
  const [editTasbih, setEditTasbih] = useState<Tasbih | null>(null);
  const [tasbihs, setTasbihs] = useState<Tasbih[]>([]);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  useEffect(() => {
    const storedTasbihs = localStorage.getItem("tasbihs");
    if (storedTasbihs) {
      setTasbihs(JSON.parse(storedTasbihs));
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      count: 100,
    },
  });

  useEffect(() => {
    if (editTasbih) {
      form.reset({
        title: editTasbih.title,
        count: editTasbih.count,
      });
    }
  }, [editTasbih, form]);

  function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const tasbihs = JSON.parse(localStorage.getItem("tasbihs") || "[]");

      if (editTasbih) {
        // Update existing tasbih
        const updatedTasbihs = tasbihs.map((t: Tasbih) =>
          t.id === editTasbih.id
            ? { ...t, title: data.title, count: data.count }
            : t
        );
        localStorage.setItem("tasbihs", JSON.stringify(updatedTasbihs));
        setTasbihs(updatedTasbihs);
        setEditTasbih(null);
        toast({
          title: "Counter updated",
          description: "Your Tasbih counter has been updated successfully.",
        });
      } else {
        // Create new tasbih
        const newTasbih = {
          id: Date.now(),
          title: data.title,
          count: data.count,
          createdAt: new Date().toISOString(),
        };
        tasbihs.push(newTasbih);
        localStorage.setItem("tasbihs", JSON.stringify(tasbihs));
        setTasbihs(tasbihs);
        toast({
          title: "Counter created",
          description: "Your new Tasbih counter has been created successfully.",
        });
      }

      setOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save counter. Please try again.",
        variant: "destructive",
      });
    }
  }

  function handleDelete(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this counter?")) {
      const updatedTasbihs = tasbihs.filter((t) => t.id !== id);
      localStorage.setItem("tasbihs", JSON.stringify(updatedTasbihs));
      setTasbihs(updatedTasbihs);

      // Also clear history for this tasbih
      const history = JSON.parse(
        localStorage.getItem("tasbih_history") || "[]"
      );
      const updatedHistory = history.filter(
        (item: any) => item.tasbihId !== id
      );
      localStorage.setItem("tasbih_history", JSON.stringify(updatedHistory));

      toast({
        title: "Counter deleted",
        description: "The counter has been deleted successfully.",
      });
    }
  }

  function handleEdit(tasbih: Tasbih, e: React.MouseEvent) {
    e.stopPropagation();
    setEditTasbih(tasbih);
    setOpen(true);
  }

  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
      className="min-h-screen bg-background flex flex-col"
    >
      <div className="container p-4 sm:p-6 md:p-8 max-w-2xl mx-auto flex-grow mt-4">
        <div className="bg-gray-200 backdrop-blur-sm mb-6 py-4 px-4 w-full flex justify-between rounded-md shadow-md">
          <div>
            <h1 className="racing-sans-one text-3xl font-light">Tasbih</h1>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => navigate("/history")}
              size="sm"
              variant="outline"
              className="flex items-center gap-2 bg-slate-50"
            >
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
            </Button>
            <Dialog
              open={open}
              onOpenChange={(isOpen) => {
                setOpen(isOpen);
                if (!isOpen) {
                  setEditTasbih(null);
                  form.reset();
                }
              }}
            >
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center bg-red-700">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">New</span>
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md max-w-md mx-auto p-6 mt-2 rounded-2xl shadow-lg bg-white overflow-y-auto max-h-[80vh] fixed top-0 left-1/2 -translate-x-1/2 translate-y-0">
                <DialogHeader>
                  <DialogTitle>
                    {editTasbih ? "Edit counter" : "Create new counter"}
                  </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Zikr, Durood or any other prayer here !!!"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="count"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Count</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter count"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setOpen(false);
                          setEditTasbih(null);
                          form.reset();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editTasbih ? "Save Changes" : "Create"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {tasbihs.length === 0 ? (
          <motion.div
            className="inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-muted-foreground text-sm">
              <Typewriter
                options={{
                  strings: ["No counters yet. Create one to get started."],
                  autoStart: true,
                  loop: true,
                  delay: 50,
                }}
              />
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {tasbihs.map((tasbih) => (
              <div
                key={tasbih.id}
                className="bg-slate-200 backdrop-blur-sm p-4 rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer relative group border border-gray-300"
                onClick={() => navigate(`/counter/${tasbih.id}`)}
              >
                <div className="absolute top-2 right-2 flex gap-2 space-x-1 mt-6 mr-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className={`${buttonStyles.editButton} bg-slate-50 h-9 w-10`}
                    onClick={(e) => handleEdit(tasbih, e)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="destructive"
                    size="icon"
                    className={`${buttonStyles.deleteButton} h-9 w-10 bg-red-700`}
                    onClick={(e) => handleDelete(tasbih.id, e)}
                  >
                    <X className="h-5 w-5 text-white" />
                  </Button>
                </div>
                <h3 className="text-lg font-medium">{tasbih.title}</h3>
                <p className="text-gray-500">Progress: 0/{tasbih.count}</p>
                <p className="text-sm text-gray-400">
                  {new Date(tasbih.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="text-gray-300 text-center mb-5">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Muhammad Ameer Hamza.
          <br /> All rights reserved.
        </p>

        {/* Social Media Icons */}
        <div className="flex justify-center space-x-4 mt-3">
          <a
            href="https://www.instagram.com/al_quran360_/?__pwa=1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="text-xl hover:text-pink-500 transition" />
          </a>
          <a
            href="https://h-rportfolio.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGlobe className="text-xl hover:text-blue-400 transition" />
          </a>
          <a
            href="https://www.linkedin.com/in/muhammad-hamza-480597279/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin className="text-xl hover:text-blue-600 transition" />
          </a>
        </div>
      </footer>
    </div>
  );
}
