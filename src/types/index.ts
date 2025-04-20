export type TOption = {
  label: string;
  value: string;
};

export interface FacetOption {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface PageProps {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string }>;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export type TSortOrder = "asc" | "desc";