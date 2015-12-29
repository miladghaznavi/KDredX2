package org.mtv;

import griffon.core.artifact.GriffonView;
import griffon.metadata.ArtifactProviderFor;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.scene.Node;
import javafx.scene.control.Button;
import javafx.scene.control.ChoiceBox;
import org.codehaus.griffon.runtime.javafx.artifact.AbstractJavaFXGriffonView;
import org.controlsfx.control.spreadsheet.*;
import java.util.ArrayList;
import java.util.logging.Logger;
import org.mtv.Util;

@ArtifactProviderFor(GriffonView.class)
public class DataTabView extends AbstractJavaFXGriffonView {
    private final static Logger LOGGER = Logger.getLogger(DataTabView.class.getName());
    private static final int DEFAULT_ROWS = 50;
    private static final int DEFAULT_COLUMNS = 20;

    private DataTabController controller;
    private DataTabModel model;
    private MultiTechVisView parentView;

    @FXML
    ChoiceBox insertIntoChoiceBox;
    @FXML
    Button plotButton;
    @FXML
    ChoiceBox analysesChoiceBox;
    @FXML
    ChoiceBox uncertaintyChoiceBox;
    @FXML
    ChoiceBox kernelFunctionChoiceBox;
    @FXML
    ChoiceBox observedColumnChoiceBox;
    @FXML
    ChoiceBox expectedColumnChoiceBox;
    @FXML
    SpreadsheetView spreadsheetView;

    public void setController(DataTabController controller) {
        this.controller = controller;
    }

    public void setModel(DataTabModel model) {
        this.model = model;
    }

    @Override
    public void initUI() {
        Node node = loadFromFXML();
        parentView.placeDataView(node);
        initComponents();
    }

    private void initComponents() {
        initSpreadsheet();
        initInsertInto();
        initWeightedMean();
        initReducedChiSquare();
        initKernelDensityEstimation();
    }

    private void initSpreadsheet() {
        spreadsheetView.setGrid(defaultGrid());
    }

    private ObservableList<String> getSpreadsheetHeaders() {
        ObservableList<String> list = FXCollections.observableList(
                Util.indicesToColumns(0, spreadsheetView.getGrid().getColumnCount()));
        return list;
    }

    private void initInsertInto() {
        ObservableList<String> list = FXCollections.observableArrayList();
        list.add(this.msg("Data.makeNewPlot"));
        insertIntoChoiceBox.setItems(list);
        insertIntoChoiceBox.getSelectionModel().selectFirst();
    }

    private void initWeightedMean() {
        ObservableList<String> list = getSpreadsheetHeaders();
        analysesChoiceBox.setItems(list);
        uncertaintyChoiceBox.setItems(list);
    }

    private void initReducedChiSquare() {
        ObservableList<String> list = getSpreadsheetHeaders();
        observedColumnChoiceBox.setItems(list);
        expectedColumnChoiceBox.setItems(list);
    }

    private void initKernelDensityEstimation() {
        kernelFunctionChoiceBox.setItems(FXCollections.observableArrayList(
            this.msg("Data.epanechnikov"),
            this.msg("Data.gaussian")
        ));
        kernelFunctionChoiceBox.getSelectionModel().selectFirst();
    }

    private GridBase defaultGrid() {
        GridBase grid = new GridBase(DEFAULT_ROWS, DEFAULT_COLUMNS);
        ArrayList<ObservableList<SpreadsheetCell>> rows = new ArrayList<>(grid.getRowCount());

        for (int row = 0; row < grid.getRowCount(); ++row) {
            final ObservableList<SpreadsheetCell> dataRow = FXCollections.observableArrayList();
            for (int column = 0; column < grid.getColumnCount(); ++column) {
                dataRow.add(
                        SpreadsheetCellType.STRING.createCell(row, column, 1, 1, null));
            }//for
            rows.add(dataRow);
        }//for
        grid.setRows(rows);
        return grid;
    }
}
