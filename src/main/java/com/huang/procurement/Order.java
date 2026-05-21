package com.huang.procurement;

public class Order {
    private String id;
    private String itemName;
    private int quantity;
    private String status;

    public Order(String id, String itemName, int quantity, String status) {
        this.id = id;
        this.itemName = itemName;
        this.quantity = quantity;
        this.status = status;
    }

    public String getId() { return id; }
    public String getItemName() { return itemName; }
    public int getQuantity() { return quantity; }
    public String getStatus() { return status; }
}