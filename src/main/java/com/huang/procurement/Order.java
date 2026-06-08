// [INPUT]:  依赖 java.util.UUID 生成短 ID
// [OUTPUT]: 对外提供 Order 实体（id / itemName / quantity / status）
// [POS]:    procurement 模块唯一数据模型，被 OrderController 创建和持有
// [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
package com.huang.procurement;

import java.util.UUID;

public class Order {
    private String id;
    private String itemName;
    private int quantity;
    private String status;

    // Jackson 反序列化需要无参构造
    public Order() {}

    public Order(String itemName, int quantity) {
        this.id = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        this.itemName = itemName;
        this.quantity = quantity;
        this.status = "PENDING";
    }

    public String getId() { return id; }
    public String getItemName() { return itemName; }
    public int getQuantity() { return quantity; }
    public String getStatus() { return status; }

    public void setId(String id) { this.id = id; }
    public void setItemName(String itemName) { this.itemName = itemName; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public void setStatus(String status) { this.status = status; }
}
