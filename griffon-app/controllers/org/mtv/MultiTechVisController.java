package org.mtv;

import griffon.core.artifact.GriffonController;
import griffon.metadata.ArtifactProviderFor;
import org.codehaus.griffon.runtime.core.artifact.AbstractGriffonController;
import griffon.transform.Threading;
import javax.annotation.Nonnull;
import java.util.Map;

@ArtifactProviderFor(GriffonController.class)
public class MultiTechVisController extends AbstractGriffonController {
    private final static String DEFAULT_DATA_ID = "data";
    private MultiTechVisView view;
    private MultiTechVisModel model;

    public void setModel(MultiTechVisModel model) {
        this.model = model;
    }

    @Override
    public void mvcGroupInit(@Nonnull Map<String, Object> args) {
        String documentId = createMVCGroup(DEFAULT_DATA_ID).getMvcId();
        model.setDataId(documentId);
    }

    @Threading(Threading.Policy.SKIP)
    public void open() {
        if (view.getSelectedTabIndex() == 0) {
            String id = model.getDataId();
            DataController dataTabController =
                    getApplication().getMvcGroupManager().getController(id, DataController.class);
            dataTabController.openDocumentFile();
        }//if
        else {
            //TODO: Implement the open chart
        }//else
    }

    @Threading(Threading.Policy.SKIP)
    public void save() {
        if (view.getSelectedTabIndex() == 0) {
            String id = model.getDataId();
            DataController dataTabController =
                    getApplication().getMvcGroupManager().getController(id, DataController.class);

            dataTabController.saveDocument();
        }//if
        else {
            //TODO: Implement the save chart
        }//else
    }

    @Threading(Threading.Policy.SKIP)
    public void saveAs() {
        if (view.getSelectedTabIndex() == 0) {
            String id = model.getDataId();
            DataController dataTabController =
                    getApplication().getMvcGroupManager().getController(id, DataController.class);
            dataTabController.saveAsDocument();
        }//if
        else {
            //TODO: Implement the save chart
        }//else
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

//    boolean checkFirstRow(DataModel model) {
//
//    }

    @Threading(Threading.Policy.INSIDE_UITHREAD_SYNC)
    public void plot(DataModel model) {

    }

    @Threading(Threading.Policy.INSIDE_UITHREAD_SYNC)
    public void plot() {
        plot(
            getApplication().getMvcGroupManager().getModel(DEFAULT_DATA_ID, DataModel.class)
        );
    }
}