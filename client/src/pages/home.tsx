import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSimulateWebhook } from "@/hooks/use-expenses";
import { webhookPayloadSchema, type WebhookPayload } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Smartphone, ArrowRight, CheckCircle2, AlertCircle, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { toast } = useToast();
  const simulateMutation = useSimulateWebhook();
  const [lastResponse, setLastResponse] = useState<any>(null);

  const form = useForm<WebhookPayload>({
    resolver: zodResolver(webhookPayloadSchema),
    defaultValues: {
      tipo: "texto",
      conteudo: "Gastei 50 reais com almoco",
      grupo: "120363025841234567@g.us",
      remetente: "5511999999999",
      url: "",
    },
  });

  const messageType = form.watch("tipo");

  async function onSubmit(data: WebhookPayload) {
    try {
      const result = await simulateMutation.mutateAsync(data);
      setLastResponse(result);
      toast({
        title: "Message Sent!",
        description: "The webhook processed your message successfully.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Webhook Simulator</h1>
        <p className="text-muted-foreground">Test your WhatsApp integration without connecting a real phone.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Simulator Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-t-4 border-t-primary shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <Smartphone className="w-5 h-5" />
                </div>
                <CardTitle>Message Simulator</CardTitle>
              </div>
              <CardDescription>
                Simulate an incoming message from Evolution API to your webhook.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="tipo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="texto">Text Message</SelectItem>
                              <SelectItem value="imagem">Image</SelectItem>
                              <SelectItem value="audio">Audio</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="remetente"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sender Phone (ID)</FormLabel>
                          <FormControl>
                            <Input placeholder="5511999999999" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="grupo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Group ID (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="120363025841234567@g.us" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {messageType === 'texto' && (
                    <FormField
                      control={form.control}
                      name="conteudo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message Content</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="e.g. Gastei 45 no uber" 
                              className="resize-none min-h-[100px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {(messageType === 'imagem' || messageType === 'audio') && (
                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Media URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 h-12 text-base shadow-lg shadow-primary/25 transition-all hover:scale-[1.01]"
                    disabled={simulateMutation.isPending}
                  >
                    {simulateMutation.isPending ? (
                      <span className="flex items-center gap-2">Processing...</span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-4 h-4" /> Send Message
                      </span>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Response & Instructions */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {lastResponse && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key="response"
              >
                <Card className="bg-emerald-50/50 border-emerald-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-emerald-800 flex items-center gap-2 text-lg">
                      <CheckCircle2 className="w-5 h-5" /> Bot Response
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
                      <p className="text-lg font-medium text-emerald-950">"{lastResponse.response}"</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {!lastResponse && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key="placeholder"
              >
                <Card className="bg-secondary/30 border-dashed border-2">
                  <CardContent className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mb-3 opacity-20" />
                    <p>Bot responses will appear here</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <Card>
            <CardHeader>
              <CardTitle>Quick Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">1</div>
                <p className="text-sm text-muted-foreground">Select the message type (Text or Image).</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">2</div>
                <p className="text-sm text-muted-foreground">Enter natural language text like <span className="font-mono text-primary font-medium">"Spent 50 on lunch"</span>.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">3</div>
                <p className="text-sm text-muted-foreground">The bot will categorize the expense and ask for a receipt photo if needed.</p>
              </div>
              <div className="pt-2">
                <Button variant="outline" className="w-full text-xs" asChild>
                  <a href="/setup" className="flex items-center gap-2">
                    View Full Setup Guide <ArrowRight className="w-3 h-3" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
