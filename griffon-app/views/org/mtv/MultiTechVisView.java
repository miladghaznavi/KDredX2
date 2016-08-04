package org.mtv;

import griffon.core.artifact.GriffonView;
import griffon.metadata.ArtifactProviderFor;
import griffon.transform.Threading;
import javafx.fxml.FXML;
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
    private MultiTechVisController controller;
    private MultiTechVisModel model;

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
        Stage stage = (Stage) getApplication()
            .createApplicationContainer(Collections.<String, Object>emptyMap());
        stage.setTitle(getApplication().getConfiguration().getAsString("application.title"));
        stage.setScene(init());
        stage.sizeToScene();
        getApplication().getWindowManager().attach("mainWindow", stage);

        if (!checkResourcesExist()) {
            Alert alert = new Alert(Alert.AlertType.ERROR);
            alert.setContentText("Some of the resource files are missing. Please reinstall the application.");
            alert.showAndWait();
            System.exit(1);
        }//if

        initWebView();
    }

    // build the UI
    private Scene init() {
        Node node = loadFromFXML();
        Scene scene = new Scene((Parent)node);
        connectActions(node, controller);
        return scene;
    }

    private boolean checkResourcesExist() {
        boolean result = true;
        // TODO: check if all resource files exist
        return result;
    }

    @Threading(Threading.Policy.INSIDE_UITHREAD_SYNC)
    private void initWebView() {
        URL resource = application.getResourceHandler().getResourceAsURL("ui/main.html");
        if (resource == null) {
            //TODO
        }//if
        else {
            webEngine = portWebView.getEngine();
            webEngine.setJavaScriptEnabled(true);
            webEngine.load(resource.toExternalForm());
            webEngine.setOnAlert(
                arg0 -> {
                    Alert alert = new Alert(Alert.AlertType.NONE);
                    alert.setContentText(arg0.getData());
                    alert.showAndWait();
                }
            );
        }//else
    }
}
