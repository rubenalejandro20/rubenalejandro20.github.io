import { useEffect, useRef, useState } from 'react';

interface NavLink {
  href: string;
  label: string;
}

interface Props {
  links: NavLink[];
  ctaHref: string;
  ctaLabel: string;
}

export default function MobileNav({ links, ctaHref, ctaLabel }: Props) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const panel = panelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    focusable?.[0]?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab' || !focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((v) => !v)}
        className="hover:bg-ink/5 flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-xl"
      >
        <span
          className={`bg-ink block h-0.5 w-6 transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`}
        />
        <span className={`bg-ink block h-0.5 w-6 transition-opacity ${open ? 'opacity-0' : ''}`} />
        <span
          className={`bg-ink block h-0.5 w-6 transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`}
        />
      </button>

      {open && (
        <div
          id="mobile-menu-panel"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="border-ink/10 bg-night-alt fixed inset-x-0 top-[var(--header-h,64px)] z-50 mx-4 rounded-2xl border p-4 shadow-2xl"
        >
          <nav className="flex flex-col">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-display text-ink hover:bg-ink/5 rounded-lg px-3 py-3 text-lg font-bold tracking-wide uppercase"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href={ctaHref}
              className="bg-brand text-night mt-2 rounded-lg px-3 py-3 text-center font-bold tracking-wide uppercase"
              onClick={() => setOpen(false)}
            >
              {ctaLabel}
            </a>
          </nav>
        </div>
      )}
    </div>
  );
}
