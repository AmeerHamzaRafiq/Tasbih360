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
import { CounterList } from "@/components/counter-list";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { useCounters, useCreateCounter, useDeleteCounter } from "@/lib/queries";
import bgImage from "../../../assets/tasbeeh.jpg";
import { FaInstagram, FaGlobe, FaLinkedin } from "react-icons/fa";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  count: z.coerce
    .number()
    .min(1, "Count must be at least 1")
    .max(10000, "Count cannot exceed 10,000"),
});

export default function Home() {
  const [open, setOpen] = useState(false);
  const { data: counters = [] } = useCounters();
  const { mutate: createCounterMutation } = useCreateCounter();
  const { mutate: deleteCounterMutation } = useDeleteCounter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      count: 100,
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      createCounterMutation(data);
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

  function onDelete(id: string) {
    try {
      deleteCounterMutation(id);
      toast({
        title: "Counter deleted",
        description: "The counter has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete counter.",
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
      <div className="container p-4 sm:p-6 md:p-8 max-w-2xl mx-auto flex-grow ">
        <div className="bg-gray-200 mb-7 py-6 px-4 w-full flex justify-between rounded-md shadow-md">
          <div className="my-[-0.6rem]">
            <h1 className="racing-sans-one text-3xl mt-2 font-light">Tasbih</h1>
          </div>

          <div className="flex gap-2">
            <Button
              size="lg"
              className="md:text-base flex items-center space-x-2 h-9"
            >
              History
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="md:text-base flex items-center space-x-2 h-9"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
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
        <CounterList counters={counters} onDelete={onDelete} />
      </div>
      // footer airea
      <footer className="text-gray-300 text-center pb-10 mt-auto">
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
