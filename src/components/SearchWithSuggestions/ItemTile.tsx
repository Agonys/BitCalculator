import type { Item } from '@/db';
import { cn, numberToRoman } from '@/lib';

interface ItemTileProps {
  item: Item | null;
  className?: string;
  onClick?: (item: Item) => void;
}

export const ItemTile = ({ item, className, onClick }: ItemTileProps) => {
  if (!item) return null;

  return (
    <div
      className={cn(
        'flex-gap-2 hover:bg-sidebar-accent/30 cursor-pointer rounded-md px-2 py-1.5 transition-colors',
        className,
      )}
      onClick={() => onClick?.(item)}
    >
      <img src={item.icon} alt={`${item.name}`} className="object-fit h-9 w-9" />
      <div className="flex-col-gap-1 w-full text-xs font-medium capitalize">
        <div className="flex w-full justify-between">
          <span>{item.name}</span>
          {/* to map later on */}
          <span className="text-[#867557]">{item.rarity}</span>
        </div>
        <div className="text-muted-foreground flex w-full justify-between">
          <span>Tier {numberToRoman(item.tier)}</span>
          <span>{item.category}</span>
        </div>
      </div>
    </div>
  );
};
