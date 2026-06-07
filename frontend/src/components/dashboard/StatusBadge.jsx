const styles = {
  Approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Rejected: 'bg-red-50 text-[#D95C4A] border border-red-200',
  rejected: 'bg-red-50 text-[#D95C4A] border border-red-200',
  Pending: 'bg-amber-50 text-[#3A3992] border border-amber-200',
  pending: 'bg-amber-50 text-[#3A3992] border border-amber-200',
  Active: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  active: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Inactive: 'bg-gray-50 text-gray-500 border border-gray-200',
  Published: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  published: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Draft: 'bg-amber-50 text-[#3A3992] border border-amber-200',
  draft: 'bg-amber-50 text-[#3A3992] border border-amber-200',
  Admin: 'bg-purple-50 text-[#5A2DA8] border border-purple-200',
  admin: 'bg-purple-50 text-[#5A2DA8] border border-purple-200',
  Student: 'bg-indigo-50 text-[#EE8433] border border-indigo-200',
  student: 'bg-indigo-50 text-[#EE8433] border border-indigo-200',
  Completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Cancelled: 'bg-red-50 text-[#D95C4A] border border-red-200',
  cancelled: 'bg-red-50 text-[#D95C4A] border border-red-200',
};

export default function StatusBadge({ status, children }) {
  const s = status || children;
  const style = styles[s] || 'bg-gray-50 text-gray-500 border border-gray-200';
  return (
    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider inline-block ${style}`}>
      {s}
    </span>
  );
}
