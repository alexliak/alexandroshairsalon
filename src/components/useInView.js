import { useEffect, useState } from 'react';

// true όσο το στοιχείο με αυτό το id φαίνεται στην οθόνη (π.χ. η φόρμα αίτησης),
// ώστε η κάτω μπάρα του κινητού να μην σκεπάζει τα πεδία που συμπληρώνεις.
export default function useInView(id) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = document.getElementById(id);
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '0px 0px -30% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [id]);
  return inView;
}
