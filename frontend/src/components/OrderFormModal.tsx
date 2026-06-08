/**
 * [INPUT]: 依赖 ../api 的 createOrder/updateOrder，依赖 ../types 的 Order
 * [OUTPUT]: 对外提供 OrderFormModal 组件（新建/编辑双模式）
 * [POS]: 订单表单弹窗，order prop 存在则为编辑模式，否则为新建模式
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { useState } from 'react';
import type { Order } from '../types';
import { createOrder, updateOrder } from '../api';

interface Props {
  order?: Order;
  onSaved: (order: Order) => void;
  onClose: () => void;
}

export default function OrderFormModal({ order, onSaved, onClose }: Props) {
  const [itemName, setItemName] = useState(order?.itemName ?? '');
  const [quantity, setQuantity] = useState(order?.quantity ?? 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!order;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;
    setLoading(true);
    setError('');
    try {
      const saved = isEdit
        ? await updateOrder(order.id, { itemName: itemName.trim(), quantity })
        : await createOrder({ itemName: itemName.trim(), quantity });
      onSaved(saved);
      onClose();
    } catch {
      setError('操作失败，请检查后端服务是否运行');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-foreground/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-card text-card-foreground rounded w-[440px] max-w-[calc(100vw-2rem)] shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-0">
          <h2 className="text-base font-semibold">{isEdit ? '编辑订单' : '新建采购订单'}</h2>
          <button
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="itemName" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              物品名称
            </label>
            <input
              id="itemName"
              type="text"
              value={itemName}
              onChange={e => setItemName(e.target.value)}
              placeholder="例：MacBook Pro 14"
              autoFocus
              required
              className="px-3 py-2 bg-background border border-input rounded text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring transition-shadow"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="quantity" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              采购数量
            </label>
            <input
              id="quantity"
              type="number"
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              min={1}
              required
              className="px-3 py-2 bg-background border border-input rounded text-sm text-foreground outline-none focus:ring-1 focus:ring-ring transition-shadow"
            />
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <div className="flex gap-2.5 justify-end mt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium bg-muted text-muted-foreground rounded hover:bg-secondary/50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {loading ? '保存中...' : isEdit ? '保存修改' : '提交订单'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
