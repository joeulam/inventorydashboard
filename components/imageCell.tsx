import { useEffect, useState } from "react";
import Image from "next/image";
import { getImage } from "@/utils/suprabaseInventoryFunctions";

export function ImageCell({ imageKey, alt }: { imageKey: string; alt: string }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImage() {
      const url = await getImage(imageKey);
      setImageUrl(url);
    }
    fetchImage();
  }, [imageKey]);

  if (!imageUrl) {
    return <div className="w-10 h-10 bg-gray-200 animate-pulse rounded" />;
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={40}
      height={40}
      className="object-cover rounded"
    />
  );
}
