FROM gradle:4.10-jdk8-alpine AS builder

COPY --chown=gradle:gradle . /home/gradle/project

WORKDIR /home/gradle/project

RUN gradle --quiet --no-daemon assemble

FROM openjdk:8u171-alpine

LABEL maintainer="https://github.com/Vincit"

EXPOSE 8080

COPY --from=builder /home/gradle/project/build/libs/*-all.jar /chatservice.jar

USER nobody

CMD [ "java", "-jar", "/chatservice.jar" ]
