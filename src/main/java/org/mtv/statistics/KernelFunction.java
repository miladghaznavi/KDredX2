package org.mtv.statistics;

public abstract class KernelFunction {
    /**
     * Abstract kernel function
     * @param x input of kernel function
     * @return kernel function value of 'x'
     */
    public abstract double compute(double x);
}
