package org.mtv;

import griffon.core.artifact.GriffonView;
import griffon.metadata.ArtifactProviderFor;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.fxml.FXML;
import javafx.scene.Node;
import javafx.scene.control.Button;
import javafx.scene.control.ChoiceBox;
import javafx.stage.FileChooser;
import javafx.stage.Window;
import javafx.util.Pair;
import org.codehaus.griffon.runtime.javafx.artifact.AbstractJavaFXGriffonView;
import org.controlsfx.control.spreadsheet.*;

import javax.annotation.Nullable;
import java.io.File;
import java.util.ArrayList;
import java.util.concurrent.atomic.AtomicReference;
import java.util.logging.Logger;

@ArtifactProviderFor(GriffonView.class)
public class DataView extends AbstractJavaFXGriffonView {
    private final static Logger LOGGER = Logger.getLogger(DataView.class.getName());
    private static final int DEFAULT_ROWS = 50;
    private static final int DEFAULT_COLUMNS = 20;
    private static final int INVALID_INDEX = -1;

    private FileChooser fileChooser = new FileChooser();
    private DataModel model;
    private DataController controller;
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
    ChoiceBox xChoiceBox;
    @FXML
    ChoiceBox observedColumnChoiceBox;
    @FXML
    ChoiceBox expectedColumnChoiceBox;
    @FXML
    SpreadsheetView spreadsheetView;

    public void setModel(DataModel model) {
        this.model = model;
    }

    @Override
    public void initUI() {
        Node node = loadFromFXML();
        parentView.placeDataView(node);
        initControls();
    }

    public void resetControls() {
        resetInsertInto();
        resetWeightedMean();
        resetReducedChiSquare();
        resetKernelDensityEstimation();
    }

    private void initControls() {
        initSpreadsheet();
        resetControls();
        initPlotButton();
    }

    private void initPlotButton() {
        parentView.bindPlot(new AtomicReference<>(plotButton.disableProperty()));
        plotButton.setOnAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent event) {
                controller.plot();
            }
        });
    }

    private void initSpreadsheet() {
        spreadsheetView.setGrid(defaultGrid());
        addListenerToSpreadsheetCells();
    }

    private ObservableList<String> getSpreadsheetHeaders() {
        ObservableList<String> list = FXCollections.observableList(
                Util.indicesToColumns(0, spreadsheetView.getGrid().getColumnCount()));
        return list;
    }

    private void resetInsertInto() {
        ObservableList<String> list = FXCollections.observableArrayList();
        list.add(this.msg("Data.makeNewPlot"));
        insertIntoChoiceBox.setItems(list);
        // TODO: having drawn charts in the selection list
        insertIntoChoiceBox.getSelectionModel().selectFirst();
        model.insertIntoProperty().bind(
                insertIntoChoiceBox.getSelectionModel().selectedItemProperty());
    }

    private void resetChoiceBox(AtomicReference<ChoiceBox> choiceBoxAtomicReference) {
        ObservableList<String> list = getSpreadsheetHeaders();
        choiceBoxAtomicReference.get().setItems(list);

        ChoiceBoxChangeListener listener = new ChoiceBoxChangeListener(choiceBoxAtomicReference);
        choiceBoxAtomicReference.get().getSelectionModel().selectedIndexProperty().addListener(listener);
        plotButtonActiveDeactive();
    }

    private void resetWeightedMean() {
        resetChoiceBox(
                new AtomicReference<>(analysesChoiceBox)
        );

        resetChoiceBox(
                new AtomicReference<>(uncertaintyChoiceBox)
        );
    }

    private void resetReducedChiSquare() {
        resetChoiceBox(
                new AtomicReference<>(expectedColumnChoiceBox)
        );
        resetChoiceBox(
                new AtomicReference<>(observedColumnChoiceBox)
        );
    }

    private void resetKernelDensityEstimation() {
        kernelFunctionChoiceBox.setItems(FXCollections.observableArrayList(
            this.msg("Data.epanechnikov"),
            this.msg("Data.gaussian")
        ));
        kernelFunctionChoiceBox.getSelectionModel().selectFirst();
        model.kernelFunctionProperty().bind(kernelFunctionChoiceBox.getSelectionModel().selectedItemProperty());

        resetChoiceBox(
                new AtomicReference<>(xChoiceBox)
        );
    }

    private GridBase defaultGrid() {
        GridBase grid = new GridBase(DEFAULT_ROWS, DEFAULT_COLUMNS);
        ArrayList<ObservableList<SpreadsheetCell>> rows = new ArrayList<>(grid.getRowCount());

        for (int row = 0; row < grid.getRowCount(); ++row) {
            final ObservableList<SpreadsheetCell> dataRow = FXCollections.observableArrayList();
            for (int column = 0; column < grid.getColumnCount(); ++column) {
                dataRow.add(
                        SpreadsheetCellType.STRING.createCell(row, column, 1, 1, null));
                dataRow.get(column).itemProperty().addListener(
                        new CellChangeListener(
                                new AtomicReference<SpreadsheetCell>(dataRow.get(dataRow.size() - 1))));
            }//for
            rows.add(dataRow);
        }//for
        grid.setRows(rows);
        return grid;
    }

    private Pair<Integer, Integer> lastValidCellPosition() {
        int row = -1;
        int column = -1;
        for (ObservableList<SpreadsheetCell> rowData: spreadsheetView.getGrid().getRows()) {
            for (SpreadsheetCell cell: rowData) {
                if (cell.getItem() != null && !(cell.getItem()).equals("")) {
                    row = Math.max(cell.getRow(), row);
                    column = Math.max(cell.getColumn(), column);
                }//if
            }//for
        }//for
        return new Pair<>(row, column);
    }

    public void addListenerToSpreadsheetCells() {
        for (ObservableList<SpreadsheetCell> row: spreadsheetView.getGrid().getRows())
            for (SpreadsheetCell cell: row) {
                cell.itemProperty().addListener(new CellChangeListener(
                        new AtomicReference<SpreadsheetCell>(cell)
                ));
            }//for
    }

    class ChoiceBoxChangeListener implements ChangeListener<Number> {
        AtomicReference<ChoiceBox> whichChoiceBox;
        boolean manualChange;

        public ChoiceBoxChangeListener(AtomicReference<ChoiceBox> whichChoiceBox) {
            this.setWhichChoiceBox(whichChoiceBox);
            this.manualChange = false;
        }

        public AtomicReference<ChoiceBox> getWhichChoiceBox() {
            return whichChoiceBox;
        }

        public void setWhichChoiceBox(AtomicReference<ChoiceBox> whichChoiceBox) {
            this.whichChoiceBox = whichChoiceBox;
        }

        @Override
        public void changed(ObservableValue<? extends Number> observable, Number oldValue, Number newValue) {
            if ((int)newValue == INVALID_INDEX || manualChange) {
                manualChange = false;
                return;
            }//if

            try {
                ObservableList<ObservableList<SpreadsheetCell>> rows = model.getDocument().getGrid().getRows();
                for (int i = 1; i < rows.size(); ++i) {
                    ObservableList<SpreadsheetCell> record = rows.get(i);
                    Double.valueOf(record.get((int)newValue).getText());
                }//for
            }//try
            catch(IndexOutOfBoundsException | NumberFormatException e) {
                DataView.this.getLog().debug(e.getMessage());
                Util.alertError(msg("Error.columnIsNotValid"));
                manualChange = true;
                if ((int)oldValue != INVALID_INDEX) {
                    whichChoiceBox.get().getSelectionModel().clearAndSelect((int)oldValue);
                }//if
                else {
                    whichChoiceBox.get().getSelectionModel().clearSelection();
                }//else
            }//catch
            plotButtonActiveDeactive();
        }
    }

    class CellChangeListener implements ChangeListener<Object> {
        AtomicReference<SpreadsheetCell> cellAtomicReference;

        public CellChangeListener(AtomicReference<SpreadsheetCell> cellAtomicReference) {
            this.setCellAtomicReference(cellAtomicReference);
        }

        public void setCellAtomicReference(AtomicReference<SpreadsheetCell> cellAtomicReference) {
            this.cellAtomicReference = cellAtomicReference;
        }

        @Override
        public void changed(ObservableValue<? extends Object> observable, Object oldValue, Object newValue) {
            if ((oldValue == null) ||
                    !oldValue.equals(newValue))
                model.setDirty(true);
            try {
                Double.valueOf((String) newValue);
            }//try
            catch(NumberFormatException e) {
                if (cellAtomicReference.get().getRow() > 0) {
                    reset();
                    plotButtonActiveDeactive();
                }//if
            }//catch
        }

        private void checkAndResetChoiceBox(ChoiceBox choiceBox, int column) {
            if (choiceBox.getSelectionModel().getSelectedIndex() == column) {
                choiceBox.getSelectionModel().clearSelection();
            }//if
        }

        private void reset() {
            int column = cellAtomicReference.get().getColumn();
            checkAndResetChoiceBox(analysesChoiceBox, column);
            checkAndResetChoiceBox(uncertaintyChoiceBox, column);
            checkAndResetChoiceBox(xChoiceBox, column);
            checkAndResetChoiceBox(observedColumnChoiceBox, column);
            checkAndResetChoiceBox(expectedColumnChoiceBox, column);
        }
    }

    void plotButtonActiveDeactive() {
        boolean result =
                analysesChoiceBox.getSelectionModel().getSelectedIndex()       != INVALID_INDEX &&
                uncertaintyChoiceBox.getSelectionModel().getSelectedIndex()    != INVALID_INDEX &&
                kernelFunctionChoiceBox.getSelectionModel().getSelectedIndex() != INVALID_INDEX &&
                xChoiceBox.getSelectionModel().getSelectedIndex()              != INVALID_INDEX &&
                observedColumnChoiceBox.getSelectionModel().getSelectedIndex() != INVALID_INDEX &&
                expectedColumnChoiceBox.getSelectionModel().getSelectedIndex() != INVALID_INDEX;
        plotButton.setDisable(!result);
    }

    @Nullable
    public File openDocumentFile() {
        Window window = (Window) getApplication().getWindowManager().getStartingWindow();
        return fileChooser.showOpenDialog(window);
    }

    @Nullable
    public File saveDocument() {
        Window window = (Window) getApplication().getWindowManager().getStartingWindow();
        return fileChooser.showSaveDialog(window);
    }
}