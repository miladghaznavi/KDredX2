package org.mtv;

import java.io.*;
import java.util.ArrayList;
import java.util.concurrent.atomic.AtomicReference;
import javafx.beans.property.*;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.CSVRecord;
import org.codehaus.griffon.runtime.core.artifact.AbstractGriffonModel;
import griffon.core.artifact.GriffonModel;
import griffon.metadata.ArtifactProviderFor;
import org.controlsfx.control.spreadsheet.Grid;
import org.controlsfx.control.spreadsheet.GridBase;
import org.controlsfx.control.spreadsheet.SpreadsheetCell;
import org.controlsfx.control.spreadsheet.SpreadsheetCellType;

@ArtifactProviderFor(GriffonModel.class)
public class DataModel extends AbstractGriffonModel {
    public static final boolean DEFAULT_DIRTY = false;
    public static final int INVALID_INDEX = -1;

    private String id;
    private String path;
    private SimpleStringProperty name;
    private AtomicReference<Grid> grid;
    private boolean dirty = DEFAULT_DIRTY;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    // Target chart
    private IntegerProperty plotIn = new SimpleIntegerProperty();

    // Weighted Mean
    private IntegerProperty analyses = new SimpleIntegerProperty();
    private IntegerProperty uncertainties = new SimpleIntegerProperty();

    // Reduced-Chi-Squared
    private IntegerProperty observed = new SimpleIntegerProperty();
    private IntegerProperty expected = new SimpleIntegerProperty();

    // Kernel Density Estimation
    //TODO: Rename X to Xi
    private IntegerProperty X = new SimpleIntegerProperty();
    private SimpleStringProperty kernelFunction = new SimpleStringProperty();

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public Grid getGrid() {
        return grid.get();
    }

    public void setGrid(Grid grid) {
        if (this.grid == null) {
            this.grid = new AtomicReference<>(grid);
        }//if
        else {
            this.grid.set(grid);
        }//else
    }

    public String getName() {
        if(name == null) {
            name = new SimpleStringProperty();
        }//if
        return name.get();
    }

    public SimpleStringProperty nameProperty() {
        return name;
    }

    public void setName(String name) {
        if(this.name == null) {
            this.name = new SimpleStringProperty();
        }//if
        this.name.set(name);
    }

    public int getPlotIn() {
        if (plotIn == null)
            plotIn = new SimpleIntegerProperty();
        return plotIn.get();
    }

    public IntegerProperty plotInProperty() {
        if(plotIn == null)
            plotIn = new SimpleIntegerProperty();
        return plotIn;
    }

    public void setPlotIn(int plotIn) {
        this.plotIn.set(plotIn);
    }

    public String getKernelFunction() {
        if (kernelFunction == null) {
            kernelFunction = new SimpleStringProperty();
        }//if
        return kernelFunction.get();
    }

    public SimpleStringProperty kernelFunctionProperty() {
        if (kernelFunction == null) {
            kernelFunction = new SimpleStringProperty();
        }//if
        return kernelFunction;
    }

    public void setKernelFunction(String kernelFunction) {
        this.kernelFunction.set(kernelFunction);
    }

    public boolean isDirty() {
        return dirty;
    }

    public void setDirty(boolean dirty) {
        this.dirty = dirty;
    }

    public Integer getAnalyses() {
        if (analyses == null) {
            analyses = new SimpleIntegerProperty();
        }//if
        return analyses.get();
    }

    public IntegerProperty analysesProperty() {
        return analyses;
    }

    public void setAnalyses(Integer analyses) {
        if (this.analyses == null) {
            this.analyses = new SimpleIntegerProperty();
        }//if
        this.analyses.set(analyses);
    }

    public Integer getUncertainties() {
        if (uncertainties == null) {
            uncertainties = new SimpleIntegerProperty();
        }//if
        return uncertainties.get();
    }

    public IntegerProperty uncertaintiesProperty() {
        return uncertainties;
    }

    public void setUncertainties(Integer uncertainties) {
        if (this.uncertainties == null) {
            this.uncertainties = new SimpleIntegerProperty();
        }//if
        this.uncertainties.set(uncertainties);
    }

    public Integer getObserved() {
        if (observed == null) {
            observed = new SimpleIntegerProperty();
        }//if
        return observed.get();
    }

    public IntegerProperty observedProperty() {
        return observed;
    }

    public void setObserved(Integer observed) {
        if (this.observed == null) {
            this.observed = new SimpleIntegerProperty();
        }//if
        this.observed.set(observed);
    }

    public Integer getExpected() {
        if (expected == null) {
            expected = new SimpleIntegerProperty();
        }//if
        return expected.get();
    }

    public IntegerProperty expectedProperty() {
        return expected;
    }

    public void setExpected(Integer expected) {
        if (this.expected == null) {
            this.expected = new SimpleIntegerProperty();
        }//if
        this.expected.set(expected);
    }

    public Integer getX() {
        if (X == null) {
            X = new SimpleIntegerProperty();
        }//if
        return X.get();
    }

    public IntegerProperty xProperty() {
        return X;
    }

    public void setX(Integer x) {
        if (this.X == null) {
            this.X = new SimpleIntegerProperty();
        }//if
        this.X.set(x);
    }

    public int getColumnIndex(DataName name) {
        int index;
        switch (name) {
            case Analyses:
                index = analyses.get();
                break;

            case Uncertainties:
                index = uncertainties.get();
                break;

            case Observed:
                index = observed.get();
                break;

            case Expected:
                index = expected.get();
                break;

            case X:
                index = X.get();
                break;

            default:
                index = INVALID_INDEX;
        }//switch
        return index;
    }

    public String getData(int row, int column) throws IndexOutOfBoundsException {
        return grid.get().getRows()
                .get(row)
                .get(column)
                .getText();
    }

    public ArrayList<Double> getData(DataName name, boolean excludeFirstRow) {
        int columnIndex = getColumnIndex(name);
        int startRow = (excludeFirstRow) ? 1 : 0;
        ArrayList<Double> items = new ArrayList<>();
        try {
            for (int i = startRow; i < grid.get().getRows().size(); ++i) {
                items.add(
                        Double.valueOf(
                                getData(i, columnIndex)));
            }//for
        }//try
        catch(Exception e) { }

        return items;
    }

    public void load() throws IOException {
        Reader reader = new FileReader(new File(this.path));
        CSVParser parser = new CSVParser(reader, CSVFormat.EXCEL);
        int columnsCount = 0;
        int rowsCount = 0;
        ArrayList<ObservableList<SpreadsheetCell>> rows = new ArrayList<>();
        for (CSVRecord record : parser) {
            final ObservableList<SpreadsheetCell> dataRow = FXCollections.observableArrayList();
            columnsCount = Math.max(columnsCount, record.size());
            int column = 0;
            for (String field: record) {
                dataRow.add(
                        SpreadsheetCellType.STRING.createCell(rowsCount, column, 1, 1, field)
                );
                ++column;
            }//for
            rows.add(dataRow);
            ++rowsCount;
        }//for
        Grid newGrid = new GridBase(rowsCount, columnsCount);
        newGrid.setRows(rows);
        this.grid.set(newGrid);
    }

    public void save() throws IOException {
        Writer writer = new FileWriter(new File(this.path));
        CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT);

        if (grid != null) {
            for (ObservableList<SpreadsheetCell> record : grid.get().getRows()) {
                ArrayList<String> stringRecord = new ArrayList<>(record.size());
                for (SpreadsheetCell cell: record)
                    stringRecord.add((String)cell.getItem());
                csvPrinter.printRecord(stringRecord);
            }//for
        }//if

        csvPrinter.close();
        writer.close();
    }

    public void setTitleFromPath() {
        this.setName(new File(path).getName());
    }

    public static DataModel empty(String name, String path) throws IOException {
        DataModel emptyModel = new DataModel();
        emptyModel.setPath(path);
        emptyModel.setName(name);
        emptyModel.save();

        return emptyModel;
    }
}