import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { format } from "date-fns";
import type { Prayer } from "@shared/schema";
import { useState } from "react";
import { Download } from "lucide-react";

export default function History() {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [selectedType, setSelectedType] = useState<string>("all");

  const { data: prayers = [], isLoading } = useQuery<Prayer[]>({
    queryKey: ["/api/prayers/1"], // Hardcoded userId for demo
  });

  const years = Array.from(
    new Set(prayers.map((p) => new Date(p.createdAt).getFullYear()))
  ).sort();

  const filteredPrayers = prayers.filter((prayer) => {
    const prayerYear = new Date(prayer.createdAt).getFullYear().toString();
    return (
      prayerYear === year &&
      (selectedType === "all" || prayer.type === selectedType)
    );
  });

  const chartData = filteredPrayers.map((prayer) => ({
    date: format(new Date(prayer.createdAt), "MMM dd"),
    count: prayer.count,
    type: prayer.type,
  }));

  const prayerTypes = Array.from(new Set(prayers.map((p) => p.type)));

  const totalCount = filteredPrayers.reduce((sum, p) => sum + p.count, 0);
  const avgCount = totalCount / (filteredPrayers.length || 1);

  const handleExport = () => {
    const csv = [
      ["Date", "Type", "Title", "Count"].join(","),
      ...filteredPrayers.map((p) => 
        [
          format(new Date(p.createdAt), "yyyy-MM-dd"),
          p.type,
          p.title,
          p.count
        ].join(",")
      )
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prayer-history-${year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Prayer History</h1>
        <div className="flex gap-4">
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Prayer type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {prayerTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleExport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Prayers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Count</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{Math.round(avgCount)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Most Active Day</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredPrayers.length > 0 ? (
              <div className="text-3xl font-bold">
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
              <div className="text-3xl font-bold">-</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Prayer Trends</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <LineChart width={800} height={400} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
            />
          </LineChart>
        </CardContent>
      </Card>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="h-96 overflow-y-auto">
            {filteredPrayers.slice().reverse().map((prayer) => (
              <div
                key={prayer.id}
                className="flex justify-between items-center p-4 border-b"
              >
                <div>
                  <div className="font-medium">{prayer.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(prayer.createdAt), "PP")}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{prayer.count}</div>
                  <div className="text-sm text-muted-foreground">
                    {prayer.type}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calendar View</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={new Date()}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
