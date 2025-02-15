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

  // Group tasbihs by date for the chart
  const groupedByDate = filteredTasbihs.reduce((acc, tasbih) => {
    const date = format(new Date(tasbih.createdAt), "MMM dd");
    if (!acc[date]) {
      acc[date] = { total: 0, tasbihs: [] };
    }
    acc[date].total += tasbih.count;
    acc[date].tasbihs.push(tasbih);
    return acc;
  }, {} as Record<string, { total: number; tasbihs: Tasbih[] }>);

  const chartData = Object.entries(groupedByDate).map(([date, data]) => ({
    date,
    count: data.total,
    tasbihs: data.tasbihs
  }));

  const totalCount = filteredTasbihs.reduce((sum, t) => sum + t.count, 0);
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
              {chartData.length > 0 ? (
                <div className="text-xl font-bold">
                  {Object.entries(groupedByDate)
                    .reduce((max, [date, data]) => 
                      data.total > max.total ? { date, total: data.total } : max
                    , { date: '', total: 0 }).date}
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
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background p-3 border rounded-lg shadow-sm">
                            <p className="font-medium mb-2">Date: {data.date}</p>
                            <p className="mb-2">Total Count: {data.count}</p>
                            <div className="space-y-1">
                              {data.tasbihs.map((t: Tasbih) => (
                                <p key={t.id} className="text-sm">
                                  {t.title}: {t.count}
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
                    dataKey="count"
                    name="Total Count"
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