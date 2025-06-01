import { type ChangeEvent, type DragEvent, type MouseEvent, useEffect, useRef, useState } from 'react';
import { CircleArrowDown, CircleX, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropzoneProps {
  className?: string;
  onImageChange?: (image: string | null) => void;
}

export const Dropzone = ({ className, onImageChange }: DropzoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setIsProcessing(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setImage(imageData);
      onImageChange?.(imageData);
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setImage(null);
    onImageChange?.(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    inputRef.current?.click();
  };

  // Global drag detection
  useEffect(() => {
    const handleDragEnter = (e: Event) => {
      const event = e as unknown as DragEvent;
      if (event.dataTransfer?.types?.includes('Files')) {
        setIsDragging(true);
      }
    };

    const handleDragOver = (e: Event) => {
      const event = e as unknown as DragEvent;
      if (event.dataTransfer?.types?.includes('Files')) {
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e: Event) => {
      if ((e as unknown as DragEvent).relatedTarget === null) {
        setIsDragging(false);
      }
    };

    const resetDragging = () => {
      setIsDragging(false);
    };

    const preventDefault = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener('dragover', preventDefault);
    window.addEventListener('drop', preventDefault);

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);

    window.addEventListener('dragend', resetDragging);
    document.body.addEventListener('drop', resetDragging);

    return () => {
      window.removeEventListener('dragover', preventDefault);
      window.removeEventListener('drop', preventDefault);

      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', resetDragging);
      window.removeEventListener('dragend', resetDragging);
      document.body.removeEventListener('drop', resetDragging);
    };
  }, []);

  return (
    <div
      className={cn(
        'text-muted-foreground relative flex cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-lg border-2 border-dashed bg-transparent p-2 transition-all duration-500',
        { 'bg-primary/20 border-primary/50 text-foregrund/10': isDragging || isProcessing },
        'hover:border-primary',
        className,
      )}
      onClick={handleClick}
      onDrop={handleDrop}
      tabIndex={0}
      role="button"
      aria-label="Upload item image"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg, image/svg, image/avif, image/webp"
        className="hidden"
        onChange={handleChange}
        onClick={(e) => e.stopPropagation()}
      />
      {image ? (
        <>
          <img src={image} alt="Uploaded" className="h-full w-full rounded-lg object-cover" />
          <div className="absolute top-2 right-2 p-2">
            <CircleX
              className="size-6 rounded-full bg-black text-white/70 transition-colors hover:text-white"
              onClick={handleRemove}
              role="presentation"
            />
          </div>
        </>
      ) : (
        <div className="pointer-events-none flex flex-col items-center gap-4">
          {isDragging || isProcessing ? <CircleArrowDown className="size-12" /> : <Upload className="size-12" />}
          <span className="text-center text-sm font-medium">
            {isDragging || isProcessing ? 'Drop file here' : 'Drag and drop or click to upload'}
          </span>
        </div>
      )}
    </div>
  );
};
