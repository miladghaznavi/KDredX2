package org.mtv;

import griffon.core.artifact.GriffonController;
import griffon.metadata.ArtifactProviderFor;
import org.codehaus.griffon.runtime.core.artifact.AbstractGriffonController;

import griffon.transform.Threading;

@ArtifactProviderFor(GriffonController.class)
public class DataTabController extends AbstractGriffonController {
    private DataTabModel model;

    public void setModel(DataTabModel model) {
        this.model = model;
    }

    public void add(String path) {

    }

    public void save(String path) {

    }

    public void copy() {

    }

    public void export() {

    }

    public void undo() {

    }

    public void redo() {

    }

    public void plot() {

    }
}