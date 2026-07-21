import Image from "next/image";

// Product visual: real photo when `image` is set, otherwise a DN8 logo
// watermark placeholder on a dark panel.
export function ProductImage({
  name,
  image,
  className = "",
}: {
  name: string;
  image?: string | null;
  className?: string;
}) {
  if (image) {
    return (
      <Image
        src={image}
        alt={name}
        fill
        unoptimized
        className={`object-cover ${className}`}
        sizes="(max-width: 768px) 50vw, 25vw"
      />
    );
  }
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface-2 to-surface ${className}`}
    >
      <Image
        src="/media/logo.jpg"
        alt={name}
        width={160}
        height={160}
        className="invert opacity-25 w-1/2 h-auto transition-all duration-500 group-hover:opacity-40 group-hover:scale-105"
      />
      <span className="absolute bottom-3 right-3 text-[10px] uppercase tracking-widest text-muted/60">
        DN8
      </span>
    </div>
  );
}
