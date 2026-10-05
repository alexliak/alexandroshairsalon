// Small bridge so components keep the react-router style API (Link to=, NavLink,
// useLocation, useSearchParams, useParams, useNavigate) on top of the Next.js router.
import React, { useCallback, useMemo } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

const split = (asPath = '/') => {
  const [beforeHash, hash = ''] = asPath.split('#');
  const [pathname, search = ''] = beforeHash.split('?');
  return { pathname: pathname || '/', search: search ? `?${search}` : '', hash: hash ? `#${hash}` : '' };
};

export const useLocation = () => {
  const router = useRouter();
  // Pages are pre-built without ?query: read it only once the router is ready,
  // so the first render in the browser matches the HTML (no hydration error).
  const asPath = router.isReady ? router.asPath : router.asPath.split('?')[0].split('#')[0];
  return useMemo(() => split(asPath), [asPath]);
};

export const Link = React.forwardRef(({ to, replace, ...rest }, ref) => (
  <NextLink ref={ref} href={to} replace={replace} {...rest} />
));
Link.displayName = 'Link';

export const NavLink = ({ to, className, ...rest }) => {
  const { pathname } = useLocation();
  const isActive = pathname === to || (to !== '/' && pathname.startsWith(`${to}/`));
  const cls = typeof className === 'function' ? className({ isActive }) : className;
  return <Link to={to} className={cls} aria-current={isActive ? 'page' : undefined} {...rest} />;
};

export const useSearchParams = () => {
  const router = useRouter();
  const { pathname, search } = useLocation();
  const sp = useMemo(() => new URLSearchParams(search), [search]);
  const setSp = useCallback(
    (next, opts = {}) => {
      const qs = new URLSearchParams(next).toString();
      const url = `${pathname}${qs ? `?${qs}` : ''}`;
      router[opts.replace ? 'replace' : 'push'](url, undefined, { shallow: true, scroll: false });
    },
    [router, pathname]
  );
  return [sp, setSp];
};

export const useParams = () => useRouter().query;

export const useNavigate = () => {
  const router = useRouter();
  return useCallback((to, opts = {}) => router[opts.replace ? 'replace' : 'push'](to), [router]);
};
