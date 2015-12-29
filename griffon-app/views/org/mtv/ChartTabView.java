package org.mtv;

import griffon.core.artifact.GriffonView;
import griffon.metadata.ArtifactProviderFor;
import javafx.fxml.FXML;
import javafx.scene.Group;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.paint.Color;
import javafx.stage.Stage;
import org.codehaus.griffon.runtime.javafx.artifact.AbstractJavaFXGriffonView;

import java.util.Collections;

@ArtifactProviderFor(GriffonView.class)
public class ChartTabView extends AbstractJavaFXGriffonView {
    private ChartTabController controller;
    private ChartTabModel model;
    private MultiTechVisView parentView;


    public void setController(ChartTabController controller) {
        this.controller = controller;
    }

    public void setModel(ChartTabModel model) {
        this.model = model;
    }

    @Override
    public void initUI() {
        Node node = loadFromFXML();
        parentView.placeChartView(node);
//        Stage stage = (Stage) getApplication()
//            .createApplicationContainer(Collections.<String,Object>emptyMap());
//        stage.setTitle(getApplication().getConfiguration().getAsString("application.title"));
//        stage.setScene(init());
//        stage.sizeToScene();
//        getApplication().getWindowManager().attach("chart-tab", stage);
    }

    // build the UI
//    private Scene init() {
//        Scene scene = new Scene(new Group());
//
//        Node node = loadFromFXML();
//        if (node instanceof Parent) {
//            scene.setRoot((Parent) node);
//        } else {
//            ((Group) scene.getRoot()).getChildren().addAll(node);
//        }
//        connectActions(node, controller);
//
//        return scene;
//    }
}
