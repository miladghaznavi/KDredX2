package org.mtv;

import griffon.core.artifact.GriffonView;
import griffon.metadata.ArtifactProviderFor;
import griffon.transform.Threading;
import javafx.concurrent.Worker;
import javafx.fxml.FXML;
import javafx.scene.Node;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import org.codehaus.griffon.runtime.javafx.artifact.AbstractJavaFXGriffonView;
import org.json.JSONException;

import java.net.URL;

@ArtifactProviderFor(GriffonView.class)
public class ChartView extends AbstractJavaFXGriffonView {
    private ChartController controller;
    private ChartModel model;
    private MultiTechVisView parentView;

    @FXML
    private WebView chartWebView;
    private WebEngine webEngine;

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
        URL resource = application.getResourceHandler().getResourceAsURL("chart-ui/chart.html");
        if (resource == null) {
            //TODO
        }//if
        else {
            webEngine = chartWebView.getEngine();
            webEngine.setJavaScriptEnabled(true);
            webEngine.load(resource.toExternalForm());

            webEngine.getLoadWorker().stateProperty().addListener(
                (ov, oldState, newState) -> {
                    if (newState == Worker.State.SUCCEEDED) {

                        try {
                            System.out.println(
                                    controller.getModel().getJsonPack().toString()
                            );
                            String script = "drawPageByJson('"
                                    +
                                    controller.getModel().getJsonPack().toString()
                                    +
                                    "')";
                            System.out.println(script);
                            chartWebView.getEngine().executeScript(script);
                        }//try
                        catch(JSONException e) {
                            Util.alertInfo(e.getMessage());
                        }//catch
                    }//if
                }
            );
        }//else
    }
}
