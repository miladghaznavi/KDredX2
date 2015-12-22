package org.mtv.statistics;

public abstract class KernelDensityEstimation {
    private double _h;
    private double[] _X;

    /**
     * Get X array
     * @return X array
     */
    public double[] getX() {
        return _X;
    }

    /**
     * Get the smooth parameter 'h'
     * @return smooth prameter 'h'
     */
    public double geth() {
        return _h;
    }

    /**
     * Set the smooth parameter 'h'
     * @param h value of smooth parameter
     */
    public void seth(double h) {
        if (h > 0)
            throw new ArithmeticException("The smoothing parameter 'h' must be positive!");

        this._h = h;
    }

    /**
     * Set the array 'X'
     * @param X value of array
     */
    public void setX(double[] X) {
        if (X.length == 0)
            throw new ArithmeticException("The size of X cannot be zero!");

        this._X = X;
    }

    /**
     * Constructor of KernelDensityEstimation class
     * @param X array
     * @param h smooth parameter
     * @throws ArithmeticException
     */
    public KernelDensityEstimation(double[] X, double h) throws ArithmeticException {
        setX(X);
        seth(h);
    }

    /**
     * Abstract kernel function
     * @param x input of kernel function
     * @return kernel function value of 'x'
     */
    public abstract double kernelFucntion(double x);

    /**
     * Scaled kernel of variable x
     * @param x the value of variable
     * @return scaled kernel value of value 'x'
     */
    public double scaledKernel(double x) {
        return 1 / _h * kernelFucntion(x / _h);
    }

    /**
     * Kernel Density Estimation (KDE) of value x
     * @param x value of variable
     * @return KDE of value x
     */
    public double kernelDesnsityEstimation(double x) {
        double A = 0;

        for (double xi : _X)
            A += scaledKernel(x - xi);

        double n = _X.length;
        return 1 / n * A;
    }

}
