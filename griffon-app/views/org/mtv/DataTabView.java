package org.mtv;

import griffon.core.artifact.GriffonView;
import griffon.metadata.ArtifactProviderFor;
import javafx.fxml.FXML;
import javafx.scene.control.ChoiceBox;
import org.codehaus.griffon.runtime.javafx.artifact.AbstractJavaFXGriffonView;
import java.util.Collections;

@ArtifactProviderFor(GriffonView.class)
public class DataTabView extends AbstractJavaFXGriffonView {
    private DataTabController controller;
    private DataTabModel model;

    @FXML
    ChoiceBox insertIntoChoiceBox;

    public void setController(DataTabController controller) {
        this.controller = controller;
    }

    public void setModel(DataTabModel model) {
        this.model = model;
    }

    @Override
    public void initUI() {

    }
}
