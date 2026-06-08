// [INPUT]:  依赖 Spring Boot 自动装配
// [OUTPUT]: 对外提供应用启动入口
// [POS]:    procurement 模块的 Bootstrap，扫描同包所有 Bean
// [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
package com.huang.procurement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ProcurementApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProcurementApplication.class, args);
	}

}
