package org.mtv;

import java.util.ArrayList;
import org.codehaus.griffon.runtime.core.artifact.AbstractGriffonModel;
import griffon.core.artifact.GriffonModel;
import griffon.metadata.ArtifactProviderFor;

@ArtifactProviderFor(GriffonModel.class)
public class DataTabModel extends AbstractGriffonModel {
//    private StringProperty insertIntoChoice;
//
//    @Nonnull
//    public final StringProperty insertIntoChoiceProperty() {
//        return insertIntoChoice;
//    }
//
//    public String getInsertIntoChoice() {
//        if (insertIntoChoice.get() == null) {
//            setInsertIntoChoice(application.getMessageSource().getMessage("DataTab.makeNewPlot"));
//        }//if
//        return insertIntoChoiceProperty().get();
//    }
//
//    public void setInsertIntoChoice(String insertIntoChoice) {
//        this.insertIntoChoiceProperty().set(insertIntoChoice);
//    }

    String insertIntoSelected;

    // Weighted Mean
    ArrayList<Double> analyses;
    ArrayList<Double> uncertainties;

    // Reduced-Chi-Squared
    String kernelFunction;

    // Kernel Density Estimation
    ArrayList<Double> observed;
    ArrayList<Double> expected;
}