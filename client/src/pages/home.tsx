import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus, History } from "lucide-react";
import { useLocation } from "wouter";
import bgImage from "../assets/tasbeeh.jpg";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  count: z.coerce
    .number()
    .min(1, "Count must be at least 1")
    .max(10000, "Count cannot exceed 10,000"),
});

export default function Home() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      count: 100,
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      // Placeholder for API call
      console.log('Creating counter:', data);
      setOpen(false);
      form.reset();
      toast({
        title: "Counter created",
        description: "Your new Tasbih counter has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create counter. Please try again.",
        variant: "destructive",
      });
    }
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
      <div className="container p-4 sm:p-6 md:p-8 max-w-2xl mx-auto flex-grow">
        <div className="bg-gray-200/90 backdrop-blur-sm mb-7 py-4 px-4 w-full flex justify-between rounded-md shadow-md">
          <div className="my-[-0.6rem]">
            <h1 className="racing-sans-one text-2xl sm:text-3xl mt-2 font-light">
              Tasbih
            </h1>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => navigate("/history")}
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
            >
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">New</span>
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md mx-4">
                <DialogHeader>
                  <DialogTitle>Create new counter</DialogTitle>
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
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Create</Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {/* Placeholder for CounterList */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium">Sample Counter</h3>
            <p className="text-gray-500">Click to start counting</p>
          </div>
        </div>
      </div>
    </div>
  );
}