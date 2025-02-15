import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const [selectedMonth, setSelectedMonth] = useState<string>();
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

  const totalCount = history.reduce((sum, item) => sum + item.current, 0);
  const totalItems = history.length || 1;
  const avgCount = Math.round(totalCount / totalItems);

  // Calculate yearly totals
  const yearlyTotals = history.reduce((acc, item) => {
    const itemYear = new Date(item.timestamp).getFullYear().toString();
    if (!acc[itemYear]) {
      acc[itemYear] = { total: 0, items: {} };
    }
    acc[itemYear].total += item.current;
    
    const month = format(new Date(item.timestamp), "MMMM");
    if (!acc[itemYear].items[month]) {
      acc[itemYear].items[month] = 0;
    }
    acc[itemYear].items[month] += item.current;
    
    return acc;
  }, {} as Record<string, { total: number, items: Record<string, number> }>);

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
          <div className="flex items-center gap-4">
            <div className="text-sm">
              Year Total: {yearlyTotals[year]?.total || 0}
            </div>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y} ({yearlyTotals[y]?.total || 0})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 mb-8">
          <Card className="p-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Total Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{totalCount}</div>
            </CardContent>
          </Card>
          <Card className="p-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Most Active Day</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <div className="text-2xl font-bold">
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  const months = Object.keys(
                    filteredHistory.reduce((acc, item) => {
                      const month = format(new Date(item.timestamp), "MMMM");
                      acc[month] = true;
                      return acc;
                    }, {} as Record<string, boolean>)
                  );
                  const currentIndex = months.indexOf(selectedMonth || months[0]);
                  if (currentIndex > 0) {
                    setSelectedMonth(months[currentIndex - 1]);
                  }
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="font-semibold text-lg">{selectedMonth || format(new Date(), "MMMM")}</h3>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  const months = Object.keys(
                    filteredHistory.reduce((acc, item) => {
                      const month = format(new Date(item.timestamp), "MMMM");
                      acc[month] = true;
                      return acc;
                    }, {} as Record<string, boolean>)
                  );
                  const currentIndex = months.indexOf(selectedMonth || months[0]);
                  if (currentIndex < months.length - 1) {
                    setSelectedMonth(months[currentIndex + 1]);
                  }
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {Object.entries(
                filteredHistory.reduce((acc, item) => {
                  const month = format(new Date(item.timestamp), "MMMM");
                  if (!acc[month]) {
                    acc[month] = [];
                  }
                  acc[month].push(item);
                  return acc;
                }, {} as Record<string, HistoryItem[]>)
              ).filter(([month]) => !selectedMonth || month === selectedMonth)
              .map(([month, items]) => (
                <div key={month} className="space-y-2">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-semibold text-lg">{month}</h3>
                    <span className="text-sm text-muted-foreground">
                      Month Total: {yearlyTotals[year]?.items[month] || 0}
                    </span>
                  </div>
                  {items.slice().reverse().map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-4 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(item.timestamp), "PPp")}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium">
                            {item.current}/{item.total}
                          </div>
                          <div className="text-sm text-muted-foreground">progress</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => {
                            const newHistory = history.filter(h => h.id !== item.id);
                            localStorage.setItem('tasbih_history', JSON.stringify(newHistory));
                            setHistory(newHistory);
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}