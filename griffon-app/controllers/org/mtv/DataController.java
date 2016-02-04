package org.mtv;

import griffon.core.artifact.GriffonController;
import griffon.metadata.ArtifactProviderFor;
import org.codehaus.griffon.runtime.core.artifact.AbstractGriffonController;
import org.controlsfx.control.spreadsheet.Grid;

import javax.annotation.Nonnull;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;

@ArtifactProviderFor(GriffonController.class)
public class DataController extends AbstractGriffonController {
    public static final String DEFAULT_DOCUMENT_TITLE = ".datafile.csv";
    public static final String DEFAULT_DOCUMENT_PATH = "./.datafile.csv";

    private DataModel model;
    private DataView view;
    private MultiTechVisController parentController;

    @Override
    public void mvcGroupInit(@Nonnull Map<String, Object> args) {
        try {
            String dataKey = (String)args.get(Constants.DATA_ID_PARAM);
            model = DataModel.empty(
                    DEFAULT_DOCUMENT_TITLE,
                    DEFAULT_DOCUMENT_PATH);
            model.setGrid(view.spreadsheetView.getGrid());
            model.setId(dataKey);
        }//try
        catch (IOException ioException) {
            this.getLog().debug(ioException.getMessage());
            Util.alertWarning(this.msg("WARNING.LOADING.DEFAULT_DOCUMENT"));
            model.setName(DEFAULT_DOCUMENT_TITLE);
            model.setPath(DEFAULT_DOCUMENT_PATH);
            model.setGrid(view.spreadsheetView.getGrid());
        }//catch
    }

    public void openDocumentFile() {
        if (model.isDirty()) {
            //TODO: save
        }//if

        Grid copy = model.getGrid();
        try {
            File file = view.openDocumentFile();
            if (file != null) {
                model.setPath(file.getPath());
                model.setTitleFromPath();
                model.load();
                view.spreadsheetView.setGrid(model.getGrid());
                view.addListenerToSpreadsheetCells();
                model.setGrid(view.spreadsheetView.getGrid());
                view.resetControls();
            }//if
        }//try
        catch(IOException | RuntimeException e) {
            this.getLog().debug(e.getMessage());
            Util.alertError(this.msg("Error.dataFileLoad"));
            view.spreadsheetView.setGrid(copy);
            model.setGrid(view.spreadsheetView.getGrid());
        }//catch
    }

    public void saveDocument() {
        if (isDefaultDocument()) {
            saveAsDocument();
        }//if
        else {
            try {
                if (model.isDirty()) {
                    model.save();
                }//if
            }//try
            catch (IOException ioExc) {
                this.getLog().debug(ioExc.getMessage());
                Util.alertError(this.msg("Error.dataFileSave"));
            }//catch
        }//else
    }

    public void saveAsDocument() {
        try {
            File file = view.saveDocument();
            if (file != null) {
                model.setPath(file.getPath());
                model.save();
            }//if
        }//try
        catch(IOException e) {
            this.getLog().debug(e.getMessage());
            Util.alertError(this.msg("Error.dataFileSave"));
        }//catch
    }

    public boolean isDefaultDocument() {
        return model.getPath().equals(DEFAULT_DOCUMENT_PATH);
    }

    public void export() {

    }

    public void copy() {

    }

    public void undo() {

    }

    public void redo() {

    }

    public void plot() {
        parentController.plot(model);
    }

    public DataView getView() {
        return view;
    }

    public DataModel getModel() {
        return model;
    }

    public void updatePlotIn(ArrayList<String> titles) {
        view.updatePlotInChoiceBox(titles);
    }
}