package org.mtv;

import java.util.ArrayList;

import javafx.beans.property.StringProperty;
import org.codehaus.griffon.runtime.core.artifact.AbstractGriffonModel;
import griffon.core.artifact.GriffonModel;
import griffon.metadata.ArtifactProviderFor;
import javax.annotation.Nonnull;

@ArtifactProviderFor(GriffonModel.class)
public class DataTabModel extends AbstractGriffonModel {
    private final String DEFAULT_DATA_FILE_PATH = "\nINVALID\n";
    private Document document;
    private StringProperty dataFilePath;

    public Document getDocument() {
        return document;
    }

    public void setDocument(Document document) {
        firePropertyChange("document", this.document, this.document = document);
    }

    public String getDataFilePath() {
        return dataFilePath.get();
    }

    @Nonnull
    final public StringProperty dataFilePathProperty() {
        if (dataFilePath == null) {
            setDataFilePath(DEFAULT_DATA_FILE_PATH);
        }//if
        return dataFilePath;
    }

    public void setDataFilePath(String dataFilePath) {
        this.dataFilePath.set(dataFilePath);
    }

    private String insertIntoSelected;

    // Weighted Mean
    private ArrayList<Double> analyses;
    private ArrayList<Double> uncertainties;

    // Reduced-Chi-Squared
    private String kernelFunction;

    // Kernel Density Estimation
    private ArrayList<Double> observed;
    private ArrayList<Double> expected;


}