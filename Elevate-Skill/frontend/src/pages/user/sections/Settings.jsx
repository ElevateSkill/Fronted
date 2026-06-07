import { Shield, Mail, Phone, User, Lock, Bell, CreditCard, Save, Eye } from 'lucide-react';

export default function Settings({
  user,
  profile,
  setProfile,
  profileSaving,
  onSaveProfile,
  passwordForm,
  setPasswordForm,
  passwordSaving,
  onUpdatePassword,
  notifications,
  setNotifications,
  apiPayments,
  onViewPayment
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-brand-text tracking-tight">Settings</h2>
        <p className="text-xs text-brand-muted mt-0.5">Manage your account preferences</p>
      </div>

      <div className="rounded-2xl border border-brand-border bg-brand-card p-5">
        <h3 className="text-xs font-bold text-brand-text mb-3 flex items-center gap-1.5 uppercase tracking-wider">
          <Shield size={13} className="text-brand-primary" /> Account Info
        </h3>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-orange to-brand-primary flex items-center justify-center text-white font-black text-xl">
            {(user?.full_name || 'U')[0]}
          </div>
          <div>
            <h4 className="text-sm font-black text-brand-text">{user?.full_name}</h4>
            <p className="text-xs text-brand-muted">@{user?.username}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#EE8433]/30 text-[#EE8433]">
                <Shield size={10} /> {user?.role}
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-black/40 border border-brand-border">
            <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1 flex items-center gap-1"><Mail size={11} /> Email</p>
            <p className="font-semibold text-brand-text break-all">{user?.email}</p>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-brand-border">
            <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1 flex items-center gap-1"><Phone size={11} /> Phone</p>
            <p className="font-semibold text-brand-text">{user?.phone_number || '—'}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-brand-border bg-brand-card p-5">
        <h3 className="text-xs font-bold text-brand-text mb-3 flex items-center gap-1.5 uppercase tracking-wider">
          <User size={13} className="text-brand-primary" /> Edit Profile
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1 block">Full Name</label>
            <input value={profile.full_name} onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))} className="w-full px-3 py-2.5 bg-black/50 border border-brand-border rounded-xl text-brand-text text-sm focus:outline-none focus:border-brand-primary/50" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1 block">Email</label>
            <input value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} className="w-full px-3 py-2.5 bg-black/50 border border-brand-border rounded-xl text-brand-text text-sm focus:outline-none focus:border-brand-primary/50" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1 block">Phone</label>
            <input value={profile.phone_number} onChange={e => setProfile(p => ({ ...p, phone_number: e.target.value }))} className="w-full px-3 py-2.5 bg-black/50 border border-brand-border rounded-xl text-brand-text text-sm focus:outline-none focus:border-brand-primary/50" />
          </div>
        </div>
        <button
          disabled={profileSaving}
          onClick={onSaveProfile}
          className="mt-3 px-5 py-2.5 bg-brand-primary text-white font-black text-[10px] rounded-xl hover:brightness-110 transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Save size={12} /> {profileSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="rounded-2xl border border-brand-border bg-brand-card p-5">
        <h3 className="text-xs font-bold text-brand-text mb-3 flex items-center gap-1.5 uppercase tracking-wider">
          <Lock size={13} className="text-brand-orange" /> Password
        </h3>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={passwordForm.newPass} onChange={e => setPasswordForm(p => ({ ...p, newPass: e.target.value }))} type="password" placeholder="New Password" className="w-full px-4 py-2.5 bg-black/50 border border-brand-border rounded-xl text-brand-text text-sm focus:outline-none focus:border-brand-orange/50 placeholder:text-gray-600" />
            <input value={passwordForm.confirm} onChange={e => setPasswordForm(p => ({ ...p, confirm: e.target.value }))} type="password" placeholder="Confirm Password" className="w-full px-4 py-2.5 bg-black/50 border border-brand-border rounded-xl text-brand-text text-sm focus:outline-none focus:border-brand-orange/50 placeholder:text-gray-600" />
          </div>
          <button
            disabled={passwordSaving}
            onClick={onUpdatePassword}
            className="px-5 py-2.5 bg-brand-orange text-white font-black text-[10px] rounded-xl hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {passwordSaving ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-brand-border bg-brand-card p-5">
        <h3 className="text-xs font-bold text-brand-text mb-3 flex items-center gap-1.5 uppercase tracking-wider">
          <Bell size={13} className="text-brand-primary" /> Notifications
        </h3>
        <div className="space-y-2">
          {[
            { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
            { key: 'sms', label: 'SMS Notifications', desc: 'Receive updates via SMS' },
            { key: 'push', label: 'Push Notifications', desc: 'Receive browser notifications' },
          ].map(n => (
            <label key={n.key} className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-brand-border cursor-pointer hover:border-brand-primary/30 transition-all">
              <div>
                <p className="text-xs font-semibold text-brand-text">{n.label}</p>
                <p className="text-[10px] text-brand-muted">{n.desc}</p>
              </div>
              <div
                onClick={() => setNotifications(p => ({ ...p, [n.key]: !p[n.key] }))}
                className={`relative w-9 h-[18px] rounded-full transition-all cursor-pointer ${notifications[n.key] ? 'bg-brand-primary' : 'bg-gray-700'}`}
              >
                <div className={`absolute top-0.5 w-[13px] h-[13px] rounded-full bg-white shadow transition-all ${notifications[n.key] ? 'left-[18px]' : 'left-0.5'}`} />
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-brand-border bg-brand-card p-5">
        <h3 className="text-xs font-bold text-brand-text mb-3 flex items-center gap-1.5 uppercase tracking-wider">
          <CreditCard size={13} className="text-brand-violet" /> Payment History
        </h3>
        {apiPayments.length === 0 ? (
          <div className="text-center py-6">
            <CreditCard size={28} className="mx-auto text-gray-600 mb-2" />
            <p className="text-xs text-brand-muted">No payment history yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {apiPayments.map(p => (
              <button
                key={p.id}
                onClick={() => onViewPayment(p)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-black/40 border border-brand-border hover:border-brand-primary/30 transition-all text-left cursor-pointer"
              >
                <div className="text-left">
                  <p className="text-xs font-semibold text-brand-text capitalize">{p.course_title} — {p.status}</p>
                  <p className="text-[10px] text-brand-muted">{new Date(p.submitted_at).toLocaleDateString()}</p>
                </div>
                <Eye size={14} className="text-brand-muted" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
