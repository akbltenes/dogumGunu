Proje Hakkında
dogumGunu, kullanıcıların doğum günü ve zaman çizelgesi bazlı etkinlikleri yönetebildiği full stack bir web uygulamasıdır. Uygulama; planlama, quiz ve timeline modülleri içerir. Backend tarafında katmanlı mimari uygulanmış, frontend tarafında modern React ve TypeScript yapısı kullanılmıştır.

Kullanılan Teknolojiler
Backend

Java
Spring Boot
Spring Data JPA
PostgreSQL
Flyway
Firebase Storage
Gradle
Docker

Frontend

React
TypeScript
Vite
Tailwind CSS

Genel

RESTful API
Git

Uygulama Özellikleri

Kullanıcı kimlik doğrulama işlemleri
Zaman çizelgesi etkinliklerinin yönetimi
Plan ve quiz modülleri
RESTful API mimarisi
PostgreSQL üzerinde kalıcı veri yönetimi
Firebase Storage ile dosya ve görsel saklama
Frontend ve backend ayrık yapı

Backend Mimarisi

Backend tarafında katmanlı mimari uygulanmıştır. Controller, service ve repository katmanları birbirinden ayrılmıştır. DTO ve mapper yapıları kullanılarak entity’ler dış dünyadan izole edilmiştir. Firebase Storage entegrasyonu ayrı bir servis olarak yapılandırılmıştır. Veritabanı versiyonlama işlemleri Flyway ile yönetilmektedir.

Backend Proje Yapısı
backend
 └─ src
    └─ main
       └─ java
          └─ com.dogumgunu.backend
             ├─ common
             │  └─ BaseAuditableEntity.java
             ├─ config
             │  ├─ FirebaseConfig.java
             │  └─ SecurityConfig.java
             ├─ controller
             │  ├─ AuthController.java
             │  ├─ DreamPlanController.java
             │  ├─ QuizController.java
             │  └─ TimelineEventController.java
             ├─ dto
             │  ├─ AuthRequestDto.java
             │  ├─ AuthResponseDto.java
             │  ├─ DreamPlanDto.java
             │  ├─ QuizQuestionDto.java
             │  ├─ QuizResultDto.java
             │  └─ TimelineEventDto.java
             ├─ enums
             │  ├─ PlanStatus.java
             │  ├─ QuizDifficulty.java
             │  └─ TimelineInteractionType.java
             ├─ exception
             │  ├─ ApiError.java
             │  └─ GlobalExceptionHandler.java
             ├─ mapper
             │  ├─ DreamPlanMapper.java
             │  ├─ QuizQuestionMapper.java
             │  ├─ QuizResultMapper.java
             │  └─ TimelineEventMapper.java
             ├─ model
             │  ├─ DreamPlanEntity.java
             │  ├─ QuizQuestionEntity.java
             │  ├─ QuizResultEntity.java
             │  └─ TimelineEventEntity.java
             ├─ repository
             │  ├─ DreamPlanRepository.java
             │  ├─ QuizQuestionRepository.java
             │  ├─ QuizResultRepository.java
             │  └─ TimelineEventRepository.java
             ├─ service
             │  ├─ AuthService.java
             │  ├─ DreamPlanService.java
             │  ├─ FirebaseStorageService.java
             │  ├─ QuizService.java
             │  └─ TimelineEventService.java
             └─ service.impl
                ├─ AuthServiceImpl.java
                ├─ DreamPlanServiceImpl.java
                ├─ FirebaseStorageServiceImpl.java
                ├─ QuizServiceImpl.java
                └─ TimelineEventServiceImpl.java

Frontend Yapısı
frontend
 └─ src
    ├─ components
    ├─ pages
    ├─ types
    ├─ utils
    ├─ App.tsx
    └─ main.tsx


Frontend tarafında sayfa bazlı ve bileşen bazlı bir yapı kullanılmıştır. Tekrar kullanılabilir bileşenler components altında, sayfalar pages altında konumlandırılmıştır. API çağrıları ve yardımcı fonksiyonlar ayrı dosyalar üzerinden yönetilmektedir.

Kurulum ve Çalıştırma
Projeyi Klonlama
git clone https://github.com/akbltenes/dogumGunu.git

Backend

PostgreSQL veritabanını oluşturun
application.properties dosyasında veritabanı ayarlarını yapılandırın
Firebase Storage yapılandırmasını ekleyin
Gradle ile projeyi çalıştırın

Frontend
npm install
npm run dev

Veritabanı

Uygulama PostgreSQL kullanmaktadır. Veritabanı migration ve seed işlemleri Flyway aracılığıyla otomatik olarak yönetilmektedir.

Güvenlik

Uygulamada temel güvenlik yapılandırmaları Spring Security kullanılarak sağlanmıştır.

Deployment

Backend Docker desteğine sahiptir. Frontend tarafı Vercel üzerinde çalışacak şekilde yapılandırılmıştır.

Geliştirme Notları

Bu proje, katmanlı mimari ve clean code prensipleri gözetilerek geliştirilmiştir. Spring Boot ile REST API geliştirme, PostgreSQL ve Flyway ile veri yönetimi, Firebase Storage entegrasyonu ve React TypeScript ile modern frontend geliştirme konularında deneyim kazandırmayı amaçlamaktadır.
