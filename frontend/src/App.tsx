/**
 * [INPUT]: 依赖 ./api 的所有函数，依赖 ./types 的 Order，依赖 ./components/OrderFormModal
 * [OUTPUT]: 对外提供 App 根组件
 * [POS]: 应用入口，管理全部订单状态与交互逻辑
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { useEffect, useState } from 'react';
import type { Order } from './types';
import { fetchOrders, updateOrderStatus, deleteOrder } from './api';
import OrderFormModal from './components/OrderFormModal';

const STATUS_CONFIG: Record<Order['status'], { label: string; className: string }> = {
  PENDING:  { label: '待审核', className: 'bg-secondary/40 text-secondary-foreground' },
  APPROVED: { label: '已批准', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  REJECTED: { label: '已驳回', className: 'bg-destructive/10 text-destructive' },
};

type FilterKey = 'ALL' | Order['status'];

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'ALL',      label: '全部'   },
  { key: 'PENDING',  label: '待审核' },
  { key: 'APPROVED', label: '已批准' },
  { key: 'REJECTED', label: '已驳回' },
];

function StatCard({ value, label, valueClass = '' }: { value: number; label: string; valueClass?: string }) {
  return (
    <div className="bg-card border border-border rounded p-5 shadow-sm">
      <div className={`text-3xl font-bold leading-none mb-1.5 ${valueClass || 'text-foreground'}`}>{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export default function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterKey>('ALL');
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    fetchOrders().then(setOrders).finally(() => setLoading(false));
  }, []);

  const toggleDark = () => {
    const next = !dark;
    document.documentElement.classList.toggle('dark', next);
    setDark(next);
  };

  const handleApprove = async (id: string) => {
    const updated = await updateOrderStatus(id, 'APPROVED');
    setOrders(prev => prev.map(o => o.id === id ? updated : o));
  };

  const handleReject = async (id: string) => {
    const updated = await updateOrderStatus(id, 'REJECTED');
    setOrders(prev => prev.map(o => o.id === id ? updated : o));
  };

  const handleDelete = async (id: string) => {
    await deleteOrder(id);
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  const handleSaved = (saved: Order) => {
    setOrders(prev =>
      prev.some(o => o.id === saved.id)
        ? prev.map(o => o.id === saved.id ? saved : o)
        : [saved, ...prev]
    );
  };

  const displayed = orders
    .filter(o => statusFilter === 'ALL' || o.status === statusFilter)
    .filter(o => o.itemName.toLowerCase().includes(search.toLowerCase()));

  const countOf = (key: FilterKey) =>
    key === 'ALL' ? orders.length : orders.filter(o => o.status === key).length;

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="bg-card border-b border-border h-[60px] flex items-center justify-between px-8 sticky top-0 z-10 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">📦</span>
          <span className="text-base font-semibold text-foreground tracking-tight">采购管理系统</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDark}
            className="w-8 h-8 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-base"
            title={dark ? '切换亮色' : '切换暗色'}
          >
            {dark ? '☀️' : '🌙'}
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded hover:opacity-90 transition-opacity shadow-sm"
          >
            + 新建订单
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-8 py-7">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard value={orders.length}                               label="总订单数" />
          <StatCard value={countOf('PENDING')}  label="待审核"  valueClass="text-primary" />
          <StatCard value={countOf('APPROVED')} label="已批准"  valueClass="text-green-600 dark:text-green-400" />
          <StatCard value={countOf('REJECTED')} label="已驳回"  valueClass="text-destructive" />
        </div>

        {/* Table card */}
        <div className="bg-card border border-border rounded shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="px-6 py-3 border-b border-border flex items-center justify-between gap-4 flex-wrap">
            {/* Filter tabs */}
            <div className="flex gap-1">
              {FILTERS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setStatusFilter(key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    statusFilter === key
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {label}
                  <span className={`ml-1.5 text-[11px] ${statusFilter === key ? 'opacity-80' : 'opacity-60'}`}>
                    {countOf(key)}
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="搜索物品名称..."
              className="px-3 py-1.5 text-sm bg-background border border-input rounded w-48 text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring transition-shadow"
            />
          </div>

          {/* Table */}
          {loading ? (
            <div className="py-16 text-center text-muted-foreground text-sm">加载中...</div>
          ) : displayed.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-sm">{orders.length === 0 ? '暂无订单，点击右上角「新建订单」开始' : '没有匹配的订单'}</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-muted border-b border-border">
                  {['订单 ID', '物品名称', '数量', '状态', '操作'].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayed.map(order => {
                  const { label, className } = STATUS_CONFIG[order.status];
                  return (
                    <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{order.id}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{order.itemName}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{order.quantity}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-medium ${className}`}>
                          {label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {order.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleApprove(order.id)}
                                className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 transition-colors"
                              >
                                批准
                              </button>
                              <button
                                onClick={() => handleReject(order.id)}
                                className="px-2 py-1 text-xs font-medium rounded bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                              >
                                驳回
                              </button>
                              <button
                                onClick={() => setEditingOrder(order)}
                                className="px-2 py-1 text-xs font-medium rounded bg-muted text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                              >
                                编辑
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="px-2 py-1 text-xs font-medium rounded bg-muted text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {showCreate && (
        <OrderFormModal
          onSaved={handleSaved}
          onClose={() => setShowCreate(false)}
        />
      )}

      {editingOrder && (
        <OrderFormModal
          order={editingOrder}
          onSaved={handleSaved}
          onClose={() => setEditingOrder(null)}
        />
      )}
    </div>
  );
}
