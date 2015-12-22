package org.mtv.statistics;

public class WeightedMean {
    /**
     * This function calculates the weighted mean of analyses weighted by uncertainties
     * @param analyses The observed values
     * @param uncertainties A set of uncertainty for every analysis
     * @return the weighted mean
     * @throws ArithmeticException
     */
    public double weightedMean(double[] analyses, double[] uncertainties) throws ArithmeticException {
        if (analyses.length != uncertainties.length)
            throw new ArithmeticException("The length of analyses and uncertainties must be equal!");
        if (analyses.length == 0)
            throw new ArithmeticException("The length of analyses cannot be zero " +
                    "for weighted uncertainty calculation!");

        double A, B;
        A = B = 0;

        for (int i = 0; i < analyses.length; ++i) {
            double p = Math.pow(uncertainties[i], 2);
            A += analyses[i] / p;
            B += 1 / p;
        }//for

        return A / B;
    }

    /**
     * This function calculates the weighted uncertainty of uncertainties
     * @param uncertainties A set of uncertainty for every analysis
     * @return The weighted uncertainty of uncertainties
     * @throws ArithmeticException
     */
    public double weightedUncertainty(double[] uncertainties) throws ArithmeticException {
        if (uncertainties.length == 0)
            throw new ArithmeticException("The length of uncertainties cannot be zero " +
                    "for weighted uncertainty calculation!");

        double result = 0;
        for (double uncertainty : uncertainties)
            result += 1 / Math.pow(uncertainty, 2);

        //for
        result = Math.sqrt(1 / result);
        return result;
    }

    /**
     * This function calculates Mean Square Weighted Deviation (MSWD) of analyses weighted by uncertainties
     * @param analyses The observed values
     * @param uncertainties A set of uncertainty for every analysis
     * @return MSWD
     * @throws ArithmeticException
     */
    public double meanSquareWeightedDeviation(double[] analyses, double[] uncertainties) throws ArithmeticException {
        if (analyses.length != uncertainties.length)
            throw new ArithmeticException("The length of analyses and uncertainties must be equal!");
        if (analyses.length < 2)
            throw new ArithmeticException("The length of analyses must be greater than 1!");

        double mean = this.weightedMean(analyses, uncertainties);

        double A, B;
        A = B = 0;

        for (int i = 0; i < analyses.length; ++i) {
            A += Math.pow(analyses[i] - mean, 2);
            B += Math.pow(uncertainties[i], 2);
        }//for

        return A / B;
    }
}
