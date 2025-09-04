declare module 'react-helmet-async' {
  import { ReactNode } from 'react';

  export interface HelmetProps {
    children?: ReactNode;
  }

  export const Helmet: React.FC<HelmetProps>;
  export const HelmetProvider: React.FC<{ children?: ReactNode }>;
}