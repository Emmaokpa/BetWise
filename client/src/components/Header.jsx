import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-bg-primary border-b border-border-color/50 px-4 py-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
          <span className="text-xl font-black tracking-tight text-white">BetWise <span className="text-brand-primary">NG</span></span>
        </Link>

        {/* Search */}
        <button className="text-brand-primary hover:opacity-80 transition-opacity">
          <Search size={22} className="stroke-[2.5]" />
        </button>
      </div>
    </header>
  );
};

export default Header;
