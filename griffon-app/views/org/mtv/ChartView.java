package org.mtv;

import griffon.core.artifact.GriffonView;
import griffon.metadata.ArtifactProviderFor;
import griffon.transform.Threading;
import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.scene.Node;
import javafx.scene.web.WebView;
import org.codehaus.griffon.runtime.javafx.artifact.AbstractJavaFXGriffonView;

import java.net.URL;

@ArtifactProviderFor(GriffonView.class)
public class ChartView extends AbstractJavaFXGriffonView {
    private ChartController controller;
    private ChartModel model;
    private MultiTechVisView parentView;

    @FXML
    private WebView chartWebView;

    public void setController(ChartController controller) {
        this.controller = controller;
    }

    public void setModel(ChartModel model) {
        this.model = model;
    }

    @Override
    public void initUI() {
        Node node = loadFromFXML();
        connectActions(node, controller);
        parentView.placeChartView(node);
        initWebView();
    }

    @Threading(Threading.Policy.INSIDE_UITHREAD_SYNC)
    private void initWebView() {
//        URL resource = getClass().getResource("chart-ui/chart.html");
        URL resource = application.getResourceHandler().getResourceAsURL("chart-ui/chart.html");
        if (resource == null) {
            //TODO
        }//if
        else {
            chartWebView.getEngine().load(resource.toExternalForm());
        }//else
    }
}
