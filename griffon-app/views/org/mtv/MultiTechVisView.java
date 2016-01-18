package org.mtv;

import griffon.core.artifact.GriffonView;
import griffon.metadata.ArtifactProviderFor;
import javafx.beans.property.BooleanProperty;
import javafx.beans.property.Property;
import javafx.fxml.FXML;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.AnchorPane;
import javafx.stage.FileChooser;
import javafx.stage.Stage;
import javafx.stage.Window;
import org.codehaus.griffon.runtime.javafx.artifact.AbstractJavaFXGriffonView;
import org.controlsfx.control.spreadsheet.SpreadsheetView;
import javax.annotation.Nullable;
import java.io.File;
import java.net.URL;
import java.util.Collections;
import java.util.ResourceBundle;
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
    }

    // build the UI
    private Scene init() {
        Node node = loadFromFXML();
        Scene scene = new Scene((Parent)node);
        connectActions(node, controller);
        return scene;
    }

    public void placeDataView(Node node) {
        dataTab.setContent(node);
    }

//    public void placeChartView(Node node) {
//        chartTab.setContent(node);
//    }

    public void bindPlot(AtomicReference<BooleanProperty> property) {
        plotActionTarget.disableProperty().bindBidirectional(property.get());
    }

    public int getSelectedTabIndex() {
        return tabGroup.getSelectionModel().getSelectedIndex();
    }
}
