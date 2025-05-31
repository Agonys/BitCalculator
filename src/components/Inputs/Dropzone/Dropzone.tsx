import { useRef, useState } from 'react';
import { CircleX, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropzoneProps {
  className?: string;
  onImageChange?: (image: string | null) => void;
}

export const Dropzone = ({ className, onImageChange }: DropzoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setImage(imageData);
      onImageChange?.(imageData);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImage(null);
    onImageChange?.(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div
      className={cn(
        'hover:border-primary relative flex cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-lg border-2 border-dashed p-2 transition-colors',
        className,
      )}
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      tabIndex={0}
      role="button"
      aria-label="Upload item image"
    >
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
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
        <div className="text-muted-foreground pointer-events-none flex flex-col items-center gap-4">
          <Upload className="size-12" />
          <span className="text-center text-sm font-medium">Drag and drop or click to upload</span>
        </div>
      )}
    </div>
  );
};
