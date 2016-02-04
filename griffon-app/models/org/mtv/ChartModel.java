package org.mtv;

import griffon.core.artifact.GriffonModel;
import griffon.metadata.ArtifactProviderFor;
import javafx.beans.property.*;
import org.codehaus.griffon.runtime.core.artifact.AbstractGriffonModel;
import org.mtv.statistics.KernelDensityEstimation;
import org.mtv.statistics.KernelFunctionType;
import org.mtv.statistics.ReducedChiSquared;
import org.mtv.statistics.WeightedMean;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.Array;
import java.util.ArrayList;


@ArtifactProviderFor(GriffonModel.class)
public class ChartModel extends AbstractGriffonModel {
    public boolean DEFAULT_IS_DIRTY = true;
    // Chart
    private String id;
    private StringProperty title = new SimpleStringProperty();
    private BooleanProperty dirty = new SimpleBooleanProperty(DEFAULT_IS_DIRTY);

    // Weighted Mean
    private WeightedMean weightedMeanCal = new WeightedMean();
    private ArrayList<Double> analyses;
    private ArrayList<Double> uncertainties;
    private DoubleProperty weightedMean = new SimpleDoubleProperty();
    private DoubleProperty weightedUncertainty = new SimpleDoubleProperty();
    private DoubleProperty mswd = new SimpleDoubleProperty();

    // Reduced-Chi-Squared
    private ReducedChiSquared reducedChiSquaredCal = new ReducedChiSquared();
    private ArrayList<Double> observed;
    private ArrayList<Double> expected;
    private DoubleProperty reducedChiSquared = new SimpleDoubleProperty();

    // Kernel Density Estimation
    //TODO: rename X to Xi
    private ArrayList<Double> X;
    private ObjectProperty<KernelFunctionType> kernelFunction = new SimpleObjectProperty<>(KernelFunctionType.Unknown);
    private ObjectProperty<ArrayList<Double>> kde = new SimpleObjectProperty<>();
    private DoubleProperty skewness = new SimpleDoubleProperty();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title.get();
    }

    public StringProperty titleProperty() {
        return title;
    }

    public void setTitle(String title) {
        this.title.set(title);
    }

    public boolean isDirty() {
        return dirty.get();
    }

    public BooleanProperty dirtyProperty() {
        return dirty;
    }

    public void setDirty(boolean dirty) {
        this.dirty.set(dirty);
    }

    public void setData(DataName name, ArrayList<Double> data) {
        switch (name) {
            case Analyses:
                setAnalyses(data);
                break;
            case Uncertainties:
                setUncertainties(data);
                break;
            case Observed:
                setObserved(data);
                break;
            case Expected:
                setExpected(data);
                break;
            case X:
                setX(data);
                break;
        }//switch
    }

    public ArrayList<Double> getData(DataName name) {
        ArrayList<Double> data;
        switch (name) {
            case Analyses:
                data = getAnalyses();
                break;
            case Uncertainties:
                data = getUncertainties();
                break;
            case Observed:
                data = getObserved();
                break;
            case Expected:
                data = getExpected();
                break;
            case X:
                data = getX();
                break;
            default:
                data = new ArrayList<>();
        }//switch

        return data;
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

    public KernelFunctionType getKernelFunction() {
        return kernelFunction.get();
    }

    public ObjectProperty<KernelFunctionType> kernelFunctionProperty() {
        return kernelFunction;
    }

    public void setKernelFunction(KernelFunctionType type) {
        this.kernelFunction.set(type);
    }
    
    public ArrayList<Double> getX() {
        return X;
    }

    public void setX(ArrayList<Double> x) {
        X = x;
    }

    public double getWeightedMean() {
        return weightedMean.get();
    }

    public DoubleProperty weightedMeanProperty() {
        return weightedMean;
    }

    public void setWeightedMean(double weightedMean) {
        this.weightedMean.set(weightedMean);
    }

    public double getMswd() {
        return mswd.get();
    }

    public DoubleProperty mswdProperty() {
        return mswd;
    }

    public void setMswd(double mswd) {
        this.mswd.set(mswd);
    }

    public double getWeightedUncertainty() {
        return weightedUncertainty.get();
    }

    public DoubleProperty weightedUncertaintyProperty() {
        return weightedUncertainty;
    }

    public void setWeightedUncertainty(double weightedUncertainty) {
        this.weightedUncertainty.set(weightedUncertainty);
    }

    public double getReducedChiSquared() {
        return reducedChiSquared.get();
    }

    public DoubleProperty reducedChiSquaredProperty() {
        return reducedChiSquared;
    }

    public void setReducedChiSquared(double reducedChiSquared) {
        this.reducedChiSquared.set(reducedChiSquared);
    }

    public ArrayList<Double> getKde() {
        return kde.get();
    }

    public ObjectProperty<ArrayList<Double>> kdeProperty() {
        return kde;
    }

    public void setKde(ArrayList<Double> kde) {
        this.kde.set(kde);
    }

    public double getSkewness() {
        return skewness.get();
    }

    public DoubleProperty skewnessProperty() {
        return skewness;
    }

    public void setSkewness(double skewness) {
        this.skewness.set(skewness);
    }

    public void calculate() {
        // Weighted weightedMean
        this.weightedMean.set(this.weightedMeanCal.weightedMean(analyses, uncertainties));
        this.setWeightedMean(this.weightedMeanCal.weightedUncertainty(uncertainties));
        this.setMswd(this.weightedMeanCal.meanSquareWeightedDeviation(analyses, uncertainties));

        // Reduced chi-squared
        this.setReducedChiSquared(
            this.reducedChiSquaredCal.reducedChiSquare(observed, expected)
        );

        //TODO: Kernel Density Estimation
        KernelDensityEstimation kde;
        switch (getKernelFunction()) {
            case Epanechnikov:
//                kde = KernelDensityEstimation.KernelDensityEstimationTypes.
//                        getEpanechnikov(this.getX(), this.get)
                break;
            case Gaussian:
                break;
        }//switch
    }

    public void save(File file) throws IOException {
        //TODO
    }
}