KDredX2
-------

KDredX2 is a Griffon application with JavaFX as UI toolkit
and Java as main language. The project has the following file structure

    .
    ├── build.gradle
    ├── griffon-app
    │   ├── conf
    │   ├── controllers
    │   ├── i18n
    │   ├── lifecycle
    │   ├── models
    │   ├── resources
    │   ├── services
    │   └── views
    ├── pom.xml
    └── src
        ├── integration-test
        │   └── java
        ├── main
        │   ├── java
        │   └── resources
        └── test
            ├── java
            └── resources

You will be able to build your project with

    gradle build
    gradle test
    gradle run

Don't forget to add any extra JAR dependencies to `build.gradle`!

If you prefer building with Maven then execute the following commands

    mvn compile
    mvn test
    mvn -Prun

Don't forget to add any extra JAR dependencies to `pom.xml`!
 
