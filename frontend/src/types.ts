/**
 * [OUTPUT]: 对外提供 Order 类型、CreateOrderPayload 类型
 * [POS]: 全局类型定义，所有模块共享
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

export interface Order {
  id: string;
  itemName: string;
  quantity: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface CreateOrderPayload {
  itemName: string;
  quantity: number;
}
