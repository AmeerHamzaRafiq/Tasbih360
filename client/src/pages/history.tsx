import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { ChevronLeft } from "lucide-react";
import { useLocation } from "wouter";

type Tasbih = {
  id: number;
  title: string;
  count: number;
  createdAt: string;
};

export default function History() {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [, navigate] = useLocation();
  const [tasbihs, setTasbihs] = useState<Tasbih[]>([]);

  useEffect(() => {
    const storedTasbihs = localStorage.getItem('tasbihs');
    if (storedTasbihs) {
      setTasbihs(JSON.parse(storedTasbihs));
    }
  }, []);

  const years = Array.from(
    new Set(tasbihs.map((p) => new Date(p.createdAt).getFullYear()))
  ).sort();

  const filteredTasbihs = tasbihs.filter((tasbih) => {
    const tasbihYear = new Date(tasbih.createdAt).getFullYear().toString();
    return tasbihYear === year;
  });

  const chartData = filteredTasbihs.map((tasbih) => ({
    date: format(new Date(tasbih.createdAt), "MMM dd"),
    count: tasbih.count,
    title: tasbih.title
  }));

  const totalCount = filteredTasbihs.reduce((sum, t) => sum + t.count, 0);
  const avgCount = Math.round(totalCount / (filteredTasbihs.length || 1));

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Tasbih Count</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Daily Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Most Active Day</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredTasbihs.length > 0 ? (
                <div className="text-xl font-bold">
                  {format(
                    new Date(
                      filteredTasbihs.reduce((max, t) =>
                        t.count > max.count ? t : max
                      ).createdAt
                    ),
                    "MMM dd"
                  )}
                </div>
              ) : (
                <div className="text-xl font-bold">-</div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Daily Tasbih Counts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] sm:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background p-2 border rounded-lg shadow-sm">
                            <p className="font-medium">{payload[0].payload.title}</p>
                            <p>Count: {payload[0].value}</p>
                            <p>Date: {payload[0].payload.date}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Tasbih Count"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Tasbih History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTasbihs.slice().reverse().map((tasbih) => (
                <div
                  key={tasbih.id}
                  className="flex justify-between items-center p-4 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">{tasbih.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(tasbih.createdAt), "PPp")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{tasbih.count}</div>
                    <div className="text-sm text-muted-foreground">counts</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}