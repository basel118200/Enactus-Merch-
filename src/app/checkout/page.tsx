"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { ArrowLeft, Upload, CheckCircle, Wallet, CreditCard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null); // Keeping as any for now
  const [authChecked, setAuthChecked] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    team: "",
  });
  const [paymentType, setPaymentType] = useState<"Full" | "Deposit">("Full");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
      } else {
        setUser(user);
        setAuthChecked(true);
      }
    };
    checkUser();
  }, [router]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
        <h1 className="font-heading text-2xl text-white mb-6 uppercase tracking-widest">Your cart is empty</h1>
        <Link href="/shop" className="text-primary hover:underline uppercase tracking-wider text-sm font-bold">
          ← Back to Shop
        </Link>
      </div>
    );
  }

  const total = totalPrice();
  const discountAmount = paymentType === "Deposit" ? total * 0.5 : total;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload your payment receipt.");
      return;
    }

    setLoading(true);
    try {
      // 1. Upload receipt to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `receipts/${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('receipts')
        .getPublicUrl(filePath);

      // 2. Save order to Supabase Database
      const { error: dbError } = await supabase.from('orders').insert({
        user_id: user.id,
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_team: formData.team,
        items: items,
        total_amount: total,
        payment_type: paymentType,
        payment_status: 'Pending',
        receipt_url: publicUrl,
      });

      if (dbError) throw dbError;

      clearCart();
      router.push("/order-confirmed");
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Error submitting order.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto text-white">
        <Link href="/shop" className="inline-flex items-center gap-2 text-secondary text-xs hover:text-primary mb-12 uppercase tracking-[0.2em] transition-colors">
          <ArrowLeft size={14} /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Main Form */}
          <div className="lg:col-span-7">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="font-heading text-4xl font-bold uppercase mb-2 tracking-tight">Checkout</h1>
              <p className="text-secondary text-xs uppercase tracking-widest mb-10">Complete your details and payment</p>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-border">
                  <div className="md:col-span-2">
                     <h3 className="font-heading text-xs uppercase font-bold text-primary tracking-widest mb-6">User Information</h3>
                  </div>
                  <div>
                    <label className="block text-[10px] font-heading font-bold text-secondary uppercase tracking-widest mb-2">Full Name</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-card border border-border p-4 text-white focus:border-primary outline-none transition-colors rounded-xl"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Basel Bahaa"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-heading font-bold text-secondary uppercase tracking-widest mb-2">Phone Number</label>
                    <input
                      required
                      type="tel"
                      className="w-full bg-card border border-border p-4 text-white focus:border-primary outline-none transition-colors rounded-xl"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      placeholder="012XXXXXXXX"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-heading font-bold text-secondary uppercase tracking-widest mb-2">Team / Department</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-card border border-border p-4 text-white focus:border-primary outline-none transition-colors rounded-xl"
                      value={formData.team}
                      onChange={e => setFormData({...formData, team: e.target.value})}
                      placeholder="e.g. Multimedia / HR / Cairo Business"
                    />
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="pb-8 border-b border-border">
                  <h3 className="font-heading text-xs uppercase font-bold text-primary tracking-widest mb-6">Payment Method</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentType("Full")}
                      className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                        paymentType === "Full" ? "border-primary bg-primary/10" : "border-border bg-card/50 hover:border-secondary"
                      }`}
                    >
                      <div className={`p-3 rounded-xl ${paymentType === "Full" ? "bg-primary text-black" : "bg-card text-secondary"}`}>
                        <CreditCard size={20} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold uppercase tracking-widest">Full Payment</p>
                        <p className="text-[10px] text-secondary mt-1">Pay the total amount now</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentType("Deposit")}
                      className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                        paymentType === "Deposit" ? "border-primary bg-primary/10" : "border-border bg-card/50 hover:border-secondary"
                      }`}
                    >
                      <div className={`p-3 rounded-xl ${paymentType === "Deposit" ? "bg-primary text-black" : "bg-card text-secondary"}`}>
                        <Wallet size={20} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold uppercase tracking-widest">Deposit (50%)</p>
                        <p className="text-[10px] text-secondary mt-1">Pay half now, half later</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* QR Instructions */}
                <div className="pt-4">
                   <h3 className="font-heading text-xs uppercase font-bold text-primary tracking-widest mb-6">Scan to Pay</h3>
                   <p className="text-secondary text-sm mb-8 leading-relaxed">
                     Please scan the QR code and transfer <span className="text-primary font-bold">EGP {discountAmount.toFixed(0)}</span> to the account below.
                   </p>
                   
                   <div className="relative w-full max-w-xs aspect-square mx-auto mb-10 group">
                     <div className="absolute inset-0 bg-primary/20 blur-2xl group-hover:bg-primary/30 transition-all rounded-full" />
                     <div className="relative w-full h-full bg-white p-4 rounded-3xl overflow-hidden shadow-2xl">
                       <Image 
                         src="/payment-qr.jpg" 
                         alt="Payment QR Code"
                         fill
                         className="object-contain p-2"
                       />
                     </div>
                   </div>

                   <div className="bg-card border border-border rounded-2xl p-6">
                      <label className="block text-[10px] font-heading font-bold text-secondary uppercase tracking-[0.2em] mb-4 text-center">Upload Transfer Receipt</label>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="receipt-upload" />
                      <label
                        htmlFor="receipt-upload"
                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all text-secondary hover:text-primary overflow-hidden"
                      >
                        {preview ? (
                          <div className="relative w-full h-full p-2 bg-background">
                            <Image src={preview} alt="Receipt preview" fill className="object-contain" />
                          </div>
                        ) : (
                          <>
                            <Upload size={24} className="mb-2" />
                            <span className="text-xs uppercase font-bold tracking-widest">Select Image</span>
                          </>
                        )}
                      </label>
                   </div>
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full py-5 bg-primary text-black font-heading font-bold uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-all rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(250,204,21,0.2)]"
                >
                  {loading ? "Processing Order..." : (
                    <>
                      <CheckCircle size={20} /> Confirm Order
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-5 h-fit lg:sticky lg:top-32">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-border rounded-3xl p-8 shadow-xl">
               <h2 className="font-heading text-xl font-bold uppercase mb-10 tracking-tight">Your Order</h2>
               <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={`${item.slug}-${item.size}`} className="flex gap-5 group">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-background border border-border group-hover:border-primary/50 transition-colors">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 py-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider">{item.name}</h4>
                      <p className="text-[10px] text-secondary mt-1 uppercase tracking-widest">Size: {item.size} • Qty: {item.quantity}</p>
                      <p className="text-primary text-sm font-bold mt-2 font-mono">EGP {item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t border-border">
                <div className="flex justify-between items-center text-xs text-secondary uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="font-mono">EGP {total}</span>
                </div>
                {paymentType === "Deposit" && (
                  <div className="flex justify-between items-center text-xs text-primary uppercase tracking-widest">
                    <span>Deposit Due (50%)</span>
                    <span className="font-mono">- EGP {(total * 0.5).toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-4">
                  <span className="text-xs font-bold uppercase tracking-[0.2em]">Total Due Today</span>
                  <span className="text-3xl font-bold font-mono text-primary">EGP {discountAmount.toFixed(0)}</span>
                </div>
              </div>

              {paymentType === "Deposit" && (
                <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                  <p className="text-[10px] text-primary/80 leading-relaxed uppercase tracking-widest text-center">
                    You&apos;ll be able to pay the remaining 50% from your account dashboard later.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
