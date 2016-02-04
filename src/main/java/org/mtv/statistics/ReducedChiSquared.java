package org.mtv.statistics;

import org.apache.commons.math3.stat.descriptive.moment.Variance;

import java.util.ArrayList;

public class ReducedChiSquared {

    public double reducedChiSquare(ArrayList<Double> observed, ArrayList<Double> expected, int degreeOfFreedom)
            throws ArithmeticException {
        if (observed.size() != expected.size())
            throw new ArithmeticException("The length of observed and expected should be same!");
        if (observed.size() == 0)
            throw new ArithmeticException("The length of observed cannot be zero!");
        if (degreeOfFreedom <= 0)
            throw new ArithmeticException("Degree of freedom most be positive!");

        double A = 0;

        for (int i = 0; i < observed.size(); ++i)
            A = Math.pow(observed.get(i) - expected.get(i), 2);

        double[] observedArray = new double[observed.size()];
        for (int i = 0; i < observed.size(); ++i)
            observedArray[i] = observed.get(i);

        double var = (new Variance()).evaluate(observedArray);
        double B = degreeOfFreedom * var;

        return A / B;
    }

    public double reducedChiSquare(ArrayList<Double> observed, ArrayList<Double> expected) {
        return reducedChiSquare(observed, expected, observed.size() - 1);
    }
}
