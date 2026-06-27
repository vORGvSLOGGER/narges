import { useState } from 'react';
import { MessageSquareWarning, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { mockComplaints, COMPLAINT_TYPES, COMPLAINT_STATUS } from '../../../data/mockComplaints';
import { useBranchStore } from '../../../store/useBranchStore';
import { formatDate } from '../../../utils/formatters';
import toast from 'react-hot-toast';

const STATUS_KEYS = ['all', 'new', 'in_progress', 'resolved'];
const STATUS_LABELS_MAP = { all: 'الكل', new: 'جديدة', in_progress: 'قيد المعالجة', resolved: 'محلولة' };

export default function ComplaintsPage() {
  const { branches } = useBranchStore();
  const [complaints, setComplaints] = useState(mockComplaints);
  const [statusFilter, setStatusFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [resolutionInputs, setResolutionInputs] = useState({});

  const filtered = complaints.filter(c =>
    (statusFilter === 'all' || c.status === statusFilter) &&
    (branchFilter === 'all' || c.branchId === parseInt(branchFilter))
  );

  const handleStatusChange = (id, newStatus) => {
    setComplaints(prev => prev.map(c =>
      c.id === id ? { ...c, status: newStatus, resolution: resolutionInputs[id] || c.resolution } : c
    ));
    toast.success('تم تحديث حالة الشكوى');
  };

  const counts = {
    new: complaints.filter(c => c.status === 'new').length,
    in_progress: complaints.filter(c => c.status === 'in_progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
  };

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">نظام الشكاوي</h1>
        <p className="text-narjis-text-secondary text-sm mt-0.5">
          {counts.new} جديدة · {counts.in_progress} قيد المعالجة · {counts.resolved} محلولة
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card p-3 text-center border-r-4 border-red-400">
          <p className="text-2xl font-bold text-red-500">{counts.new}</p>
          <p className="text-xs text-narjis-text-secondary mt-0.5">جديدة</p>
        </div>
        <div className="card p-3 text-center border-r-4 border-yellow-400">
          <p className="text-2xl font-bold text-yellow-600">{counts.in_progress}</p>
          <p className="text-xs text-narjis-text-secondary mt-0.5">قيد المعالجة</p>
        </div>
        <div className="card p-3 text-center border-r-4 border-green-400">
          <p className="text-2xl font-bold text-green-600">{counts.resolved}</p>
          <p className="text-xs text-narjis-text-secondary mt-0.5">محلولة</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="flex gap-1.5">
          {STATUS_KEYS.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                statusFilter === s ? 'bg-narjis-green text-white' : 'bg-white text-narjis-text-secondary border border-gray-100'
              }`}
            >
              {STATUS_LABELS_MAP[s]}
            </button>
          ))}
        </div>
        <select
          value={branchFilter}
          onChange={e => setBranchFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs bg-white focus:outline-none focus:border-narjis-light"
        >
          <option value="all">جميع الفروع</option>
          {branches.map(b => <option key={b.id} value={b.id}>{b.nameAr}</option>)}
        </select>
      </div>

      {/* Complaints List */}
      <div className="space-y-3">
        {filtered.map(c => {
          const cfg = COMPLAINT_STATUS[c.status];
          const isExpanded = expanded === c.id;
          const branch = branches.find(b => b.id === c.branchId);

          return (
            <div key={c.id} className="card overflow-hidden">
              {/* Header */}
              <div
                className="p-4 cursor-pointer"
                onClick={() => setExpanded(isExpanded ? null : c.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-sm">{c.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>{cfg.label}</span>
                      <span className="text-xs bg-narjis-bg text-narjis-text-secondary px-2 py-0.5 rounded-full">
                        {COMPLAINT_TYPES[c.type]}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-narjis-text">{c.customerName}</p>
                    <p className="text-xs text-narjis-text-secondary mt-0.5 line-clamp-1">{c.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-xs text-narjis-text-secondary">{formatDate(c.createdAt)}</span>
                    <span className="text-xs text-narjis-text-secondary">{branch?.nameAr}</span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-gray-50 p-4 space-y-3 bg-narjis-bg">
                  <div>
                    <p className="text-xs font-bold text-narjis-text-secondary mb-1">وصف الشكوى:</p>
                    <p className="text-sm text-narjis-text">{c.description}</p>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-narjis-text-secondary">
                    <span>📱 {c.customerPhone}</span>
                    <span>🧾 {c.orderId}</span>
                  </div>

                  {c.resolution && (
                    <div className="bg-green-50 border border-green-100 rounded-xl p-3">
                      <p className="text-xs font-bold text-green-700 mb-1">الإجراء المتخذ:</p>
                      <p className="text-sm text-green-800">{c.resolution}</p>
                    </div>
                  )}

                  {c.status !== 'resolved' && (
                    <div className="space-y-2">
                      <textarea
                        value={resolutionInputs[c.id] || ''}
                        onChange={e => setResolutionInputs(p => ({ ...p, [c.id]: e.target.value }))}
                        placeholder="اكتب ملاحظة أو إجراء المعالجة..."
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-narjis-light"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        {c.status === 'new' && (
                          <button
                            onClick={() => handleStatusChange(c.id, 'in_progress')}
                            className="flex-1 bg-yellow-500 text-white text-sm py-2 rounded-xl font-medium"
                          >
                            بدء المعالجة
                          </button>
                        )}
                        <button
                          onClick={() => handleStatusChange(c.id, 'resolved')}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-narjis-green text-white text-sm py-2 rounded-xl font-medium"
                        >
                          <CheckCircle2 size={14} />
                          تم الحل
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <span className="text-5xl">✅</span>
            <p className="mt-3 font-medium text-narjis-text">لا توجد شكاوي في هذا القسم</p>
          </div>
        )}
      </div>
    </div>
  );
}
