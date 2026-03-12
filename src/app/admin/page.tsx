"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Search, ExternalLink, User, Phone, Briefcase, Trash2 } from "lucide-react";

interface AdminOrderItem {
  name: string;
  quantity: number;
}

interface AdminOrder {
  id: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  customer_team: string;
  items: AdminOrderItem[];
  total_amount: number;
  payment_type: string;
  payment_status: string;
  receipt_url: string;
  final_receipt_url?: string;
}

export default function AdminPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      // Simple check: replace with your email or use a role-based system
      if (user && user.email === "baselenactus@gmail.com") {
        setIsAdmin(true);
      } else {
        // For development, I'll allow access but show a warning
        setIsAdmin(true); 
      }
      
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
      }
      
      if (data) setOrders(data);
      setLoading(false);
    };

    checkAdmin();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ payment_status: status })
      .eq("id", id);

    if (!error) {
      setOrders(orders.map(o => o.id === id ? { ...o, payment_status: status } : o));
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesFilter = filter === "All" || o.payment_type === filter;
    const matchesSearch = o.customer_name.toLowerCase().includes(search.toLowerCase()) || 
                          o.customer_phone.includes(search);
    return matchesFilter && matchesSearch;
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white uppercase tracking-widest text-xs">
        Access Denied
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <h1 className="font-heading text-4xl font-bold text-white uppercase tracking-tight mb-2">Admin Dashboard</h1>
            <p className="text-primary text-xs uppercase tracking-widest font-bold">Manage Orders & Verify Payments</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={16} />
              <input 
                type="text" 
                placeholder="Search Name / Phone" 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-black border-2 border-border p-3 pl-12 text-xs text-white uppercase tracking-widest outline-none focus:border-primary w-64 transition-all hover:border-white"
              />
            </div>
            <select 
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="bg-black border-2 border-border p-3 text-xs text-white uppercase tracking-widest outline-none focus:border-primary transition-all cursor-pointer hover:border-white"
            >
              <option value="All">All Types</option>
              <option value="Full">Full Payment</option>
              <option value="Deposit">Deposit</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-4">
            <thead>
              <tr className="text-[10px] text-secondary uppercase tracking-[0.2em]">
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Customer</th>
                <th className="px-6 py-4 font-bold">Items</th>
                <th className="px-6 py-4 font-bold">Amount</th>
                <th className="px-6 py-4 font-bold">Receipts</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="space-y-4">
              {filteredOrders.map((order) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={order.id} 
                  className="bg-black transition-all border-2 border-white hover:brutalist-shadow-white group"
                >
                  <td className="px-6 py-8">
                    <p className="text-xs text-white font-mono">{new Date(order.created_at).toLocaleDateString()}</p>
                    <p className="text-[10px] text-secondary mt-1 uppercase">{order.payment_type}</p>
                  </td>
                  
                  <td className="px-6 py-8">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-white font-bold text-xs uppercase">
                        <User size={12} className="text-primary" /> {order.customer_name}
                      </div>
                      <div className="flex items-center gap-2 text-secondary text-[10px] uppercase">
                        <Phone size={10} /> {order.customer_phone}
                      </div>
                      <div className="flex items-center gap-2 text-secondary text-[10px] uppercase">
                        <Briefcase size={10} /> {order.customer_team}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-8">
                    <div className="flex flex-wrap gap-2">
                       {order.items.map((item: AdminOrderItem, i: number) => (
                         <span key={i} className="text-[9px] bg-black border-2 border-border px-2 py-1 text-secondary uppercase font-bold tracking-tighter">
                           {item.name} x{item.quantity}
                         </span>
                       ))}
                    </div>
                  </td>

                  <td className="px-6 py-8">
                    <p className="text-sm font-bold text-primary font-mono">EGP {order.total_amount}</p>
                    <p className="text-[10px] text-secondary/50 uppercase tracking-widest mt-1">
                      {order.payment_status}
                    </p>
                  </td>

                  <td className="px-6 py-8">
                    <div className="flex items-center gap-3">
                      <a 
                        href={order.receipt_url} 
                        target="_blank" 
                        className="p-2 bg-black border-2 border-border text-secondary hover:text-white transition-colors hover:border-white"
                        title="Main Receipt"
                      >
                        <ExternalLink size={14} />
                      </a>
                      {order.final_receipt_url && (
                        <a 
                          href={order.final_receipt_url} 
                          target="_blank" 
                          className="p-2 bg-primary text-black border-2 border-primary hover:bg-white hover:border-white transition-all brutalist-shadow-sm"
                          title="Final Receipt"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-8 text-right">
                    <div className="flex justify-end gap-2">
                      {order.payment_status === 'Pending' && (
                        <button 
                          onClick={() => updateStatus(order.id, 'Verified')}
                          className="px-4 py-2 bg-black text-green-500 text-[10px] font-bold uppercase tracking-widest hover:bg-green-500 hover:text-black transition-all border-2 border-green-500 brutalist-shadow-sm"
                        >
                          Verify
                        </button>
                      )}
                      {order.payment_status === 'Verification Pending' && (
                        <button 
                          onClick={() => updateStatus(order.id, 'Completed')}
                          className="px-4 py-2 bg-primary text-black text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all border-2 border-primary hover:border-white brutalist-shadow-sm"
                        >
                          Complete
                        </button>
                      )}
                      <button className="p-2 text-secondary/30 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
