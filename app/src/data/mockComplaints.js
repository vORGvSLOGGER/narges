export const COMPLAINT_TYPES = {
  late_delivery: 'توصيل متأخر',
  wrong_item: 'منتج خاطئ',
  damaged_item: 'منتج تالف',
  missing_item: 'منتج مفقود',
  driver_behavior: 'سلوك المندوب',
  payment_issue: 'مشكلة في الدفع',
  other: 'أخرى',
};

export const COMPLAINT_STATUS = {
  new: { label: 'جديدة', color: 'bg-red-100 text-red-700' },
  in_progress: { label: 'قيد المعالجة', color: 'bg-yellow-100 text-yellow-700' },
  resolved: { label: 'محلولة', color: 'bg-green-100 text-green-700' },
};

export const mockComplaints = [
  { id: 'CMP-001', customerId: 'c001', customerName: 'أحمد العمري', customerPhone: '0501234567', type: 'late_delivery', description: 'الطلب تأخر أكثر من ساعة ونصف عن الوقت المحدد', status: 'new', branchId: 1, orderId: 'ORD-2025-001', createdAt: new Date(Date.now() - 2 * 3600000).toISOString(), resolution: null },
  { id: 'CMP-002', customerId: 'c002', customerName: 'سارة المالكي', customerPhone: '0507654321', type: 'wrong_item', description: 'استلمت عصير برتقال بدلاً من عصير مانجو', status: 'in_progress', branchId: 1, orderId: 'ORD-2025-002', createdAt: new Date(Date.now() - 5 * 3600000).toISOString(), resolution: 'تم التواصل مع العميل وسيتم إرسال المنتج الصحيح' },
  { id: 'CMP-003', customerId: 'c003', customerName: 'محمد الشمري', customerPhone: '0509876543', type: 'damaged_item', description: 'وصلت علبة الحليب مكسورة وتسربت', status: 'resolved', branchId: 2, orderId: 'ORD-2025-003', createdAt: new Date(Date.now() - 24 * 3600000).toISOString(), resolution: 'تم استرداد المبلغ كاملاً' },
  { id: 'CMP-004', customerId: 'c004', customerName: 'فاطمة القحطاني', customerPhone: '0502468013', type: 'missing_item', description: 'لم يصلني الخبز العربي المطلوب في الطلب', status: 'new', branchId: 1, orderId: 'ORD-2025-004', createdAt: new Date(Date.now() - 3600000).toISOString(), resolution: null },
  { id: 'CMP-005', customerId: 'c005', customerName: 'عبدالله الدوسري', customerPhone: '0503571246', type: 'driver_behavior', description: 'المندوب كان غير محترم أثناء التسليم', status: 'in_progress', branchId: 3, orderId: 'ORD-2025-005', createdAt: new Date(Date.now() - 8 * 3600000).toISOString(), resolution: 'تم التواصل مع المندوب وإشعاره بالتقرير' },
  { id: 'CMP-006', customerId: 'c006', customerName: 'نورة العنزي', customerPhone: '0508642097', type: 'payment_issue', description: 'تم خصم المبلغ مرتين من بطاقتي', status: 'resolved', branchId: 2, orderId: 'ORD-2025-002', createdAt: new Date(Date.now() - 48 * 3600000).toISOString(), resolution: 'تم رد المبلغ المضاعف خلال 24 ساعة' },
  { id: 'CMP-007', customerId: 'c007', customerName: 'خالد الرشيد', customerPhone: '0506789012', type: 'late_delivery', description: 'انتظرت الطلب ساعتين والمندوب لم يرد على الهاتف', status: 'new', branchId: 1, orderId: 'ORD-2025-001', createdAt: new Date(Date.now() - 30 * 60000).toISOString(), resolution: null },
  { id: 'CMP-008', customerId: 'c008', customerName: 'ريم الزهراني', customerPhone: '0501357924', type: 'other', description: 'المنتجات لا تطابق الصور المعروضة في التطبيق', status: 'in_progress', branchId: 1, orderId: 'ORD-2025-003', createdAt: new Date(Date.now() - 12 * 3600000).toISOString(), resolution: 'جاري مراجعة صور المنتجات في التطبيق' },
];
