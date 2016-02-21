package org.mtv;

import griffon.core.artifact.GriffonView;
import griffon.metadata.ArtifactProviderFor;
import griffon.transform.Threading;
import javafx.beans.property.BooleanProperty;
import javafx.beans.property.StringProperty;
import javafx.concurrent.Worker;
import javafx.event.EventHandler;
import javafx.fxml.FXML;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.AnchorPane;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebEvent;
import javafx.scene.web.WebView;
import javafx.stage.Stage;
import org.codehaus.griffon.runtime.javafx.artifact.AbstractJavaFXGriffonView;
import org.controlsfx.control.spreadsheet.SpreadsheetView;
import org.json.JSONException;

import java.net.URL;
import java.util.Collections;
import java.util.concurrent.atomic.AtomicReference;

@ArtifactProviderFor(GriffonView.class)
public class MultiTechVisView extends AbstractJavaFXGriffonView {
    private MultiTechVisController controller;
    private MultiTechVisModel model;

    @FXML
    private SpreadsheetView spreadsheetView;
    @FXML
    private TabPane tabGroup;
    @FXML
    private AnchorPane mainContent;
    @FXML
    private Tab dataTab;
    @FXML
    private Label progressLabel;
    @FXML
    private ProgressBar progressBar;
    @FXML
    private MenuItem plotActionTarget;

    @FXML
    private WebView portWebView;
    private WebEngine webEngine;

    public TabPane getTabGroup() {
        return tabGroup;
    }

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

        initWebView();
    }

    // build the UI
    private Scene init() {
        Node node = loadFromFXML();
        Scene scene = new Scene((Parent)node);
        connectActions(node, controller);
        return scene;
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
