import { useState } from 'react';
import clsx from 'clsx';

export const CraftListSummary = () => {
  const [isOpen, setOpen] = useState(false);

  const toggleCraftingList = () => setOpen((prev) => !prev);

  return (
    <div
      className={clsx(
        'border-foreground/20 bg-sidebar hidden shrink-0 flex-col gap-4 transition-all duration-200 ease-linear md:flex',
        {
          'w-[6rem]': !isOpen,
          'w-[20rem]': isOpen,
        },
      )}
    >
      <button
        tabIndex={-1}
        className="hover:after:bg-foreground/40 after:bg-foreground/20 absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 cursor-e-resize bg-transparent transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[1px] after:cursor-e-resize sm:flex"
        title="Toggle Materials List"
        onClick={toggleCraftingList}
      />
      <h3 className="text-lg font-medium"></h3>
    </div>
  );
};
