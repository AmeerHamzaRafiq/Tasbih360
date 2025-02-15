import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { ChevronLeft } from "lucide-react";
import { useLocation } from "wouter";

type HistoryItem = {
  id: number;
  tasbihId: number;
  title: string;
  total: number;
  current: number;
  timestamp: string;
};

export default function History() {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [, navigate] = useLocation();
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem('tasbih_history');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  const years = Array.from(
    new Set(history.map((item) => new Date(item.timestamp).getFullYear()))
  ).sort();

  const filteredHistory = history.filter((item) => {
    const itemYear = new Date(item.timestamp).getFullYear().toString();
    return itemYear === year;
  });

  // Group history by date
  const groupedByDate = filteredHistory.reduce((acc, item) => {
    const date = format(new Date(item.timestamp), "MMM dd");
    if (!acc[date]) {
      acc[date] = { total: 0, current: 0, items: [] };
    }
    acc[date].total += item.total;
    acc[date].current += item.current;
    acc[date].items.push(item);
    return acc;
  }, {} as Record<string, { total: number; current: number; items: HistoryItem[] }>);

  const chartData = Object.entries(groupedByDate).map(([date, data]) => ({
    date,
    total: data.total,
    completed: data.current,
    items: data.items
  }));

  const totalCount = filteredHistory.reduce((sum, item) => sum + item.current, 0);
  const avgCount = Math.round(totalCount / (Object.keys(groupedByDate).length || 1));

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
              <CardTitle className="text-lg">Total Progress</CardTitle>
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
              {chartData.length > 0 ? (
                <div className="text-xl font-bold">
                  {Object.entries(groupedByDate)
                    .reduce((max, [date, data]) => 
                      data.current > max.current ? { date, current: data.current } : max
                    , { date: '', current: 0 }).date}
                </div>
              ) : (
                <div className="text-xl font-bold">-</div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Daily Progress</CardTitle>
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
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background p-3 border rounded-lg shadow-sm">
                            <p className="font-medium mb-2">Date: {data.date}</p>
                            <p className="mb-1">Total Goal: {data.total}</p>
                            <p className="mb-2">Completed: {data.completed}</p>
                            <div className="space-y-1">
                              {data.items.map((item: HistoryItem) => (
                                <p key={item.id} className="text-sm">
                                  {item.title}: {item.current}/{item.total}
                                </p>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    name="Total Goal"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    name="Completed"
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
            <CardTitle>Recent Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredHistory.slice().reverse().map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-4 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(item.timestamp), "PPp")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {item.current}/{item.total}
                    </div>
                    <div className="text-sm text-muted-foreground">progress</div>
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