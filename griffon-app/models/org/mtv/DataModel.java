package org.mtv;

import java.util.ArrayList;

import javafx.beans.property.*;
import javafx.beans.value.ObservableBooleanValue;
import org.codehaus.griffon.runtime.core.artifact.AbstractGriffonModel;
import griffon.core.artifact.GriffonModel;
import griffon.metadata.ArtifactProviderFor;

@ArtifactProviderFor(GriffonModel.class)
public class DataModel extends AbstractGriffonModel {
    public static final boolean DEFAULT_DIRTY = false;
    public static final boolean DEFAULT_FIRST_ROW_AS_HEADER = false;

    public enum ModelArrayList {
        Analyses,
        Uncertainties,
        Observed,
        Expected,
        X
    }

    private boolean dirty = DEFAULT_DIRTY;

    // Name for the model
    private ObjectProperty<String> name;

    // Document
    private Document document;

    // Target chart
    private ObjectProperty<String> insertInto;

    // Weighted Mean
    private ArrayList<Double> analyses;
    private ArrayList<Double> uncertainties;

    // Reduced-Chi-Squared
    private ArrayList<Double> observed;
    private ArrayList<Double> expected;

    // Kernel Density Estimation
    private ArrayList<Double> X;
    private ObjectProperty<String> kernelFunction;

    public String getName() {
        if(name == null) {
            name = new SimpleObjectProperty<>();
        }//if
        return name.get();
    }

    public ObjectProperty<String> nameProperty() {
        return name;
    }

    public void setName(String name) {
        if(this.name == null) {
            this.name = new SimpleObjectProperty<>();
        }//if
        this.name.set(name);
    }

    public String getInsertInto() {
        if (insertInto == null)
            insertInto = new SimpleObjectProperty<>();
        return insertInto.get();
    }

    public ObjectProperty<String> insertIntoProperty() {
        if(insertInto == null)
            insertInto = new SimpleObjectProperty<>();
        return insertInto;
    }

    public void setInsertInto(String insertInto) {
        this.insertInto.set(insertInto);
    }

    public ArrayList<Double> getAnalyses() {
        return analyses;
    }

    public void setAnalyses(ArrayList<Double> analyses) {
        this.analyses = analyses;
    }

    public ArrayList<Double> getUncertainties() {
        return uncertainties;
    }

    public void setUncertainties(ArrayList<Double> uncertainties) {
        this.uncertainties = uncertainties;
    }

    public ArrayList<Double> getObserved() {
        return observed;
    }

    public void setObserved(ArrayList<Double> observed) {
        this.observed = observed;
    }

    public ArrayList<Double> getExpected() {
        return expected;
    }

    public void setExpected(ArrayList<Double> expected) {
        this.expected = expected;
    }

    public String getKernelFunction() {
        if (kernelFunction == null) {
            kernelFunction = new SimpleObjectProperty<>();
        }//if
        return kernelFunction.get();
    }

    public ObjectProperty<String> kernelFunctionProperty() {
        if (kernelFunction == null) {
            kernelFunction = new SimpleObjectProperty<>();
        }//if
        return kernelFunction;
    }

    public void setKernelFunction(String kernelFunction) {
        this.kernelFunction.set(kernelFunction);
    }

    public Document getDocument() {
        return document;
    }

    public void setDocument(Document document) {
        firePropertyChange("document", this.document, this.document = document);
    }

    public boolean isDirty() {
        return dirty;
    }

    public void setDirty(boolean dirty) {
        this.dirty = dirty;
    }

    public ArrayList<Double> getX() {
        return X;
    }

    public void setX(ArrayList<Double> x) {
        X = x;
    }

    public void setFromDocument(ModelArrayList arrayList, int column, boolean excludeFirstRow) {
        ArrayList<Double> list = new ArrayList<>();
        int start = (excludeFirstRow) ? 1 : 0;
        for (int i = start; i < document.getData().size(); ++i)
            list.add(Double.valueOf(document.getData().get(i).get(column)));

        switch (arrayList) {
            case Analyses:
                setAnalyses(list);
                break;
            case Uncertainties:
                setUncertainties(list);
                break;
            case Observed:
                setObserved(list);
                break;
            case Expected:
                setExpected(list);
                break;
            case X:
                setX(list);
                break;
        }//switch
    }

    public void setFromDocument(ModelArrayList arrayList, int column) {
        setFromDocument(arrayList, column, false);
    }
}