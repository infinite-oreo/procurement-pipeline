/**
 * [INPUT]: 依赖 ./types 的 Order、CreateOrderPayload
 * [OUTPUT]: 对外提供 fetchOrders、createOrder 函数
 * [POS]: API 层，封装所有后端通信，组件不直接 fetch
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import type { Order, CreateOrderPayload } from './types';

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8080';

export const fetchOrders = (): Promise<Order[]> =>
  fetch(`${API_BASE}/orders`).then(r => r.json());

export const createOrder = (payload: CreateOrderPayload): Promise<Order> =>
  fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(r => r.json());

export const updateOrder = (id: string, payload: CreateOrderPayload): Promise<Order> =>
  fetch(`${API_BASE}/orders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(r => r.json());

export const updateOrderStatus = (id: string, status: Order['status']): Promise<Order> =>
  fetch(`${API_BASE}/orders/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  }).then(r => r.json());

export const deleteOrder = (id: string): Promise<void> =>
  fetch(`${API_BASE}/orders/${id}`, { method: 'DELETE' }).then(() => {});
