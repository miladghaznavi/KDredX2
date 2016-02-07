package org.mtv;

import griffon.core.artifact.GriffonView;
import griffon.metadata.ArtifactProviderFor;
import griffon.transform.Threading;
import javafx.beans.property.IntegerProperty;
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
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.atomic.AtomicReference;
import java.util.logging.Logger;

@ArtifactProviderFor(GriffonView.class)
public class DataView extends AbstractJavaFXGriffonView {
    private final static Logger LOGGER = Logger.getLogger(DataView.class.getName());
    private static final int DEFAULT_ROWS = 50;
    private static final int DEFAULT_COLUMNS = 20;
    private static final int INVALID_INDEX = -1;

    private DataController controller;
    private MultiTechVisView parentView;

    @FXML
    ChoiceBox plotInChoiceBox;
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
    ChoiceBox xiChoiceBox;
    @FXML
    ChoiceBox observedColumnChoiceBox;
    @FXML
    ChoiceBox expectedColumnChoiceBox;
    @FXML
    SpreadsheetView spreadsheetView;

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
        plotInChoiceBox.setItems(list);
        // TODO: having drawn charts in the selection list
        plotInChoiceBox.getSelectionModel().selectFirst();
        controller.getModel().plotInProperty().bind(
                plotInChoiceBox.getSelectionModel().selectedIndexProperty());
    }

    private void resetChoiceBox(
            AtomicReference<ChoiceBox> choiceBoxAtomicReference,
            AtomicReference<IntegerProperty> propertyAtomicReference) {
        ObservableList<String> list = getSpreadsheetHeaders();
        choiceBoxAtomicReference.get().setItems(list);

        ChoiceBoxChangeListener listener = new ChoiceBoxChangeListener(choiceBoxAtomicReference);
        choiceBoxAtomicReference.get().getSelectionModel().selectedIndexProperty().addListener(listener);
        plotButtonActiveDeactive();
        propertyAtomicReference.get().bind(
                choiceBoxAtomicReference.get().getSelectionModel().selectedIndexProperty()
        );
    }

    private void resetWeightedMean() {
        resetChoiceBox(
                new AtomicReference<>(analysesChoiceBox),
                new AtomicReference<>(controller.getModel().analysesProperty())
        );

        resetChoiceBox(
                new AtomicReference<>(uncertaintyChoiceBox),
                new AtomicReference<>(controller.getModel().uncertaintiesProperty())
        );
    }

    private void resetReducedChiSquare() {
        resetChoiceBox(
                new AtomicReference<>(expectedColumnChoiceBox),
                new AtomicReference<>(controller.getModel().expectedProperty())
        );
        resetChoiceBox(
                new AtomicReference<>(observedColumnChoiceBox),
                new AtomicReference<>(controller.getModel().observedProperty())
        );
    }

    private void resetKernelDensityEstimation() {
        kernelFunctionChoiceBox.setItems(FXCollections.observableArrayList(
            this.msg("Data.epanechnikov"),
            this.msg("Data.gaussian")
        ));
        kernelFunctionChoiceBox.getSelectionModel().selectFirst();
        controller.getModel().kernelFunctionProperty().bind(kernelFunctionChoiceBox.getSelectionModel().selectedItemProperty());

        resetChoiceBox(
                new AtomicReference<>(xChoiceBox),
                new AtomicReference<>(controller.getModel().xProperty())
        );
        resetChoiceBox(
                new AtomicReference<>(xiChoiceBox),
                new AtomicReference<>(controller.getModel().xiProperty())
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

    public void addListenerToSpreadsheetCells() {
        for (ObservableList<SpreadsheetCell> row: spreadsheetView.getGrid().getRows())
            for (SpreadsheetCell cell: row) {
                cell.itemProperty().addListener(new CellChangeListener(
                        new AtomicReference<SpreadsheetCell>(cell)
                ));
            }//for
    }

    void plotButtonActiveDeactive() {
        boolean result =
                analysesChoiceBox.getSelectionModel().getSelectedIndex()       != INVALID_INDEX &&
                uncertaintyChoiceBox.getSelectionModel().getSelectedIndex()    != INVALID_INDEX &&
                kernelFunctionChoiceBox.getSelectionModel().getSelectedIndex() != INVALID_INDEX &&
                xChoiceBox.getSelectionModel().getSelectedIndex()              != INVALID_INDEX &&
                    xChoiceBox.getSelectionModel().getSelectedIndex()              != INVALID_INDEX &&
                observedColumnChoiceBox.getSelectionModel().getSelectedIndex() != INVALID_INDEX &&
                expectedColumnChoiceBox.getSelectionModel().getSelectedIndex() != INVALID_INDEX;
        plotButton.setDisable(!result);
    }

    @Nullable
    public File openDocumentFile() {
        return Util.openDialog(getApplication());
    }

    @Nullable
    public File saveDocument() {
        return Util.saveDialog(getApplication());
    }

    @Threading(Threading.Policy.INSIDE_UITHREAD_SYNC)
    public void updatePlotInChoiceBox(ArrayList<String> list) {
        int selectedIndex = plotInChoiceBox.getSelectionModel().getSelectedIndex();
        String first = (String) plotInChoiceBox.getItems().get(0);
        plotInChoiceBox.getItems().clear();
        plotInChoiceBox.getItems().add(first);
        for (String item: list) {
            plotInChoiceBox.getItems().add(item);
        }//for

        if (selectedIndex >= 0) {
            plotInChoiceBox.getSelectionModel().select(selectedIndex);
        }//if
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
                ObservableList<ObservableList<SpreadsheetCell>> rows = controller.getModel().getGrid().getRows();
                int count = 0;
                for (int i = 1; i < rows.size(); ++i) {
                    ObservableList<SpreadsheetCell> record = rows.get(i);
                    String value = record.get((int)newValue).getText();
                    if (value.length() == 0) continue;
                    ++count;
                    Double.valueOf(value);
                }//for
                if (count == 0)
                    throw new NumberFormatException();
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
                controller.getModel().setDirty(true);
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
}