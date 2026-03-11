"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } =
    useCartStore();


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[200] bg-black"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 right-0 h-full w-full max-w-md z-[201] bg-[#0a0a0a] border-l border-border flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-primary" />
                <h2 className="font-heading text-lg font-bold uppercase tracking-wider">
                  Your Cart
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="text-secondary hover:text-white transition-colors"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={48} className="text-border mb-4" />
                  <p className="text-secondary text-sm">Your cart is empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={`${item.slug}-${item.size}`}
                    className="flex gap-4 p-4 bg-card rounded-lg"
                  >
                    <div className="relative w-20 h-20 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold uppercase tracking-wide truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs text-secondary mt-1">
                        Size: {item.size}
                      </p>
                      <p className="text-primary text-sm font-bold mt-1">
                        EGP {item.price}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.slug,
                              item.size,
                              item.quantity - 1
                            )
                          }
                          className="w-6 h-6 flex items-center justify-center border border-border rounded text-secondary hover:text-white hover:border-primary transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-mono tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.slug,
                              item.size,
                              item.quantity + 1
                            )
                          }
                          className="w-6 h-6 flex items-center justify-center border border-border rounded text-secondary hover:text-white hover:border-primary transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          onClick={() => removeItem(item.slug, item.size)}
                          className="ml-auto text-secondary hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-secondary text-sm uppercase tracking-wider">
                    Subtotal
                  </span>
                  <span className="text-primary text-xl font-bold font-mono">
                    EGP {totalPrice()}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full py-4 bg-primary text-black font-heading font-bold uppercase tracking-wider text-center text-sm hover:bg-primary-gold transition-colors duration-300 rounded block"
                >
                  Proceed to Payment
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
