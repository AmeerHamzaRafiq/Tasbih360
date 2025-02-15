import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, XCircle } from "lucide-react";
import { Link } from "wouter";
import { Counter } from "@/lib/types";
import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditCounter } from "@/lib/queries";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Typewriter from "typewriter-effect";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

const editFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  count: z.coerce
    .number()
    .min(1, "Count must be at least 1")
    .max(10000, "Count cannot exceed 10,000"),
});

type EditFormData = z.infer<typeof editFormSchema>;

export function CounterList({
  counters,
  onDelete,
}: {
  counters: Counter[];
  onDelete: (id: string) => void;
}) {
  const [editingCounter, setEditingCounter] = useState<Counter | null>(null);
  const { toast } = useToast();
  const { mutate: editCounterMutation } = useEditCounter();

  const form = useForm<EditFormData>({
    resolver: zodResolver(editFormSchema),
  });

  const onSubmit = (data: EditFormData) => {
    if (!editingCounter) return;

    try {
      editCounterMutation(
        { id: editingCounter.id, data },
        {
          onSuccess: () => {
            setEditingCounter(null);
            form.reset();
            toast({
              title: "Success",
              description: "Counter updated successfully!",
            });
          },
        }
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update counter.",
        variant: "destructive",
      });
    }
  };

  if (counters.length === 0) {
    return (
      <motion.div
        className="inset-0 flex items-center justify-center "
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
    );
  }

  return (
    <div className="grid gap-4">
      {counters.map((counter) => (
        <Link key={counter.id} href={`/counter/${counter.id}`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg md:text-xl text-primary">
                    {counter.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Progress: {counter.current} / {counter.count}
                  </p>
                </div>
                <div
                  className="flex gap-2 ml-4"
                  onClick={(e) => e.preventDefault()}
                >
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditingCounter(counter);
                      form.reset({
                        title: counter.title,
                        count: counter.count,
                      });
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      onDelete(counter.id);
                    }}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}

      <Dialog
        open={!!editingCounter}
        onOpenChange={() => setEditingCounter(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Counter</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title" {...field} />
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
                        max="10000"
                        placeholder="Enter count"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingCounter(null);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
