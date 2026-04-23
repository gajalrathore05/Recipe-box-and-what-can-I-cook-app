'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { ChefHat, BookOpen, Refrigerator, Flame, LayoutDashboard, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session) return null;

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/recipes', label: 'Recipes', icon: BookOpen },
    { href: '/fridge', label: 'Fridge', icon: Refrigerator },
    { href: '/cook', label: 'What Can I Cook?', icon: Flame },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link href="/dashboard" style={styles.logo}>
          <ChefHat size={28} style={{ color: 'var(--accent-amber)' }} />
          <span style={styles.logoText}>RecipeBox</span>
        </Link>
        <div style={styles.links}>
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} style={{
              ...styles.link,
              ...(pathname === href || pathname?.startsWith(href + '/') ? styles.activeLink : {}),
            }}>
              <Icon size={18} />
              <span style={styles.linkLabel}>{label}</span>
            </Link>
          ))}
        </div>
        <div style={styles.right}>
          <div style={styles.user}>
            <User size={16} />
            <span style={styles.userName}>{session.user?.name}</span>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/' })} style={styles.logout}>
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(10,10,15,0.85)',
    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--border-glass)',
  },
  inner: {
    maxWidth: 1200, margin: '0 auto', padding: '0 24px',
    display: 'flex', alignItems: 'center', height: 64, gap: 32,
  },
  logo: { display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' },
  logoText: {
    fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700,
    color: 'var(--text-primary)',
  },
  links: { display: 'flex', gap: 4, flex: 1 },
  link: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '8px 14px', borderRadius: 'var(--radius-sm)',
    color: 'var(--text-secondary)', textDecoration: 'none',
    fontSize: '0.9rem', fontWeight: 500, transition: 'var(--transition)',
  },
  activeLink: {
    color: 'var(--accent-amber)',
    background: 'rgba(245,158,11,0.1)',
  },
  linkLabel: {},
  right: { display: 'flex', alignItems: 'center', gap: 12 },
  user: {
    display: 'flex', alignItems: 'center', gap: 6,
    color: 'var(--text-secondary)', fontSize: '0.85rem',
  },
  userName: {},
  logout: {
    background: 'none', border: 'none', color: 'var(--text-muted)',
    cursor: 'pointer', padding: 6, borderRadius: 'var(--radius-sm)',
    display: 'flex', alignItems: 'center',
  },
};
