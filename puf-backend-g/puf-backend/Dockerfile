FROM eclipse-temurin:17-jdk AS build
WORKDIR /app
COPY . .
RUN sed -i 's/\r$//' gradlew && chmod +x gradlew
RUN ./gradlew bootJar -x test --no-daemon

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 5555
ENTRYPOINT ["java", "-Xmx300m", "-jar", "app.jar"]
