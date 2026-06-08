// [INPUT]:  依赖 Order 实体，依赖 Spring Web（@RestController / ResponseEntity）
// [OUTPUT]: 对外暴露 /orders REST 端点（GET / POST / PUT / PATCH / DELETE）
// [POS]:    procurement 模块唯一 HTTP 入口，内存 ArrayList 作为临时数据源
// [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
package com.huang.procurement;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/orders")
public class OrderController {

    private List<Order> orders = new ArrayList<>();

    @GetMapping
    public List<Order> getOrders() {
        return orders;
    }

    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        Order newOrder = new Order(order.getItemName(), order.getQuantity());
        orders.add(newOrder);
        return newOrder;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable String id, @RequestBody Order update) {
        return orders.stream()
            .filter(o -> o.getId().equals(id))
            .findFirst()
            .map(o -> {
                o.setItemName(update.getItemName());
                o.setQuantity(update.getQuantity());
                return ResponseEntity.ok(o);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        return orders.stream()
            .filter(o -> o.getId().equals(id))
            .findFirst()
            .map(o -> {
                o.setStatus(body.get("status"));
                return ResponseEntity.ok(o);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable String id) {
        return orders.removeIf(o -> o.getId().equals(id))
            ? ResponseEntity.noContent().build()
            : ResponseEntity.notFound().build();
    }
}
