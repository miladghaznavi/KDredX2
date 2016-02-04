package org.mtv;

import griffon.core.artifact.GriffonController;
import griffon.metadata.ArtifactProviderFor;
import griffon.util.CollectionUtils;
import org.codehaus.griffon.runtime.core.artifact.AbstractGriffonController;
import griffon.transform.Threading;
import org.mtv.statistics.KernelFunctionType;

import javax.annotation.Nonnull;
import java.util.ArrayList;
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
        String id = Constants.DATA_ID + "-" + System.currentTimeMillis();
        createMVCGroup(
                Constants.DATA_MVC_GROUP,
                id,
                CollectionUtils.<String, Object>map()
                    .e(Constants.DATA_ID_PARAM, id)
        );
        model.setDataId(id);
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
            String id = model.getChartIds().get(view.getSelectedTabIndex() - 1);
            ChartController chartController =
                    getApplication().getMvcGroupManager().getController(id, ChartController.class);
            chartController.saveChart();
        }//else
    }

    @Threading(Threading.Policy.SKIP)
    public void saveAs() {
        if (view.getSelectedTabIndex() == 0) {
            String id = model.getDataId();
            DataController dataController =
                    getApplication().getMvcGroupManager().getController(id, DataController.class);
            dataController.saveAsDocument();
        }//if
        else {
            String id = model.getChartIds().get(view.getSelectedTabIndex() - 1);
            ChartController chartController =
                    getApplication().getMvcGroupManager().getController(id, ChartController.class);
            chartController.saveAsChart();
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

    boolean isFirstRowValid(DataModel model) {
        boolean result = true;
        for (DataName name : DataName.values()) {
            String value = model.getData(0, model.getColumnIndex(name));
            if (!Util.isValidDouble(value)) {
                result = false;
                break;
            }//if
        }//for
        return result;
    }

    KernelFunctionType getKernelFunctionType(String type) {
        KernelFunctionType kernelFunctionType = KernelFunctionType.Unknown;
        if (type.equals(msg("Data.epanechnikov")))
            kernelFunctionType = KernelFunctionType.Epanechnikov;
        else if (type.equals(msg("Data.gaussian")))
            kernelFunctionType = KernelFunctionType.Gaussian;

        return kernelFunctionType;
    }

    ChartModel chartModel(DataModel dataModel) {
        ChartModel chartModel = new ChartModel();
        boolean exludeFirstRow = !isFirstRowValid(dataModel);

        chartModel.setKernelFunction(
            getKernelFunctionType(dataModel.getKernelFunction())
        );

        // Find the data
        int minDataLen = Integer.MAX_VALUE;
        for (DataName name: DataName.values()) {
            chartModel.setData(name, dataModel.getData(name, exludeFirstRow));
            minDataLen = Math.min(chartModel.getData(name).size(), minDataLen);
        }//for

        // Refine data
        for (DataName name: DataName.values()) {
            chartModel.getData(name).subList(minDataLen, chartModel.getData(name).size()).clear();
        }//for
        chartModel.calculate();

        return chartModel;
    }

    private String getNewChartTitle() {
        int start = chartSeenCount;
        final String TITLE = this.msg("Data.newPlotTitle");
        String title = "";
        ArrayList<String> titles = model.getChartsTitles();
        for (int i = start; i < start + MAX_PLOTS; ++i) {
            title = TITLE + " " + start;
            if (!titles.contains(title))
                break;
        }//for

        return title;
    }

    @Threading(Threading.Policy.INSIDE_UITHREAD_SYNC)
    public void plot(DataModel dataModel) {
        if (model.getChartIds().size() >= MAX_PLOTS) {
            Util.alertInfo(msg("Data.beyondSupportedNumberOfPlots"));
            return;
        }//if

        ChartModel chartModel = chartModel(dataModel);
        int plotIn = dataModel.getPlotIn();
        String id;
        if (plotIn == DEFAULT_MAKE_NEW_CHART_CHOICE) {
            id = Constants.CHART_ID + "-" + System.currentTimeMillis();
            String chartTitle = getNewChartTitle();
            model.getChartIds().add(id);
            createMVCGroup(
                Constants.CHART_MVC_GROUP,
                id,
                CollectionUtils.<String, Object>map()
                    .e(Constants.CHART_ID_PARAM, id)
                    .e(Constants.CHART_MODEL_PARAM, chartModel)
                    .e(Constants.CHART_TITLE_PARAM, chartTitle)
            );
            view.getChartTitleProperty(model.getChartIds().size()).bindBidirectional(
                getApplication().getMvcGroupManager().getController(id,
                    ChartController.class).getModel()
                    .titleProperty()
            );

            view.selectChart(model.getChartIds().size());
            getApplication().getMvcGroupManager()
                    .getController(dataModel.getId(), DataController.class)
                    .getView()
                    .updatePlotInChoiceBox(model.getChartsTitles());

            ++chartSeenCount;
        }//if
        else {
            id = model.getChartIds().get(plotIn);
            ChartController chartController =
                getApplication().getMvcGroupManager().getController(id, ChartController.class);
            chartController.updateData(chartModel);
            view.selectChart(plotIn);
        }//else
    }

    @Threading(Threading.Policy.INSIDE_UITHREAD_SYNC)
    public void plot() {
        plot(
            getApplication().getMvcGroupManager()
                .getController(model.getDataId(), DataController.class)
                .getModel()
        );
    }

    @Threading(Threading.Policy.INSIDE_UITHREAD_SYNC)
    public boolean closeChartTab(String id) {
        ChartController chartController = getApplication().getMvcGroupManager()
                .getController(id, ChartController.class);
        boolean result = chartController.saveChart();
        if (result) {
            int index = model.getChartIds().indexOf(id);
            model.getChartIds().remove(index);
        }//if

        return result;
    }
}