import { TrendingUp, ShoppingBag, Users, Truck } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useOrderStore } from '../../../store/useOrderStore';
import { formatSAR } from '../../../utils/formatters';
import StatusBadge from '../../../components/shared/StatusBadge';
import { formatRelativeTime } from '../../../utils/formatters';

const weeklySales = [
  { day: 'الأحد', sales: 1250 },
  { day: 'الاثنين', sales: 1890 },
  { day: 'الثلاثاء', sales: 2200 },
  { day: 'الأربعاء', sales: 1670 },
  { day: 'الخميس', sales: 2850 },
  { day: 'الجمعة', sales: 3200 },
  { day: 'السبت', sales: 2100 },
];

const ordersData = [
  { day: 'الأحد', orders: 24 },
  { day: 'الاثنين', orders: 38 },
  { day: 'الثلاثاء', orders: 45 },
  { day: 'الأربعاء', orders: 31 },
  { day: 'الخميس', orders: 52 },
  { day: 'الجمعة', orders: 61 },
  { day: 'السبت', orders: 43 },
];

const StatsCard = ({ icon: Icon, label, value, sub, color, bgColor }) => (
  <div className="card p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-narges-text-secondary">{label}</p>
        <p className="text-2xl font-bold mt-1" style={{ color }}>{value}</p>
        {sub && <p className="text-xs text-green-600 mt-1">↑ {sub}</p>}
      </div>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: bgColor }}>
        <Icon size={22} style={{ color }} />
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const { orders } = useOrderStore();
  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  const totalSales = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0);

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="p-6 space-y-6 overflow-auto">
      <div>
        <h1 className="text-2xl font-bold text-narges-text">لوحة التحكم</h1>
        <p className="text-narges-text-secondary text-sm mt-1">مرحباً! إليك ملخص أداء المتجر اليوم.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={TrendingUp} label="إجمالي المبيعات" value={formatSAR(totalSales)} sub="12% هذا الأسبوع" color="#1B5E20" bgColor="#E8F5E9" />
        <StatsCard icon={ShoppingBag} label="الطلبات النشطة" value={activeOrders.length} sub="3 طلبات جديدة" color="#FF6F00" bgColor="#FFF3E0" />
        <StatsCard icon={Users} label="إجمالي الطلبات" value={orders.length} sub="8% هذا الشهر" color="#1565C0" bgColor="#E3F2FD" />
        <StatsCard icon={Truck} label="المناديب النشطين" value={2} sub="من 4 مناديب" color="#6A1B9A" bgColor="#F3E5F5" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-bold mb-4">المبيعات الأسبوعية (ر.س)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fontFamily: 'IBM Plex Sans Arabic' }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(v) => [formatSAR(v), 'المبيعات']}
                contentStyle={{ fontFamily: 'IBM Plex Sans Arabic', direction: 'rtl' }}
              />
              <Bar dataKey="sales" fill="#4CAF50" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-bold mb-4">الطلبات الأسبوعية</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={ordersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fontFamily: 'IBM Plex Sans Arabic' }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontFamily: 'IBM Plex Sans Arabic', direction: 'rtl' }} />
              <Line type="monotone" dataKey="orders" stroke="#FF6F00" strokeWidth={2.5} dot={{ fill: '#FF6F00', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card p-5">
        <h3 className="font-bold mb-4">آخر الطلبات</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-narges-text-secondary text-xs border-b">
                <th className="text-right pb-2 font-medium">رقم الطلب</th>
                <th className="text-right pb-2 font-medium">العميل</th>
                <th className="text-right pb-2 font-medium">الحالة</th>
                <th className="text-left pb-2 font-medium">الإجمالي</th>
                <th className="text-left pb-2 font-medium">الوقت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-narges-border">
              {recentOrders.map(o => (
                <tr key={o.id} className="hover:bg-narges-bg/50 transition-colors">
                  <td className="py-2.5 font-medium text-narges-green">{o.id}</td>
                  <td className="py-2.5">{o.customerName}</td>
                  <td className="py-2.5"><StatusBadge status={o.status} /></td>
                  <td className="py-2.5 text-left font-medium">{formatSAR(o.total)}</td>
                  <td className="py-2.5 text-left text-narges-text-secondary text-xs">{formatRelativeTime(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
