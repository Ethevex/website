"use client";

import { useId } from "react";
import { ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type BrandOptionMenuProps<Value extends string> = {
  label: string;
  value: Value;
  options: readonly { value: Value; label: string }[];
  onValueChange: (value: Value) => void;
};

export function BrandOptionMenu<Value extends string>({
  label,
  value,
  options,
  onValueChange,
}: BrandOptionMenuProps<Value>) {
  const id = useId();
  const selected = options.find((option) => option.value === value);

  return (
    <div className="min-w-0">
      <label id={`${id}-label`} htmlFor={`${id}-trigger`} className="text-sm">{label}</label>
      <DropdownMenu>
        <DropdownMenuTrigger
          id={`${id}-trigger`}
          aria-labelledby={`${id}-label ${id}-value`}
          className="mt-2 flex min-h-11 w-full min-w-0 cursor-pointer items-center justify-between gap-3 rounded-none border border-foreground/25 bg-background px-3 py-2 text-left text-sm text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
        >
          <span id={`${id}-value`}>{selected?.label}</span>
          <ChevronDown className="size-4 shrink-0" aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="max-w-(--available-width) rounded-none bg-background text-foreground ring-foreground/20 data-open:animate-none data-closed:animate-none">
          <DropdownMenuRadioGroup
            aria-labelledby={`${id}-label`}
            value={value}
            onValueChange={(nextValue: unknown) => {
              const option = options.find((item) => item.value === nextValue);
              if (option) onValueChange(option.value);
            }}
          >
            {options.map((option) => (
              <DropdownMenuRadioItem key={option.value} value={option.value} closeOnClick className="min-h-11 cursor-pointer rounded-none px-3 pr-9 focus:bg-muted focus:text-foreground data-highlighted:bg-muted data-highlighted:text-foreground">
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
