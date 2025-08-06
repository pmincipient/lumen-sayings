import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const categories = [
  {
    name: "motivation",
    description: "Quotes to inspire and drive you forward",
    count: 45,
    color: "category-motivation",
  },
  {
    name: "success", 
    description: "Wisdom from successful leaders and entrepreneurs",
    count: 32,
    color: "category-success",
  },
  {
    name: "wisdom",
    description: "Timeless insights from great thinkers",
    count: 58,
    color: "category-wisdom",
  },
  {
    name: "life",
    description: "Reflections on the human experience",
    count: 41,
    color: "category-life",
  },
  {
    name: "inspiration",
    description: "Uplifting thoughts to brighten your day",
    count: 37,
    color: "category-inspiration",
  },
  {
    name: "business",
    description: "Professional insights and entrepreneurial spirit",
    count: 29,
    color: "category-business",
  },
];

const Categories = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="gradient-text">Browse Categories</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore quotes organized by themes and topics that matter to you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <Card 
            key={category.name}
            className="glass-card cursor-pointer hover:scale-105 transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold capitalize">
                  {category.name}
                </CardTitle>
                <Badge 
                  variant="outline" 
                  className={`${category.color} border-2 font-medium`}
                >
                  {category.count}
                </Badge>
              </div>
              <CardDescription className="text-base">
                {category.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {category.count} quotes available
                </span>
                <div className={`w-4 h-4 rounded-full ${category.color.replace('category-', 'bg-category-')}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Categories;