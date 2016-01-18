package org.mtv;

import griffon.core.GriffonApplication;
import griffon.core.artifact.GriffonModel;
import griffon.metadata.ArtifactProviderFor;
import javafx.beans.property.StringProperty;
import javafx.beans.property.SimpleStringProperty;
import org.codehaus.griffon.runtime.core.artifact.AbstractGriffonModel;

import javax.annotation.Nonnull;
import javax.inject.Inject;
import java.util.ArrayList;

@ArtifactProviderFor(GriffonModel.class)
public class MultiTechVisModel extends AbstractGriffonModel {
    private String dataTabId;
    private ArrayList<String> chartIds;

    @Inject
    public MultiTechVisModel(@Nonnull GriffonApplication application) {
        super(application);
    }

    public ArrayList<String> getChartIds() {
        return chartIds;
    }

    public void setChartIds(ArrayList<String> chartTabsIds) {
        this.chartIds = chartTabsIds;
    }

    public String getDataId() {
        return dataTabId;
    }

    public void setDataId(String dataTabId) {
        this.dataTabId = dataTabId;
    }
}