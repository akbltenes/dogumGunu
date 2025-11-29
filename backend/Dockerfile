# For Render Deploy



FROM eclipse-temurin:23-jdk AS build
WORKDIR /app

COPY gradlew ./gradlew
COPY gradle ./gradle
COPY build.gradle settings.gradle ./
COPY src ./src

RUN chmod +x gradlew
RUN --mount=type=cache,target=/root/.gradle ./gradlew --no-daemon bootJar

FROM eclipse-temurin:23-jre AS runtime
ENV SPRING_PROFILES_ACTIVE=prod \
    JAVA_OPTS="-Xmx512m" \
    FIREBASE_SERVICE_ACCOUNT_PATH="/etc/secrets/firebase-service-account.json"
WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
