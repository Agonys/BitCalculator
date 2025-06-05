import { PageTitle } from '@/components/PageTitle/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const Main = () => {
  return (
    <>
      <PageTitle
        text="Crafting Calculator"
        description="Easily manage your list of crafts and calculate required materials"
      />

      <div className="flex h-full w-full">
        <Card className="border-0">
          <CardHeader>
            <CardTitle>some card</CardTitle>
            <CardDescription>some card description</CardDescription>
          </CardHeader>
          <CardContent>Content of the card</CardContent>
        </Card>
      </div>
    </>
  );
};
