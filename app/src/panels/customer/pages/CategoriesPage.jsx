import { useNavigate } from 'react-router-dom';
import { fetchCategories } from '../../../lib/api';
import { useFetch } from '../../../lib/useFetch';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { data: categories } = useFetch(fetchCategories, [], []);
  return (
    <div className="min-h-screen bg-narges-bg pb-20">
      <TopBar />
      <div className="px-4 pt-4">
        <h1 className="section-title text-xl mb-4">جميع الأقسام</h1>
        <div className="grid grid-cols-2 gap-3">
          {(categories || []).map(cat => (
            <button
              key={cat.id}
              onClick={() => navigate(`/Customer/category/${cat.id}`)}
              className="flex items-center gap-3 bg-narges-surface rounded-2xl p-4 shadow-sm active:scale-95 transition-transform"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ backgroundColor: cat.color }}
              >
                {cat.icon}
              </div>
              <div className="text-right">
                <p className="font-semibold text-narges-text">{cat.nameAr}</p>
                <p className="text-xs text-narges-text-secondary mt-0.5">{cat.productCount} منتج</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
