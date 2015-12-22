package org.mtv.controls;

import griffon.core.artifact.GriffonView;
import griffon.metadata.ArtifactProviderFor;
import javafx.fxml.FXML;
import javafx.scene.Group;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.stage.Stage;
import org.codehaus.griffon.runtime.javafx.artifact.AbstractJavaFXGriffonView;

import java.util.Collections;

@ArtifactProviderFor(GriffonView.class)
public class CommonToolBoxView extends AbstractJavaFXGriffonView {
    private CommonToolBoxController controller;
    private CommonToolBoxModel model;

    public void setController(CommonToolBoxController controller) {
        this.controller = controller;
    }

    public void setModel(CommonToolBoxModel model) {
        this.model = model;
    }

    @Override
    public void initUI() {

    }
}
