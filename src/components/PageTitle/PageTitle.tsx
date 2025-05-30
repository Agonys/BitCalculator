import { Separator } from '@/components/ui/separator';

interface PageTitleProps {
  text: string;
  description?: string;
}

export const PageTitle = ({ text, description }: PageTitleProps) => {
  return (
    <div>
      <div className="border-muted flex w-full items-center gap-2 pb-2">
        <h2 className="text-2xl font-medium">{text}</h2>
        {description && <p className="text-muted-foreground align-middle">- {description}</p>}
      </div>
      <Separator />
    </div>
  );
};
