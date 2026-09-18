FROM maven:3.9.11-eclipse-temurin-21 AS build

ARG SERVICE_DIR
WORKDIR /workspace

COPY backend/${SERVICE_DIR}/pom.xml ./pom.xml
RUN mvn -q -DskipTests dependency:go-offline

COPY backend/${SERVICE_DIR}/ ./
RUN mvn -q -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /workspace/target/*.jar /app/app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]

