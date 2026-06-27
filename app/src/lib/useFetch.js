import { useState, useEffect } from 'react';

// خطّاف بسيط لاستدعاء دالة async مع حالات تحميل/خطأ.
// fn: دالة تُرجع Promise. deps: مصفوفة اعتمادية لإعادة الجلب. initial: قيمة ابتدائية للبيانات.
export function useFetch(fn, deps = [], initial = null) {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    Promise.resolve(fn())
      .then((d) => {
        if (alive) {
          setData(d);
          setError(null);
        }
      })
      .catch((e) => {
        if (alive) setError(e);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
