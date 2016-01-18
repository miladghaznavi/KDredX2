package org.mtv;

import griffon.core.artifact.GriffonController;
import griffon.metadata.ArtifactProviderFor;
import org.codehaus.griffon.runtime.core.artifact.AbstractGriffonController;
import org.controlsfx.control.spreadsheet.Grid;

import javax.annotation.Nonnull;
import java.io.File;
import java.io.IOException;
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
        Document document;
        String name;
        if (args.get(Document.DOCUMENT_ID) != null &&
                args.get("document") != null) {
            name = (String) args.get(Document.DOCUMENT_ID);
            document = (Document) args.get("document");
        }//if
        else {
            try {
                document = Document.emptyDocument(
                        DEFAULT_DOCUMENT_TITLE,
                        DEFAULT_DOCUMENT_PATH);
                document.setGrid(view.spreadsheetView.getGrid());
            }//try
            catch (IOException ioException) {
                this.getLog().debug(ioException.getMessage());
                Util.alertWarning(this.msg("WARNING.LOADING.DEFAULT_DOCUMENT"));
                document = new Document();
                document.setTitle(DEFAULT_DOCUMENT_TITLE);
                document.setPath(DEFAULT_DOCUMENT_PATH);
                document.setGrid(view.spreadsheetView.getGrid());
            }//catch
            name = DEFAULT_DOCUMENT_TITLE;
        }//else

        model.setName(name);
        model.setDocument(document);
    }

    public void openDocumentFile() {
        if (model.isDirty()) {
            //TODO: save
        }//if

        Grid copy = model.getDocument().getGrid();
        try {
            File file = view.openDocumentFile();
            if (file != null) {
                model.getDocument().setPath(file.getPath());
                model.getDocument().setTitleFromPath();
                model.getDocument().load();
                view.spreadsheetView.setGrid(model.getDocument().getGrid());
                view.addListenerToSpreadsheetCells();
                model.getDocument().setGrid(view.spreadsheetView.getGrid());
                view.resetControls();
            }//if
        }//try
        catch(IOException | RuntimeException e) {
            this.getLog().debug(e.getMessage());
            Util.alertError(this.msg("Error.dataFileLoad"));
            view.spreadsheetView.setGrid(copy);
            model.getDocument().setGrid(view.spreadsheetView.getGrid());
        }//catch
    }

    public void saveDocument() {
        if (isDefaultDocument()) {
            saveAsDocument();
        }//if
        else {
            try {
                if (model.isDirty()) {
                    model.getDocument().save();
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
                model.getDocument().setPath(file.getPath());
                model.getDocument().save();
            }//if
        }//try
        catch(IOException e) {
            this.getLog().debug(e.getMessage());
            Util.alertError(this.msg("Error.dataFileSave"));
        }//catch
    }

    public boolean isDefaultDocument() {
        return model.getDocument().getPath().equals(DEFAULT_DOCUMENT_PATH);
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
}