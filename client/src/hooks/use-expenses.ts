import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type WebhookPayload, type WebhookResponse } from "@shared/routes";

// ============================================
// WEBHOOK SIMULATOR HOOKS
// ============================================

export function useSimulateWebhook() {
  return useMutation({
    mutationFn: async (data: WebhookPayload) => {
      const res = await fetch(api.webhook.process.path, {
        method: api.webhook.process.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Webhook simulation failed');
      }
      
      return api.webhook.process.responses[200].parse(await res.json());
    },
  });
}

// ============================================
// EXPENSES DATA HOOKS
// ============================================

export function useExpenses(filters?: { groupId?: string; category?: string }) {
  const queryParams = new URLSearchParams();
  if (filters?.groupId) queryParams.append('groupId', filters.groupId);
  if (filters?.category) queryParams.append('category', filters.category);

  return useQuery({
    queryKey: [api.expenses.list.path, filters],
    queryFn: async () => {
      const url = `${api.expenses.list.path}?${queryParams.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch expenses');
      return api.expenses.list.responses[200].parse(await res.json());
    },
  });
}

export function useExpenseStats(groupId?: string) {
  const queryParams = new URLSearchParams();
  if (groupId) queryParams.append('groupId', groupId);

  return useQuery({
    queryKey: [api.expenses.stats.path, groupId],
    queryFn: async () => {
      const url = `${api.expenses.stats.path}?${queryParams.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch stats');
      return api.expenses.stats.responses[200].parse(await res.json());
    },
  });
}
