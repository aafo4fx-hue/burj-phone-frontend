import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Trash2, Package } from "lucide-react";
import type { CartItem as CartItemType } from "../../store/cartStore";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Props {
  item: CartItemType;
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

function RiyalIcon({ size = 22 }: { size?: number }) {
  return (
    <Image
      src="/money-icon.webp"
      alt="ر.س"
      width={size}
      height={size}
      quality={100}
      className="opacity-80 shrink-0"
      style={{ width: "auto", height: "auto" }}
    />
  );
}

export default function CartItem({ item, onUpdateQty, onRemove }: Props) {
  const { product, qty, id, color, storage, price, image: itemImage } = item;
  const itemPrice = price ?? product.salePrice ?? product.originalPrice ?? product.price ?? 0;
  const raw = itemImage || product.images?.[0] || product.image;
  const image = raw
    ? raw.startsWith("http")
      ? raw
      : `${API}${raw.startsWith("/") ? raw : `/${raw}`}`
    : undefined;

  const displayColor = color || product.color;
  const displayStorage = storage || product.storage;
  const itemId = id || product._id;

  return (
    <article className="basket-item">
      <div className="basket-item-image">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 760px) 92px, 126px"
            className="object-contain p-2"
          />
        ) : <Package size={32} strokeWidth={1.4} />}
      </div>
      <div className="basket-item-info">
        <h3>
          <Link href={`/product/${product._id}`}>{product.name}</Link>
        </h3>
        <div className="basket-item-specs">
          {displayStorage && <span>{displayStorage}</span>}
          {displayColor && <span>{displayColor}</span>}
        </div>
        <div className="basket-item-bottom">
          <strong className="flex items-center gap-1">
            {(itemPrice * qty).toLocaleString("en-US")}
            <RiyalIcon size={22} />
          </strong>
          <div className="basket-qty">
            <button
              aria-label={`تقليل كمية ${product.name}`}
              disabled={qty <= 1}
              onClick={() => onUpdateQty(itemId, qty - 1)}
            >
              <Minus size={13} />
            </button>
            <output>{qty}</output>
            <button
              aria-label={`زيادة كمية ${product.name}`}
              onClick={() => onUpdateQty(itemId, qty + 1)}
            >
              <Plus size={13} />
            </button>
          </div>
        </div>
      </div>
      <button
        className="basket-remove"
        aria-label={`حذف ${product.name}`}
        onClick={() => onRemove(itemId)}
      >
        <Trash2 size={16} />
      </button>
    </article>
  );
}
