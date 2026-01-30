import { z } from 'zod';
import { insertExpenseSchema, expenses, webhookPayloadSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  // The main webhook endpoint for WhatsApp integration
  webhook: {
    process: {
      method: 'POST' as const,
      path: '/api/webhook',
      input: webhookPayloadSchema,
      responses: {
        200: z.object({
          success: z.boolean(),
          response: z.string(),
        }),
        400: errorSchemas.validation,
      },
    },
  },
  // Dashboard endpoints to view collected data
  expenses: {
    list: {
      method: 'GET' as const,
      path: '/api/expenses',
      input: z.object({
        groupId: z.string().optional(),
        userId: z.string().optional(),
        category: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof expenses.$inferSelect>()),
      },
    },
    stats: {
      method: 'GET' as const,
      path: '/api/expenses/stats',
      input: z.object({
        groupId: z.string().optional(),
      }).optional(),
      responses: {
        200: z.object({
          total: z.number(),
          byCategory: z.record(z.number()),
        }),
      },
    }
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
