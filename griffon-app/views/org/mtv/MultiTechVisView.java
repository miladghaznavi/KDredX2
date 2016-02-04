package org.mtv;

import griffon.core.artifact.GriffonView;
import griffon.metadata.ArtifactProviderFor;
import javafx.beans.property.BooleanProperty;
import javafx.beans.property.StringProperty;
import javafx.fxml.FXML;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.AnchorPane;
import javafx.stage.Stage;
import org.codehaus.griffon.runtime.javafx.artifact.AbstractJavaFXGriffonView;
import org.controlsfx.control.spreadsheet.SpreadsheetView;
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

    public void placeChartView(Node node) {
        Tab chartTab = new Tab();
        chartTab.setId(controller.getModel().getChartIds().get(controller.getModel().getChartIds().size() - 1));
        chartTab.setContent(node);
        chartTab.setOnCloseRequest((event) -> chartTabClose(event));
        tabGroup.getTabs().add(chartTab);
    }

    public void chartTabClose(javafx.event.Event event) {
        Tab tab = (Tab) event.getSource();
        String tabId = tab.getId();
        if (!controller.closeChartTab(tabId)) {
            event.consume();
        }//if
    }

    public void bindPlot(AtomicReference<BooleanProperty> property) {
        plotActionTarget.disableProperty().bindBidirectional(property.get());
    }

    public int getSelectedTabIndex() {
        return tabGroup.getSelectionModel().getSelectedIndex();
    }

    public void selectChart(int index) {
        tabGroup.getSelectionModel().select(index);
    }

    public StringProperty getChartTitleProperty(int index) {
        return tabGroup.getTabs().get(index).textProperty();
    }
}
