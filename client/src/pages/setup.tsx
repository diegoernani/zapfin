import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Terminal, Server, MessageCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export default function Setup() {
  const { toast } = useToast();
  const webhookUrl = `${window.location.origin}/api/webhook`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast({ title: "Copied!", description: "Webhook URL copied to clipboard" });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold mb-2">Setup Guide</h1>
        <p className="text-muted-foreground">Connect your Evolution API instance to start tracking expenses.</p>
      </div>

      <Card className="border-l-4 border-l-primary overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Server className="w-32 h-32" />
        </div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Your Webhook URL
          </CardTitle>
          <CardDescription>
            Configure this URL in your Evolution API settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 p-4 bg-secondary/50 rounded-xl border border-border/60 relative group">
            <code className="flex-1 font-mono text-sm text-primary-foreground/90 bg-gray-900 p-3 rounded-lg overflow-x-auto whitespace-nowrap">
              {webhookUrl}
            </code>
            <Button size="icon" variant="ghost" onClick={copyToClipboard} className="shrink-0 hover:bg-white">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Terminal className="w-5 h-5 text-primary" />
              1. Evolution API Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Assuming you have Evolution API running, you need to set the webhook for your instance.
            </p>
            <div className="bg-muted p-4 rounded-lg font-mono text-xs space-y-2">
              <p className="text-gray-500"># POST /instance/setWebhook/YOUR_INSTANCE_NAME</p>
              <div className="text-foreground">
                {`{`}
                <br/>&nbsp;&nbsp;"webhookUrl": "{webhookUrl}",
                <br/>&nbsp;&nbsp;"webhookByEvents": true,
                <br/>&nbsp;&nbsp;"events": ["MESSAGES_UPSERT"]
                <br/>{`}`}
              </div>
            </div>
            <p>
              Ensure <Badge variant="outline">MESSAGES_UPSERT</Badge> is enabled so the bot receives incoming messages.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              2. How to Use
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">1</span>
                <span className="text-sm text-muted-foreground">Send a message to your WhatsApp number.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">2</span>
                <div className="text-sm text-muted-foreground">
                  <p className="mb-1">Try sending expenses like:</p>
                  <div className="p-2 bg-secondary rounded text-xs font-medium italic text-foreground">
                    "Almoço 45,90"
                  </div>
                  <div className="p-2 bg-secondary rounded text-xs font-medium italic text-foreground mt-1">
                    "Uber 22 reais"
                  </div>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">3</span>
                <span className="text-sm text-muted-foreground">The bot will confirm the record or ask for clarification.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-amber-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-800 text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Troubleshooting
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-amber-900/80">
          <p className="mb-2">
            If messages aren't appearing:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Check if your Evolution API instance is connected (QR Code scanned).</li>
            <li>Ensure the Webhook URL is reachable from the Evolution API server.</li>
            <li>Use the <strong>Simulator</strong> on the home page to test logic without WhatsApp.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
