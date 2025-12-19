Proje Hakkında
dogumGunu, kullanıcıların doğum günü ve zaman çizelgesi bazlı etkinlikleri yönetebildiği full stack bir web uygulamasıdır. Uygulama; planlar, quiz yapısı ve zaman çizelgesi etkileşimleri gibi farklı modüller içerir. Backend tarafında katmanlı mimari uygulanmış, frontend tarafında modern React ve TypeScript yapısı kullanılmıştır.

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
Git
RESTful API

Uygulama Özellikleri
Kullanıcı kimlik doğrulama işlemleri
Zaman çizelgesi etkinliklerinin yönetimi
Plan ve quiz modülleri
RESTful API mimarisi
Katmanlı backend mimarisi
PostgreSQL üzerinde kalıcı veri yönetimi
Firebase Storage ile dosya ve görsel saklama
Frontend ve backend ayrık yapı

Backend Mimarisi
Backend tarafında katmanlı mimari uygulanmıştır. Controller, service ve repository katmanları birbirinden ayrılmıştır. DTO ve mapper yapıları kullanılarak entity’ler dış dünyadan izole edilmiştir. Firebase Storage entegrasyonu ayrı bir servis olarak yapılandırılmıştır. Veritabanı şema ve veri versiyonlama işlemleri Flyway ile yönetilmektedir.

Backend Proje Yapısı

config
Firebase ve güvenlik yapılandırmaları

controller
Uygulamanın HTTP isteklerini yöneten katman

service
İş kurallarının yer aldığı servis katmanı

repository
Veritabanı erişim katmanı

dto ve mapper
Veri transfer nesneleri ve entity dönüşümleri

exception
Global hata yönetimi

Frontend Yapısı
Frontend tarafında sayfa bazlı ve bileşen bazlı bir yapı kullanılmıştır. Tekrar kullanılabilir bileşenler components altında, sayfalar pages altında konumlandırılmıştır. API çağrıları ve yardımcı fonksiyonlar ayrı dosyalar üzerinden yönetilmektedir.

Kurulum ve Çalıştırma

Projeyi klonlayın

git clone https://github.com/akbltenes/dogumGunu.git

Backend
backend klasörüne girin
PostgreSQL üzerinde veritabanını oluşturun
application properties dosyasında veritabanı ayarlarını yapılandırın
Firebase Storage yapılandırmasını ekleyin
Gradle ile projeyi çalıştırın

Frontend
frontend klasörüne girin
npm install
npm run dev

Veritabanı
PostgreSQL kullanılmaktadır. Veritabanı migration işlemleri Flyway aracılığıyla otomatik olarak yönetilmektedir.

Güvenlik
Uygulamada temel güvenlik yapılandırmaları Spring Security üzerinden sağlanmıştır.

Deployment
Uygulama Docker desteğine sahiptir. Frontend tarafı Vercel üzerinde çalışacak şekilde yapılandırılmıştır.

Geliştirme Notları
Bu proje, katmanlı mimari prensiplerine uygun şekilde geliştirilmiştir. Spring Boot ile REST API geliştirme, PostgreSQL ve Flyway ile veri yönetimi, Firebase Storage entegrasyonu ve React TypeScript ile modern frontend geliştirme konularında pratik yapma imkanı sunmaktadır.
