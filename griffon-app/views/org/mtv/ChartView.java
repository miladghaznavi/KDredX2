package org.mtv;

import griffon.core.artifact.GriffonView;
import griffon.metadata.ArtifactProviderFor;
import javafx.scene.Node;
import org.codehaus.griffon.runtime.javafx.artifact.AbstractJavaFXGriffonView;

@ArtifactProviderFor(GriffonView.class)
public class ChartView extends AbstractJavaFXGriffonView {
    private ChartController controller;
    private ChartModel model;
    private MultiTechVisView parentView;


    public void setController(ChartController controller) {
        this.controller = controller;
    }

    public void setModel(ChartModel model) {
        this.model = model;
    }

    @Override
    public void initUI() {
        Node node = loadFromFXML();
//        parentView.placeChartView(node);
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
