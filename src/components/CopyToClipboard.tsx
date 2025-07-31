"use client"

import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";

type CopyToClipboardProps = {
  value: string | number;
  children: React.ReactNode;
  className?: string;
};

export function CopyToClipboard({ value, children, className }: CopyToClipboardProps) {
  const { toast } = useToast();

  const handleCopy = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(String(value));
      toast({
        title: "Copied to clipboard!",
        description: `Value: ${value}`,
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Could not copy value to clipboard.",
      });
    }
  };

  return (
    <div
      className={cn("relative cursor-pointer group", className)}
      onClick={handleCopy}
    >
      {children}
      <Copy className="absolute top-1/2 right-0 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
