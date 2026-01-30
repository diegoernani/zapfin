import { useExpenses, useExpenseStats } from "@/hooks/use-expenses";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { DollarSign, ShoppingBag, Users, Calendar, Filter, Image as ImageIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const COLORS = ['#128C7E', '#25D366', '#34B7F1', '#ECE5DD', '#075E54'];

export default function Dashboard() {
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  
  const { data: expenses, isLoading: isExpensesLoading } = useExpenses(
    categoryFilter && categoryFilter !== "all" ? { category: categoryFilter } : undefined
  );
  const { data: stats, isLoading: isStatsLoading } = useExpenseStats();

  const chartData = stats?.byCategory 
    ? Object.entries(stats.byCategory).map(([name, value]) => ({ name, value }))
    : [];

  const totalExpenses = stats?.total || 0;
  const expenseCount = expenses?.length || 0;
  
  // Get unique categories for filter
  const categories = Array.from(new Set(expenses?.map(e => e.category) || []));

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your WhatsApp expenses.</p>
        </div>
        <div className="flex items-center gap-2">
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                {categoryFilter && categoryFilter !== "all" ? categoryFilter : "All Categories"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={categoryFilter} onValueChange={setCategoryFilter}>
                <DropdownMenuRadioItem value="all">All Categories</DropdownMenuRadioItem>
                {categories.map(cat => (
                  <DropdownMenuRadioItem key={cat} value={cat}>{cat}</DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isStatsLoading ? (
          <>
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </>
        ) : (
          <>
            <StatCard 
              title="Total Expenses" 
              value={`R$ ${totalExpenses.toFixed(2)}`} 
              icon={DollarSign} 
              className="border-l-4 border-l-primary"
            />
            <StatCard 
              title="Recorded Items" 
              value={expenseCount} 
              icon={ShoppingBag}
            />
            <StatCard 
              title="Active Groups" 
              value={2} 
              icon={Users}
            />
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Expenses List */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest expenses recorded from WhatsApp.</CardDescription>
          </CardHeader>
          <CardContent>
            {isExpensesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
              </div>
            ) : expenses && expenses.length > 0 ? (
              <div className="space-y-4">
                {expenses.map((expense) => (
                  <div 
                    key={expense.id} 
                    className="flex items-center justify-between p-4 bg-secondary/20 rounded-xl border border-border/50 hover:bg-secondary/40 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        {expense.imageUrl ? (
                          <Dialog>
                            <DialogTrigger>
                              <img 
                                src={expense.imageUrl} 
                                alt="Receipt" 
                                className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-primary/20 hover:border-primary transition-colors" 
                              />
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl p-0 overflow-hidden bg-transparent border-none shadow-none">
                              <img src={expense.imageUrl} alt="Receipt" className="w-full h-auto rounded-lg shadow-2xl" />
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <ShoppingBag className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground capitalize">{expense.category}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {expense.createdAt ? format(new Date(expense.createdAt), 'MMM d, h:mm a') : 'Unknown'}
                          </span>
                          <span>•</span>
                          <span className="truncate max-w-[100px]">{expense.userId}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-foreground">
                        R$ {Number(expense.amount).toFixed(2)}
                      </div>
                      <Badge variant="secondary" className="text-[10px] mt-1 bg-white hover:bg-white">
                        {expense.groupId === 'default' ? 'Private' : 'Group'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No expenses recorded yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chart */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
             {isStatsLoading ? (
               <Skeleton className="h-[300px] w-full rounded-full" />
             ) : chartData.length > 0 ? (
               <div className="h-[300px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={chartData}
                       cx="50%"
                       cy="50%"
                       innerRadius={60}
                       outerRadius={80}
                       fill="#8884d8"
                       paddingAngle={5}
                       dataKey="value"
                     >
                       {chartData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <RechartsTooltip 
                        formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                     />
                     <Legend />
                   </PieChart>
                 </ResponsiveContainer>
               </div>
             ) : (
               <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm">
                 Not enough data
               </div>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
