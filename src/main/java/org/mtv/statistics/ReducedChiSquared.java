package org.mtv.statistics;

import org.apache.commons.math3.stat.descriptive.moment.Variance;

public class ReducedChiSquared {

    public double reducedChiSquare(double[] observed, double[] expected, int degreeOfFreedom) throws ArithmeticException {
        if (observed.length != expected.length)
            throw new ArithmeticException("The length of observed and expected should be same!");
        if (observed.length == 0)
            throw new ArithmeticException("The length of observed cannot be zero!");
        if (degreeOfFreedom <= 0)
            throw new ArithmeticException("Degree of freedom most be positive!");

        double A, B;
        A = B = 0;

        for (int i = 0; i < observed.length; ++i) {
            A = Math.pow(observed[i] - expected[i], 2);
        }//for

        Variance variance = new Variance();
        double var = variance.evaluate(observed);
        B = degreeOfFreedom * var;

        return A / B;
    }

    public double reducedChiSquare(double[] observed, double[] expected) {
        return reducedChiSquare(observed, expected, observed.length - 1);
    }
}
