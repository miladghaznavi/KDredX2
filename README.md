# KDredX2

KDredX2 [1] is a cross-platform application (kay-dee-kai; a combined initialism of kernel density estimation and reduced chi-squared) to facilitate the visualization of weighted means along with its accompanied reduced chi-squared statistic, and univariate data density. It supports exporting the visualisations in a variety of file formats and provides an extensive customization to produce publication-quality figures.
The developed numerical computations provide important insight into the nature and usability of said data.
Prior numerical tools developed for this purpose are only available on a single operating system and generally restricted to antiquated programming languages.
KDredX2 is designed to perform the aforementioned functions in the robust Java platform.

KDredX2 can run as a web-based or a standalone application. We have tested the application under MacOS and Windows.

# MacOS App
KDredX2 macOS app is available [here](https://github.com/miladghaznavi/KDredX2/releases/tag/1.1). Make sure that you have installed [JRE](https://java.com/en/download/) before running the App.

# Code Structure
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

# Compile and Build
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
 
# Reference
[1] Spencer, C. J., Yakymchuk, C., & Ghaznavi, M. (2017). Visualising data distributions with kernel density estimation and reduced chi-squared statistic. Geoscience Frontiers, 8(6), 1247-1252.
