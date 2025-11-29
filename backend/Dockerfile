# For Render Deploy

FROM eclipse-temurin:23-jdk AS build
WORKDIR /app

# Render varsayılan olarak repoyu /opt/render/project/src altına klonluyor
# Docker build context'i repo kökü olduğu için backend/ prefix'i ekliyoruz
COPY backend/gradlew ./gradlew
COPY backend/gradle ./gradle
COPY backend/build.gradle backend/settings.gradle ./
COPY backend/src ./src

RUN chmod +x gradlew
RUN --mount=type=cache,target=/root/.gradle ./gradlew --no-daemon bootJar

FROM eclipse-temurin:23-jre AS runtime
ENV SPRING_PROFILES_ACTIVE=prod \
    JAVA_OPTS=""
WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
