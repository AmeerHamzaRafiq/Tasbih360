import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import type { Prayer } from "@shared/schema";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function History() {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [, navigate] = useLocation();

  const { data: prayers = [], isLoading } = useQuery<Prayer[]>({
    queryKey: ["/api/prayers/1"], // Hardcoded userId for demo
  });

  const tasbihPrayers = prayers.filter(prayer => prayer.type === "tasbih");
  const years = Array.from(
    new Set(tasbihPrayers.map((p) => new Date(p.createdAt).getFullYear()))
  ).sort();

  const filteredPrayers = tasbihPrayers.filter((prayer) => {
    const prayerYear = new Date(prayer.createdAt).getFullYear().toString();
    return prayerYear === year;
  });

  const chartData = filteredPrayers.map((prayer) => ({
    date: format(new Date(prayer.createdAt), "MMM dd"),
    count: prayer.count,
  }));

  const totalCount = filteredPrayers.reduce((sum, p) => sum + p.count, 0);
  const avgCount = Math.round(totalCount / (filteredPrayers.length || 1));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

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
              {filteredPrayers.length > 0 ? (
                <div className="text-xl font-bold">
                  {format(
                    new Date(
                      filteredPrayers.reduce((max, p) =>
                        p.count > max.count ? p : max
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
            <CardTitle>Tasbih Trends</CardTitle>
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
                  <Tooltip />
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
          <CardContent className="max-h-[400px] overflow-y-auto">
            {filteredPrayers.slice().reverse().map((prayer) => (
              <div
                key={prayer.id}
                className="flex justify-between items-center p-4 border-b last:border-b-0"
              >
                <div>
                  <div className="font-medium">{prayer.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(prayer.createdAt), "PPp")}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{prayer.count}</div>
                  <div className="text-sm text-muted-foreground">counts</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}