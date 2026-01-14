import React from "react";

export interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}
