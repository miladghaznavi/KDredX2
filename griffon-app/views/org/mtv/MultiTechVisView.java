package org.mtv;

import griffon.core.artifact.GriffonView;
import griffon.javafx.support.JavaFXUtils;
import griffon.metadata.ArtifactProviderFor;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.fxml.FXML;
import javafx.scene.Group;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Tab;
import javafx.scene.control.TabPane;
import javafx.scene.layout.AnchorPane;
import javafx.stage.Stage;
import org.codehaus.griffon.runtime.javafx.artifact.AbstractJavaFXGriffonView;
import org.controlsfx.control.spreadsheet.SpreadsheetView;

import javax.annotation.Nonnull;
import java.util.Collections;
import java.util.Map;

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
    private Tab chartTab;

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
    public void mvcGroupInit(@Nonnull Map<String, Object> args) {
        createMVCGroup("dataTab");
        createMVCGroup("chartTab");
    }

    @Override
    public void initUI() {
        Stage stage = (Stage) getApplication()
            .createApplicationContainer(Collections.<String, Object>emptyMap());
        stage.setTitle(getApplication().getConfiguration().getAsString("application.title"));
        stage.setScene(init());
        stage.sizeToScene();
        getApplication().getWindowManager().attach("mainWindow", stage);
    }

    // build the UI
    private Scene init() {
        Node node = loadFromFXML();
        Scene scene = new Scene((Parent)node);
        connectActions(node, controller);
//        model.testProperty().bindBidirectional(button.textProperty());
//        JavaFXUtils.configure(button, toolkitActionFor(controller, "test"));
        return scene;
    }

    public void placeDataView(Node node) {
        dataTab.setContent(node);
    }

    public void placeChartView(Node node) {
        chartTab.setContent(node);
    }
}
