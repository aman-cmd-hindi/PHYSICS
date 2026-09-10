import React from "react";
import Link from "next/link";
import { Atom, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <div className="h-16 w-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-4">
        <Atom className="h-10 w-10 animate-spin" />
      </div>
      <h2 className="text-3xl font-extrabold text-foreground mb-2">404 — Topic Not Found</h2>
      <p className="text-sm text-muted-foreground max-w-md mb-6">
        The requested chapter, topic, or physics resource does not exist or has moved.
      </p>
      <Link href="/">
        <Button size="lg" className="gap-2 rounded-2xl">
          <Home className="h-4 w-4" />
          <span>Return to Dashboard</span>
        </Button>
      </Link>
    </div>
  );
}
