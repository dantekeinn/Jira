import * as React from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

// Quartz Workspace is an internal tool and we force dark mode globally.
// Keeping the Toaster theme fixed avoids bringing a ThemeProvider.
const Toaster = (props: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
