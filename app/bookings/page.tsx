import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { db } from "@/lib/db";
import Link from "next/link";

export default async function BookingsPage() {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    return redirect("/login");
  }

  // Fetch the user along with their historically nested relational bookings directly from Postgres
  const user: any = await db.user.findUnique({
    where: { email: session.user.email },
    include: {
      bookings: {
        include: { spot: true },
        orderBy: { createdAt: 'desc' }
      }
    } as any
  });

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white selection:bg-[#5f28c8] selection:text-white">
      <div className="absolute top-0 w-full z-50">
        <Navbar />
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-32 lg:pt-40 pb-20">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-[#adaaaa]">
              My Bookings
            </h1>
            <p className="text-[#adaaaa] font-medium text-lg leading-relaxed">
              Virtual parking passes and historical transaction receipts.
            </p>
          </div>
          <Link href="/" className="shrink-0 px-6 py-3 rounded-xl bg-[#85adff]/10 hover:bg-[#85adff]/20 transition-colors border border-[#85adff]/20 text-[#85adff] font-bold tracking-tight inline-flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Reservation
          </Link>
        </div>

        {user.bookings.length === 0 ? (
          /* Empty State Node */
          <div className="bg-[#1a1919] rounded-3xl p-12 mt-8 text-center border font-medium border-white/5 border-dashed flex flex-col items-center justify-center min-h-[40vh] gap-4 shadow-xl">
             <div className="w-20 h-20 rounded-full bg-[#131313] flex items-center justify-center border border-white/5 shadow-inner mb-4">
                <span className="material-symbols-outlined text-4xl text-[#adaaaa]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 200" }}>receipt_long</span>
             </div>
             <p className="text-[#adaaaa] text-xl tracking-tight">You don't have any active reservations.</p>
             <Link href="/" className="text-[#85adff] hover:underline font-bold mt-2 hover:text-[#ac8aff] transition-colors">Return to Map Dashboard</Link>
          </div>
        ) : (
          /* Grid View Pipeline */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.bookings.map((booking: any) => {
               const start = new Date(booking.startTime);
               const isExpired = booking.endTime && new Date(booking.endTime) < new Date();
               
               return (
                 <div key={booking.id} className="group flex flex-col justify-between bg-[#1a1919] rounded-2xl p-6 border border-white/5 shadow-lg hover:border-white/10 transition-colors">
                   
                   <div className="flex justify-between items-start mb-6">
                     <div className="space-y-1">
                        <span className="text-[10px] font-bold text-[#adaaaa] uppercase tracking-widest block">Transaction ID</span>
                        <div className="font-mono text-xs text-[#69f6b8] bg-[#69f6b8]/10 px-2 py-1 rounded inline-block truncate max-w-[150px]">{booking.id}</div>
                     </div>
                     <div className={`px-3 py-1 flex items-center gap-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                         isExpired 
                           ? 'bg-[#262626] text-[#adaaaa] border-white/10' 
                           : 'bg-[#85adff]/10 text-[#85adff] border-[#85adff]/20'
                       }`}>
                       {isExpired ? 'Expired' : 'Active Pass'}
                       {!isExpired && <div className="w-1.5 h-1.5 rounded-full bg-[#85adff] animate-pulse"></div>}
                     </div>
                   </div>

                   <div className="flex gap-4 items-center mb-6">
                     <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/10">
                        <img 
                          src={booking.spot.imageUrl || "https://images.unsplash.com/photo-1542361021-36b9986b24df?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"} 
                          alt="Parking spot" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                     </div>
                     <div>
                       <h3 className="text-xl font-bold tracking-tight text-white line-clamp-1">{booking.spot.name}</h3>
                       <p className="text-sm text-[#adaaaa] line-clamp-1 flex items-center gap-1">
                         <span className="material-symbols-outlined text-[14px]">location_on</span>
                         {booking.spot.address}
                       </p>
                     </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5 mt-auto">
                     <div>
                       <label className="text-[10px] font-bold text-[#adaaaa] uppercase tracking-widest block mb-1">Pass Valid From</label>
                       <p className="font-semibold text-white tracking-tight">{start.toLocaleDateString()} at {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                     </div>
                     <div>
                       <label className="text-[10px] font-bold text-[#adaaaa] uppercase tracking-widest block mb-1">Total Authorized</label>
                       <p className="font-extrabold text-[#9bffce] text-lg tracking-tighter">₹{booking.totalPrice?.toFixed(2) || '0.00'}</p>
                     </div>
                   </div>

                 </div>
               );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
