export const formatSAR = (amount) =>
  `${Number(amount).toFixed(2)} ر.س`;

export const formatDate = (isoString) => {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString('ar-SA', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

export const formatRelativeTime = (isoString) => {
  const diff = (Date.now() - new Date(isoString)) / 60000;
  if (diff < 1) return 'الآن';
  if (diff < 60) return `منذ ${Math.floor(diff)} دقيقة`;
  if (diff < 1440) return `منذ ${Math.floor(diff / 60)} ساعة`;
  return `منذ ${Math.floor(diff / 1440)} يوم`;
};

export const formatTimeLeft = (isoString) => {
  const diff = (new Date(isoString) - Date.now()) / 60000;
  if (diff <= 0) return 'في الطريق';
  if (diff < 60) return `${Math.floor(diff)} دقيقة`;
  return `${Math.floor(diff / 60)} ساعة`;
};
