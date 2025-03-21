"use client";

import { Info, InfoIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export default function FileNameGuidePopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="link" size="sm" className="p-0">
          Show supported characters
          <span className="sr-only">Show supported characters</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="rounded-md overflow-hidden">
          <div className="bg-primary px-4 py-2">
            <h3 className="font-medium text-primary-foreground">
              Supported Characters
            </h3>
          </div>

          <div className="p-4 space-y-4 bg-card">
            {/* Alphanumeric characters */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold flex items-center">
                <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary w-5 h-5 mr-2 text-xs">
                  A
                </span>
                Alphanumeric
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-muted rounded-md p-2 text-center text-xs font-medium">
                  0-9
                </div>
                <div className="bg-muted rounded-md p-2 text-center text-xs font-medium">
                  a-z
                </div>
                <div className="bg-muted rounded-md p-2 text-center text-xs font-medium">
                  A-Z
                </div>
              </div>
            </div>

            {/* Special characters */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold flex items-center">
                <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary w-5 h-5 mr-2 text-xs">
                  !
                </span>
                Special Characters
              </h4>
              <div className="grid grid-cols-4 gap-2">
                {["!", "-", "_", ".", "*", "'", "(", ")"].map((char) => (
                  <div
                    key={char}
                    className="bg-muted rounded-md p-2 text-center text-sm font-medium flex flex-col items-center"
                  >
                    <span className="text-primary font-bold">{char}</span>
                    <span className="text-[10px] text-muted-foreground mt-1">
                      {char === "!" && "Exclamation"}
                      {char === "-" && "Hyphen"}
                      {char === "_" && "Underscore"}
                      {char === "." && "Period"}
                      {char === "*" && "Asterisk"}
                      {char === "'" && "Quote"}
                      {char === "(" && "Open Paren"}
                      {char === ")" && "Close Paren"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-muted-foreground italic border-t pt-2">
              Other characters are not supported in file names.
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
