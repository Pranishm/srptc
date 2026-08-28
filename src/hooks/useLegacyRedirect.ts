import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

/**
 * The admin and technician consoles used to be single pages driven by
 * `?tab=` / `?filter=` query strings. Old bookmarks and any stale links keep
 * working by forwarding them to the equivalent route.
 */
export const useLegacyRedirect = (param: string, map: Record<string, string>) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const value = searchParams.get(param);

  useEffect(() => {
    if (!value) return;
    const target = map[value];
    if (target) navigate(target, { replace: true });
  }, [value, map, navigate]);
};
