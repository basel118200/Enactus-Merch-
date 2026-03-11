"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Package, Clock, CheckCircle, ExternalLink, CreditCard, LogOut, Upload, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingPayment, setCompletingPayment] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }
      setUser(user);

      const { data: ordersData, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (ordersData) setOrders(ordersData);
      setLoading(false);
    };

    getData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleCompletePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !completingPayment) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `receipts/${user.id}/final-${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('receipts')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          final_receipt_url: publicUrl,
          payment_status: 'Verification Pending' // New status for admin to check
        })
        .eq('id', completingPayment.id);

      if (updateError) throw updateError;

      alert("Final receipt uploaded! Admin will verify it soon.");
      setCompletingPayment(null);
      // Refresh orders
      const { data: updatedOrders } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (updatedOrders) setOrders(updatedOrders);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <div>
            <h1 className="font-heading text-4xl font-bold text-white uppercase tracking-tight mb-2">My Account</h1>
            <p className="text-secondary text-sm uppercase tracking-widest">{user?.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-400 text-xs uppercase font-bold tracking-widest transition-colors border border-red-500/20 px-6 py-3 rounded-xl hover:bg-red-500/5 h-fit w-fit"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <h2 className="font-heading text-xl font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-3">
            <Package className="text-primary" size={24} /> Order History
          </h2>

          {orders.length === 0 ? (
            <div className="bg-card border border-border p-20 rounded-3xl text-center">
              <p className="text-secondary text-sm uppercase tracking-[0.2em] mb-8">No orders found yet</p>
              <Link href="/shop" className="px-8 py-4 bg-primary text-black font-heading font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-primary/80 transition-all shadow-[0_0_30px_rgba(250,204,21,0.1)]">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={order.id} 
                  className="bg-card border border-border p-6 md:p-8 rounded-3xl group"
                >
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Order Meta */}
                    <div className="lg:w-1/4 space-y-4">
                      <div>
                        <p className="text-[10px] text-secondary uppercase tracking-widest mb-1">Order Date</p>
                        <p className="text-sm font-bold text-white">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-secondary uppercase tracking-widest mb-1">Status</p>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          order.payment_status === 'Completed' || order.payment_status === 'Verified' 
                            ? "bg-green-500/10 text-green-500" 
                            : "bg-primary/10 text-primary"
                        }`}>
                          {order.payment_status === 'Verified' ? <CheckCircle size={10} /> : <Clock size={10} />}
                          {order.payment_status}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-secondary uppercase tracking-widest mb-1">Payment Type</p>
                        <p className="text-xs font-bold text-primary uppercase">{order.payment_type}</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="lg:w-2/4 border-y lg:border-y-0 lg:border-x border-border/50 py-4 lg:py-0 lg:px-8">
                      <p className="text-[10px] text-secondary uppercase tracking-widest mb-4">Items</p>
                      <div className="space-y-3">
                        {order.items.map((item: any, i: number) => (
                          <div key={i} className="flex justify-between items-center bg-background/50 p-3 rounded-xl border border-border/30">
                            <span className="text-xs font-bold text-white uppercase tracking-wider">{item.name} <span className="text-secondary lowercase">x{item.quantity}</span></span>
                            <span className="text-xs font-mono text-secondary">EGP {item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Actions */}
                    <div className="lg:w-1/4 flex flex-col justify-between items-end gap-6 text-right">
                      <div>
                        <p className="text-[10px] text-secondary uppercase tracking-widest mb-1">Total</p>
                        <p className="text-2xl font-bold font-mono text-primary">EGP {order.total_amount}</p>
                      </div>
                      
                      <div className="flex flex-col gap-3 w-full max-w-[200px]">
                        {order.payment_type === 'Deposit' && order.payment_status !== 'Completed' && (
                          <button 
                            onClick={() => setCompletingPayment(order)}
                            className="bg-primary hover:bg-primary/90 text-black px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg"
                          >
                            <CreditCard size={14} /> Complete Payment
                          </button>
                        )}
                        <a 
                          href={order.receipt_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="bg-card/50 border border-border hover:border-secondary text-secondary hover:text-white px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                        >
                          <ExternalLink size={14} /> View Receipt
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Complete Payment Modal */}
      <AnimatePresence>
        {completingPayment && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCompletingPayment(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-card border border-border p-8 rounded-3xl shadow-2xl"
            >
              <button 
                onClick={() => setCompletingPayment(null)}
                className="absolute top-4 right-4 text-secondary hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-10">
                <h3 className="font-heading text-2xl font-bold text-white uppercase tracking-tight mb-2">Final Payment</h3>
                <p className="text-secondary text-xs uppercase tracking-widest">Upload receipt for remaining 50%</p>
              </div>

              <div className="bg-primary/5 p-4 rounded-2xl border border-primary/20 mb-8 text-center">
                <p className="text-xs text-primary font-bold uppercase tracking-widest mb-1">Due Amount</p>
                <p className="text-3xl font-mono font-bold text-white">EGP {(completingPayment.total_amount * 0.5).toFixed(0)}</p>
              </div>

              <form onSubmit={handleCompletePayment} className="space-y-6">
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setFile(e.target.files?.[0] || null)} 
                    className="hidden" 
                    id="final-receipt-upload" 
                  />
                  <label
                    htmlFor="final-receipt-upload"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:border-primary transition-all text-secondary"
                  >
                    {file ? (
                      <div className="flex flex-col items-center p-4">
                        <Package className="text-primary mb-2" />
                        <span className="text-xs font-bold text-white uppercase tracking-widest truncate max-w-xs">{file.name}</span>
                      </div>
                    ) : (
                      <>
                        <Upload size={32} className="mb-3" />
                        <span className="text-xs font-bold uppercase tracking-widest">Select Final Receipt</span>
                      </>
                    )}
                  </label>
                </div>

                <button
                  disabled={uploading || !file}
                  type="submit"
                  className="w-full py-4 bg-primary text-black font-heading font-bold uppercase tracking-widest text-sm rounded-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : (
                    <>
                      <CheckCircle size={18} /> Submit Receipt
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
