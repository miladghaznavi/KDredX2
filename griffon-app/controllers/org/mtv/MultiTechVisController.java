package org.mtv;

import griffon.core.artifact.GriffonController;
import griffon.metadata.ArtifactProviderFor;
import org.codehaus.griffon.runtime.core.artifact.AbstractGriffonController;
import griffon.transform.Threading;
import javax.annotation.Nonnull;
import java.util.Map;

@ArtifactProviderFor(GriffonController.class)
public class MultiTechVisController extends AbstractGriffonController {
    private final int DEFAULT_MAKE_NEW_CHART_CHOICE = 0;
    private final int MAX_PLOTS = 20;
    private int chartSeenCount = 0;
    private MultiTechVisModel model;
    private MultiTechVisView view;

    public void setModel(MultiTechVisModel model) {
        this.model = model;
    }

    public MultiTechVisModel getModel() {
        return model;
    }

    @Override
    public void mvcGroupInit(@Nonnull Map<String, Object> args) {

    }

    @Threading(Threading.Policy.SKIP)
    public void open() {
        //TODO
    }

    @Threading(Threading.Policy.SKIP)
    public void save() {
        //TODO
    }

    @Threading(Threading.Policy.SKIP)
    public void saveAs() {
        //TODO
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
}