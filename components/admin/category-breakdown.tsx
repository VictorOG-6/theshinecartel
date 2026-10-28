import useFetchProductsCategoriesSummary from "@/hooks/product/use-fetch-product-categories-summary";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { PieLabelRenderProps } from "recharts";

const COLORS = [
  "hsl(346, 60%, 55%)",
  "hsl(30, 60%, 65%)",
  "hsl(180, 40%, 50%)",
  "hsl(270, 40%, 60%)",
  "hsl(45, 80%, 60%)",
  "hsl(200, 50%, 55%)",
];

function formatCategoryLabel(category: string) {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const renderSliceLabel = ({
  cx = 0,
  cy = 0,
  midAngle = 0,
  outerRadius = 0,
  percent = 0,
}: PieLabelRenderProps) => {
  const RADIAN = Math.PI / 180;
  const labelRadius = outerRadius + 16;
  const x = cx + labelRadius * Math.cos(-midAngle * RADIAN) - 8;
  const y = cy + labelRadius * Math.sin(-midAngle * RADIAN) - 4;
  const percentage = Math.round(percent * 100);

  if (percentage === 0) return null;

  return (
    <text
      x={x}
      y={y}
      fill="#111111"
      textAnchor="middle"
      dominantBaseline="auto"
      className="text-sm font-semibold"
    >
      {percentage}%
    </text>
  );
};

export default function CategoryBreakdown() {
  const { data: productsCategoriesSummary, isLoading } =
    useFetchProductsCategoriesSummary({ status: "published" });

  const chartData =
    productsCategoriesSummary?.map((item) => ({
      name: formatCategoryLabel(item.category),
      value: item.product_count,
    })) ?? [];

  const hasMultipleSlices = chartData.length > 1;
  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="font-inter text-lg font-semibold mb-4 text-black">
          Categories
        </h3>
        <p className="text-sm text-neutral-500 text-center py-8">Loading...</p>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="font-inter text-lg font-semibold mb-4 text-black">
          Categories
        </h3>
        <p className="text-sm text-neutral-500 text-center py-8">
          No products yet
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-5 md:p-6">
      <h3 className="font-inter text-lg font-semibold mb-4 text-black">
        Categories
      </h3>
      <div className="h-56 w-full min-h-56">
        <ResponsiveContainer width="100%" height={224}>
          <PieChart margin={{ top: 24, right: 24, bottom: 16, left: 24 }}>
            <Pie
              data={chartData}
              cx="50%"
              cy="52%"
              innerRadius={48}
              outerRadius={68}
              paddingAngle={hasMultipleSlices ? 3 : 0}
              dataKey="value"
              nameKey="name"
              label={renderSliceLabel}
              labelLine={false}
              stroke="none"
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload?.length) {
                  return (
                    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
                      <p className="text-xs font-medium text-black">
                        {payload[0].name}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {payload[0].value} products
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-3">
        {chartData.map((item, i) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <span className="text-xs text-neutral-500">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
