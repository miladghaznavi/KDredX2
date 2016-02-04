package org.mtv;

import griffon.core.artifact.GriffonController;
import griffon.metadata.ArtifactProviderFor;
import javafx.scene.chart.Chart;
import org.codehaus.griffon.runtime.core.artifact.AbstractGriffonController;

import javax.annotation.Nonnull;
import java.io.File;
import java.io.IOException;
import java.util.Map;

@ArtifactProviderFor(GriffonController.class)
public class ChartController extends AbstractGriffonController {
    public static final String DEFAULT_CHART_TITLE = ".chartfile.json";
    public static final String DEFAULT_CHART_PATH = "./.chartfile.csv";

    private ChartModel model;

    public void setModel(ChartModel model) {
        this.model = model;
    }

    public ChartModel getModel() {
        return model;
    }

    @Override
    public void mvcGroupInit(@Nonnull Map<String, Object> args) {
        String chartId = (String)args.get(Constants.CHART_ID_PARAM);
        model = (ChartModel) args.get(Constants.CHART_MODEL_PARAM);
        model.setId(chartId);
        model.setTitle((String) args.get(Constants.CHART_TITLE_PARAM));
    }

    public void updateData(ChartModel model) {
        //TODO
    }

    public boolean saveChart() {
        boolean result = true;
        Util.SavingOption option = Util.askForSave(getApplication());

        switch (option) {
            case Save:
                result = saveAsChart();
                break;

            case DoNotSave:
                result = true;
                break;

            case Cancel:
                result = false;
                break;
        }// switch

        return result;
    }

    public boolean saveAsChart() {
        boolean result = false;
        File file = Util.saveDialog(getApplication());
        try {
            if (file != null)
                model.save(file);
            else
                result = true;
        }//try
        catch(IOException e) {
            result = false;
        }//catch

        return result;
    }
}