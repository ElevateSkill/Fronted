import { Trash2 } from 'lucide-react';
import Modal from './Modal';

export default function DeleteConfirm({ onConfirm, onCancel }) {
  return (
    <Modal title="Confirm Delete" onClose={onCancel}>
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-900/20 mb-4">
          <Trash2 size={28} className="text-[#D95C4A]" />
        </div>
        <p className="text-brand-text font-medium mb-6">
          Are you sure you want to delete this item? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 border border-brand-border rounded-xl text-brand-muted font-bold text-xs hover:bg-brand-bg/5 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 bg-red-600 text-white font-black text-xs rounded-xl hover:bg-red-700 transition-all cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
