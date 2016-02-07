package org.mtv.statistics;

import org.apache.commons.math3.stat.StatUtils;

import java.lang.reflect.Array;
import java.util.ArrayList;

public class KernelDensityEstimation {
    private final int SKEWNESS_LEAST_DATA_POINTS = 3;
    protected KernelFunction kernelFunction;
    protected KernelFunctionType kernelFunctionsType;
    private double bandwidth;
    private ArrayList<Double> X;
    private ArrayList<Double> Xi;

    /**
     * Get the kernel function
     * @return kernel function
     */
    public KernelFunction getKernelFunction() {
        return kernelFunction;
    }

    /**
     * Set the desired kernel function
     * @param kernelFunction the kernel function
     */
    protected void setKernelFunction(KernelFunction kernelFunction) {
        this.kernelFunction = kernelFunction;
    }

    /**
     * Get the smooth parameter 'bandwidth'
     * @return smooth prameter 'bandwidth'
     */
    public double getBandwidth() {
        return bandwidth;
    }

    /**
     * Set the smooth parameter 'bandwidth'
     * @param bandwidth value of smooth parameter
     */
    public void setBandwidth(double bandwidth) {
        this.bandwidth = bandwidth;
    }

    /**
     * Getter of X array
     * @return X array
     */
    public ArrayList<Double> getX() {
        return X;
    }

    /**
     * Setter of X array
     * @param X to set array X
     */
    public void setX(ArrayList<Double> X) {
        this.X = X;
    }

    /**
     * Get Xi array
     * @return Xi array
     */
    public ArrayList<Double> getXi() {
        return Xi;
    }

    /**
     * Set the array 'X'
     * @param Xi value of array
     */
    public void setXi(ArrayList<Double> Xi) {
        if (Xi.size() == 0)
            throw new ArithmeticException("The size of Xi cannot be zero!");

        this.Xi = Xi;
    }

    /**
     * Constructor of KernelDensityEstimation class
     * @param Xi array
     * @param h smooth parameter
     * @throws ArithmeticException
     */
    public KernelDensityEstimation(ArrayList<Double> X, ArrayList<Double> Xi, double h) throws ArithmeticException {
        setX(X);
        setXi(Xi);
        setBandwidth(h);
        kernelFunctionsType = KernelFunctionType.Unknown;
    }

    /**
     * Scaled kernel of variable x
     * @param x the value of variable
     * @return scaled kernel value of value 'x'
     */
    public double scaledKernel(double x) {
        return 1 / bandwidth * kernelFunction.compute(x / bandwidth);
    }

    /**
     * Kernel Density Estimation (KDE) of value x
     * @param x value of variable
     * @return KDE of value x
     */
    public double kernelDesnsityEstimation(double x) {
        if (kernelFunctionsType == KernelFunctionType.Unknown) {
            throw new UnsupportedOperationException();
        }//if

        double A = 0;

        for (double xi : Xi)
            A += scaledKernel(x - xi);

        double n = Xi.size();
        return 1 / n * A;
    }

    public ArrayList<Double> kernelDesnsityEstimation(ArrayList<Double> X) {
        ArrayList<Double> result = new ArrayList<>();

        for (double x: X) {
            result.add(kernelDesnsityEstimation(x));
        }//for

        return result;
    }

    /**
     * Compute the skewness of X values
     * @return skewness
     * @throws ArithmeticException
     */
    public double skewness() throws ArithmeticException {
        int n = Xi.size();

        if (n < SKEWNESS_LEAST_DATA_POINTS) {
            throw new ArithmeticException("Number of x values must be greater than " +
                Integer.toString(SKEWNESS_LEAST_DATA_POINTS));
        }//if

        double[] XArr = new double[Xi.size()];
        for (int i = 0; i < Xi.size(); ++i) XArr[i] = Xi.get(i);
        double mode = StatUtils.mode(XArr)[0];
        double mean = StatUtils.mean(XArr);
        double std = StatUtils.variance(XArr);

        double skewness = 0;
        for (double x: Xi) {
            skewness += Math.pow((x - mode) / std, 3.0);
        }//for
        skewness *= (double)n / (double)((n - 1) * ( n -2));

        return skewness;
    }

    /**
     * Kernel Density Estimation Types
     */
    public static class KernelDensityEstimationTypes {
        public static KernelDensityEstimation getGaussian(ArrayList<Double> X, ArrayList<Double> Xi, double h) {
            KernelDensityEstimation kde = new KernelDensityEstimation(X, Xi, h);
            kde.setKernelFunction(new GaussianKernelFunction());
            kde.kernelFunctionsType = KernelFunctionType.Gaussian;
            return kde;
        }

        public static KernelDensityEstimation getEpanechnikov(ArrayList<Double> X, ArrayList<Double> Xi, double h) {
            KernelDensityEstimation kde = new KernelDensityEstimation(X, Xi, h);
            kde.setKernelFunction(new EpanechnikovKernelFunction());
            kde.kernelFunctionsType = KernelFunctionType.Epanechnikov;
            return kde;
        }
    }
}
