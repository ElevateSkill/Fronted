const styles = {
  // Approved / Active
  Approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Active: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  active: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Published: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  published: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',

  // Rejected / Cancelled
  Rejected: 'bg-red-50 text-[#D95C4A] border border-red-200',
  rejected: 'bg-red-50 text-[#D95C4A] border border-red-200',
  Cancelled: 'bg-red-50 text-[#D95C4A] border border-red-200',
  cancelled: 'bg-red-50 text-[#D95C4A] border border-red-200',

  // Pending (initial enrollment)
  Pending: 'bg-amber-50 text-[#3A3992] border border-amber-200',
  pending: 'bg-amber-50 text-[#3A3992] border border-amber-200',

  // Under review (admin is reviewing)
  'Under Review': 'bg-blue-50 text-[#3A3992] border border-blue-200',
  'under_review': 'bg-blue-50 text-[#3A3992] border border-blue-200',
  'Under-Review': 'bg-blue-50 text-[#3A3992] border border-blue-200',

  // Other
  Inactive: 'bg-gray-50 text-gray-500 border border-gray-200',
  Draft: 'bg-amber-50 text-[#3A3992] border border-amber-200',
  draft: 'bg-amber-50 text-[#3A3992] border border-amber-200',
  Admin: 'bg-purple-50 text-[#5A2DA8] border border-purple-200',
  admin: 'bg-purple-50 text-[#5A2DA8] border border-purple-200',
  Student: 'bg-indigo-50 text-[#EE8433] border border-indigo-200',
  student: 'bg-indigo-50 text-[#EE8433] border border-indigo-200',
};

export default function StatusBadge({ status, children, className = '', size = 'md' }) {
  const s = status || children;
  const style = styles[s] || 'bg-gray-50 text-gray-500 border border-gray-200';

  // Pretty-print status like 'under_review' -> 'Under Review'
  let display = s;
  if (typeof s === 'string') {
    display = s
      .replace(/[_-]/g, ' ')
      .split(' ')
      .map(w => w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : '')
      .join(' ');
  }

  const sizes = {
    sm: 'text-[9px] px-2 py-0.5',
    md: 'text-[10px] px-3 py-1',
    lg: 'text-xs px-4 py-1.5',
  };
  const sizeClass = sizes[size] || sizes.md;

  return (
    <span
      className={`font-black rounded-full uppercase tracking-wider inline-block whitespace-nowrap ${sizeClass} ${style} ${className}`}
    >
      {display}
    </span>
  );
}
