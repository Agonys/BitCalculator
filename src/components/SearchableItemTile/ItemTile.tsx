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
        'hover:bg-sidebar-accent/30 flex h-full w-full min-w-[300px] cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 transition-colors',
        className,
      )}
      onClick={() => onClick?.(item)}
    >
      <img src={item.icon} alt={`${item.name}`} className="h-9 w-9 shrink-0 object-contain" />
      <div className="flex w-full min-w-0 flex-col gap-1 text-xs font-medium capitalize">
        <div className="flex w-full justify-between gap-2 overflow-hidden">
          <span className="line-clamp-1 max-w-[240px] min-w-0 text-ellipsis whitespace-normal" title={item.name}>
            {item.name}
          </span>
          {/* to map later on */}
          <span className="shrink-0 text-[#867557]">{item.rarity}</span>
        </div>
        <div className="text-muted-foreground flex w-full justify-between">
          {item.tier && <span>Tier {numberToRoman(item.tier)}</span>}
          <span className="ml-auto">{item.category}</span>
        </div>
      </div>
    </div>
  );
};
