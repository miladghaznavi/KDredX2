package org.mtv;

import griffon.core.artifact.GriffonController;
import griffon.metadata.ArtifactProviderFor;
import javafx.application.Platform;
import javafx.scene.control.Alert;
import org.codehaus.griffon.runtime.core.artifact.AbstractGriffonController;

import griffon.transform.Threading;

@ArtifactProviderFor(GriffonController.class)
public class MultiTechVisController extends AbstractGriffonController {
    private MultiTechVisView view;
    private MultiTechVisModel model;

    public void setModel(MultiTechVisModel model) {
        this.model = model;
    }

//    public void test() {
//        Platform.runLater(new Runnable() {
//            @Override
//            public void run() {
//                if (model.getTest().equals("Test"))
//                    model.setTest("Milad");
//                else
//                    model.setTest("Test");
//            }
//        });
//    }

    @Threading(Threading.Policy.SKIP)
    public void open() {

    }

    public void save() {

    }

    public void export() {

    }

    public void print() {

    }

    public void undo() {

    }

    public void redo() {

    }

    public void cut() {

    }

    public void copy() {

    }

    public void paste() {

    }

    public void plot() {

    }
}