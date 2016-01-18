package org.mtv.statistics;

import org.apache.commons.math3.stat.StatUtils;

public class KernelDensityEstimation {
    private final int SKEWNESS_LEAST_DATA_POINTS = 3;
    protected KernelFunction kernelFunction;
    protected KernelFunctionType kernelFunctionsType;
    private double h;
    private double[] X;

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
     * Get the smooth parameter 'h'
     * @return smooth prameter 'h'
     */
    public double getH() {
        return h;
    }

    /**
     * Set the smooth parameter 'h'
     * @param h value of smooth parameter
     */
    public void setH(double h) {
        this.h = h;
    }

    /**
     * Get X array
     * @return X array
     */
    public double[] getX() {
        return X;
    }

    /**
     * Set the array 'X'
     * @param X value of array
     */
    public void setX(double[] X) {
        if (X.length == 0)
            throw new ArithmeticException("The size of X cannot be zero!");

        this.X = X;
    }

    /**
     * Constructor of KernelDensityEstimation class
     * @param X array
     * @param h smooth parameter
     * @throws ArithmeticException
     */
    public KernelDensityEstimation(double[] X, double h) throws ArithmeticException {
        setX(X);
        setH(h);
        kernelFunctionsType = KernelFunctionType.Unknown;
    }

    /**
     * Scaled kernel of variable x
     * @param x the value of variable
     * @return scaled kernel value of value 'x'
     */
    public double scaledKernel(double x) {
        return 1 / h * kernelFunction.compute(x / h);
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

        for (double xi : X)
            A += scaledKernel(x - xi);

        double n = X.length;
        return 1 / n * A;
    }

    /**
     * Compute the skewness of X values
     * @return skewness
     * @throws ArithmeticException
     */
    public double skewness() throws ArithmeticException {
        int n = X.length;

        if (n < SKEWNESS_LEAST_DATA_POINTS) {
            throw new ArithmeticException("Number of x values must be greater than " +
                Integer.toString(SKEWNESS_LEAST_DATA_POINTS));
        }//if

        double mode = StatUtils.mode(X)[0];
        double mean = StatUtils.mean(X);
        double std = StatUtils.variance(X);

        double skewness = 0;
        for (double x: X) {
            //TODO:
            //I don't understand why x bar is mean in the Christopher's reply!
        }//for

        return skewness;
    }

    /**
     * Kernel Density Estimation Types
     */
    public static class KernelDensityEstimationTypes {
        public static KernelDensityEstimation getGaussian(double[] X, double h) {
            KernelDensityEstimation kde = new KernelDensityEstimation(X, h);
            kde.setKernelFunction(new GaussianKernelFunction());
            kde.kernelFunctionsType = KernelFunctionType.Gaussian;
            return kde;
        }

        public static KernelDensityEstimation getEpanechnikov(double[] X, double h) {
            KernelDensityEstimation kde = new KernelDensityEstimation(X, h);
            kde.setKernelFunction(new EpanechnikovKernelFunction());
            kde.kernelFunctionsType = KernelFunctionType.Epanechnikov;
            return kde;
        }
    }
}
