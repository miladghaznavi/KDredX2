package org.mtv.statistics;

public class GaussianKernelFunction extends KernelFunction {
    @Override
    public double compute(double x) {
        return 1.0 / Math.sqrt(2 * Math.PI) *
                Math.pow(Math.E, -Math.pow(x, 2.0) / 2.0);
    }
}
