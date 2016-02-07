package org.mtv.statistics;

import java.util.ArrayList;

public class WeightedMean {
    private ArrayList<Double> analyses;
    private ArrayList<Double> uncertainties;

    /**
     * Get the uncertainties
     * @return uncertainties
     */
    public ArrayList<Double> getUncertainties() {
        return uncertainties;
    }

    /**
     * Set the uncertainties
     * @param uncertainties the uncertainties
     * @throws IllegalArgumentException
     */
    public void setUncertainties(ArrayList<Double> uncertainties) throws IllegalArgumentException {
        if (uncertainties.size() == 0) {
            throw new IllegalArgumentException("Uncertainties cannot be empty!");
        }//if
        this.uncertainties = uncertainties;
    }

    /**
     * Get the analyses
     * @return analyses
     */
    public ArrayList<Double> getAnalyses() {
        return analyses;
    }

    /**
     * Set the analyses
     * @param analyses the analyses
     * @throws IllegalArgumentException
     */
    public void setAnalyses(ArrayList<Double> analyses) throws IllegalArgumentException {
        if (analyses.size() == 0) {
            throw new IllegalArgumentException("Analyses cannot be empty!");
        }//if
        this.analyses = analyses;
    }

    /**
     * This function calculates the weighted mean of analyses weighted by uncertainties
     * @param analyses The observed values
     * @param uncertainties A set of uncertainty for every analysis
     * @return the weighted mean
     * @throws ArithmeticException
     */
    public double weightedMean(ArrayList<Double> analyses, ArrayList<Double> uncertainties) throws ArithmeticException {
        if (analyses.size() != uncertainties.size())
            throw new ArithmeticException("The length of analyses and uncertainties must be equal!");
        if (analyses.size() == 0)
            throw new ArithmeticException("The length of analyses cannot be zero " +
                    "for weighted uncertainty calculation!");

        double A, B;
        A = B = 0;

        for (int i = 0; i < analyses.size(); ++i) {
            double p = Math.pow(uncertainties.get(i), 2);
            A += analyses.get(i) / p;
//            B += 1 / p;
            B += p;
        }//for

        return A / B;
    }

    /**
     * This function calculates the weighted mean of analyses weighted by uncertainties
     * @return the weighted mean
     */
    public double WeightedMean() {
        return weightedMean(analyses, uncertainties);
    }

    /**
     * This function calculates the weighted uncertainty of uncertainties
     * @param uncertainties A set of uncertainty for every analysis
     * @return The weighted uncertainty of uncertainties
     * @throws ArithmeticException
     */
    public double weightedUncertainty(ArrayList<Double> uncertainties) throws ArithmeticException {
        if (uncertainties.size() == 0)
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
     * This function calculates the weighted uncertainty of uncertainties
     * @return The weighted uncertainty of uncertainties
     */
    public double weightedUncertainty(){
        return weightedUncertainty(uncertainties);
    }

    /**
     * This function calculates Mean Square Weighted Deviation (MSWD) of analyses weighted by uncertainties
     * @param analyses The observed values
     * @param uncertainties A set of uncertainty for every analysis
     * @return MSWD
     * @throws ArithmeticException
     */
    public double meanSquareWeightedDeviation(ArrayList<Double> analyses, ArrayList<Double> uncertainties) throws ArithmeticException {
        if (analyses.size() != uncertainties.size())
            throw new ArithmeticException("The length of analyses and uncertainties must be equal!");
        if (analyses.size() < 2)
            throw new ArithmeticException("The length of analyses must be greater than 1!");

        double mean = this.weightedMean(analyses, uncertainties);

        double A, B;
        A = B = 0;

        for (int i = 0; i < analyses.size(); ++i) {
            A += Math.pow(analyses.get(i) - mean, 2);
            B += Math.pow(uncertainties.get(i), 2);
        }//for

        return A / B;
    }

    /**
     * This function calculates Mean Square Weighted Deviation (MSWD) of analyses weighted by uncertainties
     * @return MSWD
     */
    public double meanSquareWeightedDeviation() {
        return meanSquareWeightedDeviation(analyses, uncertainties);
    }

    /**
     * Check if the analyses range and weighted-mean range intersect
     * @param analysis the analyses
     * @param uncertainty the uncertainty
     * @param weightedMean the weighted mean
     * @param weightedUncertainty weighted uncertainty
     * @return true if analyses range and weighted-mean range intersect, otherwise false.
     */
    private boolean intersect(double analysis, double uncertainty,
                              double weightedMean, double weightedUncertainty) {
        double lower = Math.min(
                weightedMean - weightedUncertainty,
                weightedMean + weightedUncertainty);
        double upper = Math.max(
                weightedMean - weightedUncertainty,
                weightedMean + weightedUncertainty);

        double b0 = Math.min(
                analysis - uncertainty,
                analysis + uncertainty);

        double b1 = Math.max(
                analysis - uncertainty,
                analysis + uncertainty);

        if (b0 <= lower) {
            return (b1 > lower);
        }//if
        else {
            return (b0 < upper && b1 >= b0);
        }//else
    }

    /**
     * Compute the number of rejected values. A rejected value lays outside of weighted-mean range.
     * @param weightedMean the weighted mean
     * @param weightedUncertainty weighted uncertainty
     * @return the number of rejected values
     */
    public int rejected(ArrayList<Double> analyses, ArrayList<Double> uncertainties,
                        double weightedMean, double weightedUncertainty) {
        int rejected = 0;

        for (int i = 0; i < analyses.size(); ++i) {
            if (!intersect(
                    analyses.get(i), uncertainties.get(i),
                    weightedMean, weightedUncertainty)) {
                ++rejected;
            }//if
        }//for

        return rejected;
    }
}
