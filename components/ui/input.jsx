import React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    React.createElement("input", {
      type: type,
      className: cn(
        "flex h-10 w-72 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-transparent file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground-dark focus-visible:outline-none focus-visible:ring focus-visible:none disabled:cursor-not-allowed disabled:opacity-100",
        className
      ),
      ref: ref,
      ...props
    })
  );
});
Input.displayName = "Input";

export { Input };
