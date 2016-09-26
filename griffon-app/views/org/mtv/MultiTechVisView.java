package org.mtv;

import griffon.core.artifact.GriffonView;
import griffon.metadata.ArtifactProviderFor;
import griffon.transform.Threading;
import javafx.beans.value.ObservableValue;
import javafx.fxml.FXML;
import javafx.concurrent.Worker.State;
import javafx.beans.value.ChangeListener;
import netscape.javascript.JSObject;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javafx.stage.Stage;
import org.codehaus.griffon.runtime.javafx.artifact.AbstractJavaFXGriffonView;
import java.net.URL;
import java.util.Collections;

@ArtifactProviderFor(GriffonView.class)
public class MultiTechVisView extends AbstractJavaFXGriffonView {
    private static final String UI_HTML = "ui/index.html";
    private static final String JS_JAVA_BRIDGE = "JavaJSBridge";
    private static final String RESOURCES_NOT_FOUND_ERROR_TITLE = "Resources not found error";
    private static final String RESOURCES_NOT_FOUND_ERROR_CONTENT = "Some of the resource files are missing. Please reinstall the application to fix the problem.";
    private MultiTechVisController controller;
    private MultiTechVisModel model;
    JSObject JavaJSBridge;
    Stage stage;

    @FXML
    private WebView portWebView;
    private WebEngine webEngine;

    public void setController(MultiTechVisController controller) {
        this.controller = controller;
    }

    public void setModel(MultiTechVisModel model) {
        this.model = model;
    }

    @Override
    public void initUI() {
        stage = (Stage) getApplication()
            .createApplicationContainer(Collections.<String, Object> emptyMap());
        stage.setTitle(getApplication().getConfiguration().getAsString("application.title"));
        stage.setScene(init());
        stage.sizeToScene();
        getApplication().getWindowManager().attach("mainWindow", stage);

        if (!checkResourcesExist()) {
            alertResourcesNotFound();
            application.shutdown();
        }//if

        initWebView();
    }

    private void alertResourcesNotFound() {
        Alert alert = new Alert(Alert.AlertType.ERROR);
        alert.setTitle(MultiTechVisView.RESOURCES_NOT_FOUND_ERROR_TITLE);
        alert.setContentText(MultiTechVisView.RESOURCES_NOT_FOUND_ERROR_CONTENT);
        alert.showAndWait();
    }

    // build the UI
    private Scene init() {
        Node node = loadFromFXML();
        Scene scene = new Scene((Parent)node);
        connectActions(node, controller);
        return scene;
    }

    private boolean checkResourcesExist() {
        URL resource = application.getResourceHandler().getResourceAsURL(MultiTechVisView.UI_HTML);
        return (resource != null);
    }

    void alert(String msg) {
        Alert alerting = new Alert(Alert.AlertType.INFORMATION);
        alerting.setContentText(msg);
        alerting.showAndWait();
    }

    @Threading(Threading.Policy.INSIDE_UITHREAD_SYNC)
    private void initWebView() {
        URL resource = application.getResourceHandler().getResourceAsURL(MultiTechVisView.UI_HTML);
        webEngine = portWebView.getEngine();

        webEngine.setJavaScriptEnabled(true);
        webEngine.load(resource.toExternalForm());

        webEngine.getLoadWorker().stateProperty().addListener(
                new ChangeListener<State>(){
                    @Override
                    public void changed(ObservableValue<? extends State> ov, State oldState, State newState) {
                        if(newState == State.SUCCEEDED){
                            JSObject window = (JSObject) webEngine.executeScript("window");
                            window.setMember(MultiTechVisView.JS_JAVA_BRIDGE, new Bridge(stage));
                        }//if
                    }
                });

        webEngine.setOnAlert(
            arg0 -> {
                Alert alert = new Alert(Alert.AlertType.INFORMATION);
                alert.setContentText(arg0.getData());
                alert.showAndWait();
            }
        );
    }
}
