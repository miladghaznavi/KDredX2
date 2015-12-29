package org.mtv.controls;

import griffon.core.artifact.GriffonView;
import griffon.metadata.ArtifactProviderFor;
import javafx.event.EventHandler;
import javafx.fxml.FXML;
import javafx.scene.Group;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.stage.Stage;
import org.codehaus.griffon.runtime.javafx.artifact.AbstractJavaFXGriffonView;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.Collections;

@ArtifactProviderFor(GriffonView.class)
public class CommonToolBoxView extends AbstractJavaFXGriffonView {
    private CommonToolBoxController controller;
    private CommonToolBoxModel model;

    @FXML
    Button addButton;

    public void setController(CommonToolBoxController controller) {
        this.controller = controller;
    }

    public void setModel(CommonToolBoxModel model) {
        this.model = model;
    }

    @Override
    public void initUI() {
//        Stage stage = (Stage) getApplication()
//                .createApplicationContainer(Collections.<String, Object>emptyMap());
//        stage.setTitle(getApplication().getConfiguration().getAsString("application.title"));
//        stage.setScene(init());
//        stage.sizeToScene();
//        getApplication().getWindowManager().attach("mainWindow", stage);
//
//        addButton.setOnAction(new EventHandler<javafx.event.ActionEvent>() {
//            @Override
//            public void handle(javafx.event.ActionEvent event) {
//                System.out.println(event.toString());
//            }
//        });
    }

//    // build the UI
//    private Scene init() {
//        Node node = loadFromFXML();
//        Scene scene = new Scene((Parent) node);
//        connectActions(node, controller);
//
//        return scene;
//    }
}
