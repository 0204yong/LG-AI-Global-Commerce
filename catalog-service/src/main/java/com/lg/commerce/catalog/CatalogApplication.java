package com.lg.commerce.catalog;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CatalogApplication {

	public static void main(String[] args) {
		try {
			// .env.development 혹은 .env 파일 로드
			Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
			if (dotenv.get("GEMINI_API_KEY") != null) {
				System.setProperty("GEMINI_API_KEY", dotenv.get("GEMINI_API_KEY"));
			}
		} catch (Exception e) {
			System.out.println("No .env file found or failed to load. Falling back to system properties.");
		}
		SpringApplication.run(CatalogApplication.class, args);
	}

}
